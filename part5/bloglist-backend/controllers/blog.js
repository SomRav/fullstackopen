const appRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

appRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
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

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };
appRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const body = request.body;
      const user = request.user;

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
      });

      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  }
);

appRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const id = request.params.id;

      const blogToBeDeleted = await Blog.findById(id);
      if (!blogToBeDeleted) {
        return response.status(404).end();
      }

      if (blogToBeDeleted.user.toString() === request.user._id.toString()) {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        deletedBlog ? response.status(204).end() : response.status(404).end();
      } else {
        response.status(403).json({ error: "the user is not authorized" });
      }
    } catch (error) {
      next(error);
    }
  }
);

appRouter.put(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).end();
      }

      const user = request.user;

      if (blog.user.toString() !== user._id.toString()) {
        return response
          .status(403)
          .json({ error: "not authorized to update this blog" });
      }

      // update fields except id and user
      const updates = request.body;
      for (const [key, value] of Object.entries(updates)) {
        if (key !== "id" && key !== "user") {
          blog[key] = value;
        }
      }

      const updatedBlog = await blog.save();
      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = appRouter;

// appRouter.put("/:id", async (request, response, next) => {
//   const changedBlog = request.body;
//   try {
//     const blog = await Blog.findById(request.params.id);
//     if (!blog) {
//       return response.status(404).end();
//     }
//     // updating the changed value except id
//     for (const [key, value] of Object.entries(changedBlog)) {
//       if (key !== "id") {
//         blog[key] = value;
//       }
//     }
//     // saving to db
//     const updatedBlog = await blog.save();
//     response.json(updatedBlog);
//   } catch (error) {
//     next(error);
//   }
// });
