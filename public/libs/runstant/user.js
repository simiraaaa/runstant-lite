
;(function (exports) {
  var LOCAL_STORAGE_KEY = 'runstant-user-setting-beta';

  var User = function() {
    this.load();
  };

  User.prototype = {
    init: function() {
      this.load();
    },

    load: function() {
      this.data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!this.data) {
        this.data = {
          username: 'runstant',
          keyBinding: 'ace',
          theme: 'ace/theme/monokai',
          tabSize: 2,
          fontSize: 13,

          projects: [],
        };
        this.save();
      }
      else {
        var zipedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        var strData = runstant.util.unzip(zipedData);
        this.data = JSON.parse(strData);
      }

      return this;
    },

    addProject: function(id, data) {
      if (!this.data.projects) this.data.projects = [];

      var project = this.data.projects.find(function(p) {
        return p.title === data.setting.title;
      });

      if (project) {
        project.id = id;
        project.title = data.setting.title;
        project.description = data.setting.description;
      }
      else {
        project = {
          id: id,
          title: data.setting.title,
          description: data.setting.description,
        };
        this.data.projects.push(project);
      }

      return this;
    },

    save: function() {
      var strData = JSON.stringify(this.data);
      var zipedData = runstant.util.zip(strData);
      localStorage.setItem(LOCAL_STORAGE_KEY, zipedData);

      return this;
    },
  };

  exports.runstant.User = User;
})(typeof exports === 'undefined' ? this : exports);
