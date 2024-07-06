const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

// Load Environment Variables
dotenv.config();

// DATABASE CONNECTION
const MONGODB_URL = process.env.DATABASE_ATLAS_URL.replace('<PASSWORD>', process.env.DATABASE_ATLAS_PASSWORD);
// const MONGODB_URL = process.env.DATABASE_LOCAL_URL;
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('DATABASE CONNECTED'))
  .catch(err => console.error('DATABASE CONNECTION ERROR:', err));

// Event listeners for Mongoose connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose successfully connected');
});

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('close', () => {
  console.log('Mongoose connection closed');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing Mongoose connection:', err);
    process.exit(1);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
