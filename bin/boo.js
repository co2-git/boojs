#!/usr/bin/env node

(function () {
  
  'use strict';

  require('colors');

  var index = require('../');

  var pkg = require('../package.json');

  var format = require('util').format;

  var help = [format('boojs v%s', pkg.version)];

  help.push(pkg.description.grey);

  help.push('* Usage: boodb <channel> <message>'.magenta);

  help.push('* Channels: start, poke, insert, find, update, remove, db, dbs, collection, collections'.magenta);

  var action = process.argv[2];

  var client;

  function _time () {
    var d = new Date(),
      h = d.getHours(),
      m = d.getMinutes(),
      s = d.getSeconds();

    return ('[' +
      ( h < 10 ? ('0' + h) : h ) + 
      ':' +
      ( m < 10 ? ('0' + m) : m ) +
      ':' +
      ( s < 10 ? ('0' + s) : s ) +
    ']').grey;
  }

  switch ( action ) {
    default:
      help.forEach(function (line) {
        console.log('  ' + line);
      });
      break;

    case 'start':

      var server = index.server();

      server.on('leave', function () {
        console.log(_time() + ' leave'.cyan.bold);
      });

      server.on('listening', function (service) {
        console.log(_time() + ' listening'.cyan.bold, service);
      });

      server.on('error', function (error) {
        console.log(_time() + ' error'.cyan.bold, error.stack.split(/\n/));
      });

      server.on('join', function () {
        console.log(_time() + ' join'.cyan.bold);
      });

      server.on('request', function (req) {
        console.log(_time() + ' request'.cyan.bold, req);
      });

      server.on('inserting', function (req) {
        console.log(_time() + ' inserting'.cyan.bold, req);
      });

      server.on('inserted', function (req) {
        console.log(_time() + ' inserted'.cyan.bold, req);
      });

      server.on('finding', function (req) {
        console.log(_time() + ' finding'.cyan.bold, req);
      });

      server.on('found', function (req) {
        console.log(_time() + ' found'.cyan.bold, req);
      });

      server.on('updating', function (req) {
        console.log(_time() + ' updating'.cyan.bold, req);
      });

      server.on('updated', function (req) {
        console.log(_time() + ' updated'.cyan.bold, req);
      });

      server.on('removing', function (req) {
        console.log(_time() + ' removing'.cyan.bold, req);
      });

      server.on('removed', function (req) {
        console.log(_time() + ' removed'.cyan.bold, req);
      });

      server.on('dbs', function (req) {
        console.log(_time() + ' dbs'.cyan.bold, req);
      });

      server.on('collections', function (req) {
        console.log(_time() + ' collections'.cyan.bold, req);
      });

      server.create();

      break;

    case 'poke':

      client = client || index.client();

      client.on('connected', function () {
        console.log('poking'.blue);

        client.disconnect();
      });

      client.on('disconnected', function () {
        console.log('poked'.green);
      });

      break;

    case 'insert':

      client = client || index.client();

      client.on('error', function (error) {
        console.log('error', error);
      });

      var doc = {};

      if ( process.argv[3] ) {
        try {
          doc = JSON.parse(process.argv[3]);
        }
        catch ( error ) {
          return console.log(('Could not parse ' + process.argv[3]).red);
        }
      }

      client
        
        .insert(doc)
        
        .on('error', function (error) {
          console.log('error', error);
        })
        
        .on('inserted', function (req) {
          console.log('inserted'.green, req);

          client.disconnect();
        });

      break;

    case 'find':

      client = client || index.client();

      client.on('connected', function () {
        console.log('connected'.green);
      });

      client.on('error', function (error) {
        console.log('error', error);
      });

      var doc = {};

      if ( process.argv[3] ) {
        try {
          doc = JSON.parse(process.argv[3]);
        }
        catch ( error ) {
          return console.log(('Could not parse ' + process.argv[3]).red);
        }
      }

      client
        
        .find(doc)
        
        .on('error', function (error) {
          console.log('error', error);
        })
        
        .on('found', function (req) {
          console.log('found'.green, req);

          client.disconnect();
        });

      break;

    case 'update':

      client = client || index.client();

      client.on('error', function (error) {
        console.log('error', error);
      });

      var doc = {};

      if ( process.argv[3] ) {
        try {
          doc = JSON.parse(process.argv[3]);
        }
        catch ( error ) {
          return console.log(('Could not parse ' + process.argv[3]).red);
        }
      }

      client
        
        .update(doc)
        
        .on('error', function (error) {
          console.log('error', error);
        })
        
        .on('updated', function (req) {
          console.log('updated'.green, req);

          client.disconnect();
        });

      break;

    case 'remove':

      client = client || index.client();

      client.on('error', function (error) {
        console.log('error', error);
      });

      var doc = {};

      if ( process.argv[3] ) {
        try {
          doc = JSON.parse(process.argv[3]);
        }
        catch ( error ) {
          return console.log(('Could not parse ' + process.argv[3]).red);
        }
      }

      client
        
        .remove(doc)
        
        .on('error', function (error) {
          console.log('error', error);
        })
        
        .on('removed', function (req) {
          console.log('removed'.green, req);

          client.disconnect();
        });

      break;

    case 'db':

      client = client || index.client();

      client.on('connected', function () {
        console.log(client.address.database);
        client.disconnect();
      });

      client.on('error', function (error) {
        console.log(error, error.stack.split(/\n/));
      });

      break;

    case 'dbs':

      client = client || index.client();

      client.send('dbs')

        .on('error', function (error) {
          console.log('error'.red);
        })

        .on('dbs', function (dbs) {
          console.log(dbs);
          client.disconnect();
        });

      break;

    case 'collection':

      client = client || index.client();

      client.on('connected', function () {
        console.log(client.address.database + '/' + client.address.collection);
        client.disconnect();
      });

      client.on('error', function (error) {
        console.log(error, error.stack.split(/\n/));
      });

      break;

    case 'collections':

      client = client || index.client();

      client.send('collections')

        .on('error', function (error) {
          console.log('error'.red);
        })

        .on('collections', function (collections) {
          console.log(collections);
          client.disconnect();
        });

      break;
  }

}) ();
