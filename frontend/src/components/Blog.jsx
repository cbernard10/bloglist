import { useState } from "react";

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false);

  return (
    <li className="blog p-4 border-gray-100 border-2 drop-shadow-xl rounded-lg ">
      {blog && (
        <div className="flex flex-col gap-2">
          <div
            className="basicInfo"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className="font-bold text-2xl">{blog.title}</div>
            <div className="text-sm text-gray-800">{blog.author}</div>
          </div>
          <button
            className="viewButton text-xs text-black hover:text-blue-700 self-start font-medium"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {visible ? "Collapse" : "Expand"}
          </button>
          <div
            style={
              visible
                ? { display: "flex", flexDirection: "column" }
                : { display: "none" }
            }
            className="moreInfo"
          >
            <div style={{ display: "flex" }} className="flex flex-row gap-1">
              <button
                id="likeButton"
                className="hover:text-red-500"
                onClick={() => handleLike({ ...blog, user: blog.user.id })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
              <span id="likes">{blog.likes}</span>
            </div>

            <a href={blog.url} className="text-blue-500 hover:underline">{blog.url}</a>

            <div className="flex flex-row justify-between pt-2">
              <div className="text-gray-700 text-xs">
                {blog.user.name ?? user.name}
              </div>
              {blog.user.name === user.name && (
                <button
                  id="deleteButton"
                  className="hover:text-red-500 text-xs"
                  onClick={() => handleDelete({ ...blog, user: blog.user.id })}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default Blog;
