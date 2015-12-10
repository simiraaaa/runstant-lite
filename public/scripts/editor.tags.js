
riot.tag('app', '<header onplay="{onsave}"></header> <div class="main"> <editor width="{this.editorWidth}%" height="100%" float="right" onsave="{onsave}" class="panel"></editor> <preview width="{100-this.editorWidth}%" height="60%" float="left" class="panel"></preview> <util width="40%" height="40%" float="left" onpost="{onpost}" class="panel"></util> </div> <footer></footer> <modal-detail></modal-detail> <modal-share></modal-share> <modal-user></modal-user>', 'body { background: hsl(0, 0%, 90%); } .main { position: absolute; width: 100%; height: calc(100% - 56px - 30px); overflow: hidden; } @media only screen and (min-width: 601px) { .main { height: calc(100% - 64px - 30px); } } .panel { display: block; padding: 5px 5px; float: right; transition: 500ms; } .panel.fullscreen { width: 100% !important; height: 100% !important; } .panel.nofullscreen { width: 0% !important; height: 0% !important; opacity: 0.0; margin: 0px; padding: 0px; } .inner { /* border: 1px solid #ccc; */ position: relative; width: 100%; height: 100%; }', function(opts) {
    var self = this;
    this.type = null;
    this.editorWidth = '60';





    
    runstant.user = new runstant.User();
    runstant.project = new runstant.Project();

    document.ondragenter = function() {
      return false;
    };
    document.ondragover = function() {
      return false;
    };
    document.ondrop = function(e) {
      var file = e.dataTransfer.files[0];
      var fileReader = new FileReader();
      
      fileReader.onload = function(e) {
        var txt = e.target.result;
        var json = JSON.parse(txt);
    
        runstant.project.set(json);
        self.tags.editor.refresh();
        self.onsave();
        riot.update();
      };
      fileReader.readAsText(file);
    
      if (self.type === 'app') {
        var data = {
          action: 'load',
          data: {
            path: file.path,
          },
        };
        window.parent.postMessage(JSON.stringify(data), "*");
      }
    
      return false;
    };
    
    
    runstant.detailModal = new runstant.Modal({
      query: '#modal-detail',
      ready: function() {
        self.tags['modal-detail'].init();
      },
      complete: function() {
        self.tags['modal-detail'].save();
        self.tags.editor.updateMode();
        self.loadScripts();
      },
    });
    
    runstant.shareModal = new runstant.Modal({
      query: '#modal-share',
      ready: function() {
        self.tags['modal-share'].init();
      },
      complete: function() {
      },
    });
    
    runstant.userModal = new runstant.Modal({
      query: '#modal-user',
      ready: function() {
        self.tags['modal-user'].init();
      },
      complete: function() {
        self.tags['modal-user'].save();
        self.tags.editor.setup();
      },
    });
    
    this.on('mount', function() {
      window.onmessage = this.onmessage.bind(this);
    
      self.tags.preview.on('mount', function() {
        self.loadScripts();
      });
    });
    
    this.onsave = function() {
      self.tags.editor.saveCode();
      self.tags.preview.refresh();
      runstant.project.save();
    
      self.tags.util.tags['panel-console'].clear();
      self.tags.util.tags['panel-project'].refresh();
    
      Materialize.toast('save & play', 1000, "rounded");
    
      if (self.type === 'app') {
        var data = {
          action: 'save',
          data: runstant.project.data,
        };
        window.parent.postMessage(JSON.stringify(data), "*");
      }
    };
    
    this.onpost = function(v) {
      self.tags.preview.post(v);
    };
    
    this.loadScripts = function() {
      var code = runstant.project.data.code;
    
      var pathes = (function() {
        var types = [
          code.html.type,
          code.style.type,
          code.script.type,
        ];
    
        var pathes = [];
    
        types.forEach(function(type) {
          var path = runstant.constant.LANG_SCRIPT_MAP[type];
          if (path) {
            pathes.push(path);
          }
        });
    
        return pathes;
      })();
    
      runstant.util.loadScripts(pathes, function() {
        self.onsave();
        self.update();
      });
    };
    
    this.onmessage = function(e) {
      var res = JSON.parse(e.data);
      if (res.action === 'type') {
        this.type = res.data;
      }
      else if (res.action === 'set') {
        var json = JSON.parse(res.data);
        runstant.project.set(json);
        self.tags.editor.refresh();
        self.onsave();
        riot.update();
      }
      else {
        this.actionConsole(res);
      }
    };
    
    this.actionConsole = function(data) {
      var method = data.method;
      var args = data.arguments;
      var csl = self.tags.util.tags['panel-console'];
    
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
    
      csl.focus();
    };
  
});

