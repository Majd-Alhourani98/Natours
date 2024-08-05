const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal then 40 characters'],
      minLength: [10, 'A tour name must have more or equal then 10 chrachtrers'],
      match: [/^[a-zA-Z\s]+$/, 'Name must contain only spaces and alphabetic characters'],
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        // enum just works on strings
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], // just on number and date
      max: [5, 'Rating must be below 5.0'], // just on number and date
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        // the this keyword is only gonna point to the current document when we are creating a new document
        // so this function here is NOT going to work on update
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount price {VALUE} should be below the regular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a description'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    startDates: [Date],
    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    // refrencing -- Embedding
    // guides: Array,

    //  child referncing with user collection
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// calculate duration in weeks
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration ? Number((this.duration / 7).toFixed(2)) : undefined;
});

// calculate the price in KWD
tourSchema.virtual('priceInKWD').get(function () {
  return this.price ? Number((this.price / 3.2).toFixed(2)) : undefined;
});

// Document Middleware: add slug
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware: exclude secret Tours from Query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Pre Query Middleware to populate users
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -role',
  });

  next();
});

// Aggregation Middleware: exclude secret tours from the aggregation
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Review Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// get the user an put there info inside the tour based on the id
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id).select('name email role'));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post(/^find/, async function (docs, next) {
//   const guidesPromises = docs.guides.map(async id => await User.findById(id));
//   console.log(guidesPromises);
//   docs.guides = await Promise.all(guidesPromises);
//   next();
// });
