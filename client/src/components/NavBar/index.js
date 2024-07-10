import { Link, useHistory } from "react-router-dom";
import { BsChatSquareText } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";
import { FaSquarePlus } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import "./index.css";
import { useSelector } from "react-redux";

const Navbar = (props) => {
  const { getUserSearch } = props;
  const profilePicture = useSelector((state) => state.uniqueUser.userProfile);
  const userId = useSelector((state) => state.user.userId);
  const history = useHistory();
  const sendUserName = (e) => {
    getUserSearch(e.target.value);
  };
  const handleChat = () => {
    history.push("/api/userschatbox");
  };
  return (
    <nav className="nav-bg">
      <Link className="nav-profile-link" to={`/api/profile/${userId}`}>
        <div className="nav-profile">
          {profilePicture ? (
            <img
              title="Profile"
              className="nav-profile-pic"
              src={profilePicture}
              alt=""
            />
          ) : (
            <IoPersonCircle className="nav-non-profile" />
          )}
        </div>
      </Link>

      <div className="nav-elements-div">
        <input
          name="usersearch"
          onChange={sendUserName}
          id="userinputsearch"
          className="nav-search"
          type="text"
          placeholder="Search profile here..."
        />
        <Link className="nav-profile-link" to="/api/uploadpost">
          <FaSquarePlus className="add-post-sm" />
          <button className="post-btn" type="button">
            {" "}
            Post
          </button>
        </Link>
        <button onClick={handleChat} className="normal-btn">
          <BsChatSquareText title="Chat Box" className="nav-message-icon" />
          <MdMessage title="Chat Box" className="nav-message-sm" />
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
