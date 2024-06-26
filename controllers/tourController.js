const Tour = require('./../models/tourModel');

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: '<list of tours>',
    },
  });
};

const getSingleTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<specified tour>',
    },
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      tour: '<create new tour>',
    },
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<update tour>',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
