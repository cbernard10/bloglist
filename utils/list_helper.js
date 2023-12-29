const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.map((blog) => blog.likes).reduce((curr, acc) => curr + acc, 0);
};

const favoriteBlog = (blogs) => {
  let argmax = 0;
  let max = blogs[argmax].likes;
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      argmax = i;
      max = blogs[i].likes;
    }
  }
  return blogs[argmax];
};

const mostBlogs = (blogs) => {
  const [author, nblogs] = _.maxBy(
    Object.entries(_.countBy(blogs, (blog) => blog.author))
  );
  return { author, blogs: nblogs };
};

const mostLikes = (blogs) => {
  const author = _.maxBy(blogs, (blog) => blog.likes).author;

  const blogsFromAuthor = blogs.filter(blog => blog.author === author)
  const likes = blogsFromAuthor.map(blog => blog.likes).reduce((acc, curr) => acc+curr, 0)

  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
