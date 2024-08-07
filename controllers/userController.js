const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const factory = require('./handlerFactory');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

const getSingleUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: '<specified user>',
    },
  });
};

const createUser = factory.createOne(User);
// do not use to update the passwords
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
