(function() {
  var format = '{username}:{salt}:{hash}:{iterations}';

  function hmac(username, password) {
    var iterations = Math.floor(Math.random() * 100) + 50;
    var salt = new jsSHA(Math.random().toString(), 'TEXT').getHash('SHA-512', 'B64').substr(0, 10);
    var hash = password;
    for (var i = 0; i<=iterations; i++) {
      var shaObj = new jsSHA(hash, 'TEXT');
      hash = shaObj.getHMAC(salt, 'TEXT', 'SHA-512', 'B64');
    }
    var s = format
      .replace('{username}', username)
      .replace('{salt}', salt)
      .replace('{hash}', hash)
      .replace('{iterations}', iterations);
    return s;
  }

  window.hmac = hmac;
})();
