(function () {

  'use strict';

  var util = require("util");

  var events = require("events");

  var Address = require('./Address');

  var Client = require('./Client');

  var Collection = require('./Collection');

  function DB (db) {

    console.log(' ✔ '.green + 'new DB'.bold.green, db);
    console.log(' -----------------------'.grey);

    this.client = {};
    this.address = {};

    if ( db ) {
      if ( db instanceof Address ) {
        this.address = db;
      }

      else if ( db.constructor.name === 'Client' ) {
        this.client = db;
        this.address = db.address;
      }

      else {
        this.address = new Address(db);
      }
    }
    else {
      this.address = new Address();
    }
  }

  util.inherits(DB, events.EventEmitter);

  DB.prototype.collection = function(collectionName) {
    var collection = new Collection(this);
    collection.name = collectionName;
    return collection;
  };

  module.exports = DB;

})();
