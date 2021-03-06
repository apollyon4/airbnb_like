var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
  name: {type: String, required: true, trim: true, unique: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  createdAt: {type: Date, default: Date.now},
  facebook: {id: String, token: String, photo: String},

  hostList: [{type:ObjectId, ref: 'Host'}],
  reservList: [{type:ObjectId, ref: 'Reserv'}],
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.methods.generateHash = function(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

schema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', schema);

module.exports = User;
