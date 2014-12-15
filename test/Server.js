(function () {
  'use stritc';

  var path      =   require('path');
  var assert    =   require('assert');

  var mocha     =   require('mocha');
  var should    =   require('should');

  var config    =   require('../config.json');

  var Server, server;

  /** @class Server */

  describe ( 'Server - Class', function () {

    it ( 'should have its own file, lib/class/Server.js', function () {
      Server = require('../lib/class/Server');
    });

    it ( 'should be a function', function () {
      Server.should.be.a.function;
    });

    it ( 'should have prototypes', function () {
      Server.prototype.should.be.an.Object;
      Server.prototype.constructor.name.should.equal('BooServer');
    });

    it ( 'should have a create method', function () {
      Server.prototype.create.should.be.a.Function;
    });

  });

  describe ( 'Server - Instance', function () {

    it ( 'should be an object', function () {
      server = new Server({ port: 3456 });
      server.should.be.an.Object;
    });

    it ( 'should be an instance of BooServer', function () {
      server.constructor.name.should.equal('BooServer')
    });

    it ( 'should have inherited from EventEmitter', function () {
      for ( var method in require('events').EventEmitter.prototype ) {
        server.should.have.property(method).which.is.a.Function;
      }
    });

  });

  describe ( 'server - properties - address', function () {

    it ( 'should exist', function () {
      server.address.should;
    });

    it ( 'should an instance of Address', function () {
      server.address.should.be.an.instanceof(require('../lib/class/Address'));
    });

    it ( 'should have a property database which is a string and equals default database from config', function () {
      server.address.should.have.property('database')
        .which.is.a.String
        .and.equal(config.address.database);
    });

    it ( 'should have a property collection which is a string and equals default collection from config', function () {
      server.address.should.have.property('collection')
        .which.is.a.String
        .and.equal(config.address.collection);
    });

  });

  describe ( 'server - properties - databases', function () {

    it ( 'should exist', function () {
      server.databases.should;
    });

    it ( 'should be an object', function () {
      server.databases.should.be.an.Object;
    });

  });

  describe ( 'server - methods - create()', function () {

    var create;

    it ( 'should be a function', function () {
      server.create.should.be.a.Function;
    });

    it ( 'should return server; not have errors; emit a listening event', function (done) {
      create = server.create();
      
      create.constructor.name.should.equal('BooServer');
      
      create.on('error', done);

      create.on('listening', function () {
        done();
      });
    });

  });

  describe ( 'server - properties - service', function () {

    it ( 'should exist', function () {
      server.service.should;
    });

    it ( 'should be a #<Net> Server', function () {
      server.service.should.be.an.Object;
      server.service.constructor.name.should.equal('Server');
    });

  });

})();
