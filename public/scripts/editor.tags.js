
riot.tag('app', '<header></header> <editor></editor> <preview></preview> <footer></footer>', '.preview { background: #ccf; position: fixed; left: 0px; height: 100%; } .editor { background: #fcc; position: fixed; right: 0px; height: 100%; height : -webkit-calc(100% - 64px) ; height : calc(100% - 64px) ; }', function(opts) {
    this.on('mount', function() {
    });
  
});

riot.tag('editor', '<div class="inner z-depth-4"> <div class="header"> <ul class="tabs"> <li id="tab-html" class="tab col s3"><a data-type="html" href="#editor-html"><span class="type">html</span><span class="lang">(html)</span></a></li> <li id="tab-style" class="tab col s3"><a data-type="style" href="#editor-style"><span class="type">style</span><span class="lang">(css)</span></a></li> <li id="tab-script" class="tab col s3"><a data-type="script" href="#editor-script"><span class="type">script</span><span class="lang">(javascript)</span></a></li> </ul> </div> <div class="content"> <div id="editor"></div> </div> </div>', 'editor { right: 3px; width: 60%; height: 100%; height : -webkit-calc(100% - 64px) ; height : calc(100% - 64px) ; position: absolute; padding: 10px; } .inner { border: 1px solid #ccc; width: 100%; height: 100%; } .header { margin-bottom: 1px; } .content { width: 100%; height: calc(100% - 48px); } #editor { width: 100%; height: 100%; }', function(opts) {
    this.on('mount', function() {
      var editor = ace.edit("editor");
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/javascript");
    });
  
});

riot.tag('footer', '<h2> </h2>', function(opts) {

});

riot.tag('header', '<nav class="blue-grey darken-3"> <div class="nav-wrapper"><a href="#home" class="brand-logo"><img src="/images/runstant.png"><span>Run</span><span class="lighter">stant</span></a> <ul class="right hide-on-small-and-down"> <li data-tooltip="play" class="tooltipped"><a id="btn-play" href="#"><i class="mdi-av-play-arrow"></i></a></li> <li data-tooltip="share" class="tooltipped"><a id="btn-share" href="#"><i class="mdi-social-share"></i></a></li> <li data-tooltip="setting" class="tooltipped"><a id="btn-setting" href="#"><i class="mdi-action-settings"></i></a></li> </ul> <ul id="nav-mobile" style="left: -250px;" class="side-nav"> <li><a href="#">Share</a></li> </ul> <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="mdi-navigation-menu"></i></a> </div> </nav> <style scoped="scoped"> :scope { display: block } nav { padding: 0px 20px; } .brand-logo { position: relative; white-space: nowrap; } .brand-logo img { height: 40px; transform: translate(0px, 5px); } .brand-logo .lighter { font-weight: 200; } </style>', function(opts) {var self = this;
});

riot.tag('preview', '<div class="inner z-depth-4"></div>', 'preview { left: 3px; width: 40%; height: 100%; height : -webkit-calc(100% - 64px) ; height : calc(100% - 64px) ; position: absolute; padding: 10px; }', function(opts) {

});