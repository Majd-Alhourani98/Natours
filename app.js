// Importing Required Libraries

const express = require('express');

// Importing Routing
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Creating an Express app
const app = express();

// Routes Handlers
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

module.exports = app;