riot.tag('btn-fullscreen', '<a href="#" onclick="{expand}" if="{!isFullScreen}"><i class="mdi-navigation-fullscreen"></i></a><a href="#" onclick="{exit}" if="{isFullScreen}"><i class="mdi-navigation-fullscreen-exit"></i></a>', 'btn-fullscreen { display: block; position: absolute; bottom: 16px; right: 10px; line-height: 14px; cursor: pointer; font-size: 2rem; z-index: 32; }', function(opts) {
    this.isFullScreen = false;
    
    this.on('mount', function() {
      if (runstant.project.data.setting.fullscreen === opts.query) {
        document.body.classList.add('no-transition');
        this.expand();
        setTimeout(function() {
          document.body.classList.remove('no-transition');
        }, 128);
      }
    });
    
    this.expand = function() {
      var target = document.querySelector(opts.query);
      var panels = document.querySelectorAll('.panel');
    
      Array.prototype.forEach.call(panels, function(panel) {
        if (panel === target) return ;
        panel.classList.add('nofullscreen');
      });
    
      $(opts.query).addClass('fullscreen');
      this.isFullScreen = true;

      runstant.project.data.setting.fullscreen = opts.query;
      runstant.project.save();

      setTimeout(function() {
        var tabs = $('editor ul.tabs');
        tabs.tabs('select_tab', tabs.find(".active").attr('href').substr(1));
        var tabs = $('util ul.tabs');
        tabs.tabs('select_tab', tabs.find(".active").attr('href').substr(1));
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

      runstant.project.data.setting.fullscreen = false;
      runstant.project.save();

      setTimeout(function() {
        var tabs = $('editor ul.tabs');
        tabs.tabs('select_tab', tabs.find(".active").attr('href').substr(1));
        var tabs = $('util ul.tabs');
        tabs.tabs('select_tab', tabs.find(".active").attr('href').substr(1));
      }, 500);
    };
  
});

riot.tag('editor', '<div class="inner z-depth-4"> <div class="header"> <ul class="tabs"> <li id="tab-html" class="tab col s3"><a data-type="html" href="#editor-html"><span class="type">html</span><span class="lang">{runstant.project.data.code.html.type}</span></a></li> <li id="tab-style" class="tab col s3"><a data-type="style" href="#editor-style"><span class="type">style</span><span class="lang">{runstant.project.data.code.style.type}</span></a></li> <li id="tab-script" class="tab col s3"><a data-type="script" href="#editor-script"><span class="type">script</span><span class="lang">{runstant.project.data.code.script.type}</span></a></li> </ul> </div> <div class="content"> <div id="editor-html" class="editor-unit">html</div> <div id="editor-style" class="editor-unit">style</div> <div id="editor-script" class="editor-unit">script</div> </div> <btn-fullscreen query="editor"></btn-fullscreen> </div>', 'editor .header { margin-bottom: 1px; height: 32px; } editor .content { position: relative; width: 100%; height: calc(100% - 36px); top: 3px; } #editor, #editor-html, #editor-style, #editor-script { width: 100%; height: 100%; position: absolute; } editor .tabs { background-color: hsl(0, 0%, 27%); height: 36px; } editor .tabs .tab { height: 36px; line-height: 36px; } editor .tabs .indicator { /* background: hsl(60, 100%, 60%); */ } @media only screen and (min-width: 601px) { editor .tabs li.tab .lang { font-size: x-small; } editor .tabs li.tab .lang:before { content: \'(\'; } editor .tabs li.tab .lang:after { content: \')\'; } } @media only screen and (max-width: 600px) { editor .tabs li.tab span.type { display: none; } }', function(opts) {
    var self = this;
    
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.editors = {};
    
    this.on('mount', function() {
      $('editor ul.tabs').tabs();
    
      this.initEditor('html');
      this.initEditor('style');
      this.initEditor('script');
    
      this.refresh();
      this.setup();
    
      this.changeCurrentTab(runstant.project.data.setting.current);
    
      this.updateMode();
    });
    
    this.changeCurrentTab = function(type) {

      $('editor ul.tabs').tabs('select_tab', 'editor-' + type);
      this.editors[type].focus();
    };
    
    
    this.initEditor = function(type) {
      var editor = this.editors[type] = new runstant.Editor('editor-' + type);
    
      editor.onsave = function() {
        opts.onsave && opts.onsave();
      };

      editor.setFontSize(14);
      editor.setTheme('ace/theme/monokai');
    
      ['html', 'style', 'script'].forEach(function(type, i) {
        var index = (i+1);
        var key = 'Alt-' + index;
    
        editor.addCommand({
          name: type,
          bindKey: { mac: key, win: key, },
          exec: function() { self.changeCurrentTab(type); }
        });
      });
    
    };
    
    this.refresh = function() {
      ['html', 'style', 'script'].forEach(function(type) {
        var editor = this.editors[type];
        var code = runstant.project.data.code[type];
        editor.setValue(code.value);
        editor.editor.moveCursorTo(0, 0);
      }, this);
    };
    
    
    this.saveCode = function() {
      var project = runstant.project;

      for (var key in this.editors) {
        var editor = this.editors[key];
        var code = project.data.code[key];
        var v = editor.getValue();
        code.value = v;
      }

      var current = $('ul.tabs').find("a.active").data('type');
      project.data.setting.current = current;
    };
    
    this.setup = function() {
      var user = runstant.user;
      for (var key in this.editors) {
        var editor = this.editors[key];
        editor.setFontSize(user.data.fontSize);
        editor.setTabSize(user.data.tabSize);
        editor.setTheme(user.data.theme);
      }
    };
    
    this.updateMode = function() {
      this.editors.$forIn(function(type, editor) {
        var mode = runstant.project.data.code[type].type;
        editor.setMode(mode);
      });
    };
  
});

riot.tag('footer', '<div class="row"> <div class="col s6"> <input type="text" value="{runstant.project.data.setting.title}" onblur="{onblurtitle}"> </div> <div class="col s6"> <ul> <li><a href="http://twitter.com/phi_jp" target="_blank"><i class="small material-icons">account_box</i></a></li> <li><a href="http://github.com/phi-jp" target="_blank"><i class="small material-icons">build</i></a></li> <li><a id="footer-download" href="" onclick="{download}"><i class="small material-icons">get_app</i></a></li> <li><a href="/user" target="_blank"><i class="small material-icons">settings_applications</i></a> </li> </ul> </div> </div>', 'footer { position: fixed; height: 30px; width: 100%; background-color: hsl(200, 18%, 26%)!important; bottom: 0; color: white } footer .row { } footer input { width: auto !important; height: 1.8rem !important; } footer ul { margin: 3px; text-align: right; } footer ul li { display: inline-block; margin-right: 10px; } footer ul li a { color: white; } footer ul li a i { position: relative; top: 3px; font-size: 15px !important; }', function(opts) {
    this.onblurtitle = function(e) {
      var title = e.target.value;
      runstant.project.data.setting.title = title;
      runstant.project.save();
      riot.update();
    };
    this.download = function(e) {
      var title = '{title}.json'
        .replace('{title}', runstant.project.data.setting.title)
        .replace(/\s/g, '_')
        ;
      var json = JSON.stringify(runstant.project.data, null, '  ');
      var blob = new Blob([json]);
      var url = window.URL.createObjectURL(blob);
    
      var elm = document.getElementById('footer-download');
    
      elm.download = title;
      elm.href = url;
      
      return true;
    };
  
});

riot.tag('header', '<nav class="blue-grey darken-3"> <div class="nav-wrapper"><a href="/about" class="brand-logo"><img src="/images/runstant.png"><span>Run</span><span class="lighter">stant </span></a> <ul class="right hide-on-small-and-down"> <li data-tooltip="play" class="tooltipped"><a id="btn-play" href="" onclick="{opts.onplay}"><i class="material-icons">play_arrow</i></a></li> <li data-tooltip="fork" class="tooltipped"><a id="btn-play" href="" onclick="{fork}"><i class="material-icons">call_split</i></a></li> <li data-tooltip="share" class="tooltipped"><a id="btn-share" href="#" onclick="runstant.shareModal.open(); return false;"><i class="material-icons">share</i></a></li> <li data-tooltip="setting" class="tooltipped"><a id="btn-setting" href="#" onclick="runstant.detailModal.open(); return false;"><i class="material-icons">settings</i></a></li> </ul> <ul id="nav-mobile" class="side-nav"> <li><a href="" onclick="{opts.onplay}"><i class="left material-icons">play_arrow</i>Play</a></li> <li><a href="" onclick="{fork}"><i class="left material-icons">call_split</i>Fork</a></li> <li><a href="" onclick="runstant.shareModal.open(); return false;"><i class="left material-icons">share</i>Share</a></li> <li><a href="" onclick="runstant.detailModal.open(); return false;"><i class="left material-icons">settings</i>Settings</a></li> </ul> <a data-activates="nav-mobile" class="button-collapse"><i class="mdi-navigation-menu"></i></a> </div> </nav>', 'header, [riot-tag="header"]{ display: block } header nav, [riot-tag="header"] nav{ padding: 0px 20px; } header .brand-logo, [riot-tag="header"] .brand-logo{ position: relative; white-space: nowrap; } header .brand-logo img, [riot-tag="header"] .brand-logo img{ height: 40px; transform: translate(0px, 5px); } header .brand-logo .lighter, [riot-tag="header"] .brand-logo .lighter{ font-weight: 200; } header .side-nav i.left, [riot-tag="header"] .side-nav i.left{ line-height: 64px; }', function(opts) {
    var self = this;
    
    this.on('mount', function() {
      $(".button-collapse").sideNav();
    });
    
    this.fork = function() {
      window.open(location.href);
    };
  
});

riot.tag('preview', '<div class="inner z-depth-2"> <div onclick="runstant.detailModal.open();" class="header white"><span class="title">{runstant.project.data.setting.title}</span></div> <div class="content"> <div id="preview"></div> </div> <btn-fullscreen query="preview"></btn-fullscreen> </div>', 'preview { } preview .inner { background: white; } preview .header { background-color: rgb(250, 250, 250) !important; padding: 3px 10px; height: 36px; line-height: 36px; /* border-bottom: 1px solid #aaa; */ } preview .header .title { font-size: 1.2rem; color: hsl(358, 79%, 68%); } preview .content { position: relative; width: 100%; height: calc(100% - 36px); } #preview { width: 100%; height: 100%; overflow: scroll; -webkit-overflow-scrolling: touch; } #preview iframe { display: block; width: 100%; height: 100%; border: none; }', function(opts) {
    var self = this;
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.on('mount', function() {
      var preview = jframe("#preview");
      this.preview = preview;
    });
    
    this.refresh = function() {
      var v = runstant.project.toCode(true);
      this.preview.load(v);
    };
    
    this.post = function(v) {
      var frame = self.preview.domElement.querySelector('iframe');
      var win = frame.contentWindow;
    
      win.postMessage(v, '*');
    };
  
});

riot.tag('util', '<div class="inner z-depth-2"> <div class="header"> <ul class="tabs"> <li class="tab col s3"><a href="#project"><span class="type">project</span></a></li> <li class="tab col s3"><a href="#console"><span class="type">console</span></a></li> <li class="tab col s3"><a href="#panel-cdn"><span class="type">cdn</span></a></li> </ul> </div> <div class="content"> <panel-project id="project"></panel-project> <panel-console id="console" onpost="{opts.onpost}"></panel-console> <panel-cdn id="panel-cdn"></panel-cdn> </div> <btn-fullscreen query="util"></btn-fullscreen> </div>', 'util { } util .header { } util .inner { background: white; } util .tabs { background-color: rgb(250, 250, 250); /* background-color: hsl(0, 0%, 27%); */ height: 36px; } util .tabs .tab { height: 36px; line-height: 36px; } util .content { position: relative; width: 100%; height: calc(100% - 36px); } /* util .header { padding: 3px 10px; height: 36px; line-height: 36px; } util .header .title { font-size: 1.2rem; } */ util .content { background-color: hsl(0, 0%, 96%); overflow-x: auto; }', function(opts) {
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

<!-- プロジェクトの詳細-->
riot.tag('modal-detail', '<div class="modal-content"> <h4>Project Setting</h4> <form name="_form" onsubmit="return false;" class="row"> <div class="col s6"> <div class="row"> <div class="col s12 input-field"> <input name="_title" value="hoge" type="text"> <label>Project Title</label> </div> <div class="col s12 input-field"> <textarea name="_description" class="materialize-textarea"></textarea> <label>Description</label> </div> </div> </div> <div class="col s6"> <div class="row"> <div class="col s12"> <label>Language</label> </div> <div each="{languages}" class="col s4"> <label>{name}</label> <select name="_{name}" class="browser-default"> <option each="{list}" value="{name}">{name}</option> </select> </div> </div> </div> </form> </div>', 'modal-detail { max-height: 85% !important; }', 'id="modal-detail" class="modal bottom-sheet"', function(opts) {
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
      var setting = runstant.project.data.setting;
      var code = runstant.project.data.code;
      elements._title.value = setting.title;
      elements._description.value = setting.description;
      elements._html.value = code.html.type;
      elements._style.value = code.style.type;
      elements._script.value = code.script.type;
    
      elements._description.focus();
      elements._title.focus();
      elements._title.select();
    };
    
    this.save = function() {
      var elements = this._form.elements;
      var setting = runstant.project.data.setting;
      var code = runstant.project.data.code;
    
      setting.title = elements._title.value;
      setting.description = elements._description.value;
      code.html.type = elements._html.value;
      code.style.type = elements._style.value;
      code.script.type = elements._script.value;
    };
  
});

<!-- シェアモーダル-->
riot.tag('modal-share', '<div class="modal-content"> <h4>Share</h4> <div class="row"> <div class="col s12"> <div class="row"> <div class="input-field col s12"> <input name="_shorturl" value="getting..." type="text" onclick="this.select()"> <label>Short URL</label> </div> <div class="input-field col s12"> <input name="_embedcode" value="getting..." type="text" onclick="this.select()"> <label>Embed Code</label> </div> </div> <div class="row"> <h5>Social</h5> <div class="input-field col s12"> <button data-name="twitter" onclick="{share}" class="waves-effect waves-light btn blue lighten-2">Twitter</button> <button data-name="facebook" onclick="{share}" class="waves-effect waves-light btn blue darken-1"> Facebook</button> <button data-name="google" onclick="{share}" class="waves-effect waves-light btn red darken-1"> Google+</button> <button data-name="pocket" onclick="{share}" class="waves-effect waves-light btn pink lighten-1"> Pocket</button> <button data-name="hatebu" onclick="{share}" class="waves-effect waves-light btn blue darken-2"> Hatebu</button> </div> </div> <div class="row"> <h5>Other</h5> <div class="input-field col s12"><a onclick="{fullscreen}" class="waves-effect waves-light btn green lighten-1">Fullscreen</a> <a id="btn-download" onclick="{download}" class="waves-effect waves-light btn amber darken-1">Download</a> <a id="btn-download-zip" onclick="{downloadZip}" class="waves-effect waves-light btn red lighten-1">Download Zip</a> <a id="btn-download-runstant" onclick="{downloadRunstant}" class="waves-effect waves-light btn red lighten-2">Download Runstant</a></div> </div> </div> </div> </div>', 'modal-share { max-height: 85% !important; }', 'id="modal-share" class="modal bottom-sheet"', function(opts) {
    var self = this;
    this.init = function() {
      runstant.util.shorten(location.href, function(url) {
        var embed = runstant.constant.EMBED_CODE.replace('{url}', url);
    
        self.shortURL = url;
        self._shorturl.value = url;
        self._embedcode.value = embed;
        self.update();
    
        self._shorturl.focus();
        self._shorturl.select();
      });
    };
    
    this.share = function(e) {
      var name = e.target.dataset.name;
    
      this[name]({
        text: runstant.project.data.setting.title,
        url: this.shortURL,
      });
    };
    
    this.twitter = function(param) {
      var url = "https://twitter.com/intent/tweet?text={text}&hashtags=runstant&via={via}&url={url}";
      url = url.replace("{text}", encodeURIComponent(param.text));
      url = url.replace("{via}", "runstant");
      url = url.replace("{url}", encodeURIComponent(param.url));
      window.open(url, 'share', 'width=640, height=480');
    };
    
    this.facebook = function(param) {
      var url = "https://www.facebook.com/sharer/sharer.php?u={url}";
      url = url.replace("{url}", encodeURIComponent(param.url));
      window.open(url, 'share', 'width=640, height=480');
    };
    
    this.google = function(param) {
      var url = "https://plus.google.com/share?url={url}";
      url = url.replace("{url}", encodeURIComponent(param.url));
      window.open(url, 'share', 'width=640, height=480');
    };
    
    this.pocket = function(param) {
      var url = "https://getpocket.com/edit?url={url}";
      url = url.replace("{url}", encodeURIComponent(param.url));
      window.open(url, 'share', 'width=640, height=480');
    };
    
    this.hatebu = function(param) {
      var url = "http://b.hatena.ne.jp/entry/{url}";
      url = url.replace("{url}", encodeURIComponent(param.url));
      window.open(url, 'share');
    };
    
    this.fullscreen =  function(param) {
      var html = runstant.project.toCode(false);
      window.open("data:text/html;charset=utf8;base64," + window.btoa(unescape(encodeURIComponent(html))));
    };
    
    this.download = function() {
      var title = '{title}.html'
          .replace('{title}', runstant.project.data.setting.title)
          .replace(/\s/g, '_')
          ;
        var html = runstant.project.toCode(false);
      var blob = new Blob([html]);
      var url = window.URL.createObjectURL(blob);
    
      $('#btn-download')[0].download = title;
      $('#btn-download')[0].href = url;
      
      return true;
    };
    
    this.downloadZip = function() {
      var title = '{title}.zip'
          .replace('{title}', runstant.project.data.setting.title)
          .replace(/\s/g, '_')
          ;
      var blob = runstant.project.toBlob(false);
      var url = window.URL.createObjectURL(blob);
    
      $('#btn-download-zip')[0].download = title;
      $('#btn-download-zip')[0].href = url;
      
      return true;
    };
    
    this.downloadRunstant = function() {
      var title = '{title}.json'
        .replace('{title}', runstant.project.data.setting.title)
        .replace(/\s/g, '_')
        ;
      var json = JSON.stringify(runstant.project.data, null, '  ');
      var blob = new Blob([json]);
      var url = window.URL.createObjectURL(blob);
    
      $('#btn-download-runstant')[0].download = title;
      $('#btn-download-runstant')[0].href = url;
      
      return true;
    };
  
});

<!-- ユーザーモーダル-->
riot.tag('modal-user', '<div class="modal-content"> <h4>User Setting</h4> <form name="_userForm" onsubmit="return false" class="row"> <div class="col s6"> <div class="row"> <div class="col s12 input-field"> <input name="_username" type="text" value="{runstant.user.data.username}"> <label>User Name</label> </div> <div class="col s12"> <label>Theme</label> <select name="_theme" value="{runstant.user.data.theme}" class="browser-default"> <option each="{runstant.Editor.themes}" value="{theme}">{caption}</option> </select> </div> </div> </div> <div class="col s6"> <div class="row"> <div class="col s12"> <label>Tab Size ({_tabSize.value})</label> <p class="range-field"> <input name="_tabSize" type="range" value="{runstant.user.data.tabSize}" min="0" max="16" oninput="{update}"> </p> </div> <div class="col s12"> <label>Font Size ({_fontSize.value})</label> <p class="range-field"> <input name="_fontSize" type="range" value="{runstant.user.data.fontSize}" min="1" max="64" oninput="{update}"> </p> </div> </div> </div> </form> </div>', 'id="modal-user" class="modal bottom-sheet"', function(opts) {
    this.init = function() {
      this.update();
    };
    
    this.save = function() {
      var elements = this._userForm.elements;
      var user = runstant.user;
    
      user.data.username = elements._username.value;
      user.data.tabSize = elements._tabSize.value;
      user.data.fontSize = elements._fontSize.value;
      user.data.theme = elements._theme.value;
    
      user.save();
    };
  
});

riot.tag('panel-cdn', '<div class="row"> <div class="col s12"> <input type="text" name="_search" onblur="{search}" value="" placeHolder="search"> </div> <div class="col s12"> <ul> <li each="{results}" class="row result"> <div class="col s3"><a href="https://cdnjs.com/libraries/{name}" target="_blank">{name}: </a></div> <div class="col s9"><span>{description}</span> </div> </li> </ul> </div> </div>', 'panel-cdn .result { padding-bottom: 10px; border-bottom: 1px solid #ccc; }', function(opts) {
    var api = 'http://api.cdnjs.com/libraries?search={0}&fields=version,description';
    
    this.results = [];
    
    this.search = function() {
      var q = this._search.value;
    
      $.ajax(api.format(q))
        .done(function(res) {
          this.results = res.results;
          this.update();
        }.bind(this))
        ;
    };
  
});

riot.tag('panel-console', '<div class="content-console"><span each="{messages}" onclick="confirm(&quot;{value}&quot;)" class="{type}">{value}</span><span id="console-input" type="text" contenteditable="true" onkeypress="{keypress}" class="input"></span></div>', 'panel-console .content-console { position: relative; width: 100%; height: 100%; margin: 0px; padding: 5px 20px; font-family: Consolas, Monaco, \'ＭＳ ゴシック\'; overflow-x: auto; } panel-console .content-console span { border-bottom: 1px solid #ddd; display: block; line-height: 1em; margin-top: 2px; padding-bottom: 2px; color: #0055ff; font-size: 13px; white-space: pre; word-wrap: break-word; } panel-console .content-console span.input { outline: 0; color: #222; border-bottom: 0px; } panel-console .content-console span.input:before { position: absolute; left: 7px; font-weight: bold; content: \'> \'; color: #47b4eb; } panel-console .content-console span.output { outline: 0; } panel-console .content-console span.output:before { position: absolute; left: 7px; font-weight: bold; content: \'< \'; color: #47b4eb; } panel-console .content-console span.error { color: red; }', function(opts) {
    var self = this;
    
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
    };
    
    this.focus = function() {

      $('util ul.tabs').tabs('select_tab', 'console');
    };
  
});

riot.tag('panel-project', '<div class="preview"></div>', 'panel-project { } panel-project .preview { width: 100%; height: 100%; overflow: scroll; -webkit-overflow-scrolling: touch; } panel-project .preview iframe { width: 100%; height: 100%; border: none; }', function(opts) {
    var self = this;
    
    this.on('mount', function() {
      this.refresh();
    
      this.on('update', function() {
        this.refresh();
      });
    });
    
    this.refresh = function() {
      if (!self.jframe) {
        self.jframe = jframe('panel-project .preview');
      }
      var v = runstant.project.toProject();
      self.jframe.load(v);
    };
  
});