'use strict';

const Hapi = require('hapi');
const Mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGOLAB_URI || process.env.MONGODB_URI;
const HTTP_PORT = process.env.PORT || 3000;

const server = new Hapi.Server({
  debug: module.parent ? false : undefined,
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection({port: HTTP_PORT});

const routes = require('./routes');
server.route(routes);

if (!module.parent) {
  Mongoose.connect(MONGODB_URI, (err) => {
    if (err) {
      console.error('Failed to connect to MongoDB:', MONGODB_URI);
    } else {
      console.log('Connected to MongoDB:', MONGODB_URI);
    }
  })
  server.start(() => {
    console.log('Server started at', server.info.uri);
  });
}

module.exports = server;
