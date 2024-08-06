const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  topFiveCheapTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController');

const { protect, restrictTo } = require('./../controllers/authController');

const { createReview } = require('./../controllers/reviewController');

router.route('/tours-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/top-5-cheap-tours').get(topFiveCheapTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// POST /tours/23123/reviews
// GET /tours/23123/reviews
// GET /tours/23123/reviews/3213

router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

module.exports = router;
