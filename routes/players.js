'use strict';

const Boom = require('boom');
const Joi = require('joi');

const Player = require('../models/player');

module.exports = [

  {
    method: 'GET',
    path: '/players',
    handler: function (req, reply) {
      Player.find((err, players) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply(players);
      });
    }
  },

  {
    method: 'POST',
    path: '/players',
    handler: function (req, reply) {
      Player.create(req.payload, (err, player) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply(player).created(`/players/${player._id}`);
      });
    },
    config: {
      validate: {
        payload: Joi.object()
      }
    }
  },

  {
    method: 'GET',
    path: '/players/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Player.findById(id, (err, player) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        if (!player) {
          return reply(Boom.notFound());
        }
        reply(player);
      });
    }
  },

  {
    method: 'PUT',
    path: '/players/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Player.findByIdAndUpdate(id, req.payload,
        {new: true, upsert: true, overwrite: true},
        (err, player) => {
          if (err) {
            req.log(['error', 'db'], err);
            return reply(Boom.badImplementation());
          }
          reply(player);
        }
      );
    },
    config: {
      validate: {
        payload: Joi.object()
      }
    }
  },

  {
    method: 'DELETE',
    path: '/players/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Player.remove({_id: id}, (err) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply().code(204);
      });
    }
  },

];
