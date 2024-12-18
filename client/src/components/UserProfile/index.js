import { useEffect, useCallback, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import UserPost from "../UserPost";
import Cookies from "js-cookie";
import { IoPersonCircle } from "react-icons/io5";
import { ApiUrl } from "../Api/api";
import { setChatUserProfile } from "../../actions/userActions";
import "./index.css";
const apiStatus = {
  initial: "INITIAL",
  success: "SUCCESS",
  pending: "PENDING",
  failure: "FAILURE",
};
const UserProfile = () => {
  const effectRan = useRef(true);
  const [apiState, setApiState] = useState(apiStatus.initial);
  const activeUser = useSelector((state) => state.user.userId);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [postTab, updateTab] = useState("Posts");
  const [userUploads, setUserUploads] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowersArr, setUserFollowersArr] = useState([]);
  const fetchData = useCallback(async () => {
    setApiState(apiStatus.pending);
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userprofile/${userId}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        console.log("userprofile=>", data);
        setApiState(apiStatus.success);
        // console.log("success");
        setUserUploads(data.postDetails);
        // console.log(data);
        setUserDetails(data.user);
        setUserFollowers(data.user.followers); // array containing ids of the followers only
        setUserFollowersArr(data.followersArray); // array containing objects of the followers who will follow
      } else {
        setApiState(apiStatus.failure);
        throw new Error("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  }, [userId]);

  useEffect(() => {
    console.log("userId from URL:", userId); // Log the userId when the component mounts or userId changes
    fetchData(); // Fetch data whenever userId changes
  }, [userId, fetchData]);

  // useEffect(() => {
  //   if (!effectRan.current) {
  //     console.log("userId from URL:", userId);
  //     // console.log("Effect applied - only on the FIRST mount");
  //     fetchData(); // Fetch data only on the first mount
  //     effectRan.current = false;
  //   }
  //   // unmounting of the component
  //   return () => {
  //     effectRan.current = false;
  //   };
  // }, [userId, fetchData]);

  const {
    username,
    mobile,
    profileImage,
    about,
    state,
    vegitables,
    millets,
    commercial,
    memberDate,
  } = userDetails;
  const handleLike = async (id) => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userprofile/${id}`;
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
      // console.log("likedata=>", response);
      if (response.ok) {
        return;
      } else {
        console.log("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getLikeId = (id) => {
    handleLike(id);
  };

  const handleFollow = async () => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userprofile/${userId}`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ uniqueId: activeUser }),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        const checkFollower = userFollowers.includes(activeUser);
        if (checkFollower) {
          const filterFollower = userFollowers.filter(
            (follwer) => follwer !== activeUser
          );
          setUserFollowers(filterFollower);
          const filteredArr = userFollowersArr.filter(
            (follower) => follower.userId !== activeUser
          );
          setUserFollowersArr(filteredArr);
        } else {
          setUserFollowers([...userFollowers, activeUser]);
          userFollowersArr.unshift(data.data);
        }
      } else {
        console.log("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePosts = () => {
    updateTab("Posts");
  };
  const handleFollowers = () => {
    updateTab("Follow");
  };
  const handleFollwing = () => {
    handleFollow();
  };
  const handleMessage = () => {
    const newObj = {
      profileImage,
      username,
      state,
      userId,
    };
    dispatch(setChatUserProfile(newObj));
  };

  const renderPosts = () => {
    return (
      <div className="user-post-details-list">
        {userUploads.length <= 0 ? (
          <p>User has not posted anything yet...</p>
        ) : (
          userUploads.map((each) => (
            <div key={each.id} className="user-post-details">
              <UserPost postDetails={each} getLikeId={getLikeId} />
            </div>
          ))
        )}
      </div>
    );
  };
  const renderFollowers = () => {
    return (
      <div className="followers-parent-bg">
        {userFollowersArr.length <= 0 ? (
          <p>You don't have followers yet..</p>
        ) : (
          <div className="followers-bg">
            {userFollowersArr.map((each) => (
              <Link
                key={each.userId}
                className="follower-link"
                to={
                  each.userId === activeUser
                    ? `/profile/${activeUser}`
                    : `/userprofile/${each.userId}`
                }
              >
                <div className="follower-parent">
                  <img
                    className="follower-pic"
                    src={each.profileImage}
                    alt={each.username}
                  />
                  <div className="follower-name-state">
                    <h4 className="follower-name">{each.username}</h4>
                    <p className="follower-state">{each.state}</p>
                    <p className="follower-member">
                      Former Connect member since {each.memberDate}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };
  const renderLoader = () => (
    <div className="userprofile-loader-container">
      <TailSpin width={50} height={50} color="blue" />
    </div>
  );
  const failureView = () => (
    <div className="userprofile-failure-parent">
      <h1>Gettigng Error while fetching Your profile....</h1>
      <p className="userprofile-failure-msg">Please try after sometime...</p>
    </div>
  );

  const renderUserDetails = () => {
    const following = userFollowers.includes(activeUser);
    return (
      <>
        <div className="user-profile-parent">
          {profileImage ? (
            <img
              className="user-profile-image"
              src={profileImage}
              alt={username}
            />
          ) : (
            <IoPersonCircle className="user-profile-non-img" />
          )}

          <div>
            <h4 className="user-name">{username}</h4>
            <p className="userprofile-state">{state}</p>
            <p className="user-contact">Contact :- {mobile}</p>
            <p className="user-connect">
              Farmer Connect member since {memberDate}
            </p>
          </div>
        </div>
        <hr />
        <h4 className="user-about-text">About</h4>
        {about === "" ? (
          <p className="user-about">Say about yourself in brief......</p>
        ) : (
          <p className="user-about">{about}</p>
        )}

        <p className="user-about-text">
          Cultivation Crops :- {vegitables} {millets} {commercial}
        </p>
        <div className="user-buttons-parent">
          <button
            onClick={handleFollwing}
            className={following ? "change-color-follow" : "user-btn-follow"}
          >
            {following ? "Following" : "Follow"}
          </button>
          <button
            onClick={handlePosts}
            className={postTab === "Posts" ? "user-btn" : "change-color"}
          >
            Posts
          </button>
          <button
            onClick={handleFollowers}
            className={postTab === "Follow" ? "user-btn" : "change-color"}
          >
            Followers
          </button>
          <Link to="/chat">
            <button onClick={handleMessage} className="change-color">
              Message
            </button>
          </Link>
        </div>
        {postTab === "Posts" ? renderPosts() : renderFollowers()}
      </>
    );
  };
  const renderComponent = () => {
    switch (apiState) {
      case apiStatus.pending:
        return renderLoader();
      case apiStatus.success:
        return renderUserDetails();
      case apiStatus.failure:
        return failureView();
      default:
        return;
    }
  };
  return <div className="user-bg">{renderComponent()}</div>;
};
export default UserProfile;
