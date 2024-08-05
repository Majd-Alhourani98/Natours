const express = require('express');
const router = express.Router();

const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require('./../controllers/reviewController');

router.route('/').get(getAllReviews).post(createReview);
router.route('/:id').get(getSingleReview).patch(updateReview).delete(deleteReview);

module.exports = router;
