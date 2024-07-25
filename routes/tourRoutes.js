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

const { protect } = require('./../controllers/authController');

router.route('/tours-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/top-5-cheap-tours').get(topFiveCheapTours, getAllTours);
router.route('/').get(protect, getAllTours).post(createTour);

router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
