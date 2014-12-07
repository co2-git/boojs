(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var Request = require('./Request');

  function Query (client, action, query) {
    console.log(' ✔ '.green + 'new Query'.bold.green, {
      action: action, query: query
    });
    console.log(' -----------------------'.grey);

    this.client = client;
    this.action = action;
    this.query = query;

    process.nextTick(function () {
      this.exec();
    }.bind(this));
  }

  util.inherits(Query, events.EventEmitter);

  Query.prototype.exec = function() {
    if ( ! this.client ) {
      return this.emit('error', new Error('No client function'));
    }

    var query = this;

    var message = this.query || {};

    message.$db = this.client.address.db;

    message.$collection = this.client.address.collection;

    new Request(this.client.conn, this.action, message)
      .on('error', function (error) {
        query.emit('error', error);
      })
      .on('done', function (response) {
        query.emit('done', response);
      });
  };

  module.exports = Query;

})();
