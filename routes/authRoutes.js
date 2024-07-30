const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  protect,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
} = require('../controllers/authController');

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);

router.route('/update-password').patch(protect, updatePassword);
router.route('/update-me').patch(protect, updateMe);
router.route('/delete-me').delete(protect, deleteMe);

module.exports = router;
