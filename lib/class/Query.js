(function () {

  'use strict';

  function BooQuery () {
  }

  require('util').inherits(BooQuery, require('events').EventEmitter);

  BooQuery.prototype.provider = function (client) {
    this.client = client;
  };

  BooQuery.prototype.insert = function (document) {

    var self = this,
      query = new BooQuery();

    process.nextTick(function () {

      if ( ! self.client ) {
        return query.emit('error', new Error('Query has no client'));
      }

      query.provider(self.client);

      query.client
        
        .write({
          insert: document || {},
          database: query.client.address.database,
          collection: query.client.address.collection
        });

      query.client.on('error', function (error) {
        query.emit('error', error);
      });

      query.client.on('client request', function (client_request) {
        query.emit('client request', client_request);
      })
    });

    return query;
  };

  BooQuery.prototype.update = function (message) {
    // body...
  };

  BooQuery.prototype.find = function (message) {
    // body...
  };

  BooQuery.prototype.count = function (message) {
    // body...
  };

  BooQuery.prototype.remove = function (message) {
    // body...
  };

  module.exports = BooQuery;

})();
