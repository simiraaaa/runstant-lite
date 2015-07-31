
;(function (exports) {

  var constant = {};

  constant.RUNSTANT_URL = "http://phi-jp.github.io/runstant/release/alpha/index.html";

  constant.TEMPLATE_HTML = "\<!DOCTYPE html\>\n\
 \n\
\<html\>\n\
  \<head\>\n\
    \<meta charset=\"UTF-8\" /\>\n\
    \<meta name=\"viewport\" content=\"width=device-width, user-scalable=no\" /\>\n\
    \<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" /\>\n\
    \n\
    \<title\>${title}\</title\>\n\
    \<meta name=\"description\" content=\"${description}\" /\>\n\
    \n\
    \<style\>${style}\</style\>\n\
    \n\
    \<scri____pt src=\"http://cdn.rawgit.com/phi-jp/high/0.0.3/high.js\"\>\</scri____pt\>\n\
    \<scri____pt\>${script}\</scri____pt\>\n\
  \</head\>\n\
  \<body\>\n\
    \<h1\>Hello, runstant!\</h1\>\n\
  \</body\>\n\
\</html\>".replace(/scri____pt/g, 'script');

  constant.TEMPLATE_CSS = "body {\n\
  background-color: hsl(0, 0%, 96%);\n\
}\n\
\n\
h1 {\n\
  color: #444;\n\
  font-size: 23px;\n\
  font-family: \'Lucida Grande\',\'Hiragino Kaku Gothic ProN\', Meiryo, sans-serif;\n\
}";
  constant.TEMPLATE_JS = 'console.log("Hello, runstant!");';

  constant.TEMPLATE_DATA = {
    version: '0.0.1',

    setting: {
      title: "template - tmlib.js",
      description: "tmlib.js 用公式エディタ. 色々と使えますよ♪", // もと detail
      fullscreen: false,
      current: "script",
    },
    code: {
      html: {
        type: "html",
        value: constant.TEMPLATE_HTML,
      },
      style: {
        type: "css",
        value: constant.TEMPLATE_CSS,
      },
      script: {
        type: "javascript",
        value: constant.TEMPLATE_JS,
      },
    },
  };

  constant.RUNSTANT_URL = "http://phi-jp.github.io/runstant/release/alpha/index.html";

  constant.LANG_SCRIPT_MAP = {
    'coffee': "http://cdnjs.cloudflare.com/ajax/libs/coffee-script/1.7.1/coffee-script.min.js",
    'ecmascript6': "http://cdn.rawgit.com/phi-jp/runstant/625e2c2e06bb409e92d05b1bc4e64584a9d1e434/plugins/traceur-compiler/traceur.js",
    'typescript': "http://rawgit.com/niutech/typescript-compile/gh-pages/js/typescript.min.js",

    'stylus': "http://cdnjs.cloudflare.com/ajax/libs/stylus/0.32.1/stylus.js",
    'less': "http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.3/less.min.js",
    'sass': "http://cdnjs.cloudflare.com/ajax/libs/sass.js/0.4.0/sass.min.js",

    'jade': "http://cdnjs.cloudflare.com/ajax/libs/jade/1.3.1/jade.min.js",
    'markdown': "http://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js",
  };

  constant.EMBED_CODE = "[div class='runstant'][iframe src='{url}' width=100% height=460px style='border:0px;box-shadow:0px 0px 2px 0px #aaa'][/iframe][/div]";
  constant.EMBED_CODE = constant.EMBED_CODE.replace(/\[/g, '<').replace(/\]/g, '>');

  exports.runstant = exports.runstant || {};
  exports.runstant.constant = constant;

})(typeof exports === 'undefined' ? this : exports);
