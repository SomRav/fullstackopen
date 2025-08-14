import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import { use } from "react";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setURL] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const loginForm = () => {
    return (
      <div>
        <h1>Login To BlogList</h1>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      const backendMessage =
        error.response?.data?.error || "Something went wrong";

      setNotification({ message: backendMessage, type: "error" });
      setUsername("");
      setPassword("");
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };

  const addNewBlogForm = () => {
    return (
      <div>
        <h1>Add A New Blog</h1>
        <form onSubmit={handleAddNewBLog}>
          <div>
            title:
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setURL(target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    );
  };

  const handleAddNewBLog = async (event) => {
    event.preventDefault();
    console.log("adding a new blog", title, author, url);

    try {
      const newBlog = {
        title,
        author,
        url,
      };

      const addedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(addedBlog));
      setTitle("");
      setAuthor("");
      setURL("");

      setNotification({
        message: `A new blog ${addedBlog.title} by ${addedBlog.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);

      //.....
    } catch (error) {
      const backendMessage =
        error.response?.data?.error || "Something went wrong";

      setNotification({ message: backendMessage, type: "error" });
      setTitle("");
      setAuthor("");
      setURL("");

      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 5000);
    }
  };

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {user ? (
        // if looged in

        <>
          <h2>blogs</h2>
          <p>
            {user.username} is logged in.{" "}
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem("loggedAppUser");
                setUser(null);
              }}
            >
              Logout
            </button>
          </p>
          {addNewBlogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      ) : (
        // if not logged in

        loginForm()
      )}
    </div>
  );
};

export default App;
