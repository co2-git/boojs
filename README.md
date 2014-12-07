boo.js
======

boo is a database written in JavaScript with the following features:

- memory database
- tcp socket server
- event-driven (all clients get notified in real time of any watched events)

# Install

```bash
npm install boo
```

# Usage

```js

var boo = require('boo');

boo.connect('my-db-name/my-collection-name')

  .on('connected', function (con, db, collection) {

    collection.find()

      .on('found', function (found) {
        console.log(found);
        });

    // Insert into a collection when another one gets updated

    db.collection('another-collection')

      .pipe(collection, { on: 'updated' });

  });
```

# Connexion

# Databases, collections and documents

# `new Net`

## Constructor

    new Boo.Net(String address || Number port || Null default)
    
## Static constructor

```js
require('boo').net(); // aliases= require('boo').connect()
```
    
### Example

```js

// NB `new require('boo').Net()` can also be called statically like this `require('boo').net()`

new require('boo').Net(); // boo://localhost:7000
new require('boo').Net(9000); // boo://localhost:9000
new require('boo').Net('my-db'); // boo://localhost:7000/my-db
new require('boo').Net('my-db/my-collec'); // boo://localhost:7000/my-db/my-collec
new require('boo').Net('boo://app.com:1234/app/users'); // using a full address
new require('boo').Net({  // using an object
  'host': 'app.com',
  'port': 1234,
  'db': 'app',
  'collection': 'users'});
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

## Methods

- db(String dbName)

### db(String dbName)

#### Return

    boo.DB
    

# DB

## Events

- #created a new collection has been created
- #dropped a collection has been deleted


- Methods
    - show
    - collection(String collectionName)
- Collection
  - Methods
    - find()
    - insert()
    - update()
    - remove()
    - drop()
- Document
  - Methods
    - update()
    - remove()

There are 1 utility object, non emittable:

- Boo.Address

Main objects can be instantiated by calling an module's exported sugar method, which name is the one of the object in lower case.

```js
boo.net(); // is the same then `new boo.Net()`
boo.db(); // is the same then `new boo.DB()`
// etc.
```

### Sugar aliases

```js
boo.connect(); // alias of boo.net();

boo.use(); // alias of boo.db();

boo.table(); // alias of boo.collection();

// Aliases of boo.find()
boo.view();
boo.select();
boo.get();

// Aliases of boo.insert()
boo.view();
boo.select();
boo.get();
```

## boo

### boo.connect()

```js

boo.connect();

// Or

new Boo

#### Events

## db

## collection

### collection.find(Query || null)

Use the find method to retrieve documents from a collection.

```js
collection.find()
  .on('error', function (error) {})
  .on('empty', function () {})
  .on('found', function (documents) {});
```

#### Events

##### error

##### empty

##### found

##### done

### collection.insert(Document || [Document])

### collection.update(Query, Document)

### collection.remove(Query || null)
