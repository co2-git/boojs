(function () {

  'use strict';

  exports.client = function () {
    var Client = require('./lib/Client');

    var client = new Client();

    return client;
  };

})();
