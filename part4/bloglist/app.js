const express = require("express");
const mongoose = require("mongoose");
const loginRouter = require("./controllers/login");
const userRouter = require("./controllers/user");
const blogRouter = require("./controllers/blog");
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
app.use(middleware.tokenExtractor);
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
