var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  hostName: {type: String, required: true},
  simpleInfo: {type: String, required: true},
  city: {type: String, required: true, trim: true},
  address: {type: String, required: true, trim: true},
  cost: {type: String, required: true},
  useful: {type: String},
  rule: {type: String},
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Host = mongoose.model('Host', schema);

module.exports = Host;
