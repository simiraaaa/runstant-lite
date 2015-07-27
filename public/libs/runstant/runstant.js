
;(function (exports) {
  var runstant = {};

  exports.TEMPLATE_HTML = "<h1>Hello, runstant!</h1>";
  exports.TEMPLATE_CSS = "body { background: red; }";
  exports.TEMPLATE_JS = "console.log('Hello, runstant!')";

  runstant.data = {
    version: '0.0.1',
    current: "script",

    setting: {
      title: "template - tmlib.js",
      description: "tmlib.js 用公式エディタ. 色々と使えますよ♪", // もと detail
      fullscreen: false,
    },
    code: {
      html: {
        type: "html",
        value: exports.TEMPLATE_HTML,
      },
      style: {
        type: "css",
        value: exports.TEMPLATE_CSS,
      },
      script: {
        type: "javascript",
        value: exports.TEMPLATE_JS,
      },
    },
  };

  exports.runstant = runstant;
})(typeof exports === 'undefined' ? this : exports);
