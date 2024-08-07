const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  setTourIdUserId,
} = require('./../controllers/reviewController');

const { protect, restrictTo } = require('./../controllers/authController');

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), setTourIdUserId, createReview);
router.route('/:id').get(getSingleReview).patch(updateReview).delete(deleteReview);

module.exports = router;
