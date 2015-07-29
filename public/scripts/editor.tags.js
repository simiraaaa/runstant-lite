
riot.tag('app', '<header></header> <div class="main"> <editor width="60%" height="100%" float="right" onsave="{onsave}" class="panel"></editor> <preview width="40%" height="60%" float="left" class="panel"></preview> <console width="40%" height="40%" float="left" onpost="{onpost}" class="panel"></console> </div> <footer></footer> <detailmodal></detailmodal>', 'body { background: hsl(0, 0%, 95%); } .main { position: absolute; width: 100%; height: calc(100% - 64px - 30px); overflow: hidden; } .panel { display: block; padding: 5px 5px; float: right; transition: 500ms; } .panel.fullscreen { width: 100% !important; height: 100% !important; } .panel.nofullscreen { width: 0% !important; height: 0% !important; opacity: 0.0; margin: 0px; padding: 0px; } .inner { /* border: 1px solid #ccc; */ position: relative; width: 100%; height: 100%; }', function(opts) {
    var self = this;
    
    runstant.openDetailModal = function() {
      self.tags.detailmodal.init();
      $('#detailmodal').openModal();
    };
    
    this.on('mount', function() {
      window.onmessage = this.onmessage.bind(this);
    });
    
    this.onsave = function() {
      self.tags.preview.refresh();
      self.save();
    };
    
    this.onpost = function(v) {
      self.tags.preview.post(v);
    };
    
    var cache = '';
    this.load = function() {
      var data = null;
    
      if (location.hash) {
        var hash = location.hash.substr(1);
        data = runstant.util.hash2json(hash);
      }
      else {
        data = JSON.parse( JSON.stringify(runstant.constant.TEMPLATE_DATA) );
      }

      if (data.setting.detail && !data.setting.description) {
        data.setting.description = data.setting.detail;
      }
    
      runstant.data = data;

      cache = JSON.stringify(data);

      document.title = data.setting.title + " | runstant";
    };
    this.load();
    
    this.save = function() {
      var data = runstant.data;
      var dataString = JSON.stringify(data);
    
      if (this.cache !== dataString) {
        this.cache = dataString;
    
        var hash = runstant.util.json2hash(data);
        history.pushState(null, 'runstant', '#' + hash);

        document.title = data.setting.title + " | runstant";
      }
    };
    
    
    this.onmessage = function(e) {
      var data = JSON.parse(e.data);
      var method = data.method;
      var args = data.arguments;
      var csl = self.tags.console;
    
      if (method == 'log') {
          csl.print('log', args.join(' '));
      }
      else if (method == 'dir') {
          csl.print('dir', JSON.stringify(args[0], null, 2));
      }
      else if (method === 'output') {
          csl.print('output', args.join(' '));
      }
      else if (method == 'error') {
          csl.print('error', args.join(' '));
      }
      else if (method == 'clear') {
          csl.clear();
      }
    };
  
});

riot.tag('btn-fullscreen', '<a href="#" onclick="{expand}" if="{!isFullScreen}"><i class="mdi-navigation-fullscreen"></i></a><a href="#" onclick="{exit}" if="{isFullScreen}"><i class="mdi-navigation-fullscreen-exit"></i></a>', 'btn-fullscreen { display: block; position: absolute; bottom: 16px; right: 10px; line-height: 14px; cursor: pointer; font-size: 2rem; z-index: 32; }', function(opts) {
    this.isFullScreen = false;
    this.expand = function() {
      var target = document.querySelector(opts.query);
      var panels = document.querySelectorAll('.panel');
    
      Array.prototype.forEach.call(panels, function(panel) {
        if (panel === target) return ;
        panel.classList.add('nofullscreen');
      });
    
      $(opts.query).addClass('fullscreen');
      this.isFullScreen = true;

      setTimeout(function() {
        $('ul.tabs').tabs('select_tab', $('ul.tabs').find(".active").attr('href').substr(1));
      }, 500);
    };
    this.exit = function() {
      $(opts.query).removeClass('fullscreen');
      var panels = document.querySelectorAll('.panel');
    
      Array.prototype.forEach.call(panels, function(panel) {
        panel.classList.remove('fullscreen');
        panel.classList.remove('nofullscreen');
      });
    
      this.isFullScreen = false;

      setTimeout(function() {
        $('ul.tabs').tabs('select_tab', $('ul.tabs').find(".active").attr('href').substr(1));
      }, 500);
    };
  
});

