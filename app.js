// Importing Required Libraries
const morgan = require('morgan');
const express = require('express');

// Importing Routing
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Creating an Express app
const app = express();

// JSON parsing
app.use(express.json());

// Enable logging in the development Environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

// Routes Handlers
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
