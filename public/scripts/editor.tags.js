
riot.tag('app', '<header></header> <div class="row"> <div class="col s4 preview"> <div>aaa</div> </div> <div class="col s8 editor"> <div class="inner"> <div id="editor"></div> </div> </div> </div> <footer></footer>', '.preview { background: #ccf; position: fixed; left: 0px; height: 100%; } .editor { background: #fcc; position: fixed; right: 0px; height: 100%; height : -webkit-calc(100% - 64px) ; height : calc(100% - 64px) ; } .inner { padding: 5px; width: 100%; height: 100%; } #editor { width: 100%; height: 100%; }', function(opts) {
    this.on('mount', function() {
      var editor = ace.edit("editor");
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/javascript");
    });
  
});

riot.tag('footer', '<h2>footer2</h2>', function(opts) {

});

riot.tag('header', '<nav class="blue-grey darken-3"> <div class="nav-wrapper"><a href="#home" class="brand-logo"><img src="/images/runstant.png"><span>Run</span><span class="lighter">stant</span></a> <ul class="right hide-on-small-and-down"> <li data-tooltip="play" class="tooltipped"><a id="btn-play" href="#"><i class="mdi-av-play-arrow"></i></a></li> <li data-tooltip="share" class="tooltipped"><a id="btn-share" href="#"><i class="mdi-social-share"></i></a></li> <li data-tooltip="setting" class="tooltipped"><a id="btn-setting" href="#"><i class="mdi-action-settings"></i></a></li> </ul> <ul id="nav-mobile" style="left: -250px;" class="side-nav"> <li><a href="#">Share</a></li> </ul> <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="mdi-navigation-menu"></i></a> </div> </nav> <style scoped="scoped"> :scope { display: block } nav { padding: 0px 20px; } .brand-logo { position: relative; white-space: nowrap; } .brand-logo img { height: 40px; transform: translate(0px, 5px); } .brand-logo .lighter { font-weight: 200; } </style>', function(opts) {var self = this;
});