riot.tag('console', '<div class="inner z-depth-2"> <div class="header cyan lighten-5 grey-text text-darken-2"><span class="title">console</span></div> <div onclick="{click}" class="content"> <div class="content-console"><span each="{messages}" onclick="confirm(&quot;{value}&quot;)" class="{type}">{value}</span><span id="console-input" type="text" contenteditable="true" onkeypress="{keypress}" class="input"></span></div> </div> <btn-fullscreen query="console"></btn-fullscreen> </div>', 'console { } console .inner { background: white; } console .header { padding: 3px 10px; height: 36px; line-height: 36px; } console .header .title { font-size: 1.2rem; } console .content .content-console { position: relative; width: 100%; height: 100%; margin: 0px; padding: 5px 20px; font-family: Consolas, Monaco, \'ＭＳ ゴシック\'; overflow-x: auto; } console .content .content-console span { border-bottom: 1px solid #ddd; display: block; line-height: 1em; margin-top: 2px; padding-bottom: 2px; color: #0055ff; font-size: 13px; white-space: pre; word-wrap: break-word; } console .content .content-console span.input { outline: 0; color: #222; border-bottom: 0px; } console .content .content-console span.input:before { position: absolute; left: 7px; font-weight: bold; content: \'> \'; color: #47b4eb; } console .content .content-console span.output { outline: 0; } console .content .content-console span.output:before { position: absolute; left: 7px; font-weight: bold; content: \'< \'; color: #47b4eb; } console .content .content-console span.error { color: red; }', function(opts) {
    var self = this;
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.messages = [
    ];
    
    this.stack = [];
    
    this.on('mount', function() {
      var $input = $("#console-input");
    });
    
    this.keypress = function(e) {
      if (e.which === 13 && e.shiftKey === false) {
        var target = $(e.target);
        var v = target.text();
        if (v === '') return false;
    
        target.text('');
    
        opts.onpost && opts.onpost(v);
    
        this.stack.push(v);
        this.print('input', v);
    
        return false;
      }
      return true;
    };
    
    this.click = function() {
      $('#console-input').focus();
    };
    
    this.print = function(type, v) {
      this.messages.push({
        type: type,
        value: v,
      });
      this.update();
    };
    
    this.clear = function() {
      this.messages = [];
      this.update();
    }
  
});

<!-- クリップの詳細-->
riot.tag('detailmodal', '<div class="modal-content"> <h4>Setting</h4> <form name="_form" class="row"> <div class="col s6"> <h5>Project</h5> <div class="row"> <div class="col s12 input-field"> <input name="_title" value="hoge" type="text"> <label>Project Title</label> </div> <div class="col s12 input-field"> <textarea name="_description" class="materialize-textarea"></textarea> <label>Description</label> </div> </div> <div class="row"> <div class="col s12"> <label>Language</label> </div> <div each="{languages}" class="col s4"> <label>{name}</label> <select name="_{name}" class="browser-default"> <option each="{list}" value="{name}">{name}</option> </select> </div> </div> </div> </form> </div>', 'detailmodal { max-height: 85% !important; }', 'id="detailmodal" class="modal bottom-sheet"', function(opts) {
    this.languages = [
      {
        name: 'html',
        list: [
          {name:'html'},
          {name:'jade'},
          {name:'markdown'},
        ],
      },
      {
        name: 'style',
        list: [
          {name:'css'},
          {name:'stylus'},
          {name:'less'},
          {name:'sass'},
        ],
      },
      {
        name: 'script',
        list: [
          {name:'javascript'},
          {name:'typescript'},
          {name:'coffee'},
          {name:'ecmascript6'},
        ],
      },
    ];
    this.init = function() {
      var elements = this._form.elements;
      elements._title.value = runstant.data.setting.title;
      elements._description.value = runstant.data.setting.description;
      elements._html.value = 'jade';
      elements._style.value = 'less';
      elements._script.value = 'coffee';
    };
  
});

