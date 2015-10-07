
riot.tag('app', '<div class="container"> <div class="row"> <div class="col s12"> <h2>{user.data.username}</h2> </div> </div> <div class="row"> <div class="col s12"> <ul class="tabs"> <li class="tab col s3"><a href="#_user" class="active">user</a></li> <li class="tab col s3"><a href="#_projects">projects</a></li> </ul> </div> </div> <div id="_user"> <form onsubmit="{save}" class="row"> <div class="col s4"> <div class="row"> <div class="col s12 input-field"> <input name="_name" type="text" value="{user.data.username}"> <label>User name</label> </div> <div class="col s12"> <label>Theme</label> <select name="_theme" value="{user.data.theme}" onchange="{refreshEditor}" class="browser-default"> <option each="{runstant.Editor.themes}" value="{theme}">{caption}</option> </select> </div> <div class="col s12"> <label>Tab Size ({_tabSize.value})</label> <p class="range-field"> <input name="_tabSize" type="range" value="{user.data.tabSize}" min="0" max="16" oninput="{refreshEditor}"> </p> </div> <div class="col s12"> <label>Font Size ({_fontSize.value})</label> <p class="range-field"> <input name="_fontSize" type="range" value="{user.data.fontSize}" min="1" max="64" oninput="{refreshEditor}"> </p> </div> </div> </div> <div class="col s8"> <div class="row"> <div class="col s12"> <div id="editor" width="300px" height="300px"></div> </div> </div> </div> <div class="col s12"> <button type="submit" class="btn">save</button> </div> </form> </div> <div id="_projects"> <ul class="collection with-header"> <li class="collection-header"> <h4>Projects</h4> </li> <li each="{projects}" class="collection-item"><a href="/?title={data.setting.title}" target="_blank">{data.setting.title}</a><a href="http://goo.gl/{id}" target="_blank" class="secondary-content"><i class="material-icons">send</i></a> <time>{created}</time> <div>{data.setting.description}</div> </li> </ul> </div> </div>', '#editor { width: 100%; height: 480px; box-shadow: 0px 0px 4px 0px #aaa; }', function(opts) {
    var self = this;
    var demoText = "\/*\n * \n *\/\nwindow.onload = function() {\n  console.log('Hello, world!');\n}";
    
    this.user = new runstant.User();
    this.projects = this.user.getStorage('logs').projects;
    
    this.on('mount', function() {
      this.editor = ace.edit('editor');
      this.editor.$blockScrolling = Infinity;
    
      this.editor.setValue(demoText);
      this.editor.getSession().setMode("ace/mode/javascript");
      this.refreshEditor();
    
      this.update();
    });
    
    this.refreshEditor = function() {
      var theme = this._theme.value;
      var tabSize = +this._tabSize.value;
      var fontSize = +this._fontSize.value;
      this.editor.setTheme(theme);
      this.editor.getSession().setTabSize(tabSize);
      this.editor.setFontSize(fontSize);
    };
    
    this.save = function() {
      self.user.data.username = this._name.value;
      self.user.data.theme = this._theme.value;
      self.user.data.tabSize = +this._tabSize.value;
      self.user.data.fontSize = +this._fontSize.value;
    
      self.user.save();
    
      Materialize.toast('save', 1000, "rounded");
    };
    
  
});