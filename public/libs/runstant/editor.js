
var runstant = runstant || {};

;(function() {

  var Editor = function(param) {
    this.init(param);
  };

  Editor.prototype = {

    init: function(id) {
      var editor = this.editor = ace.edit(id);
      editor.setTheme("ace/theme/monokai");

      // setup command
      defaults.commands.forEach(function(command) {
        editor.commands.addCommand({
          name: command.name,
          bindKey: command.bindKey,
          exec: command.exec.bind(this),
        });
      }, this);

      // setup options
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      editor.$blockScrolling = Infinity;
      editor.getSession().setTabSize(2);

      // support scroll in smart phone
      var isSmartPhone = (function() {
        var ua = navigator.userAgent;
        return ua.indexOf('iPhone') > 0 ||
        ua.indexOf('iPad') > 0 ||
        ua.indexOf('iPod') > 0 ||
        ua.indexOf('Android') > 0;
      })();

      if (isSmartPhone) {
        $(editor.container).find('.ace_scroller')
          .css('overflow', 'auto')
          ;
      }
    },

    setValue: function(value) {
      this.editor.setValue(value);
    },

    getValue: function() {
      return this.editor.getValue();
    },

    setMode: function(type) {
      var map = {
        "ecmascript6": "javascript",
        "sass": "scss",
      };
      if (map[type]) type = map[type];

      this.editor.getSession().setMode("ace/mode/" + type);
    },

    setTheme: function(theme) {
      console.log(theme);
      this.editor.setTheme(theme);
    },

    setTabSize: function(tabSize) {
      tabSize = Number(tabSize) || 2;
      this.editor.getSession().setTabSize(tabSize);
    },

    setFontSize: function(size) {
      this.editor.setFontSize(+size);
    },

    setKeyboardHandler: function(key) {
      var keybindings = {
      'ace': null,    // default
      'vim': "ace/keyboard/vim",
      'emacs': "ace/keyboard/emacs",
      };
      var keybinding = keybindings[key];
      this.editor.setKeyboardHandler(keybinding);
    },

    addCommand: function(command) {
      this.editor.commands.addCommand(command);
    },
    focus: function() {
      this.editor.focus();
    },

    onsave: function() {
      console.log(this);
      // console.log(this.getValue());
    },
  };


  var defaults = {
    commands: [
      {
        name: "save",
        bindKey: { mac: "Command-S", win: "Ctrl-S", },
        exec: function() {
          this.onsave && this.onsave();
        }
      },
      // 左右移動
      {
        name: "go to word right",
        bindKey: {
          mac: "Ctrl-Right",
          win: "Ctrl-Right",
        },
        exec: function(e) {
          e.navigateWordRight();
        }
      },
      {
        name: "go to word left",
        bindKey: {
          mac: "Ctrl-Left",
          win: "Ctrl-Left",
        },
        exec: function(e) {
          e.navigateWordLeft();
        }
      },
      {
        name: "selectwordright2",
        bindKey: {
          mac: "Ctrl-Shift-Right",
          win: "Ctrl-Shift-Right",
        },
        exec: function(e) {
          e.getSelection().selectWordRight();
        }
      },
      {
        name: "selectwordleft2",
        bindKey: {
          mac: "Ctrl-Shift-Left",
          win: "Ctrl-Shift-Left",
        },
        exec: function(e) {
          e.getSelection().selectWordLeft();
        }
      },
    ],
  };

  runstant.Editor = Editor;

})();



;(function() {

  var themeData = [
    ["Chrome"         ],
    ["Clouds"         ],
    ["Crimson Editor" ],
    ["Dawn"           ],
    ["Dreamweaver"    ],
    ["Eclipse"        ],
    ["GitHub"         ],
    ["Solarized Light"],
    ["TextMate"       ],
    ["Tomorrow"       ],
    ["XCode"          ],
    ["Kuroir"],
    ["KatzenMilch"],
    ["Ambiance"             ,"ambiance"                ,  "dark"],
    ["Chaos"                ,"chaos"                   ,  "dark"],
    ["Clouds Midnight"      ,"clouds_midnight"         ,  "dark"],
    ["Cobalt"               ,"cobalt"                  ,  "dark"],
    ["idle Fingers"         ,"idle_fingers"            ,  "dark"],
    ["krTheme"              ,"kr_theme"                ,  "dark"],
    ["Merbivore"            ,"merbivore"               ,  "dark"],
    ["Merbivore Soft"       ,"merbivore_soft"          ,  "dark"],
    ["Mono Industrial"      ,"mono_industrial"         ,  "dark"],
    ["Monokai"              ,"monokai"                 ,  "dark"],
    ["Pastel on dark"       ,"pastel_on_dark"          ,  "dark"],
    ["Solarized Dark"       ,"solarized_dark"          ,  "dark"],
    ["Terminal"             ,"terminal"                ,  "dark"],
    ["Tomorrow Night"       ,"tomorrow_night"          ,  "dark"],
    ["Tomorrow Night Blue"  ,"tomorrow_night_blue"     ,  "dark"],
    ["Tomorrow Night Bright","tomorrow_night_bright"   ,  "dark"],
    ["Tomorrow Night 80s"   ,"tomorrow_night_eighties" ,  "dark"],
    ["Twilight"             ,"twilight"                ,  "dark"],
    ["Vibrant Ink"          ,"vibrant_ink"             ,  "dark"]
  ];

  runstant.Editor.themesByName = {};

  /**
  * An array containing information about available themes.
  */
  runstant.Editor.themes = themeData.map(function(data) {
    var name = data[1] || data[0].replace(/ /g, "_").toLowerCase();
    var theme = {
      caption: data[0],
      theme: "ace/theme/" + name,
      isDark: data[2] == "dark",
      name: name
    };
    runstant.Editor.themesByName[name] = theme;
    return theme;
  });

})();