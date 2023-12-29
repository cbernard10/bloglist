import Blog from "./Blog";
import PropTypes from "prop-types";

function BlogList({ blogs, user, handleLike, handleDelete }) {
  return (
    <ul className="flex flex-row gap-4">
      {blogs.map((blog) => (
        <div key={blog.id} style={{ display: "flex", gap: "12px" }}>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        </div>
      ))}
    </ul>
  );
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default BlogList;
