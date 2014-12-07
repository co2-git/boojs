(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  function Request (conn, event, message) {
    console.log(' ✔ '.green + 'new Request'.bold.green, {
      event: event, message: message
    });
    console.log(' -----------------------'.grey);

    this.conn = conn;
    this.event = event;
    this.message = message;

    var request = this;

    process.nextTick(function () {

      message.$id = Math.ceil(Date.now() / 111 * 7);
      
      conn.write({ event: event, message: message });

      conn.client.on('data', function (data) {
        var response = JSON.parse(data.toString());

        if ( response.id === message.$id ) {
          request.emit('done', response.documents);
        }
      })

    });
  }

  util.inherits(Request, events.EventEmitter);

  module.exports = Request;

})();
