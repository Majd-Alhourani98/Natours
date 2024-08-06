const Review = require('./../models/reviewModel');
const AppError = require('./../util/AppError');
const catchAsync = require('./../util/catchAsync');

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    data: { reviews },
  });
});

const getSingleReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) return next(new AppError(`There is no tour with the: ${id}`));

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) return next(new AppError(`There is no tour with the: ${id}`));

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);

  if (!review) return next(new AppError(`There is no tour with the: ${id}`));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
};
