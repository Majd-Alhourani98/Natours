const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.bodu.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

module.exports = { signup };
