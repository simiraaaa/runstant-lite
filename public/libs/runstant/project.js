
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
      var query = location.search.substr(1).toObjectAsQuery();
      var hash = location.hash.substr(1);

      if (query.title) {
        var title = decodeURIComponent(query.title);
        if (runstant.user) {
          var project = runstant.user.findProject(title);
          if (project) {
            data = project.data;
          }
        }
      }
      else if (location.hash) {
        data = this.decode(hash, query.v);
      }

      // setting default
      if (!data) {
        data = JSON.parse(JSON.stringify(runstant.constant.TEMPLATE_DATA));
        data.setting.title = (new Date()).format('Y-m-d H:i:s') + ' - ' + data.setting.title;
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
      // キャッシュしておく
      this.cache = JSON.stringify(data);

      this.set(data);
    },

    set: function(data) {
      this.data = data;

      // タイトル更新
      document.title = data.setting.title + " | runstant";

      this.save();
    },

    encode: function(data, version) {
      return runstant.util.getConverter(version).encode(data);
    },
    decode: function(hash, version) {
      return runstant.util.getConverter(version).decode(hash);
    },
    save: function() {
      var data = this.data;
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
          runstant.user.logProject(data);
        }
      }
    },
    toCode: function(debug, toBlob) {
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

      if (toBlob) {
        var finalCode = htmlCode
          .replace("${title}", title)
          .replace("${description}", description)
          .replace("<style>${style}<\/style>", '<link rel="stylesheet" href="style.css">')
          .replace("<script>${script}<\/script>", '<script src="main.js"><\/script>')
        ;

        var blob = runstant.util.blob({
          html: finalCode,
          css: cssCode,
          js: jsCode
        });

        return blob;
      }

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
    toBlob: function(debug) {
      return this.toCode(debug, true);
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
