/*
 *
 */


(function (exports) {

  exports.runstant = exports.runstant || {};
  var util = exports.runstant.util = {};

  var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
  var JSZip = (isNode) ? require('request') : window.JSZip;
  var request = (isNode) ? require('request') : null;

  util.zip = function(data) {
    var zip = new JSZip();
    zip.file('data', data);

    return zip.generate({type:"base64"});
  };

  util.unzip = function(data) {
    var zip = new JSZip();
    var files = zip.load(data, {
      base64: true
    });

    return files.file('data').asText();
  };

  util.json2hash = function(obj) {
    var str = JSON.stringify(obj);
    var zipedFile = this.zip(str);
    return encodeURI(zipedFile);
  };

  util.hash2json = function(data) {
    data = decodeURI(data);
    data = this.unzip(data);
    data = JSON.parse(data);
    return data;
  };

  util.jade2html = function(code) {
    var source = jade.compile(code, {
      pretty: true
    });
    return '<!-- Compiled Jade -->\n\n' + source();
  };

  util.markdown2html = function(code) {
    var source = marked(code);

    return '<!-- Compiled Markdown -->\n\n' + source;
  };

  util.less2css = function(code) {
    // console.dir(less.Parser());
    var source = '';
    less.Parser().parse(code, function(err, tree) {
      if (err) {
        return console.error(err)
      }
      source = tree.toCSS();
    });

    return '/* Compiled LESS */\n\n' + source;
  };

  util.sass2css = function(code) {
    var css = Sass.compile(code);
    return '/* Compiled SASS */\n\n' + css;
  };

  util.stylus2css = function(code) {
    var source = '';
    var renderer = stylus(code);

    renderer.render(function(a, b) {
      source = b;
    });

    return '/* Compiled Stylus */\n\n' + source;
  };

  // 
  util.coffee2js = function(code) {
    var source = CoffeeScript.compile(code);
    return '// Compiled CoffeeScript\n\n' + source;
  };
  // 
  util.es62js = function(code) {
    var compiler = new traceur.Compiler({
      experimental: true,
    });
    var result = compiler.stringToString(code);
    var code = result.js.match(/"use strict";([\s\S]*)return/m)[1];

    return '// Compiled ECMAScript 6\n\n' + code;
  };
  // 
  util.typescript2js = function(code) {
    var outfile = {
      source: '',
      Write: function(s) {
        this.source += s;
      },
      WriteLine: function(s) {
        this.source += s + '\n';
      },
      Close: function() {

      },
    };
    var outerror = {
      source: '',
      Write: function(s) { },
      WriteLine: function(s) { },
      Close: function() { },
    };

    var compiler = new TypeScript.TypeScriptCompiler(outfile, outerror);

    compiler.addUnit(code, '');
    compiler.emit(false, function createFile(fileName) {
        return outfile;
    });

    return '// Compiled TypeScript\n\n' + outfile.source;
  };

  // 動的にスクリプトをロードする
  util.loadScript = function(path, callback) {
    if (util.loadScript.cache[path]) {
      return ;
    }

    $.getScript(path, callback);
    util.loadScript.cache[path] = true;
  };
  util.loadScript.cache = {};

  util.shorten = function(url, callback) {
    if (isNode) {
      var key = "AIzaSyCfmMcmHwD_YN8vXQjJwojUP-4xKHHdaoI";

      var options = {
        url: "https://www.googleapis.com/urlshortener/v1/url?key=" + key,
        headers: {
          'Content-Type': 'application/json'
        },
        json: true,
        body: JSON.stringify({
          longUrl: url
        }),
      };

      request.post(options, function(error, response, body) {
        if (error) {
          console.log('error: ' + response.statusCode);
          return ;
        }

        console.log(body.error);
        if (response.statusCode == 200) {
          callback(body.id);
        }
      });
    }
    else {
      var key = {
        "junk.tmlife.net": "AIzaSyAZiKPSew71cIg8hjwzlF_fYJ4vfi_rDgw",
        "phi-jp.github.io": "AIzaSyDhmy80EsFt4SjFnI5syKzBu1idEp1jBi4",
      }[document.domain];

      return $.ajax({
        url: "https://www.googleapis.com/urlshortener/v1/url?key=" + key,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          longUrl: url,
        }),
        dataType: "json",
        success: function(res) {
          return callback(res.id);
        },
        error: function(err) {
          return console.error(err);
        },
      });

    }
  };

  /*
   * 短縮URLにアクセス可能か確認
   * @param url 短縮URL
   * @param success アクセスできたときに実行される関数
   * @param error アクセスできなかったときに実行される関数
   * 
   * {
   *  url:url,
   *  success:success,
   *  error:error,
   * }
   * という形式でもOK
   */
  util.tryAccess = function (url, success, error) {
      if (typeof url !== 'string') {
          url = url.url;
          success = url.success;
          error = url.error;
      }

      success = success || function () {};
      error = error || function () {};
      var frame = document.createElement('iframe');

      frame.src = url;
      frame.style.display = 'none';
      frame.onload = function () {
          try {
              this.contentDocument;
              success();
          } catch (e) {
              error(e);
          } finally {
              this.parentNode.removeChild(this);
          }
      };

      document.body.appendChild(frame);
  };


  // extend console
  util.ConsoleExtention = function() {
    var post = function(method, args) {
      var message = {
        method: method,
        arguments: args || [],
      };

      window.parent.postMessage(JSON.stringify(message), "*");
    };

    var _log = console.log;
    console.log = function() {
      _log.apply(console, arguments);
      var args = Array.prototype.slice.call(arguments);
      post('log', args);
    };

    var _dir = console.dir;
    console.dir = function() {
      _dir.apply(console, arguments);
      var args = Array.prototype.slice.call(arguments);
      post('dir', args);
    };

    var _error = console.error;
    console.error = function() {
      _error.apply(console, arguments);
      var args = Array.prototype.slice.call(arguments);
      post('error', args);
    };

    var _clear = console.clear;
    console.clear = function() {
      _clear.apply(console, arguments);
      post('clear');
    };

    // 
    var log = console.log;
    var dir = console.dir;
    var error = console.error;
    var clear = console.clear;

    // 
    window.onmessage = function(e) {
      var result = eval(e.data);
      if (!result) result = result + '';

      post('output', [result]);
    };
    // 
    window.onerror = function(message, file, line, col, error) {
        console.error(message + ' (line:' + line + ')');
    };
  };

  var script2tag = function(path) {
    return '<${script} src="${path}"></${script}>'
      .replace(/\$\{script\}/g, "script")
      .replace(/\$\{path\}/, path)
      ;
  };

  exports.runstant.compiler = {
    // html
    'jade': {
        func: util.jade2html,
    },
    'markdown': {
        func: util.markdown2html,
    },
    // style
    'stylus': {
        func: util.stylus2css,
    },
    'less': {
        func: util.less2css,
    },
    'sass': {
        func: util.sass2css,
    },
    // script
    'coffee': {
        func: util.coffee2js,
    },
    'ecmascript6': {
        func: util.es62js,
        prefix: script2tag("http://cdn.rawgit.com/google/traceur-compiler/519f5663415cb825ead961177c4165d52721c33f/bin/traceur-runtime.js"),
    },
    'typescript': {
        func: util.typescript2js,
    },
  };


  // for node
  if (!isNode) return ;

  var spawn = require('child_process').spawn;

  util.open = function(url) {
      spawn("open", [url]);
  };

})(typeof exports === 'undefined' ? this : exports);

