const mongoose = require("mongoose");
const supertest = require("supertest");
// const helper = require("./test_helper");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "test blog",
    author: "John Doe",
    url: "https://www.google.com",
    likes: 57
  },
  {
    title: "test blog",
    author: "John Doe",
    url: "https://www.bing.com",
    likes: 50,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  // await User.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("correct amount of blog posts is returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body.length).toBe(2);
});

test("unique identified property of posts is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;
  expect(blogs[0].id).toBeDefined();
});

test("post request without authorization returns status code 401", async () => {
  const newBlog = {
    title: "test blog",
    author: "John Doe",
    url: "https://www.google.com",
    likes: 60,
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(401);
});

test("user can be created", async () => {
  const usersAtStart = await helper.usersInDb();
  const newUser = {
    username: `user${Math.floor(Math.random() * 10000)}`,
    name: "Admin",
    password: `password${Math.floor(Math.random() * 10000)}`,
  };

  await api.post("/api/users").send(newUser).expect(201);
  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
});

test("user can log in", async () => {
  const user = {
    username: "admin",
    password: "admin",
  };
  const response = await api.post("/api/login").send(user).expect(200);
  expect(response.body.token).toBeDefined();
});

test("a blog can be added if user is logged in", async () => {
  const blogsBefore = await api.get("/api/blogs");
  const n_blogsBefore = blogsBefore.body.length;

  const token = await helper.logInGetToken(api, "admin", "admin");

  const newBlog = {
    title: "test blog",
    author: "John Doe",
    url: "https://www.google.com",
    likes: 57,
  };

  response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfter = await api.get("/api/blogs");
  const n_blogsAfter = blogsAfter.body.length;
  expect(n_blogsAfter - n_blogsBefore).toBe(1);
  const url = blogsAfter.body.map((n) => n.url);
  expect(url).toContain("https://www.google.com");
});

test("defaults to 0 likes if likes property is missing", async () => {
  const token = await helper.logInGetToken(api, "admin", "admin");

  const newBlog = {
    title: "blog without likes",
    author: "John Doe",
    url: "https://www.bing.com",
  };
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(response.body.likes).toBe(0);
});

test("if title property is missing from request body, backend responds with code 400", async () => {
  const token = await helper.logInGetToken(api, "admin", "admin");

  const newBlog = {
    author: "John Doe",
    url: "https://www.bing.com",
    likes: 2,
  };
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(400);
});

test("if url property is missing from request body, backend responds with code 400", async () => {
  const token = await helper.logInGetToken(api, "admin", "admin");
  const newBlog = {
    author: "John Doe",
    title: "bing",
    likes: 2,
  };
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(400);
});

test("blog can be added, and then deleted", async () => {
  const token = await helper.logInGetToken(api, "admin", "admin");

  const blogsBefore = await helper.blogsInDb();

  const newBlog = {
    title: "blog to be deleted",
    author: "John Doe",
    url: "https://www.google.com",
    likes: 44,
  };

  response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogId = response.body.id;

  await api
    .delete(`/api/blogs/${blogId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(blogsBefore.length);

  // const urls = blogsAtEnd.map((r) => r.url);

  // expect(urls).not.toContain(blogToDelete.url);
});

test("number of likes can be updated", async () => {
  const blogs = await helper.blogsInDb();
  const blogToUpdate = blogs[0];
  const updatedBlog = { ...blogToUpdate, likes: 100 };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);
  const newBlog = await api.get(`/api/blogs/${blogToUpdate.id}`).expect(200);

  expect(newBlog.body.likes).toBe(100);
});

test("user can add a blog", async () => {
  const usersAtStart = await helper.usersInDb();
  const user = {
    username: "admin",
    name: "Admin",
    password: "admin",
  };

  // const result =
});

afterAll(async () => {
  await mongoose.connection.close();
});
