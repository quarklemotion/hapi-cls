var Lab  = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var expect = Code.expect;

describe("basic hapi CLS case", function () {
  var server;

  before(function (done) {
    var cls = require('continuation-local-storage');
    var ns = cls.createNamespace('hapi@test');
    ns.run(function() {
      ns.set('value', 42);
    });

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
        ns.set('value', 'overwritten');
        setTimeout(function () {
          reply({value : ns.get('value')});
        });
      }
    });

    done();
  });

  it("should still find CLS context on subsequent ticks", function (done) {
    expect(process.namespaces['hapi@test']).to.be.ok;
    server.inject({url : '/hello'}, function (res) {
      expect(res.payload).equal('{"value":"overwritten"}');
      done();
    });
  });
});
