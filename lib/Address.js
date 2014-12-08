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

Address.prototype.toString = function (short) {
  var str = this.protocol + '://' + this.host + ':' + this.port + '/';

  if ( ! short ) {
    str += this.db + (this.collection ? '/' + this.collection : '');
  }

  return str;
};

module.exports = Address;
