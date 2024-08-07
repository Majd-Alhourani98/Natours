const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const factory = require('./handlerFactory');

const getAllUsers = factory.getAll(User);
const getSingleUser = factory.getOne(User);
const createUser = factory.createOne(User);
// do not use to update the passwords
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
};
