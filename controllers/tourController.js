const moment = require('moment');
const Tour = require('./../models/tourModel');
const QueryBuilder = require('./../util/QueryBuilder');
const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/AppError');
const factory = require('./handlerFactory');

const getAllTours = catchAsync(async (req, res, next) => {
  const queryBuilder = new QueryBuilder(Tour, req.query).filter().sort().select().paginate();
  const tours = await queryBuilder.query;

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
});

const getSingleTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate('reviews');

  if (!tour) return next(new AppError(`No tour found with the ${id}`, 404));

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!tour) return next(new AppError(`No tour found with the ${id}`, 404));

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

const deleteTour = factory.deleteOne(Tour);
// const deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tour.findByIdAndDelete(id);

//   if (!tour) return next(new AppError(`No tour found with the ${id}`, 404));
//   res.status(204).json({
//     status: 'success',
//     data: {
//       tour: null,
//     },
//   });
// });

const topFiveCheapTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,duration,price,ratingsAverage';
  next();
};

// Get tours Statistics
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $facet: {
        // All tours stats
        AllToursStats: [
          {
            $group: {
              _id: null,
              numberOfAllTours: { $sum: 1 },
              toursRatingsAverage: { $avg: '$ratingsAverage' },
              toursMaxRatingsAverage: { $max: '$ratingsAverage' },
              toursMinRatingsAverage: { $min: '$ratingsAverage' },

              toursAvgPriceAverage: { $avg: '$price' },
              toursMaxPriceAverage: { $max: '$price' },
              toursMinPriceAverage: { $min: '$price' },
            },
          },

          {
            $project: {
              numberOfAllTours: '$numberOfAllTours',
              toursRatingsAverage: { $round: '$toursRatingsAverage' },
              toursMaxRatingsAverage: { $round: '$toursMaxRatingsAverage' },
              toursMinRatingsAverage: { $round: '$toursMinRatingsAverage' },

              toursAvgPriceAverage: { $round: '$toursAvgPriceAverage' },
              toursMaxPriceAverage: { $round: '$toursMaxPriceAverage' },
              toursMinPriceAverage: { $round: '$toursMinPriceAverageprice' },
            },
          },
        ],

        //  group of tours stats
        groupOfToursStats: [
          {
            $group: {
              _id: '$difficulty',
              numberOfAllTours: { $sum: 1 },

              toursRatingsAverage: { $avg: '$ratingsAverage' },
              toursMaxRatingsAverage: { $max: '$ratingsAverage' },
              toursMinRatingsAverage: { $min: '$ratingsAverage' },

              toursAvgPriceAverage: { $avg: '$price' },
              toursMaxPriceAverage: { $max: '$price' },
              toursMinPriceAverage: { $min: '$price' },
            },
          },

          {
            $project: {
              toursRatingsAverage: { $round: '$toursRatingsAverage' },
              toursMaxRatingsAverage: { $round: '$toursMaxRatingsAverage' },
              toursMinRatingsAverage: { $round: '$toursMinRatingsAverage' },

              toursAvgPriceAverage: { $round: '$toursAvgPriceAverage' },
              toursMaxPriceAverage: { $round: '$toursMaxPriceAverage' },
              toursMinPriceAverage: { $round: '$toursMinPriceAverageprice' },
            },
          },

          {
            $sort: { toursAvgPriceAverage: 1 },
          },

          {
            $match: { _id: { $ne: 'easy' } },
          },

          {
            $addFields: {
              difficulty: '$_id',
            },
          },

          {
            $project: {
              _id: 0,
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  let plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: {
        month: '$_id',
      },
    },

    {
      $project: { _id: 0 },
    },

    {
      $sort: {
        numToursStats: -1,
      },
    },
    // {
    //   $limit: 5,
    // },
  ]);

  plan = plan.map(doc => {
    doc.month = moment()
      .month(doc.month - 1)
      .format('MMMM');

    return doc;
  });

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  topFiveCheapTours,
  getTourStats,
  getMonthlyPlan,
};
