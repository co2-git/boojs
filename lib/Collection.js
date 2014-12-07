var util = require("util");

var events = require("events");

var Address = require('./Address');

function Collection (address) {
  this.address = address instanceof Address ? address : new Address(address);
}

util.inherits(Collection, events.EventEmitter);

// Collection.prototype.collection = function(collectionName) {
//   return new Collection(this.address.set({ collection: collectionName }))
// };

module.exports = Collection;
