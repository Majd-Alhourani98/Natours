const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/AppError');

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = user.signToken(user._id);

  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

const login = catchAsync(async (req, res, next) => {
  // check if the email or password exist in the body
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  const token = user.signToken(user._id);

  console.log(token);
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if exist
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // CHECK req.header.autor
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) next(new AppError('you are not logged, please login to get access', 401));

  next();
});

module.exports = { signup, login, protect };
