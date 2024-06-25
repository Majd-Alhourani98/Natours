// Importing Required Libraries
const dotenv = require("dotenv");
const express = require("express");

// Importing Routing
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// Load Environment Variables
dotenv.config();

// Creating an Express app
const app = express();

// Routes Handlers
app.use("/api/tours", tourRouter);
app.use("/api/users", userRouter);

// Setting the port and starting the server
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
