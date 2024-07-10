import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import { ApiUrl } from "../Api/api";
import "./index.css";

const DetailedPost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [postDetails, setPostDetails] = useState({});
  const [likesArr, setLikesArr] = useState([]);
  // const userProfile = useSelector((state) => state.uniqueUser.userProfile);
  let activeUser = useSelector((state) => state.user.userId);
  const fetchData = useCallback(async () => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/post/${id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        Accept: "applicaton/json",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log("data=>", data);
      if (response.ok) {
        setPostDetails(data.post);
        setLikesArr(data.post.likes);
      } else {
        console.log("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  const deletePostById = async (id) => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/post/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        Accept: "applicaton/json",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      //   console.log("data=>", data);
      if (response.ok) {
        // setPostDetails(data.post);
        history.replace("/api/home");
      } else {
        console.log("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deletePost = (id) => {
    deletePostById(id);
  };
  const handleLike = async () => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/post/${id}`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userId: activeUser }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log("likedata=>", data.post);
      if (response.ok) {
        fetchData();
        setPostDetails(data.post);
      } else {
        console.log("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="detailed-post-bg">
      <div className="detailed-unique-card">
        <div className="detail-post-card">
          <div className="detail-profile-user">
            <div className="detail-post-profile">
              <Link
                to={
                  postDetails.userId === activeUser
                    ? `/profile/${activeUser}`
                    : `/userprofile/${postDetails.userId}`
                }
              >
                <div>
                  <img
                    src={postDetails.userPic}
                    alt={postDetails.userName}
                    className="detail-post-pic"
                  />
                </div>
              </Link>
              <div className="detail-post-name-state">
                <h4 className="detail-post-user-name">
                  {postDetails.userName}
                </h4>
                <span className="detail-user-state">
                  {postDetails.userState}
                </span>
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
          <img
            className="detail-user-post-image"
            src={postDetails.userPostImage}
            alt={postDetails.userName}
          />

          <p className="detail-post-description">{postDetails.description}</p>
          <hr />
          <div className="like-contanier">
            <button onClick={handleLike} className="like-btn">
              {likesArr.includes(activeUser) ? (
                <FcLike className="like-icon" />
              ) : (
                <FaRegHeart className="like-icon" />
              )}
            </button>
            <p>
              {likesArr.includes(activeUser) ? (
                <span>You and {likesArr.length} people liked this post</span>
              ) : (
                <span>{likesArr.length} people liked this post</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailedPost;
