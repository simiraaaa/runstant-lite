/*
 *
 */


(function(exports) {

  exports.runstant = exports.runstant || {};
  var util = exports.runstant.util = {};

  var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
  var JSZip = (isNode) ? require('request') : window.JSZip;
  var request = (isNode) ? require('request') : null;

  util.zip = function(data) {
    var zip = new JSZip();
    zip.file('data', data);

    return zip.generate({ type: "base64" });
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
    var renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
      return '<a href="{0}" target="_blank">{1}</a>'.format(href, text);
    };
    marked.setOptions({
      highlight: function(code) {
        var v = hljs.highlightAuto(code);
        return v.value;
      },
      breaks: true,
    });
    var source = marked(code, { renderer: renderer });

    return '<!-- Compiled Markdown -->\n\n' + source;
  };

  util.less2css = function(code) {
    // console.dir(less.Parser());
    var source = '';
    less.Parser().parse(code, function(err, tree) {
      if (err) {
        return console.error(err);
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
    var result = babel.transform(code);

    return '// Compiled ECMAScript 6\n\n' + result.code;
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

  util.sanitaize = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  // 動的にスクリプトをロードする
  util.loadScript = function(path, callback) {
    if (util.loadScript.cache[path]) {
      callback && callback();
      return;
    }

    $.getScript(path, callback);
    util.loadScript.cache[path] = true;
  };
  util.loadScript.cache = {};

  util.loadScripts = function(pathes, callback) {
    if (pathes.length <= 0) {
      callback && callback();
      return;
    }
    var count = pathes.length;
    var counter = 0;

    pathes.forEach(function(path) {
      runstant.util.loadScript(path, function() {
        counter++;

        if (counter >= count) {
          callback && callback();
        }
      });
    });
  };

  util.shorten = function(url, callback, error) {
    var URL_MAX_LENGTH = 0x3fff;

    if (url.length > URL_MAX_LENGTH) {
      return (error || function(e) {
        alert('コードが長すぎます!!\n100%以下にしてください\nコードの長さ: '
          + (e.length / e.max * 100).toFixed(2) + '%');
      })({
        length: url.length,
        max: URL_MAX_LENGTH
      });
    }

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
          return;
        }

        console.log(body.error);
        if (response.statusCode == 200) {
          callback(body.id);
        }
      });
    }
    else {
      var key = "AIzaSyA3mnqKXrHh8uGNfJPnJmI97KTnpifJ4DM";

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
    },
    'typescript': {
      func: util.typescript2js,
    },
  };

  // バージョン管理
  util.versions = {
    '0.0.1': {
      hash2json: function(data) {
        data = decodeURI(data);
        data = this.unzip(data);
        data = JSON.parse(data);
        return data;
      },

      unzip: function(data) {
        var zip = new JSZip();
        var files = zip.load(data, {
          base64: true
        });

        return files.file('data').asText();
      }
    },

    '0.0.2': {

      hash2json: function(data) {
        //inflate を unzipにする予定
      },

      unzip: function(data) {
        // inflate
      }
    }
  };

  // 指定したバージョンが存在しないとき最新バージョン(utilそのまま)を返す
  util.getVersion = function(version) {
    return util.versions[version || '0.0.1'] || util;
  };

  // for node
  if (!isNode) return;

  var spawn = require('child_process').spawn;

  util.open = function(url) {
    spawn("open", [url]);
  };

})(typeof exports === 'undefined' ? this : exports);

