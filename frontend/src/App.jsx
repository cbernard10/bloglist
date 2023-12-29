import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type} id="notificationBox">{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [message, setMessage] = useState({ text: null, type: "success" });

  const [blogFormVisible, setBlogFormVisible] = useState(false);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="usernameInput"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="passwordInput"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="loginButton">login</button>
    </form>
  );

  const addBlog = async (blog) => {
    blogService.create(blog).then((res) => {
      setBlogs(blogs.concat(res));
    });
  };

  const blogForm = () => (
    <Togglable
      buttonLabel="new blog"
      visible={blogFormVisible}
      setVisible={setBlogFormVisible}
    >
      <BlogForm
        addBlog={addBlog}
        setBlogFormVisible={setBlogFormVisible}
        setMessage={setMessage}
      />
    </Togglable>
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage({ text: "Wrong credentials", type: "error" });
      setTimeout(() => {
        setMessage({ text: null, type: "success" });
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem("loggedBlogListUser");
      setUser(null);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("could not logout.");
    }
  };

  const handleLike = (blog) => {
    // adds one like to the blog post in the database and updates the state of the blog list
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    console.log(updatedBlog);

    blogService.update(blog.id, updatedBlog).then((res) => {
      console.log(res);
      setBlogs(blogs.map((blog) => (blog.id === res.id ? res : blog)));
    });
  };

  const handleDelete = (blogToDelete) => {
    blogService.remove(blogToDelete.id).then(() => {
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
    });
  };

  return (
    <div>
      <Notification message={message.text} type={message.type} />
      <h2>blogs</h2>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {blogForm()}
          {/* {blogs.map((blog) => (
            <div key={blog.id} style={{display: "flex", gap: "12px" }}>
              <Blog key={blog.id} blog={blog} user={user} />

            </div>
          ))} */}
          <BlogList
            blogs={blogs.sort((a, b) => b.likes - a.likes)}
            user={user}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default App;
