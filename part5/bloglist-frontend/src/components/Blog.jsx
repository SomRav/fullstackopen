const Blog = ({ blog }) => (
  <div>
    {blog.title}, by <i>{blog.author}</i>
  </div>
);

export default Blog;
