boo.js `alpha`
============

boo is a database written in JavaScript with the following features:

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

client = boo.client();

// Create a new document

client.insert('players', { name: "Toni", score: 100, team: "red" });

// Update (increment Toni's score by 100)

client.update('players', { name: "Toni", $inc: { score: 100 } });

// Find Toni

client.find('players', { name: "Toni" });

// Increment each team red's players every time they have a new member

client.collection('players').on('inserted', function (players) {

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
boo.client('boo://app.com/mydb/users'); 
// will start a new server is there is none listening at this address
```

# Client

You can use boo module to statically create a new client, or called the Client library directly:

```js
var client = boo.client();

// is the same than

var client = new (require('boo/lib/class/Client'))();
```

# Address

The Client constructor is expecting one mixed parameter, which is the server's address.

