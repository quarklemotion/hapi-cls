'use strict';

module.exports = {
  name     : 'hapi-cls',
  version  : '1.0.0',
  register : function (plugin, options, next) {
    if (!options.namespace) next(new TypeError('namespace name required'));

    var cls = require('continuation-local-storage');
    var ns = cls.getNamespace(options.namespace);
    if (!ns) ns = cls.createNamespace(options.namespace);

    plugin.ext('onRequest', function (request, continuation) {
      ns.bindEmitter(request.raw.req);
      ns.bindEmitter(request.raw.res);

      ns.run(function () { continuation(); });
    });

    next();
  }
};