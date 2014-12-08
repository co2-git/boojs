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

# Databases, collections and documents

- Client
  - **Inherits**
  - EventEmitter
  - Query
  - **Events**
  - #error
  - #connected
  - #log
  - **Members**
  - Address address
  - Connexion connexion
  - **Methods**
  - db(String dbName)
  - **Static Methods**
  - prettyTerminalOutput(Object log)
- Connexion
  - **Inherits**
  - EventEmitter
  - **Events**
  - #error
  - #connected
  - #log
  - **Members**
  - Socket socket
  - **Methods**
  - write(Object message)
- Server
  - **Inherits**
  - EventEmitter
  - **Events**
  - #error
  - #listening
  - #log
  - **Members**
  - Address address
  - Object data
  - <net>Server service
  - **Methods**
  - create()

# `Client`

## Constructor

    new Client(String address || Number port || Null default)
    
## Static constructor

```js
require('boo').client(); // aliases= connect();
```

### Arguments

- String address || Number port

#### String address 

The address (complete or partial) of the boo server

##### Default 

    "boo://localhost:7000/boo-db/boo-collec"

#### Number port

The boo server's port

##### Default 

    7000
  
## Events

- error
- done (aliases: connected, ready)

### error(Error error)

### done(Net connexion)

## Properties

- {Address} address

## Methods

- db(String dbName || Null default)

### db(String dbName || Null default)

```js
/**
 * @arg {String=boo-db} dbName? - the name of the database (if empty, will use default "boo-db" as database name)
 * @return {boo.DB}
 * @example */

var db = require('boo').client().db('my-db-name');
assert(db instanceof boo.DB);
```

# `new DB`

## Constructor

    new DB(Address address || String address || Object address || Number port || Null default)
    
## Static constructor

```js
require('boo').db(); // aliases= require('boo').use()
```
    
### Example

```js

// NB `new require('boo').Net()` can also be called statically like this `require('boo').net()`

new require('boo').DB(); // boo://localhost:7000/boo-db
new require('boo').DB(9000); // boo://localhost:9000/boo-db
new require('boo').DB('my-db'); // boo://localhost:7000/my-db
new require('boo').DB('boo://app.com:1234/app'); // using a full address
new require('boo').DB({  // using an object
  'host': 'app.com',
  'port': 1234,
  'db': 'app'});
```

### Arguments

- Address address || String address || Object address || Number port || Null default

#### String address 

The address (complete or partial) of the boo server

##### Default 

    "boo://localhost:7000/boo-db/boo-collec"

#### Number port

The boo server's port

##### Default 

    7000
  
## Events

- error
- done (aliases: connected, ready)

### error(Error error)

### done(Net connexion)

## Properties

- {Address} address

## Methods

- collection(String collectionName || Null default)

### collection(String collectionName || Null default)

```js
/**
 * @arg {String=boo-sandbox} collectionName? - the name of the collection (if empty, will use default "boo-sandbox" as collection name)
 * @return {Collection}
 * @example */

var collection = require('boo').connect().db('my-db-name').collection('my-collection-name');
assert(collection instanceof Collection);
```

# `new Collection`

## Constructor

    new Collection(Address address || String address || Object address || Number port || Null default)
    
## Static constructor

```js
require('boo').collection(); // aliases= require('boo').table()
```
    
### Example

```js

// NB `new require('boo').Collection()` can also be called statically like this `require('boo').collection()`

new require('boo').DB(); // boo://localhost:7000/boo-db
new require('boo').DB(9000); // boo://localhost:9000/boo-db
new require('boo').DB('my-db'); // boo://localhost:7000/my-db
new require('boo').DB('boo://app.com:1234/app'); // using a full address
new require('boo').DB({  // using an object
  'host': 'app.com',
  'port': 1234,
  'db': 'app'});
```

### Arguments

- Address address || String address || Object address || Number port || Null default

#### String address 

The address (complete or partial) of the boo server

##### Default 

    "boo://localhost:7000/boo-db/boo-collec"

#### Number port

The boo server's port

##### Default 

    7000
  
## Events

- error
- done (aliases: connected, ready)

### error(Error error)

### done(Net connexion)

## Properties

- {Address} address

## Methods

- find(Object query || Null default)

### find(Query query || Null default)

```js
/**
 * @arg {String=boo-sandbox} collectionName? - the name of the collection (if empty, will use default "boo-sandbox" as collection name)
 * @return {Collection}
 * @example */

var documents = collection.find({});
assert(documents instanceof Query);
```
