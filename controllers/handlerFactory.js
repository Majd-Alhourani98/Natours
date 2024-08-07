const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/AppError');

const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    console.log('delte');
    if (!doc) return next(new AppError(`No ${Model.modelName.toLowerCase()} found with the ${id}`, 404));
    res.status(204).json({
      status: 'success',
      data: {
        doc: null,
      },
    });
  });

module.exports = {
  deleteOne,
};
