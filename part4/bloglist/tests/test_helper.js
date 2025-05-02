const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Exploring the Depths of Node.js",
    author: "Jane Doe",
    url: "https://example.com/nodejs-guide",
    likes: 42,
  },
  {
    title: "Mastering CSS Grid Layout",
    author: "Chris Coyier",
    url: "https://css-tricks.com/grid-guide",
    likes: 87,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "non existing title",
    author: "non existing author",
    url: "https://anything.anything",
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};
module.exports = { initialBlogs, blogsInDb, nonExistingId, usersInDb };
