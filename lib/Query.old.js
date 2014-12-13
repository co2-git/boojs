(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var Request = require('./Request');

  function Query (client, action, query) {

    this.client = client;
    this.action = action;
    this.query = query;

    process.nextTick(function () {

      this.emit('log', {
        ok: 'new Query',
        info: {
          action: action,
          query: query
        }
      });

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

  Query.prototype.insert = function (collection, document) {

    var self = this;

    var query = new Query(this, 'insert', document);
    
    query.on('done', function (inserted) {
      query.emit('inserted', inserted);
    });

    query.on('error', function (error) {
      self.emit('error', error);
    });

    query.on('log', function (log) {
      self.emit('log', log);
    });

    return query;
  };

  Query.prototype.update = function (collection, document) {

    var self = this;

    var query = new Query(this, 'update', document);
    
    query.on('done', function (inserted) {
      query.emit('inserted', inserted);
    });

    query.on('error', function (error) {
      self.emit('error', error);
    });

    query.on('log', function (log) {
      self.emit('log', log);
    });

    return query;
  };

  module.exports = Query;

})();
