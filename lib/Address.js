function Address (address) {
  this.protocol = 'boo';
  this.host = 'localhost';
  this.port = 7000;
  this.db = 'boo-db';
  this.collection = 'boo-collec';
}

Address.prototype.set = function(setters) {
  for ( var setter in setters ) {
    this[setter] = setters[setter];
  }

  return this;
};

module.exports = Address;
