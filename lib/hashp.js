/*
 * hashp
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: July 18, 2018
 * License: MIT
 */

var crypto = require('crypto');
var f = require('util').format;

var assert = require('assert-plus');
var has = require('has');
var templer = require('templer');

var DEFAULT_ALGORITHM = 'sha512';
var DEFAULT_FORMAT = '{{user}}:{{salt}}:{{hash}}:{{iterations}}';

// generate a random salt
function generateSalt(opts) {
  opts = opts || {};
  if (typeof (opts) === 'string')
    opts = {algorithm: opts};
  if (!opts.algorithm)
    opts.algorithm = DEFAULT_ALGORITHM;

  var data = Math.random().toString();
  return crypto.createHash(opts.algorithm).update(data).digest('base64').substr(0, 10);
}

// given a password, algorithm, salt, and iterations, return the hashed password
function hashPassword(password, opts) {
  var alg = opts.algorithm || DEFAULT_ALGORITHM;

  var hash = password;
  for (var i = 0; i <= opts.iterations; i++) {
    hash = crypto.createHmac(alg, opts.salt).update(hash).digest('base64');
  }
  return hash;
}

// create a hash string for the user/pass combo
function createUserHash(user, password, opts) {
  opts = opts || {};
  opts.algorithm = opts.algorithm || DEFAULT_ALGORITHM;
  opts.format = opts.format || DEFAULT_FORMAT;
  opts.iterations = opts.iterations || (Math.floor(Math.random() * 100) + 50);
  opts.salt = opts.salt || generateSalt(opts);

  var hash = hashPassword(password, opts);

  var data = {
    user: user,
    hash: hash,
    salt: opts.salt,
    iterations: opts.iterations
  };

  return templer(opts.format, data);
}

// HashP object
function HashP(s, opts) {
  var self = this;

  assert.string(s, 's');
  assert.optionalObject(opts, 'opts');
  opts = opts || {};

  assert.optionalString(opts.duplicates, 'opts.duplicates');
  if (!has(opts, 'duplicates')) {
    opts.duplicates = 'ignore';
  }

  switch (opts.duplicates) {
  case 'ignore':
  case 'throw':
  case 'allow':
    // ok
    break;
  default:
    assert(false, f('opts.duplicates unknown value: "%s"', opts.duplicates));
  }

  self.opts = opts;
  self.creds = {};

  var lines = s.split('\n');
  lines.forEach(function (line) {
    // skip comments
    if (!line || line[0] === '#')
      return;

    // trim comments at the end of a string
    line = line.split('#')[0].trim();

    // parse lines
    var fields = line.split(':');
    var name = fields[0];
    var salt = fields[1];
    var hash = fields[2];
    var iterations = parseInt(fields[3], 10);

    // verify data
    assert(name.length > 0, 'name is empty');
    assert(salt.length > 0, 'salt is empty');
    assert(hash.length > 0, 'hash is empty');

    assert.number(iterations, 'iterations is not a number');
    var obj = {
      salt: salt,
      hash: hash,
      iterations: iterations,
    };

    switch (opts.duplicates) {
    case 'ignore':
      self.creds[name] = obj;
      break;
    case 'throw':
      if (has(self.creds, name)) {
        var err = new Error(f('duplicate name "%s" found', name));
        throw err;
      }
      self.creds[name] = obj;
      break;
    case 'allow':
      if (!has(self.creds, name)) {
        self.creds[name] = [];
      }
      self.creds[name].push(obj);
      break;
    default:
      assert(false, f('unknown opts.duplicates: %s', opts.duplicates));
      break;
    }
  });
}

HashP.prototype.exists = function exists(user) {
  return has(this.creds, user);
};

HashP.prototype.checkMatch = function checkMatch(user, pass) {
  if (!this.exists(user))
    return false;

  var creds = this.creds[user];
  if (!Array.isArray(creds)) {
    creds = [creds];
  }

  return creds.some(function (cred) {
    var data = {
      iterations: cred.iterations,
      salt: cred.salt
    };
    var hash = hashPassword(pass, data);
    return cred.hash === hash;
  });
};

module.exports.hashPassword = hashPassword;
module.exports.generateSalt = generateSalt;
module.exports.createUserHash = createUserHash;
module.exports.HashP = HashP;
