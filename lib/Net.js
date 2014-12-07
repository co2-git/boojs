var Address = require('./Address');

function Net (address) {
  this.address = new Address(address);
}

module.exports = Net;
