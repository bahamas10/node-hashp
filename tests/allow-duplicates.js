var assert = require('assert');

var hashp = require('../');

var data = [
  hashp.createUserHash('dave', 'foo'),
  hashp.createUserHash('mike', 'bar'),
  hashp.createUserHash('mike', 'baz'),
].join('\n');

var hp = new hashp.HashP(data, {duplicates: 'allow'});

assert.equal(hp.exists('dave'), true);
assert.equal(hp.exists('mike'), true);
assert.equal(hp.exists('shaggy'), false);

assert.equal(hp.checkMatch('dave', 'foo'), true);
assert.equal(hp.checkMatch('mike', 'bar'), true);
assert.equal(hp.checkMatch('mike', 'baz'), true);

assert.equal(hp.checkMatch('dave', 'WRONG'), false);
assert.equal(hp.checkMatch('mike', 'WRONG'), false);
assert.equal(hp.checkMatch('shaggy', 'WRONG'), false);
