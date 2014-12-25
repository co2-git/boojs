boo.js `alpha`
============

       __                                                
      /  |                                               
      ## |____    ______    ______          __   _______ 
      ##      \  /      \  /      \        /  | /       |
      #######  |/######  |/######  |       ##/ /#######/ 
      ## |  ## |## |  ## |## |  ## |       /  |##      \ 
      ## |__## |## \__## |## \__## |__     ## | ######  |
      ##    ##/ ##    ##/ ##    ##//  |    ## |/     ##/ 
      #######/   ######/   ######/ ##/__   ## |#######/  
                                     /  \__## |          
                                     ##    ##/           
                                      ######/             
                                    
                                    
                                



                                                                       
                                  .do-"""""'-o..                         
                               .o""            ""..                       
                             ,,''                 ``b.                   
                            d'                      ``b                   
                           d`d:                       `b.                 
                          ,,dP                         `Y.               
                         d`88                           `8.               
   ooooooooooooooooood888`88'                            `88888888888bo, 
  d"""    `""""""""""""Y:d8P                              8,          `b 
  8                    P,88b                             ,`8           8 
  8                   ::d888,                           ,8:8.          8 
  :                   dY88888                           `' ::          8 
  :                   8:8888                               `b          8 
  :                   Pd88P',...                     ,d888o.8          8 
  :                   :88'dd888888o.                d8888`88:          8 
  :                  ,:Y:d8888888888b             ,d88888:88:          8 
  :                  :::b88d888888888b.          ,d888888bY8b          8 
                      b:P8;888888888888.        ,88888888888P          8 
                      8:b88888888888888:        888888888888'          8 
                      8:8.8888888888888:        Y8888888888P           8 
  ,                   YP88d8888888888P'          ""888888"Y            8 
  :                   :bY8888P"""""''                     :            8 
  :                    8'8888'                            d            8 
  :                    :bY888,                           ,P            8 
  :                     Y,8888           d.  ,-         ,8'            8 
  :                     `8)888:           '            ,P'             8 
  :                      `88888.          ,...        ,P               8 
  :                       `Y8888,       ,888888o     ,P                8 
  :                         Y888b      ,88888888    ,P'                8 
  :                          `888b    ,888888888   ,,'                 8 
  :                           `Y88b  dPY888888OP   :'                  8 
  :                             :88.,'.   `' `8P-"b.                   8 
  :.                             )8P,   ,b '  -   ``b                  8 
  ::                            :':   d,'d`b, .  - ,db                 8 
  ::                            `b. dP' d8':      d88'                 8 
  ::                             '8P" d8P' 8 -  d88P'                  8 
  ::                            d,' ,d8'  ''  dd88'                    8 
  ::                           d'   8P'  d' dd88'8                     8 
   :                          ,:   `'   d:ddO8P' `b.                   8 
   :                  ,dooood88: ,    ,d8888""    ```b.                8 
   :               .o8"'""""""Y8.b    8 `"''    .o'  `"""ob.           8 
   :              dP'         `8:     K       dP''        "`Yo.        8 
   :             dP            88     8b.   ,d'              ``b       8 
   :             8.            8P     8""'  `"                 :.      8 
   :            :8:           :8'    ,:                        ::      8 
   :            :8:           d:    d'                         ::      8 
   :            :8:          dP   ,,'                          ::      8 
   :            `8:     :b  dP   ,,                            ::      8 
   :            ,8b     :8 dP   ,,                             d       8 
   :            :8P     :8dP    d'                       d     8       8 
   :            :8:     d8P    d'                      d88    :P       8 
   :            d8'    ,88'   ,P                     ,d888    d'       8 
   :            88     dP'   ,P                      d8888b   8        8 
   '           ,8:   ,dP'    8.                     d8''88'  :8        8 
               :8   d8P'    d88b                   d"'  88   :8        8 
               d: ,d8P'    ,8P""".                      88   :P        8 
               8 ,88P'     d'                           88   ::        8 
              ,8 d8P       8                            88   ::        8 
              d: 8P       ,:  -hrr-                    :88   ::        8 
              8',8:,d     d'                           :8:   ::        8 
             ,8,8P'8'    ,8                            :8'   ::        8 
             :8`' d'     d'                            :8    ::        8 
             `8  ,P     :8                             :8:   ::        8 
              8, `      d8.                            :8:   8:        8 
              :8       d88:                            d8:   8         8 
   ,          `8,     d8888                            88b   8         8 
   :           88   ,d::888                            888   Y:        8 
   :           YK,oo8P :888                            888.  `b        8 
   :           `8888P  :888:                          ,888:   Y,       8 
   :            ``'"   `888b                          :888:   `b       8 
   :                    8888                           888:    ::      8 
   :                    8888:                          888b     Y.     8, 
   :                    8888b                          :888     `b     8: 
   :                    88888.                         `888,     Y     8: 
   ``ob...............--"""""'----------------------`""""""""'"""`'"""""



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

