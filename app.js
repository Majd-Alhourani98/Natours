// Importing Required Libraries
const dotenv = require("dotenv");
const express = require("express");

// Load Environment Variables
dotenv.config();

// Creating an Express app
const app = express();

// Routes Handlers

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<list of tours>",
    },
  });
};

const getSingleTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<specified tour>",
    },
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      tour: "<create new tour>",
    },
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<update tour>",
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: {
      tour: null,
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      users: "<list of users>",
    },
  });
};
const getSingleUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "<specified user>",
    },
  });
};
const createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      user: "<create new user>",
    },
  });
};
const updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "<update user>",
    },
  });
};
const deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: {
      user: null,
    },
  });
};

const userRouter = express.Router();
const tourRouter = express.Router();

app.use("/api/tours", tourRouter);
app.use("/api/users", userRouter);

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter
  .route("/:id")
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter
  .route("/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

// Setting the port and starting the server
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
