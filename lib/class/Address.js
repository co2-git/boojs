(function () {

  'use strict';

  var config = require('../../config.json');

  function Address (address) {

    address = address || {};

    this.server = address.server || config.address.server;
    this.port = +(address.port || config.address.port);
    this.database = address.database || config.address.database;
    this.collection = address.collection || config.address.collection;
  }

  module.exports = Address;

})();
