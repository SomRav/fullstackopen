const appRouter = require("express").Router();
const Blog = require("../models/blog");

appRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((error) => next(error));
});

appRouter.post("/", (request, response, next) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

module.exports = appRouter;
