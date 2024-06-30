const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../models/tourModel');

dotenv.config();

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'tours-simple.json'), 'utf-8'));

const DATABASE_URL = `${process.env.DATABASE_MONGODB_URL}/${process.env.DATABASE_MOGNODB_NAME}`;
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('CONNECTED TO DATABSE'))
  .catch(() => console.log('CONNECTION TO DATABASE FAILE 😈'));

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
