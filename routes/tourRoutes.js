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
} = require('./../controllers/tourController');

router.route('/tours-stats').get(getTourStats);
router.route('/top-5-cheap-tours').get(topFiveCheapTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
