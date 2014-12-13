(function () {

  'use strict';

  function extend (obj) {
    var a = arguments;
    for ( var i in a ) {
      if ( +i ) {
        Object.keys(a[i].prototype).forEach(function (method) {
          obj.prototype[method] = a[i].prototype[method];
        });
      }
    }
  }

  if ( module && module.exports ) {
    module.exports = extend;
  }
  else {
    return extend;
  }

})();
