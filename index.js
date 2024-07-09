const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jobRoutes = require("./route/job");

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected successfully"))
  .catch((err) => console.log("Error connecting database", err));

// Middlewares
app.use(express.json());

function authorized(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
  next();
}

function logger(req, res, next) {
  console.log("Request METHOD", req.method);
  console.log("Request received at", new Date());
  next();
}

app.use(logger);

// Routes
app.use("/api/jobs", authorized, jobRoutes);


function errorMiddleware(err, req, res, next) {
  console.log(err);
  return res.status(req.statusCode || 500).json({
    success: false,
    code: req.statusCode || 500,
    message: err.message,
  });
}

app.use(errorMiddleware);


app.listen(process.env.PORT, () => console.log(`Server is up and running at port ${process.env.PORT}`));