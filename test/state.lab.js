var Lab  = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var expect = Code.expect;

describe("hapi app state", function () {
  var server;

  it("should expose the namespace on the state", function (done) {
    var cls = require('continuation-local-storage');
    var ns = cls.createNamespace('hapi@test');
    ns.run(function() {
      ns.set('value', 42);

      var Server = require('hapi').Server;
      server = new Server();
      server.connection({host: 'localhost', port: 8080});

      server.register({ register: require('..'), options: {namespace : ns.name} }, function (err) {
        if (err) done(err);
      });

      server.route({
        method : 'GET',
        path : '/hello',
        handler : function (request, reply) {
          expect(server.app.clsNamespace.name).equal('hapi@test');
          reply({value : server.app.clsNamespace.get('value')});
        }
      });

      server.inject({url : '/hello'}, function (res) {
        expect(res.payload).equal('{"value":42}');
        done();
      });
    });
  });
});
