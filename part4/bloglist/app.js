const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./controllers/blog");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");

const app = express();

logger.info("Connecting to MongoDB....");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Successfully Connected to DB");
    logger.info("URL", config.MONGODB_URI);
  })
  .catch((error) => {
    logger.error("Failed to connect DB", error.message);
  });

app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/blogs", appRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
