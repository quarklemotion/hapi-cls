'use strict';

var HapiCls = {
  register : function (server, options, next) {
    if (!options.namespace) next(new TypeError('namespace name required'));

    var cls = require('continuation-local-storage');
    var ns = cls.getNamespace(options.namespace);
    if (!ns) ns = cls.createNamespace(options.namespace);

    server.app.clsNamespace = ns;

    server.ext('onRequest', function (request, reply) {
      ns.bindEmitter(request.raw.req);
      ns.bindEmitter(request.raw.res);

      ns.run(function () { reply.continue(); });
    });

    next();
  }
};

HapiCls.register.attributes = {
  name     : 'hapi-cls',
  version  : '1.2.0'
};

module.exports = HapiCls;
