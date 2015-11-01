'use strict';

const Boom = require('boom');
const Joi = require('joi');

const Team = require('../models/team');
const Match = require('../models/match');

module.exports = [

  {
    method: 'GET',
    path: '/teams',
    handler: function (req, reply) {
      Team.find((err, teams) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply(teams);
      });
    }
  },

  {
    method: 'POST',
    path: '/teams',
    handler: function (req, reply) {
      Team.create(req.payload, (err, team) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply(team).created(`/teams/${team._id}`);
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
    path: '/teams/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Team.findById(id, (err, team) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        if (!team) {
          return reply(Boom.notFound());
        }
        reply(team);
      });
    }
  },

  {
    method: 'PUT',
    path: '/teams/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Team.findByIdAndUpdate(id, req.payload,
        {new: true, upsert: true, overwrite: true},
        (err, team) => {
          if (err) {
            req.log(['error', 'db'], err);
            return reply(Boom.badImplementation());
          }
          reply(team);
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
    path: '/teams/{id}',
    handler: function (req, reply) {
      const id = req.params.id;
      Team.remove({_id: id}, (err) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        reply().code(204);
      });
    }
  },

  {
    method: 'GET',
    path: '/teams/{id}/matches',
    handler: function (req, reply) {
      const id = req.params.id;
      Team.findMatches(id, (err, matches) => {
        if (err) {
          req.log(['error', 'db'], err);
          return reply(Boom.badImplementation());
        }
        if (!matches) {
          return reply(Boom.notFound());
        }
        reply(matches);
      });
    }
  },

];
