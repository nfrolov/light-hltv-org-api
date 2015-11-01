'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ShortId = require('shortid');

const matchSchema = new Schema({
  _id: {type: String, unique: true, default: ShortId.generate},
  date: {type: Date, default: Date.now},
  teams: [{type: String, ref: 'Team'}],
  maps: [{
    _id: false,
    map: String,
    result: [Number]
  }]
}, {
  toJSON: {virtuals: true, versionKey: false},
  id: false
});

matchSchema.virtual('result').get(function () {
  if (0 === this.maps.length) {
    return undefined;
  }
  if (1 === this.maps.length) {
    if (this.maps[0].result.length) {
      return this.maps[0].result;
    }
    return undefined;
  }
  return this.maps.reduce((result, map) => {
    if (map.result.length) {
      const winner = map.result[0] > map.result[1] ? 0 : 1;
      result[winner]++;
    }
    return result;
  }, [0, 0]);
});

matchSchema.pre('find', function (next) {
  this.populate('teams');
  next();
});

matchSchema.pre('findOne', function (next) {
  this.populate('teams');
  next();
});

matchSchema.statics.findByTeam = function (id, cb) {
  return this.find({teams: {$in: [id]}}, {}, {sort: {date: -1}}, cb);
};

const Match = Mongoose.model('Match', matchSchema);

module.exports = Match;
