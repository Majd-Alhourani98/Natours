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

// simple nested route
// const { createReview } = require('./../controllers/reviewController');

const reviewsRouter = require('./reviewRoutes');
// /api/tours
router.use('/:tourId/reviews', reviewsRouter);

router.route('/tours-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/top-5-cheap-tours').get(topFiveCheapTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// simple nested route
// POST /tours/23123/reviews
// GET /tours/23123/reviews
// GET /tours/23123/reviews/3213
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

module.exports = router;
