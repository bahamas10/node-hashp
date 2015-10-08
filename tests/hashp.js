var assert = require('assert');

var hashp = require('../');

var data = 'user:NUcDl5mR6T:lKjPCs5Z1+Uwl0gxYU/AWIKbTV4i8bsWlHeE5fYYwW8Tt/O6YtohJasjER5kIb8RKtniyLi0ppxn3wXQyaxGzg==:68';

var hp = new hashp.HashP(data);

assert.equal(hp.exists('user'), true);
assert.equal(hp.exists('foo'), false);

assert.equal(hp.checkMatch('user', 'pass'), true);
assert.equal(hp.checkMatch('user', 'WRONG'), false);
