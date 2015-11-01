'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ShortId = require('shortid');

const playerSchema = new Schema({
  _id: {type: String, unique: true, default: ShortId.generate},
  nick: String,
  firstName: String,
  lastName: String,
  team: {type: String, ref: 'Team'},
  country: {type: String}
}, {
  toJSON: {versionKey: false}
});

playerSchema.virtual('name').get(function () {
  return `${this.firstName} '${this.nick}' ${this.lastName}`;
});

const Player = Mongoose.model('Player', playerSchema);

module.exports = Player;
