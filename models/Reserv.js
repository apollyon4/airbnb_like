var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var reserv = new Schema({
  title: {type: String},
  hostName: {type: String},
  checkIn: {type: String},
  checkOut: {type: String},
  people: {type: String},
  isReserv: {type: Boolean},
});

var Reserv = mongoose.model('Reserv', reserv);

module.exports = Reserv;
