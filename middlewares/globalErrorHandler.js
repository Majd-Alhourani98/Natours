const AppError = require('../util/AppError');

// Database errors
const handleCastErrorDB = err => new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateFieldsDB = err => new AppError(`${Object.values(err.keyValue)[0]} already exist`, 400);
const handleVlidationErrorDB = err => {
  const errorObjects = Object.values(err.errors).map(error => {
    return { [error.path]: error.message };
  });

  return new AppError(JSON.stringify(errorObjects), 400);
};

// JSON WEB TOKEN ERRORS
const handleJWTError = () => new AppError('Invalid token, please login again', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again', 401);

// Send Error during development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Send Error during production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleVlidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
