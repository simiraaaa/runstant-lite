
;(function (exports) {
  var LOCAL_STORAGE_KEYS = {
    user: 'runstant-lite-user-setting',
    logs: 'runstant-lite-logs',
  };

  var User = function() {
    this.load();
  };

  User.prototype = {
    init: function() {
      this.load();
    },

    load: function() {
      this.data = this.getStorage('user');
      if (!this.data) {
        this.data = {
          username: 'runstant',
          keyBinding: 'ace',
          theme: 'ace/theme/monokai',
          tabSize: 2,
          fontSize: 13,
        };
        this.save();
      }

      return this;
    },

    logProject: function(data) {
      var logs = this.getStorage('logs');
      if (!logs) {
        logs = {
          projects: [],
        };
      }
      logs.projects = logs.projects || [];

      var project = logs.projects.find(function(p) {
        if (!p.data) return false;
        return p.data.setting.title === data.setting.title;
      });

      if (!project) {
        project = {
          created: (new Date()).format('Y-m-d H:i:s'),
        };
        logs.projects.push(project);
      }
      project.data = data;
      project.updated = (new Date()).format('Y-m-d H:i:s');

      this.setStorage('logs', logs);

      return this;
    },

    findProject: function(title) {
      var logs = this.getStorage('logs');
      var projects = logs.projects;

      return projects.find(function(project) {
        if (!project.data) return ;
        return project.data.setting.title === title;
      });
    },

    save: function() {
      this.setStorage('user', this.data);

      return this;
    },

    getStorage: function(key) {
      var data = null;
      var key = LOCAL_STORAGE_KEYS[key];
      var item = localStorage.getItem(key);

      if (item) {
        data = JSON.parse(item);
      }

      return data;
    },

    setStorage: function(key, data) {
      var key = LOCAL_STORAGE_KEYS[key];
      var item = JSON.stringify(data);

      localStorage.setItem(key, item);
    },
  };

  exports.runstant.User = User;
})(typeof exports === 'undefined' ? this : exports);
