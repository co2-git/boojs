var util = require("util");

var events = require("events");

var Address = require('./Address');

var DB = require('./DB');

function Net (address) {
  this.address = new Address(address);
}

util.inherits(Net, events.EventEmitter);

Net.prototype.db = function(dbName) {
  return new DB(this.address.set({ db: dbName }))
};

module.exports = Net;
