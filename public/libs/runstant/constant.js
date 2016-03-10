
;(function(exports) {

  var constant = {};

  constant.RUNSTANT_URL = "http://lite.runstant.com/";

  constant.TEMPLATE_HTML =
    "<!doctype html>\n" +
    " \n" +
    "<html>\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\" />\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, user-scalable=no\" />\n" +
    "    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n" +
    "    \n" +
    "    <title>${title}</title>\n" +
    "    <meta name=\"description\" content=\"${description}\" />\n" +
    "    \n" +
    "    <style>${style}</style>\n" +
    "    <script>${script}</script>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <h1>Hello, runstant!</h1>\n" +
    "  </body>\n" +
    "</html>\n";


  constant.TEMPLATE_CSS =
    "*, *:before, *:after {\n" +
    "  box-sizing: border-box; \n" +
    "}\n" +
    "html {\n" +
    "  font-size: 62.5%;\n" +
    "}\n" +
    "body {\n" +
    "  color: #444;\n" +
    "  background-color: hsl(0, 0%, 96%);\n" +
    "}\n" +
    "h1 {\n" +
    "  font-size: 1.8rem;\n" +
    "}\n";

  constant.TEMPLATE_JS =
    "\/*\n" +
    " * runstant\n" +
    " *\/\n" +
    "\n" +
    "window.onload = function() {\n" +
    "  \/\/ TODO: write code\n" +
    "  \/\/ console.log(\"Hello, runstant!\");\n" +
    "};\n";

  constant.TEMPLATE_DATA = {
    version: '0.0.3',

    setting: {
      title: "Runstant",
      description: "思いたったらすぐ開発. プログラミングに革命を...", // もと detail
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
    'ecmascript6': "https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js",
    'typescript': "http://rawgit.com/niutech/typescript-compile/gh-pages/js/typescript.min.js",

    'stylus': "http://cdnjs.cloudflare.com/ajax/libs/stylus/0.32.1/stylus.js",
    'less': "http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.3/less.min.js",
    'sass': "http://cdnjs.cloudflare.com/ajax/libs/sass.js/0.4.0/sass.min.js",

    'jade': "http://cdnjs.cloudflare.com/ajax/libs/jade/1.3.1/jade.min.js",
    'markdown': "http://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js",
  };

  constant.EMBED_CODE = "[div class='runstant'][iframe src='{url}' width='100%' height='640px' style='border:0px;box-shadow:0px 0px 2px 0px #aaa'][/iframe][/div]";
  constant.EMBED_CODE = constant.EMBED_CODE.replace(/\[/g, '<').replace(/\]/g, '>');

  exports.runstant = exports.runstant || {};
  exports.runstant.constant = constant;

})(typeof exports === 'undefined' ? this : exports);
