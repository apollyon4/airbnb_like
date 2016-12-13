var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var reserv = new Schema({
  checkIn: {type: Date},
  checkOut: {type: Date},
  people: {type: String},

  isReserv: {type: Boolean},
});

var Reserv = mongoose.model('Reserv', reserv);

module.exports = Reserv;
