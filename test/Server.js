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

    it ( 'should have a record method', function () {
      Server.prototype.record.should.be.a.Function;
    });

  });

  describe ( 'Server - Instance', function () {

    it ( 'should be an object', function () {
      server = new Server();
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

    it ( 'should have a property events which is an array', function () {
      server.databases.should.have.property(config.address.events)
        .which.is.an.Array;
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

      create.on('listening', done);
    });

  });

  describe ( 'server - methods - record()', function () {

    var record, recorded;

    it ( 'should be a function', function () {
      server.record.should.be.a.Function;
    });

    it ( 'emit a recorded event', function (done) {
      record = server.record('test', 123);
      
      server.on('recorded', function (record) {
        recorded = record;
        done();
      });
    });

    it ( 'should have property event which is a string and equals test',
      function () {
        recorded.should.have.property('event')
          .which.is.a.String
          .and.equal('test');
      });

    it ( 'should have property message which is a number and equals 123',
      function () {
        recorded.should.have.property('message')
          .which.is.a.Number
          .and.equal(123);
      });

    it ( 'should have property address which is an object and is equal to server address',
      function () {
        recorded.should.have.property('address')
          .which.is.an.Object
          .and.eql(server.address);
      });

    it ( 'should have property date which is a date',
      function () {
        recorded.should.have.property('date')
          .which.is.a.Date;
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
