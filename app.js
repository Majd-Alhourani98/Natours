// Importing Required Libraries
const dotenv = require("dotenv");
const express = require("express");

// Load Environment Variables
dotenv.config();

// Creating an Express app
const app = express();

// Routes Handlers
app.get("/api/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<list of tours>",
    },
  });
});

app.get("/api/tours/:id", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<specified tour>",
    },
  });
});

app.post("/api/tours", (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      tours: "<create new tour>",
    },
  });
});

// Setting the port and starting the server
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
