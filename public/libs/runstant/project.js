
(function(exports) {
  var Project = function() {
    this.cache = null;
    this.load();
  };

  var wrapTag = function(text, tag) {
    return '<' + tag + '>' + text + '</' + tag + '>';
  };

  Project.prototype = {
    load: function() {
      var data = null;

      if (location.hash) {
        var hash = location.hash.substr(1);
        var query = location.search.substr(1).toObjectAsQuery();
        data = this.decode(hash, query.v);
      }
      else {
        data = JSON.parse(JSON.stringify(runstant.constant.TEMPLATE_DATA));
      }

      // 後方互換
      if (data.setting.detail && !data.setting.description) {
        data.setting.description = data.setting.detail;
        delete data.setting.detail;
      }
      if (data.current && !data.setting.current) {
        data.setting.current = data.current;
        delete data.current;
      }

      this.data = data;

      // キャッシュしておく
      this.cache = JSON.stringify(data);
      // タイトル更新
      document.title = data.setting.title + " | runstant";
    },

    encode: function(data, version) {
      return runstant.util.getConverter(version).encode(data);
    },
    decode: function(hash, version) {
      return runstant.util.getConverter(version).decode(hash);
    },
    save: function() {
      var data = runstant.project.data;
      var dataString = JSON.stringify(data);

      if (this.cache !== dataString) {
        this.cache = dataString;
        var version = runstant.constant.TEMPLATE_DATA.version;
        var hash = this.encode(data, version);
        history.pushState(null, 'runstant', '?v=' + version + '#' + hash);

        // タイトル更新
        document.title = data.setting.title + " | runstant";

        // ユーザーデータにプロジェクト情報を保存
        if (runstant.user) {
          runstant.util.shorten(location.href, function(url) {
            var id = url.replace('http://goo.gl/', '');

            runstant.user.logProject(id, data);
          }, function(e) {
            // URL短縮できなかったときはそのまま入れる
            runstant.user.logProject(location.search + location.hash, data);
          });
        }
      }
    },
    toCode: function(debug) {
      var data = this.data;
      var setting = data.setting;
      var code = data.code;

      var htmlCode = code.html.value;
      if (runstant.compiler[code.html.type]) {
        htmlCode = runstant.compiler[code.html.type].func(htmlCode);
      }
      var cssCode = code.style.value;
      if (runstant.compiler[code.style.type]) {
        cssCode = runstant.compiler[code.style.type].func(cssCode);
      }
      var jsCode = code.script.value;
      if (runstant.compiler[code.script.type]) {
        jsCode = runstant.compiler[code.script.type].func(jsCode);
      }

      var title = runstant.util.sanitaize(setting.title);
      var description = runstant.util.sanitaize(setting.description);

      var finalCode = htmlCode
        .replace("${title}", title)
        .replace("${description}", description)
        .replace("${style}", cssCode)
        .replace("${script}", jsCode)
      ;

      if (debug === true) {
        var debugCode = '(' + runstant.util.ConsoleExtention.toString() + ')()';
        finalCode = wrapTag(debugCode, 'script') + finalCode;
      }

      return finalCode;
    },
    toProject: function() {
      var md = '';
      var setting = this.data.setting;

      md += '# ' + setting.title + '\n\n';
      md += setting.description;

      var html = runstant.util.markdown2html(md);
      html += '<link href="/styles/markdown.css" rel="stylesheet"></link>\n';

      // var stylePath = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.8.0/styles/default.min.css';
      var stylePath = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.8.0/styles/github.min.css';
      html += '<link rel="stylesheet" href="{0}" />'.format(stylePath);

      return html;
    },

  };

  exports.runstant.Project = Project;
})(typeof exports === 'undefined' ? this : exports);
