const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../models/tourModel');

dotenv.config();

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'tours.json'), 'utf-8'));
// DATABASE CONNECTION
const MONGODB_URL = process.env.DATABASE_ATLAS_URL.replace('<PASSWORD>', process.env.DATABASE_ATLAS_PASSWORD);
// const MONGODB_URL = process.env.DATABASE_LOCAL_URL;
mongoose
  .connect(MONGODB_URL)
  .then(con => console.log('DATABASE CONNECTED'))
  .catch(err => console.log(err.message));
const importData = async () => {
  await Tour.create(tours);
  console.log('Data imported successfully');
  process.exit();
};
const deleteData = async () => {
  await Tour.deleteMany();
  console.log('database deleted successfully');
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
