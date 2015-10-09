var assert = require('assert');
var crypto = require('crypto');
var f = require('util').format;

var has = require('has');
var templer = require('templer');

var DEFAULT_ALGORITHM = 'sha512';
var DEFAULT_FORMAT = '{{user}}:{{salt}}:{{hash}}:{{iterations}}';

// generate a random salt
function generateSalt(opts) {
  opts = opts || {};
  if (typeof (opts) === 'string')
    opts = {alg: opts};
  opts.algorithm = opts.algorithm || DEFAULT_ALGORITHM;

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
function HashP(s) {
  var self = this;

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
    assert.equal(typeof (name), 'string', 'name is not a string');
    assert(name.length > 0, 'name is empty');

    assert.equal(typeof (salt), 'string', f('%s: salt is not a string', name));
    assert(salt.length > 0, f('%s: salt is empty'));

    assert.equal(typeof (hash), 'string', f('%s: hash is not a string', name));
    assert(hash.length > 0, f('%s: hash is empty', name));

    assert.equal(typeof (iterations), 'number', f('%s: iterations is not a string', name));
    assert(!isNaN(iterations) && isFinite(iterations), f('%s: iterations is an invalid number', name));

    self.creds[name] = {
      salt: salt,
      hash: hash,
      iterations: iterations,
    };
  });
}

HashP.prototype.exists = function exists(user) {
  return has(this.creds, user);
};

HashP.prototype.checkMatch = function checkMatch(user, pass) {
  if (!this.exists(user))
    return false;

  var creds = this.creds[user];

  var data = {
    iterations: creds.iterations,
    salt: creds.salt
  };
  var hash = hashPassword(pass, data);

  return creds.hash === hash;
};

module.exports.hashPassword = hashPassword;
module.exports.generateSalt = generateSalt;
module.exports.createUserHash = createUserHash;
module.exports.HashP = HashP;
