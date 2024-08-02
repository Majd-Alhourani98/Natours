// Importing Required Libraries
const morgan = require('morgan');
const express = require('express');

const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');

const AppError = require('./util/AppError');

// Importing Routing
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

// Creating an Express app
const app = express();

// set security HTTP headers
app.use(helmet());

// RATE LIMITER
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many request, Please try again later in an hour',
});

app.use('/api', limiter);

// Rate limiter for login
const loginLimiter = rateLimiter({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests, Please Login again in an hour',
});

app.use('/api/auth/login', loginLimiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// DATA sanitization
app.use(xss());

// Enable logging in the development Environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

// Routes Handlers
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// Global Error Handling Middlware
app.use(globalErrorHandler);

module.exports = app;
