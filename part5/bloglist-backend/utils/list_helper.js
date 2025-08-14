// const dummy = (blogs) => {
//   return blogs ? 1 : 1;
// };
const dummy = (blogs) => (blogs ? 1 : 1);

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => {
        return sum + blog.likes;
      }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((favBlog, blog) => {
    return blog.likes > favBlog.likes ? blog : favBlog;
  });
};

const mostBlogs = (blogs) => {
  const blogCountByAuthor = {};
  for (const blog of blogs) {
    const author = blog.author;
    blogCountByAuthor[author] = (blogCountByAuthor[author] || 0) + 1;
  }

  let topAuthor = null;
  let maxBlog = 0;

  for (const author in blogCountByAuthor) {
    if (blogCountByAuthor[author] > maxBlog) {
      topAuthor = author;
      maxBlog = blogCountByAuthor[author];
    }
  }
  return {
    author: topAuthor,
    blogs: maxBlog,
  };
};

const mostLikes = (blogs) => {
  const likesCountForAuthor = {};

  for (const blog of blogs) {
    likesCountForAuthor[blog.author] =
      (likesCountForAuthor[blog.author] || 0) + blog.likes;
  }

  let topAuthor = null;
  let maxLikes = 0;

  for (const author in likesCountForAuthor) {
    if (likesCountForAuthor[author] > maxLikes) {
      maxLikes = likesCountForAuthor[author];
      topAuthor = author;
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
