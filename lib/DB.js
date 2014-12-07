var util = require("util");

var events = require("events");

var Address = require('./Address');

function DB (address) {
  this.address = address instanceof Address ? address : new Address(address);
}

util.inherits(DB, events.EventEmitter);

module.exports = DB;
