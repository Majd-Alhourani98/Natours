const crypto = require('crypto');
const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/AppError');
const sendEmail = require('./../util/email');
const { allowedNodeEnvironmentFlags } = require('process');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

// Cookie Options
const cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  httpOnly: true,
};
if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

// Sign up
const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // role: req.body.role,
    // passwordChangedAt: req.body.passwordChangedAt
  });

  const token = user.signToken(user._id);

  user.password = undefined;
  user.active = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

// Login
const login = catchAsync(async (req, res, next) => {
  // check if the email or password exist in the body
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  const token = user.signToken(user._id);

  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// Protect
const protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if exist
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) next(new AppError('You are not logged, please login to get access', 401));

  // 2) Verify token
  const { id, iat } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user still exists
  const user = await User.findById(id);
  if (!user) return next(new AppError('The user belonging to this token does no longer exist', 401));

  // Check if user changed password after the token was issued
  if (user.isChangedPasswordAfter(iat))
    return next(new AppError('User recently changed password! Please log in again', 401));

  req.user = user;

  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to perfrom this action', 403));

    next();
  };
};

// Forget Password
const forgotPassword = catchAsync(async (req, res, next) => {
  // check the email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new AppError('There is no user with the email address', 404));

  // Genrete password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // create reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  // create the message
  const message = `Forgot you password? Submit a PATCH request with your new password and password confirm to ${resetURL}.\n if you did not forgot you password, Please ignore this email`;

  // send email
  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 min)`,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent to email!',
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email, try again later', 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1. get and hash the token
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. get the user based on the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  // 3. If token has not expired, and there is user, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.cookie('jwt', JWTtoken, cookieOptions);

  const JWTtoken = user.signToken(user._id);

  res.status(200).json({
    status: 'success',
    token: JWTtoken,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, currentPassword } = req.body;
  // 1. get the user from database
  const user = await User.findById(req.user._id).select('+password');

  // 2. Check if the current password is correct
  if (!(await user.isCorrectPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong'));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  const token = user.signToken(user._id);
  res.cookie('jwt', JWTtoken, cookieOptions);
  res.status(200).json({
    status: 'success',
    token,
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('this route is not for password updates, please use /update-password'));

  // filtering
  const filteredObject = filterObj(req.body, 'email', 'name');

  // update
  const user = await User.findByIdAndUpdate(req.user._id, filteredObject, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// delete me
const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: { user: null },
  });
});

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  resetPassword,
  updateMe,
  forgotPassword,
  updatePassword,
  deleteMe,
};

// POSTMAN ENVIRONMENT VARIABLES
// pm.environment.set('jwt', pm.response.json().token)
