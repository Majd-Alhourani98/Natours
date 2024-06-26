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

const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
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
