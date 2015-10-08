var assert = require('assert');

var hashp = require('../');

var data = [
  hashp.createUserHash('dave', 'foo'),
  hashp.createUserHash('skye', 'bar'),
].join('\n');

var hp = new hashp.HashP(data);

assert.equal(hp.exists('dave'), true);
assert.equal(hp.exists('skye'), true);
assert.equal(hp.exists('mike'), false);
assert.equal(hp.exists('shaggy'), false);

assert.equal(hp.checkMatch('dave', 'foo'), true);
assert.equal(hp.checkMatch('skye', 'bar'), true);
assert.equal(hp.checkMatch('mike', 'foo'), false);
assert.equal(hp.checkMatch('shaggy', 'bar'), false);

assert.equal(hp.checkMatch('dave', 'WRONG'), false);
assert.equal(hp.checkMatch('skye', 'WRONG'), false);
assert.equal(hp.checkMatch('mike', 'WRONG'), false);
assert.equal(hp.checkMatch('shaggy', 'WRONG'), false);
