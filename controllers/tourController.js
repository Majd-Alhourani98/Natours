const moment = require('moment');
const Tour = require('./../models/tourModel');
const QueryBuilder = require('./../util/QueryBuilder');
const getAllTours = async (req, res) => {
  try {
    const queryBuilder = new QueryBuilder(Tour, req.query).filter().sort().select().paginate();
    const tours = await queryBuilder.query;

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: { tours },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
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

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const topFiveCheapTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,duration,price,ratingsAverage';
  next();
};

// Get tours Statistics
const getTourStats = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',

      message: err,
    });
  }
};

const getMonthlyPlan = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',

      message: err,
    });
  }
};

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