riot.tag('editor', '<div class="inner z-depth-4"> <div class="header"> <ul class="tabs"> <li id="tab-html" class="tab col s3"><a data-type="html" href="#editor-html"><span class="type">html</span><span class="lang">{this.data.code.html.type}</span></a></li> <li id="tab-style" class="tab col s3"><a data-type="style" href="#editor-style"><span class="type">style</span><span class="lang">{this.data.code.style.type}</span></a></li> <li id="tab-script" class="tab col s3"><a data-type="script" href="#editor-script"><span class="type">script</span><span class="lang">{this.data.code.script.type}</span></a></li> </ul> </div> <div class="content"> <div id="editor-html" class="editor-unit">html</div> <div id="editor-style" class="editor-unit">style</div> <div id="editor-script" class="editor-unit">script</div> </div> <btn-fullscreen query="editor"></btn-fullscreen> </div>', 'editor .header { margin-bottom: 1px; height: 32px; } .content { width: 100%; height: calc(100% - 36px); } #editor, #editor-html, #editor-style, #editor-script { width: 100%; height: 100%; } editor .tabs { background-color: hsl(0, 0%, 27%); height: 36px; } editor .tabs .tab { height: 36px; line-height: 36px; } editor .tabs .indicator { /* background: hsl(60, 100%, 60%); */ } @media only screen and (min-width: 601px) { editor .tabs li.tab .lang { font-size: x-small; } editor .tabs li.tab .lang:before { content: \'(\'; } editor .tabs li.tab .lang:after { content: \')\'; } } @media only screen and (max-width: 600px) { editor .tabs li.tab span.type { display: none; } }', function(opts) {
    var self = this;
    this.data = runstant.data;
    
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.editors = {};
    
    this.on('mount', function() {
      $('editor ul.tabs').tabs();
    
      this.setupEditor('html');
      this.setupEditor('style');
      this.setupEditor('script');
    
      $('ul.tabs').tabs('select_tab', 'editor-' + 'script');
      this.editors['script'].focus();
    });
    
    this.setupEditor = function(type) {
      var editor = this.editors[type] = new runstant.Editor('editor-' + type);
      var code = self.data.code[type];
    
      editor.setMode(code.type);
      editor.setValue(code.value);
    
      editor.onsave = function() {
        var v = editor.getValue();
        code.value = v;
        opts.onsave && opts.onsave();
      };

      editor.setFontSize(14);
      editor.setTheme('ace/theme/monokai');
    };
  
});

riot.tag('footer', '', 'footer { position: fixed; height: 30px; width: 100%; background-color: hsl(200, 18%, 26%)!important; bottom: 0; text-align: right; }', function(opts) {

});

riot.tag('header', '<nav class="blue-grey darken-3"> <div class="nav-wrapper"><a href="#home" class="brand-logo"><img src="/images/runstant.png"><span>Run</span><span class="lighter">stant</span></a> <ul class="right hide-on-small-and-down"> <li data-tooltip="play" class="tooltipped"><a id="btn-play" href="#"><i class="mdi-av-play-arrow"></i></a></li> <li data-tooltip="share" class="tooltipped"><a id="btn-share" href="#"><i class="mdi-social-share"></i></a></li> <li data-tooltip="setting" class="tooltipped"><a id="btn-setting" href="#"><i class="mdi-action-settings"></i></a></li> </ul> <ul id="nav-mobile" style="left: -250px;" class="side-nav"> <li><a href="#">Share</a></li> </ul> <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="mdi-navigation-menu"></i></a> </div> </nav> <style scoped="scoped"> :scope { display: block } nav { padding: 0px 20px; } .brand-logo { position: relative; white-space: nowrap; } .brand-logo img { height: 40px; transform: translate(0px, 5px); } .brand-logo .lighter { font-weight: 200; } </style>', function(opts) {var self = this;
});

riot.tag('preview', '<div class="inner z-depth-2"> <div onclick="runstant.openDetailModal();" class="header cyan lighten-5 grey-text text-darken-2"><span class="title">preview</span></div> <div class="content"> <div id="preview"></div> </div> <btn-fullscreen query="preview"></btn-fullscreen> </div>', 'preview { } preview .inner { background: white; } preview .header { padding: 3px 10px; height: 36px; line-height: 36px; } preview .header .title { font-size: 1.2rem; } #preview { width: 100%; height: 100%; } #preview iframe { width: 100%; height: 100%; border: none; }', function(opts) {
    var self = this;
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.on('mount', function() {
      var preview = jframe("#preview");
      this.preview = preview;
    
      this.refresh();
    });
    
    var wrapTag = function(text, tag) {
      return '<' + tag + '>' + text + '</' + tag + '>';
    };
    
    this.dataToCode = function() {
      var data = runstant.data;
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
    
      var finalCode = htmlCode
        .replace("${title}", setting.title)
        .replace("${description}", setting.description)
        .replace("${style}", cssCode)
        .replace("${script}", jsCode)
        ;
    
      var debug = true;
      if (debug === true) {
        var debugCode = '(' + runstant.util.ConsoleExtention.toString() + ')()';
        finalCode = wrapTag(debugCode, 'script') + finalCode;
      }
    
      return finalCode;
    };
    
    this.refresh = function() {
      var v = this.dataToCode();
      this.preview.load(v);
    };
    
    this.post = function(v) {
      var frame = self.preview.domElement.querySelector('iframe');
      var win = frame.contentWindow;
    
      win.postMessage(v, '*');
    };
  
});