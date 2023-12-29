import { useState } from "react";

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <li className="blog">
      {blog && (
        <div style={blogStyle} className="">
          <div
            className="basicInfo"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>Title: {blog.title}</div>
            <div>Author: {blog.author}</div>
          </div>
          <button
            className="viewButton"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {visible ? "hide" : "view"}
          </button>
          <div
            style={
              visible
                ? { display: "flex", flexDirection: "column" }
                : { display: "none" }
            }
            className="moreInfo"
          >
            <div style={{ display: "flex" }}>
              <span>likes:</span>
              <span id="likes">{blog.likes}</span>
              <button id="likeButton"
                onClick={() => handleLike({ ...blog, user: blog.user.id })}
              >
                like
              </button>
            </div>
            <div> {blog.url}</div>
            <div>{blog.user.name ?? user.name}</div>

            {blog.user.name === user.name && (
              <button id="deleteButton"
                onClick={() => handleDelete({ ...blog, user: blog.user.id })}
              >
                delete
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export default Blog;
