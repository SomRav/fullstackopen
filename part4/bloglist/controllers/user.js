const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
    });
    response.json(users);
  } catch (error) {
    next(error);
  }
});
userRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    // validation
    if (username.length < 3 || password.length < 3) {
      let message = "User validation failed:";
      if (username.length < 3 && password.length < 3) {
        message +=
          " username and password are shorter than the minimum allowed length (3).";
      } else if (username.length < 3) {
        message += " username is shorter than the minimum allowed length (3).";
      } else {
        message += " password is shorter than the minimum allowed length (3).";
      }
      return response.status(400).json({ error: message });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
