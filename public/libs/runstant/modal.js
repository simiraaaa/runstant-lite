
;(function() {
  var Modal = function(param) {
    this.query = param.query;
    this.ready = param.ready;
    this.complete = param.complete;
  };

  Modal.prototype = {
    open: function() {
      var self = this;

      $(this.query).openModal({
        ready: function() {
          self.ready && self.ready();
        },

        complete: function() {
          self.complete && self.complete();
        },
      });
    },
  };

  runstant.Modal = Modal;
})();
