// Importing Required Libraries
const morgan = require('morgan');
const express = require('express');
const rateLimiter = require('express-rate-limit');

const AppError = require('./util/AppError');
const globalErrorMiddleware = require('./middlewares/globalErrorMiddleware');

// Importing Routing
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

// Creating an Express app
const app = express();

// RATE LIMITER
app.use(
  '/',
  rateLimiter({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many request, Please try again later in an hour',
  })
);

app.use(
  '/api/auth/login',
  rateLimiter({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many request, Please Login again',
  })
);
// JSON parsing
app.use(express.json());

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
app.use(globalErrorMiddleware);

module.exports = app;
