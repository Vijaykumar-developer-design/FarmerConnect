import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa6";
import "./index.css";

const UserPost = (props) => {
  const { postDetails, getDeleteId, getLikeId } = props;
  let activeUser = useSelector((state) => state.user.userId);
  const {
    // id,
    userPic,
    userName,
    userPostImage,
    description,
    userState,
    userLikes,
  } = postDetails;
  const likes = userLikes;
  const check = userLikes.includes(activeUser);
  const [isLiked, setIsLiked] = useState(check);
  const [showFullText, setTextUpdate] = useState(false);
  const [postLikedBy, setPostLikedBy] = useState(likes);
  const maxLength = 150;
  const toggleShowMore = () => {
    setTextUpdate(!showFullText);
  };

  const deletePost = async (postId) => {
    // Show a confirmation dialog to confirm post deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    // If the user confirms the deletion
    if (confirmDelete) {
      try {
        // Perform the deletion operation
        await getDeleteId(postId);
        // Show an alert to inform the user that the post has been deleted
      } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error("Error deleting post:", error);
        // Optionally, show an error alert to the user
        window.alert("An error occurred while deleting the post");
      }
    }
  };

  const likePost = (id) => {
    // console.log(postLikedBy, "==>");
    const existed = postLikedBy.includes(activeUser);
    if (existed) {
      const newLikedBy = postLikedBy.filter(
        (likedId) => likedId !== activeUser
      );
      setPostLikedBy(newLikedBy);
    } else {
      const newLikedBy = [...postLikedBy, activeUser];
      setPostLikedBy(newLikedBy);
    }
    setIsLiked(!isLiked);
    getLikeId(id);
  };
  return (
    <div className="post-card">
      <div className="post-profile">
        <div className="user-pic-about">
          <div>
            <Link
              to={
                postDetails.userId === activeUser
                  ? `/profile/${activeUser}`
                  : `/userprofile/${postDetails.userId}`
              }
            >
              <img src={userPic} alt={userName} className="post-pic" />
            </Link>
          </div>
          <div className="post-name-state">
            <h4 className="post-user-name">{userName}</h4>
            <span className="user-state">{userState}</span>
          </div>
        </div>
        <div>
          {postDetails.userId === activeUser && (
            <button
              onClick={() => deletePost(postDetails.id)}
              className="detail-delete-btn"
            >
              <RiDeleteBin5Line className="detail-delete-icon" />
            </button>
          )}
        </div>
      </div>
      <hr />
      <img className="user-post-image" src={userPostImage} alt={userName} />
      {showFullText ? (
        <p className="post-description">{description}</p>
      ) : description.length > maxLength ? (
        description.slice(0, maxLength) + "..."
      ) : (
        description
      )}
      {description.length > maxLength && (
        <button className="show-more-btn" onClick={toggleShowMore}>
          {showFullText ? "Show Less" : "Show More"}
        </button>
      )}
      <div className="like-contanier">
        <button onClick={() => likePost(postDetails.id)} className="like-btn">
          {isLiked ? (
            <FcLike className="like-icon" />
          ) : (
            <FaRegHeart className="like-icon" />
          )}
        </button>
        <p className="liked-post">
          {postLikedBy.includes(activeUser) ? (
            postLikedBy.length === 1 ? (
              <span>You liked this post</span>
            ) : (
              <span>
                You and {postLikedBy.length - 1} other
                {postLikedBy.length - 1 > 1 ? " people" : " person"} liked this
                post
              </span>
            )
          ) : (
            <span>
              {postLikedBy.length}{" "}
              {postLikedBy.length === 1 ? "person" : "people"} liked this post
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
export default UserPost;
