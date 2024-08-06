const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require('./../controllers/reviewController');

const { protect, restrictTo } = require('./../controllers/authController');

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), createReview);
router.route('/:id').get(getSingleReview).patch(updateReview).delete(deleteReview);

module.exports = router;
