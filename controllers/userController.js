const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');

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

const createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      user: '<create new user>',
    },
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: '<update user>',
    },
  });
};

const deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
