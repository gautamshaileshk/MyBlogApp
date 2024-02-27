import { Link } from "react-router-dom";
import { format } from "date-fns";
const Post = ({ _id,title, content, summary, cover, createdAt, auther }) => {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={"http://localhost:4000/" + cover} alt="error" />
        </Link>
      </div>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author" href="#">
            {auther.username}
          </a>
          <time>{format(new Date(createdAt), "yyyy-MM-dd HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};
export default Post;
