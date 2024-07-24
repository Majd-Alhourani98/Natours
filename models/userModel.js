const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModel');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: [true, 'password should at least 8 characters'],
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],

    validate: {
      validator: function (value) {
        return value === this.password;
      },

      message: 'password and password confirm does not match',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
