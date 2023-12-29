import { useState } from "react";

const BlogForm = ({ addBlog, setMessage, startVisible }) => {
  const [newBlog, setNewBlog] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [visible, setVisible] = useState(startVisible);

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

    setNewBlog("");
    setNewAuthor("");
    setNewUrl("");
    setMessage({ text: "Blog added", type: "success" });
    setTimeout(() => {
      setMessage({ text: null, type: "success" });
    }, 5000);
  };

  return visible ? (
    <div className="flex flex-col gap-4">
      <h2>Create a new blog post</h2>

      <form onSubmit={createBlog} className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-between">
          <span>Title:</span>
          <input
            value={newBlog}
            onChange={handleBlogChange}
            id="titleInput"
            className="bg-gray-100"
          />
        </div>

        <div className="flex flex-row gap-2 justify-between">
          <span>Author:</span>
          <input
            className="bg-gray-100"
            value={newAuthor}
            onChange={handleAuthorChange}
            id="authorInput"
          />
        </div>

        <div className="flex flex-row gap-2 justify-between">
          <span>Url:</span>
          <input
            value={newUrl}
            onChange={handleUrlChange}
            id="urlInput"
            className="bg-gray-100"
          />
        </div>
        <div className="flex flex-row justify-between">
          <button
            type="submit"
            id="saveButton"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
          >
            Save
          </button>
          <button
            onClick={() => setVisible(false)}
            id="cancelButton"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  ) : (
    <button onClick={() => setVisible(true)}>New blog</button>
  );
};

export default BlogForm;
