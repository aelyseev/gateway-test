/* eslint-disable no-console */
const { gateway, services: { greeting, hello } } = require('./config');
const helloService = require('./services/hello');
const greetingService = require('./services/greeting');
const createGateway = require('./services/gateway');

helloService.listen(hello.port);
greetingService.listen(greeting.port);
createGateway(
  `http://localhost:${hello.port}/${hello.endpoint}`,
  `http://localhost:${greeting.port}/${greeting.endpoint}`
)
  .listen(gateway.port);

console.log(`Hello service has been started at ${hello.port}`);
console.log(`Greeting service has been started at ${greeting.port}`);
console.log(`Gateway service has been started at ${gateway.port}`);
