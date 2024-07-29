const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema(
  {
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
      minLength: [8, 'Password should be at least 8 characters.'],
      select: false, // find
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },

        message: 'Passwords are not the same',
      },
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'guide', 'lead-guide', 'admin'],
        message: 'Difficulty is either: easy, medium, difficulty',
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    id: false,
  }
);

// Encrypt the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Check if the password is correct
userSchema.methods.isCorrectPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generete Token
userSchema.methods.signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// check if the password changed after a token issued
userSchema.methods.isChangedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimestamp;

  return false;
};

// Create Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  // create a random token
  const passwordResetToken = crypto.randomBytes(32).toString('hex');
  const hashedPasswordResetToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

  // save the token info in the database
  this.passwordResetToken = hashedPasswordResetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return hashedPasswordResetToken;
};

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) return next();

  this.passwordChangedAt = Date.now();

  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
