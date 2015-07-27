
riot.tag('app', '<header></header> <div class="main"> <editor width="60%" height="100%" float="right" onsave="{onsave}" class="panel"></editor> <preview width="40%" height="60%" float="left" class="panel"></preview> <console width="40%" height="40%" float="left" class="panel"></console> </div> <footer></footer>', 'body { background: hsl(0, 0%, 95%); } .main { position: absolute; width: 100%; height: calc(100% - 64px - 30px - 4px); overflow: hidden; } .panel { display: block; padding: 5px 5px; float: right; transition: 500ms; } .panel.fullscreen { width: 100% !important; height: 100% !important; } .panel.nofullscreen { width: 0% !important; height: 0% !important; opacity: 0.0; margin: 0px; padding: 0px; } .inner { /* border: 1px solid #ccc; */ position: relative; width: 100%; height: 100%; }', function(opts) {
    var self = this;
    this.on('mount', function() {
    });
    
    this.onsave = function() {
      self.tags.preview.refresh();
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

riot.tag('console', '<div class="inner z-depth-2"> <div class="header cyan lighten-5 grey-text text-darken-2"><span class="title">console</span></div> <btn-fullscreen query="console"></btn-fullscreen> </div>', 'console { } console .inner { background: white; } console .header { padding: 3px 10px; height: 36px; line-height: 36px; } console .header .title { font-size: 1.2rem; }', function(opts) {
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
  
});

riot.tag('editor', '<div class="inner z-depth-4"> <div class="header"> <ul class="tabs"> <li id="tab-html" class="tab col s3"><a data-type="html" href="#editor-html"><span class="type">html</span><span class="lang">{this.data.code.html.type}</span></a></li> <li id="tab-style" class="tab col s3"><a data-type="style" href="#editor-style"><span class="type">style</span><span class="lang">{this.data.code.style.type}</span></a></li> <li id="tab-script" class="tab col s3"><a data-type="script" href="#editor-script"><span class="type">script</span><span class="lang">{this.data.code.script.type}</span></a></li> </ul> </div> <div class="content"> <div id="editor-html" class="editor-unit">html</div> <div id="editor-style" class="editor-unit">style</div> <div id="editor-script" class="editor-unit">script</div> </div> <btn-fullscreen query="editor"></btn-fullscreen> </div>', 'editor .header { margin-bottom: 1px; height: 32px; } .content { width: 100%; height: calc(100% - 36px); } #editor, #editor-html, #editor-style, #editor-script { width: 100%; height: 100%; } editor .tabs { background-color: hsl(0, 0%, 27%); height: 36px; } editor .tabs .tab { height: 36px; line-height: 36px; } editor .tabs .indicator { background: hsl(60, 100%, 60%); } @media only screen and (min-width: 601px) { editor .tabs li.tab .lang { font-size: x-small; } editor .tabs li.tab .lang:before { content: \'(\'; } editor .tabs li.tab .lang:after { content: \')\'; } } @media only screen and (max-width: 600px) { editor .tabs li.tab span.type { display: none; } }', function(opts) {
    var self = this;
    this.data = runstant.data;
    
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.on('mount', function() {
      $('editor ul.tabs').tabs();
    
      toEdit('html');
      toEdit('style');
      toEdit('script');
    });
    
    var toEdit = function(type) {
      var editor = ace.edit('editor-' + type);
      editor.setTheme("ace/theme/monokai");

    
      editor.$blockScrolling = Infinity;
      editor.getSession().setTabSize(2);
    
      var code = self.data.code[type];
    
      setMode(editor, code.type);

      editor.setValue(code.value);
    
      editor.commands.addCommand({
        name: "save",
        bindKey: { mac: "Command-S", win: "Ctrl-S", },
        exec: function() {
          var v = editor.getValue();
          code.value = v;
          opts.onsave && opts.onsave();
        }
      });
    };
    
    var setMode = function(editor, type) {
      var map = {
        "ecmascript6": "javascript",
        "sass": "scss",
      };
      if (map[type]) type = map[type];
    
      editor.getSession().setMode("ace/mode/" + type);
    };
  
});

riot.tag('footer', '', 'footer { position: fixed; height: 30px; width: 100%; background-color: hsl(200, 18%, 26%)!important; bottom: 0; text-align: right; }', function(opts) {

});

riot.tag('header', '<nav class="blue-grey darken-3"> <div class="nav-wrapper"><a href="#home" class="brand-logo"><img src="/images/runstant.png"><span>Run</span><span class="lighter">stant</span></a> <ul class="right hide-on-small-and-down"> <li data-tooltip="play" class="tooltipped"><a id="btn-play" href="#"><i class="mdi-av-play-arrow"></i></a></li> <li data-tooltip="share" class="tooltipped"><a id="btn-share" href="#"><i class="mdi-social-share"></i></a></li> <li data-tooltip="setting" class="tooltipped"><a id="btn-setting" href="#"><i class="mdi-action-settings"></i></a></li> </ul> <ul id="nav-mobile" style="left: -250px;" class="side-nav"> <li><a href="#">Share</a></li> </ul> <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="mdi-navigation-menu"></i></a> </div> </nav> <style scoped="scoped"> :scope { display: block } nav { padding: 0px 20px; } .brand-logo { position: relative; white-space: nowrap; } .brand-logo img { height: 40px; transform: translate(0px, 5px); } .brand-logo .lighter { font-weight: 200; } </style>', function(opts) {var self = this;
});

riot.tag('preview', '<div class="inner z-depth-2"> <div class="header cyan lighten-5 grey-text text-darken-2"><span class="title">preview</span></div> <div class="content"> <div id="preview"></div> </div> <btn-fullscreen query="preview"></btn-fullscreen> </div>', 'preview { } preview .inner { background: white; } preview .header { padding: 3px 10px; height: 36px; line-height: 36px; } preview .header .title { font-size: 1.2rem; } #preview { width: 100%; height: 100%; } #preview iframe { width: 100%; height: 100%; border: none; }', function(opts) {
    this.root.style.width = opts.width;
    this.root.style.height = opts.height;
    this.root.style.float = opts.float;
    
    this.on('mount', function() {
      var preview = jframe("#preview");
      this.preview = preview;
    
      this.refresh();
    });
    
    this.refresh = function() {
      var v = runstant.data.code['html'].value;
      this.preview.load(v);
    };
  
});