import { useCallback, useEffect, useState, useRef } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { TailSpin } from "react-loader-spinner";
import { IoPersonCircle } from "react-icons/io5";
import Cookies from "js-cookie";
import UserPost from "../UserPost";
import { ApiUrl } from "../Api/api";
import "./index.css";
const apiStatus = {
  initial: "INITIAL",
  success: "SUCCESS",
  pending: "PENDING",
  failure: "FAILURE",
  deleteProfile: "DELETE",
};
const Profile = () => {
  const effectRan = useRef(false);
  const [apiState, setApiState] = useState(apiStatus.initial);
  const [profileData, setProfile] = useState({});
  const [userFollowersArr, setUserFollowersArr] = useState([]);
  const [userUploads, setUserUploads] = useState([]);
  const [postTab, updateTab] = useState("");

  const history = useHistory();
  const { userId } = useParams();
  const [deleteMessage, setDeleteMessage] = useState("");

  const onLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.clear();
    history.replace("/signin");
  };
  const goToEditProfile = () => {
    history.replace("/editprofile");
  };

  const fetchData = useCallback(async () => {
    setApiState(apiStatus.pending);
    const jwt_token = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    };
    const url = `${ApiUrl}/profile/${userId}`;

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(response);
      if (response.ok) {
        setApiState(apiStatus.success);
        // console.log("profiledata==>", data);
        const user = data.user;
        // console.log("users==>", user);
        setProfile({ ...user });
        setUserFollowersArr(data.followersArray);
        setUserUploads(data.postDetails);
      } else {
        setApiState(apiStatus.failure);
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network error, e.g., display error message to the user
    }
  }, [userId]);
  useEffect(() => {
    if (!effectRan.current) {
      // console.log("Effect applied - only on the FIRST mount");
      fetchData(); // Fetch data only on the first mount
    }

    return () => {
      effectRan.current = true;
    };
  }, [fetchData]);

  const handleLike = async (id) => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userprofile/${id}`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userId: userId }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log("likedata=>", data.post);
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
    // console.log("iserpost", id);
  };
  const deletePostById = async (id) => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userprofile/${id}`;
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
        const filteredData = userUploads.filter((post) => post.id !== id);
        setUserUploads(filteredData);
      } else {
        console.log("Error while fetching data", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDeleteId = (id) => {
    deletePostById(id);
  };

  const deleteProfileComponent = () => {
    // console.log(deleteMessage);

    return (
      <div className="delete-profile-parent">
        <h1>{deleteMessage}</h1>
      </div>
    );
  };
  const deleteProfileApi = async (id) => {
    const url = `${ApiUrl}/profile/${id}`;
    const jwt_token = Cookies.get("jwt_token");
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        // console.log(data.message);
        setDeleteMessage(data.message);
        setApiState(apiStatus.deleteProfile);
        setTimeout(() => {
          // Redirect to login page
          history.replace("/signin");
        }, 3000);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error while fetching data", error);
    }
  };
  const deleteProfile = (id) => {
    const confirmDelete = window.confirm(
      "Are You Sure Want To Delete Your Profile..?"
    );
    if (confirmDelete) {
      deleteProfileApi(id);
    } else {
      return;
    }
  };
  const {
    username,
    mobile,
    profileImage,
    occupationAndDist,
    about,
    village,
    mandal,
    district,
    state,
    vegitables,
    millets,
    commercial,
    otherCrops,
    memberDate,
  } = profileData;

  const renderFollowers = () => {
    return (
      <div className="profile-followers-parent-bg">
        {userFollowersArr.length <= 0 ? (
          <p>You don't have followers yet..</p>
        ) : (
          <div className="profile-followers-bg">
            {userFollowersArr.map((each) => (
              <Link
                key={each.userId}
                className="profile-follower-link"
                to={`/userprofile/${each.userId}`}
              >
                <div className="profile-follower-parent" key={each.userId}>
                  {each.profileImage ? (
                    <img
                      className="profile-follower-pic"
                      src={each.profileImage}
                      alt={each.username}
                    />
                  ) : (
                    <IoPersonCircle fontSize={80} />
                  )}
                  <div className="profile-follower-name-state">
                    <h4 className="profile-follower-name">{each.username}</h4>
                    <p className="profile-follower-state">{each.state}</p>
                    <p className="profile-follower-member">
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

  const renderPosts = () => {
    return (
      <div className="profile-user-post-details-list">
        {userUploads.length <= 0 ? (
          <p>Please Upload Your Posts....</p>
        ) : (
          userUploads.map((each) => (
            <div key={each.id} className="profile-user-post-details">
              <UserPost
                postDetails={each}
                getLikeId={getLikeId}
                getDeleteId={getDeleteId}
              />
            </div>
          ))
        )}
      </div>
    );
  };
  const renderDetails = () => {
    switch (postTab) {
      case "":
        return renderBioData();
      case "Posts":
        return renderPosts();
      case "Followers":
        return renderFollowers();
      default:
        break;
    }
  };

  const renderUserDetails = () => {
    return (
      <>
        <div className="profile-head">
          <div className="profile-text">
            <Link to={`/home/${userId}`} className="profile-pic">
              {profileImage ? (
                <img className="profile-image" src={profileImage} alt="" />
              ) : (
                <IoPersonCircle fontSize={80} />
              )}
            </Link>
            <div>
              <h4 className="profile-user-name">{username}</h4>
              <p className="intro">{occupationAndDist} India</p>
              <p className="intro">Contact Number : {mobile}</p>
            </div>
          </div>
          <div className="delete-logout-btns-parent">
            <button
              onClick={() => deleteProfile(userId)}
              className="delete-profile-btn"
            >
              Delete Profile
            </button>
            <div className="logout-div">
              <button onClick={onLogout} className="logout-btn" type="button">
                {" "}
                Logout
              </button>
              <LuLogOut className="logout-icon" />
            </div>
          </div>
        </div>
        <hr className="hr-line" />
        <h1 className="about-head">About</h1>
        <p className="brief-intro">{about}</p>
        <p className="member-text">Farmer Connect, Member since {memberDate}</p>
        <div className="buttons-container">
          <button onClick={handlePosts} className="btns" type="button">
            Posts
          </button>

          <button onClick={handleFollowers} className="btns" type="button">
            Followers
          </button>
          <button onClick={goToEditProfile} className="btns" type="button">
            Edit Profile
          </button>
        </div>
        {renderDetails()}
      </>
    );
  };
  const renderBioData = () => (
    <div>
      <p>
        <span className="highlight-text">Occupation : Farmer</span>
      </p>
      <p className="highlight-text">
        Village : <span className="address">{village}</span>
      </p>
      <p className="highlight-text">
        Mandal: <span className="address">{mandal}</span>
      </p>
      <p className="highlight-text">
        District : <span className="address">{district}</span>
      </p>
      <p className="highlight-text">
        State : <span className="address">{state}</span>
      </p>
      <p className="cultivation-head">
        Cultivation Crops :{" "}
        <span className="cultivations">
          {vegitables}-{millets}-{commercial}-{otherCrops}
        </span>
      </p>
      <p className="highlight-text">
        Vegitables : <span className="address">{vegitables}</span>
      </p>
      <p className="highlight-text">
        Millets : <span className="address">{millets}</span>
      </p>
      <p className="highlight-text">
        Commercial : <span className="address">{commercial}</span>
      </p>
      <p className="highlight-text">
        Other Crops : <span className="address">{otherCrops}</span>
      </p>
    </div>
  );

  const handlePosts = () => {
    updateTab("Posts");
  };
  const handleFollowers = () => {
    updateTab("Followers");
  };
  const renderLoader = () => (
    <div className="profile-loader-container">
      <TailSpin width={50} height={50} color="blue" />
    </div>
  );
  const failureView = () => (
    <div className="profile-failure-parent">
      <h1>Gettigng Error while fetching Your profile....</h1>
      <p className="profile-failure-msg">Please try after sometime...</p>
    </div>
  );
  const renderComponent = () => {
    switch (apiState) {
      case apiStatus.pending:
        return renderLoader();
      case apiStatus.success:
        return renderUserDetails();
      case apiStatus.failure:
        return failureView();
      case apiStatus.deleteProfile:
        return deleteProfileComponent();
      default:
        return;
    }
  };

  return <div className="profile-bg">{renderComponent()}</div>;
};
export default Profile;
