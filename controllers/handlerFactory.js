const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/AppError');
const QueryBuilder = require('./../util/QueryBuilder');

// Delete document
const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) return next(new AppError(`No ${Model.modelName.toLowerCase()} found with the ${id}`, 404));
    res.status(204).json({
      status: 'success',
      data: {
        doc: null,
      },
    });
  });

// update document
const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!doc) return next(new AppError(`No ${Model.modelName.toLowerCase()} found with the ${id}`, 404));

    res.status(200).json({
      status: 'success',
      data: {
        [Model.modelName.toLowerCase()]: doc,
      },
    });
  });

const createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      [Model.modelName.toLowerCase()]: doc,
    });
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);
    if (populateOptions) query = Model.findById(id).populate(populateOptions);
    const doc = await query;

    if (!doc) return next(new AppError(`No ${Model.modelName.toLowerCase()} found with the ${id}`, 404));

    res.status(200).json({
      status: 'success',
      data: { [Model.modelName.toLowerCase()]: doc },
    });
  });

const getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const queryBuilder = new QueryBuilder(Model.find(filter), req.query).filter().sort().select().paginate();
    const docs = await queryBuilder.query;

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: { [Model.modelName.toLowerCase() + 's']: docs },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
