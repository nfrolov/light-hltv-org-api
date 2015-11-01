'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ShortId = require('shortid');

const Match = require('./match');

const teamSchema = new Schema({
  _id: {type: String, unique: true, default: ShortId.generate},
  name: String,
  abbr: String,
  country: String,
  players: [{type: String, ref: 'Player'}]
}, {
  toJSON: {versionKey: false}
});

teamSchema.pre('findOne', function (next) {
  this.populate('players');
  next();
});

teamSchema.statics.findMatches = function (id, cb) {
  this.findById(id, '_id', (err, team) => {
    if (err) {
      return cb(err);
    }
    if (team) {
      return Match.findByTeam(id, cb);
    }
    return cb(null, null);
  });
};

const Team = Mongoose.model('Team', teamSchema);

module.exports = Team;
