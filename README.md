boo.js `alpha`
============

`boo` is a database written in JavaScript with the following features:

- memory database
- tcp socket server
- event-driven (all clients get notified in real time of any watched events)

# Install

```bash
npm install co2-git/boojs
```

# Usage

```js

var boo = require('boo');

// Create new client

client = boo.client({ collection: 'players' });

// Create a new document

client.insert({ name: "Toni", score: 100, team: "red" });

// Update (increment Toni's score by 100)

client.update({ name: "Toni", $inc: { score: 100 } });

// Find Toni

client.find({ name: "Toni" });

// Increment each team red's players every time they have a new member

client.on('inserted', function (players) {

  // Find out how many of the new players are from team red
  
  var newMembers = players
    
    .filter(function (player) {
      return player.team === 'red';
    })
    
    .map(function (player) {
      return { $id: player.$id };
    });
  
  // Update each player of team red, except new ones
  
  if ( newMembers.length ) {
    client.update('players', {
      team: 'red',
      $id: { $not: newMembers },
      $inc: { score: ( 100 * newMembers.length ) } }); 
  }
});

```

# Connexion

boo uses a URL format to identify connexions:

    boo://<server>(:<port>)(/dbname(/collectionName))
    
Default address is:

    boo://localhost:7000/boo-db/boo-sandbox

# Server

boo server starts automatically when a client requires it.

```js
boo.client(); // will use default address
boo.client('boo://app.com:9009'); // specify a diffent host and port
boo.client('test'); // will use default address but with "test" as database
boo.client('test/running'); // will use default address but with "test" as database and "running" as collection
boo.client(9876); // will use default address but with 9876 as port
boo.client({ host: 'app.com', port: 9009, database: 'test', collection: 'users'); // Use object for finer control
```

# Client

You can use boo module to statically create a new client, or called the Client library directly:

```js
var client = boo.client();

// is the same than

var client = new (require('boo/lib/class/Client'))();
```

# Query

Special queries are prefixed by a dollar sign `$` and injected into the regular query:

```js
// Find documents which name is Joe and score is bigger than 100
client.find({ name: 'Joe', score: { $gt: 100 } });
```

# Query operators

# `$not`

```js
// Find documents which name is not Joe
client.find({ name: { $not: 'Joe' } });
```

## Aliases

- `$ne`

# Test

Tests are written in Mocha and shouldjs.

