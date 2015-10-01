/*
 *
 */


(function (exports) {

  exports.runstant = exports.runstant || {};
  var util = exports.runstant.util = {};

  var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
  var JSZip = (isNode) ? require('request') : window.JSZip;
  var request = (isNode) ? require('request') : null;

  util.zip = function (data) {
    var zip = new JSZip();
    zip.file('data', data);

    return zip.generate({ type: "base64" });
  };

  util.unzip = function (data) {
    var zip = new JSZip();
    var files = zip.load(data, {
      base64: true
    });

    return files.file('data').asText();
  };

  util.json2hash = function (obj) {
    var str = JSON.stringify(obj);
    var unmin = str;
    console.log('圧縮前', str.length);
    var s = new Date();
    str = util.minify(str);
    console.log('time:', new Date() - s, '可逆:', util.unminify(str) === unmin);
    console.log('圧縮後', str.length);
    console.log('圧縮率', (str.length / unmin.length * 100).toFixed(2));
    var zipedFile = this.zip(str);

    //zip圧縮後の圧縮率
    console.log('ziped圧縮率', (zipedFile.length / this.zip(unmin).length * 100).toFixed(2));
    return encodeURI(zipedFile);
  };

  util.hash2json = function (data) {
    data = decodeURI(data);
    data = this.unzip(data);
    data = util.unminify(data);
    data = JSON.parse(data);
    return data;
  };

  util.jade2html = function (code) {
    var source = jade.compile(code, {
      pretty: true
    });
    return '<!-- Compiled Jade -->\n\n' + source();
  };

  util.markdown2html = function (code) {
    var renderer = new marked.Renderer();
    renderer.link = function (href, title, text) {
      return '<a href="{0}" target="_blank">{1}</a>'.format(href, text);
    };
    marked.setOptions({
      highlight: function (code) {
        var v = hljs.highlightAuto(code);
        return v.value;
      },
    });
    var source = marked(code, { renderer: renderer });

    return '<!-- Compiled Markdown -->\n\n' + source;
  };

  util.less2css = function (code) {
    // console.dir(less.Parser());
    var source = '';
    less.Parser().parse(code, function (err, tree) {
      if (err) {
        return console.error(err);
      }
      source = tree.toCSS();
    });

    return '/* Compiled LESS */\n\n' + source;
  };

  util.sass2css = function (code) {
    var css = Sass.compile(code);
    return '/* Compiled SASS */\n\n' + css;
  };

  util.stylus2css = function (code) {
    var source = '';
    var renderer = stylus(code);

    renderer.render(function (a, b) {
      source = b;
    });

    return '/* Compiled Stylus */\n\n' + source;
  };

  // 
  util.coffee2js = function (code) {
    var source = CoffeeScript.compile(code);
    return '// Compiled CoffeeScript\n\n' + source;
  };
  // 
  util.es62js = function (code) {
    var result = babel.transform(code);

    return '// Compiled ECMAScript 6\n\n' + result.code;
  };
  // 
  util.typescript2js = function (code) {
    var outfile = {
      source: '',
      Write: function (s) {
        this.source += s;
      },
      WriteLine: function (s) {
        this.source += s + '\n';
      },
      Close: function () {

      },
    };
    var outerror = {
      source: '',
      Write: function (s) { },
      WriteLine: function (s) { },
      Close: function () { },
    };

    var compiler = new TypeScript.TypeScriptCompiler(outfile, outerror);

    compiler.addUnit(code, '');
    compiler.emit(false, function createFile(fileName) {
      return outfile;
    });

    return '// Compiled TypeScript\n\n' + outfile.source;
  };

  // unminify で元に戻せる minify
  util.minify = function (str) {
    var regex = /[\'\"\!\&\|\^\~\-\=\(\)\&\%\#\?\<\>\+\*\;\:\[\]\{\}\t \@\`\\\,\/\.\n]/g;
    var after = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var targetAll = str.replace(regex, ',').split(',');

    // 連続する空白も追加
    [].push.apply(targetAll, str.match(/\s+/g));


    // 適当にソート
    targetAll.sort();

    // 重複と文字長2以下除外して、出現回数をカウント(出現回数2以下除外)
    var target = [];
    for (var i = 1, c = 0, len = targetAll.length, temp = targetAll[0]; i < len; ++i) {
      var x = targetAll[i];
      if (x !== temp) {
        if (temp.length > 2 && ++c > 2) target.push({
          str: temp,
          count: c,
          cost: c * (temp.length - 1)
        });
        temp = x;
        c = 0;
      } else {
        ++c;
      }
    }

    // コスト順
    target.sort(function (a, b) {
      return b.cost - a.cost;
    });

    var position = 0;
    var AFTER_POSITON_LAST = after.length;

    var replaced = '0';

    var next = function () {
      replaced = '';
      var p = ++position;
      while (p > 0) {
        replaced = after[p % AFTER_POSITON_LAST] + replaced;
        p = p / AFTER_POSITON_LAST | 0;
      }
      return replaced || (replaced = '0');
    };

    // 文字数を減らすことができるかの判定
    var canMinify = function (x) {
      var len = x.str.length;
      var y = len - replaced.length;
      if (y < 1) return false;
      y *= x.count;
      return y > len + replaced.length;
    };

    var _history = [];

    target.some(function (x) {
      while (str.indexOf(replaced) !== -1) next();
      if (!canMinify(x)) return true;
      str = str.split(x.str).join(replaced);
      _history.push([replaced, x.str]);
      next();
      return false;
    });

    //最後にこの関数でminifyされたかどうかわかる文字列を引っ付けておく
    return str + '//' + JSON.stringify(_history) + 'isMin';
  };

  util.unminify = function (str) {
    var s = new Date();
    var isMin = str.slice(-5) === 'isMin';
    if (!isMin) {
      console.log('is not min');
      return str;
    }
    str = str.slice(0, -5);
    var index = str.lastIndexOf('//');
    var _history = JSON.parse(str.slice(index).slice(2));
    str = str.slice(0, index);
    for (var i = _history.length - 1; i >= 0; --i) {
      var h = _history[i];
      str = str.split(h[0]).join(h[1]);
    }
    console.log('unmin', new Date - s);
    return str;
  };

  // 動的にスクリプトをロードする
  util.loadScript = function (path, callback) {
    if (util.loadScript.cache[path]) {
      callback && callback();
      return;
    }

    $.getScript(path, callback);
    util.loadScript.cache[path] = true;
  };
  util.loadScript.cache = {};

  util.loadScripts = function (pathes, callback) {
    if (pathes.length <= 0) {
      callback && callback();
      return;
    }
    var count = pathes.length;
    var counter = 0;

    pathes.forEach(function (path) {
      runstant.util.loadScript(path, function () {
        counter++;

        if (counter >= count) {
          callback && callback();
        }
      });
    });
  };

  util.shorten = function (url, callback, error) {
    var URL_MAX_LENGTH = 0x3fff;

    if (url.length > URL_MAX_LENGTH) {
      return (error || function (e) {
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

      request.post(options, function (error, response, body) {
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
        success: function (res) {
          return callback(res.id);
        },
        error: function (err) {
          return console.error(err);
        },
      });

    }
  };


  // extend console
  util.ConsoleExtention = function () {
    var post = function (method, args) {
      var message = {
        method: method,
        arguments: args || [],
      };

      window.parent.postMessage(JSON.stringify(message), "*");
    };

    var _log = console.log;
    console.log = function () {
      _log.apply(console, arguments);
      var args = Array.prototype.slice.call(arguments);
      post('log', args);
    };

    var _dir = console.dir;
    console.dir = function () {
      _dir.apply(console, arguments);
      var args = Array.prototype.slice.call(arguments);
      post('dir', args);
    };

    var _error = console.error;
    console.error = function () {
      _error.apply(console, arguments);
      var args = Array.prototype.slice.call(arguments);
      post('error', args);
    };

    var _clear = console.clear;
    console.clear = function () {
      _clear.apply(console, arguments);
      post('clear');
    };

    // 
    var log = console.log;
    var dir = console.dir;
    var error = console.error;
    var clear = console.clear;

    // 
    window.onmessage = function (e) {
      var result = eval(e.data);
      if (!result) result = result + '';

      post('output', [result]);
    };
    // 
    window.onerror = function (message, file, line, col, error) {
      console.error(message + ' (line:' + line + ')');
    };
  };

  var script2tag = function (path) {
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


  // for node
  if (!isNode) return;

  var spawn = require('child_process').spawn;

  util.open = function (url) {
    spawn("open", [url]);
  };

})(typeof exports === 'undefined' ? this : exports);

