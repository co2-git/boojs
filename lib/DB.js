var util = require("util");

var events = require("events");

var Address = require('./Address');

var Collection = require('./Collection');

function DB (address) {
  this.address = address instanceof Address ? address : new Address(address);

  this.name = this.address.db;
}

util.inherits(DB, events.EventEmitter);

DB.prototype.collection = function(collectionName) {
  return new Collection(this.address.set({ collection: collectionName }))
};

module.exports = DB;
