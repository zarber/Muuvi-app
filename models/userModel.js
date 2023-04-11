const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error('Täytä kaikki kentät!');
  }
  if (!validator.isEmail(email)) {
    throw Error('Virheellinen sähköposti');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Salasana ei ole tarpeeksi vahva');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Sähköposti on jo käytössä');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('Täytä kaikki kentät!');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Väärä sähköposti');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Väärä password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
