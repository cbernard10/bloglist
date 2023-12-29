import { useState } from "react";

const BlogForm = ({
  addBlog, setBlogFormVisible, setMessage
}) => {
  const [newBlog, setNewBlog] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const handleBlogChange = (event) => {
    console.log(event.target.value);
    setNewBlog(event.target.value);
  };

  const handleAuthorChange = (event) => {
    console.log(event.target.value);
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    console.log(event.target.value);
    setNewUrl(event.target.value);
  };


  const createBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog,
      author: newAuthor,
      url: newUrl,
    };

    addBlog(blogObject);

    setBlogFormVisible(false);
    setNewBlog("");
    setNewAuthor("");
    setNewUrl("");
    setMessage({ text: "Blog added", type: "success" });
    setTimeout(() => {
      setMessage({ text: null, type: "success" });
    }, 5000);

  };

  return (
    <div>
      <h2>Create a new blog post</h2>

      <form onSubmit={createBlog}>
        <div>
          <span>title:</span>
          <input value={newBlog} onChange={handleBlogChange} id="titleInput"/>
        </div>

        <div>
          <span>author:</span>
          <input value={newAuthor} onChange={handleAuthorChange} id="authorInput"/>
        </div>

        <div>
          <span>url:</span>
          <input value={newUrl} onChange={handleUrlChange} id="urlInput"/>
        </div>
        <button type="submit" id="saveButton">save</button>
      </form>
    </div>
  );
};

export default BlogForm;
