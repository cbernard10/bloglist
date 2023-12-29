const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.status(200).json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.status(200).json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const creator = await request.user;
  blog.user = creator._id;

  if (blog.likes === undefined) {
    blog["likes"] = 0;
  }

  if (
    blog.title === undefined ||
    blog.url === undefined ||
    blog.title === "" ||
    blog.url === ""
  ) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();

    creator.blogs = creator.blogs.concat(savedBlog._id);
    await creator.save();

    Blog.findById(savedBlog._id)
      .populate("user", { username: 1, name: 1 })
      .then((savedBlog) => {
        response.status(201).json(savedBlog);
      })
      .catch(error => next(error))

    // response.status(201).json(savedBlog);
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id)
      return response
        .status(401)
        .json({ error: "invalid token, cannot delete blog" });

    const blog = await Blog.findById(request.params.id);

    const creator = blog.user.toString();
    const user = await request.user;
    const userId = user._id.toString();

    if (creator !== userId) {
      return response
        .status(401)
        .json({ error: "invalid user, cannot delete blog" });
    } else {
      try {
        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
      } catch (error) {
        return response.status(400).json({ error: "could not delete blog" });
      }
    }
  }
);

blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate("user", { username: 1, name: 1 })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
