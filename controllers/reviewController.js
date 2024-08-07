const Review = require('./../models/reviewModel');
const AppError = require('./../util/AppError');
const catchAsync = require('./../util/catchAsync');
const factory = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res, next) => {
  // get all reviews
  // get all reviews ==> tour
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
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

const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

const setTourIdUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  setTourIdUserId,
};

// ------------------- CREATE REVIEW -------------------------------
// const createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user._id;

//   const review = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: { review },
//   });
// });

// ------------------- UPDATE REVIEW -------------------------------
// const updateReview = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const review = await Review.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!review) return next(new AppError(`There is no tour with the: ${id}`));

//   res.status(200).json({
//     status: 'success',
//     data: { review },
//   });
// });

// ------------------- DELETE REVIEW -------------------------------
// const deleteReview = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const review = await Review.findByIdAndDelete(id);
//   if (!review) return next(new AppError(`There is no tour with the: ${id}`));
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
