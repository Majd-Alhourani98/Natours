const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
} = require('./../controllers/userController');

const { protect, restrictTo } = require('./../controllers/authController');

router.route('/me').get(protect, getMe, getSingleUser);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
