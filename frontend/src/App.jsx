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

  return (
    <div className={type} id="notificationBox">
      {message}
    </div>
  );
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
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-fit">
      <div className="flex flex-row gap-4 items-center justify-between">
        <span>Username</span>
        <input
          className="p-1"
          id="usernameInput"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div className="flex flex-row gap-4 items-center justify-between">
        <span>Password</span>
        <input
          className="p-1"
          id="passwordInput"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button
        type="submit"
        id="loginButton"
        className="rounded-lg bg-blue-600 text-white border-4 border-transparent w-fit px-6 py-2 self-end active:bg-blue-800 active:border-blue-800 active:translate-y-[1px] hover:border-blue-700"
      >
        Login
      </button>
    </form>
  );

  const addBlog = async (blog) => {
    blogService.create(blog).then((res) => {
      setBlogs(blogs.concat(res));
    });
  };

  const blogForm = () => (
    <BlogForm addBlog={addBlog} startHidden={true} setMessage={setMessage} />
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
    <div className="flex flex-col gap-12 p-12 mx-auto max-w-[1000px]">
      <Notification message={message.text} type={message.type} />
      <h2 className="text-5xl font-bold">Blogs</h2>
      {!user && loginForm()}
      {user && (
        <div className="flex flex-col gap-12">
          <div className="flex flex-row gap-4 items-start">
            <p>
              <span className="font-bold">{user.name}</span> logged in.
            </p>
            <button
              onClick={handleLogout}
              className="hover:underline text-red-600"
            >
              Logout
            </button>

            {blogForm()}
          </div>
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
