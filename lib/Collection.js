(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var Address = require('./Address');

  var Client = require('./Client');
  
  var DB = require('./DB');

  var Query = require('./Query');

  function Collection (collection) {
    console.log(' ✔ '.green + 'new Collection'.bold.green, collection);
    console.log(' -----------------------'.grey);

    this.client = {};
    this.db = {};
    this.address = {};

    if ( collection ) {
      if ( collection instanceof Address ) {
        this.address = collection;
      }

      else if ( collection.constructor.name === 'Client' ) {
        this.client = collection;
      }

      else if ( collection.constructor.name === 'DB' ) { 
        this.db = collection;
        this.client = collection.client;
      }

      else {
        this.address = new Address(collection);
      }
    }
    else {
      this.address = new Address();
    }
  }

  util.inherits(Collection, events.EventEmitter);

  Collection.prototype.find = function(query) {
    var query = new Query(this.client, 'find', query);
    
    query.on('done', function (found) {
      if ( ! found.length ) {
        query.emit('empty');
      }
      else {
        query.emit('found', found);
      }
    });

    return query;
  };

  Collection.prototype.insert = function(query) {
    var query = new Query(this.client, 'insert', query);
    
    query.on('done', function (inserted) {
      query.emit('inserted', inserted);
    });

    return query;
  };

  module.exports = Collection;
})();
