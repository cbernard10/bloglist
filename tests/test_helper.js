const Blog = require("../models/blog");
const User = require("../models/user");

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const logInGetToken = async (api, username, password) => {
  const response = await api.post("/api/login").send({ username, password });
  return response.body.token;
};

module.exports = {
  blogsInDb,
  usersInDb,
  logInGetToken
};
