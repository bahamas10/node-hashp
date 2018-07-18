var assert = require('assert');

var hashp = require('../');

var data = [
  hashp.createUserHash('dave', 'foo'),
  hashp.createUserHash('mike', 'bar'),
  hashp.createUserHash('mike', 'baz'),
].join('\n');

try {
  new hashp.HashP(data, {duplicates: 'throw'});
  assert(false, 'should have thrown');
} catch (e) {
}
