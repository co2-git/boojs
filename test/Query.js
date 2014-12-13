(function () {

  'use strict';

  var path      =   require('path');
  var assert    =   require('assert');

  var mocha     =   require('mocha');
  var should    =   require('should');

  var config    =   require('../config.json');

  var Query, query;

  /** @class Query */

  describe ( 'Query - Class', function () {

    it ( 'should have its own file, lib/class/Query.js', function () {
      Query = require('../lib/class/Query');
    });

    it ( 'should be a function', function () {
      Query.should.be.a.function;
    });

    it ( 'should have prototypes', function () {
      Query.prototype.should.be.an.Object;
      Query.prototype.constructor.name.should.equal('BooQuery');
    });

    it ( 'should have a insert method', function () {
      Query.prototype.insert.should.be.a.Function;
    });

    it ( 'should have a update method', function () {
      Query.prototype.update.should.be.a.Function;
    });

    it ( 'should have a find method', function () {
      Query.prototype.find.should.be.a.Function;
    });

    it ( 'should have a count method', function () {
      Query.prototype.count.should.be.a.Function;
    });

    it ( 'should have a remove method', function () {
      Query.prototype.remove.should.be.a.Function;
    });

    it ( 'should have a provider method', function () {
      Query.prototype.provider.should.be.a.Function;
    });

  });

  describe ( 'Query - Instance', function () {

    it ( 'should be an object', function () {
      query = new Query();
      query.should.be.an.Object;
    });

    it ( 'should be an instance of BooQuery', function () {
      query.constructor.name.should.equal('BooQuery')
    });

    it ( 'should have inherited from EventEmitter', function () {
      for ( var method in require('events').EventEmitter.prototype ) {
        query.should.have.property(method).which.is.a.Function;
      }
    });

  });

  describe ( 'query - methods - provider()', function () {

    var provider;

    it ( 'should be a function', function () {
      query.provider.should.be.a.Function;
    });

    it ( 'should return undefined', function () {
      provider = query.provider(new (require('../lib/class/Client'))());

      should(provider).be.undefined;
    });

  });

  describe ( 'query - properties - client', function () {

    it ( 'should exist', function () {
      query.client.should;
    });

    it ( 'should an instance of client', function () {
      query.client.should.be.an.instanceof(require('../lib/class/Client'));
    });

  });

  describe ( 'query - methods - insert()', function () {

    var insert,
      candidate = { test: true },
      request;

    it ( 'should be a function', function () {
      query.insert.should.be.a.Function;
    });

    it ( 'should be a BooQuery; not throw errors; emit a "client request" event', function (done) {
      insert = query.insert();

      insert.on('error', done);

      insert.constructor.name.should.equal('BooQuery');

      insert.on('client request', function (argument) {
        request = argument;
        done();
      });
    });

    it ( 'should have a request which is an object', function () {
      request.should.be.an.Object;
    });

    it ( 'should have a database property which is a string and equal default database', function () {
      request.should.have.property('database')
        .which.is.a.String
        .and.equal(config.address.database);
    });

    it ( 'should have a database property which is a string and equal default collection', function () {
      request.should.have.property('collection')
        .which.is.a.String
        .and.equal(config.address.collection);
    });

    it ( 'should have a insert property which is an empty object', function () {
      request.should.have.property('insert')
        .which.is.an.Object;

      Object.keys(request.insert).length.should.equal(0);
    });

  });

})();
