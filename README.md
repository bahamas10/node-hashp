node-hashp
==========

Manage users and hashed passwords using sha-512 with variable iterations

Usage
-----

### `hashp.createUserHash(user, password[, opts={}])`

Create a `hashp` formatted hashed password string

``` js
var hashp = require('hashp');
var line = hashp.createUserHash('dave', 'foobar');
// => "dave:NUcDl5mR6T:lKjPCs5Z1+Uwl0gxYU/AWIKbTV4i8bsWlHeE5fYYwW8Tt/O6YtohJasjER5kIb8RKtniyLi0ppxn3wXQyaxGzg==:68"
```

`opts`
- `opts.algorithm` - hash algorithm to use, defaults to `sha512`
- `opts.format` - string format, defaults to `{{user}}:{{salt}}:{{hash}}:{{iterations}}`
- `opts.iterations` - number of iterations, defaults to a random number between 50 and 150
- `opts.salt` - salt to hash with, defaults to something random

### `var hp = new hashp.HashP(s)`

Create a `HashP` object with a given string of newline separated hashed password strings

`passwords.txt`

```
# some comment
dave:0Hmg1NlFBz:AoUd5RaBWFvGZD6oD+KZqGBExFH4fpvr4jtfDBsW+dBxYibzo8GwomNzAtFFbaydzN1BU67TfpksCnW9uyFI7Q==:86

# something else
skye:SJSsH5+g6A:4ESGl7LUyuaVdB2SH4laTrOKHyZL/pDhKCIb0AHbiWeJF7h5bPJS8Oxe5sm6Gmb6j2kMIKnD4YK+ceW3Wq7f3A==:95
```

``` js
var hashp = require('hashp');
var fs = require('fs');

var data = fs.readFileSync('./passwords.txt', 'utf8');
var hp = new hashp.HashP(data);
```

### `hp.exists(user)`

Check if a user exists

``` js
hp.exists('dave');
// => true

hp.exists('john');
// => false
```

### `hp.checkMatch(user, password)`

Check if a user/pass combo matches

``` js
hp.checkMatch('dave', 'foo');
// => true
hp.checkMatch('dave', 'bar');
// => false
hp.checkMtach('john', 'bar');
// => false
```

---

These functions are exposed but probably don't need to be called directly

### `hashp.hashPassword(password[, opts={}])`

Hash a password, opts is the same createUserHash

### `hashp.generateSalt([opts={}])`

Generate a random salt, opts is the same createUserHash

CLI Usage
---------

    $ echo -n password | hashp dave
    dave:RYueIcbr7E:CaNK4tuamiyOSz3zVzBaMNTxq2+E2XlPlo9/XpQ+agcmIJnL32OPh97BUrlkBDEFn7SofQNZWlCaQnVFVfGz8w==:65

Installation
------------

Use as a module

    npm install hashp

Use as a CLI tool

    npm install -g hashp

License
-------

MIT License
