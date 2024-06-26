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
  .then(con => console.log('DATABASE CONNECTED'))
  .catch(err => console.log(err.message));

// Setting the port and starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
