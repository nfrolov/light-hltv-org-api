'use strict';

const Boom = require('boom');
const Joi = require('joi');

const Match = require('../models/match');

module.exports = [

  {
    method: 'GET',
    path: '/matches',
    handler: function (req, reply) {
      Match.find((err, matches) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply(matches);
      });
    }
  },

  {
    method: 'POST',
    path: '/matches',
    handler: function (req, reply) {
      Match.create(req.payload, (err, match) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply(match).created(`/matches/${match._id}`);
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
    path: '/matches/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Match.findById(id, (err, match) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        if (!match) {
          return reply(Boom.notFound());
        }
        reply(match);
      });
    }
  },

  {
    method: 'PUT',
    path: '/matches/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Match.findByIdAndUpdate(id, req.payload,
        {new: true, upsert: true, overwrite: true},
        (err, match) => {
          if (err) {
            req.log(['error', 'db'], err);
            return reply(Boom.badImplementation());
          }
          reply(match);
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
    path: '/matches/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Match.remove({_id: id}, (err) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply().code(204);
      });
    }
  },

];
