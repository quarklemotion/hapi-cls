A hapi plugin that runs each request within a continuation-local storage context.

Example:

```js
var cls = require('continuation-local-storage');
var nsName = 'hapi@test';
var ns = cls.createNamespace(nsName);
var getNamespace = cls.getNamespace;

var Server = require('hapi').Server;
server = new Server();
server.connection({host: 'localhost', port: 8080});

server.register({ register: require('hapi-cls'), options: {namespace : ns.name} }, function (err) {
  if (err) throw err;
});

server.route({
  method : 'GET',
  path : '/hello',
  handler: function (request, reply) {
    getNamespace(nsName).set('value', 'my value');
    setTimeout(function () {
      reply({value : getNamespace(nsName).get('value')});
    });
  }
});

server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});
```

With this setup, requests to `/hello` will return `{"value":"overwritten"}`. As
with regular CLS, values that are set in route handlers will be accessible to
callbacks passed to asynchronous functions.

The namespace used (or, optionally, created) by the plugin will be available in
route handlers via the application state variable `clsNamespace`.
