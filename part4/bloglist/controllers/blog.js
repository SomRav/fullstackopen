const appRouter = require("express").Router();
const Blog = require("../models/blog");

appRouter.get("/", async (request, response, next) => {
  try {
    const notes = await Blog.find({});
    response.json(notes);
  } catch (error) {
    next(error);
  }
});

appRouter.get("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const blog = await Blog.findById(id);
    blog ? response.json(blog) : response.status(404).end();
  } catch (error) {
    next(error);
  }
});

appRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

appRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    deletedBlog ? response.status(204).end() : response.status(404).end();
  } catch (error) {
    next(error);
  }
});

appRouter.put("/:id", async (request, response, next) => {
  const changedBlog = request.body;
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).end();
    }
    // updating the changed value except id
    for (const [key, value] of Object.entries(changedBlog)) {
      if (key !== "id") {
        blog[key] = value;
      }
    }
    // saving to db
    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});
module.exports = appRouter;
