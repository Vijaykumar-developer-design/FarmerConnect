import { useCallback, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import Navbar from "../NavBar";
import { TailSpin } from "react-loader-spinner";
import UserPost from "../UserPost";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../actions/userActions";
import { ApiUrl } from "../Api/api";
import "./index.css";
// import { Link } from "react-router-dom";
const apiStatus = {
  initial: "INITIAL",
  pending: "IN_PROCESS",
  success: "SUCCESS",
  failure: "FAILURE",
};
const HomePage = () => {
  const [apiState, setApiState] = useState(apiStatus.initial);
  const effectRan = useRef(false);
  const [postDetails, setPostDetails] = useState([]);
  const [userSearch, updateSearch] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  const fetchApi = useCallback(async () => {
    setApiState(apiStatus.pending);
    try {
      const jwtToken = Cookies.get("jwt_token");
      const url = `${ApiUrl}/home/${userId}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log("==>", response);
      if (response.ok) {
        // console.log("posts==>", data);
        const items = data.posts;
        const userDetails = data.activeUser[0];
        dispatch(updateUserProfile(userDetails.profileImage));
        setPostDetails(items);
        setApiState(apiStatus.success);
      } else {
        setApiState(apiStatus.failure);
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error while getting data", error);
    }
  }, [userId, dispatch]);
  useEffect(() => {
    if (!effectRan.current) {
      // console.log("Effect applied - only on the FIRST mount");
      fetchApi(); // Fetch data only on the first mount
    }

    return () => {
      effectRan.current = true;
    };
  }, [fetchApi]);

  const getUserSearch = (value) => {
    updateSearch(value);
  };
  const deletePostById = async (id) => {
    try {
      const jwt_token = Cookies.get("jwt_token");
      const url = `${ApiUrl}/home/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          Accept: "applicaton/json",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      //   console.log("data=>", data);
      if (response.ok) {
        const filteredData = postDetails.filter((post) => post.id !== id);
        setPostDetails(filteredData);
      } else {
        throw new Error(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error while deleting post:", error);
      throw error;
    }
  };
  const handleLike = async (id) => {
    try {
      const jwt_token = Cookies.get("jwt_token");
      const url = `${ApiUrl}/home/${id}`;
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({ userId: userId }),
      };
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
  };
  const getDeleteId = (id) => {
    deletePostById(id);
  };
  const filteredData = postDetails.filter((user) =>
    user.userName.toLowerCase().includes(userSearch.toLowerCase())
  );

  const renderPosts = () => (
    <div className="posts-parent">
      {filteredData.length <= 0 ? (
        <p>There is no Posts to show.. </p>
      ) : (
        filteredData.map((each) => (
          <UserPost
            key={each.id}
            postDetails={each}
            getDeleteId={getDeleteId}
            getLikeId={getLikeId}
          />
        ))
      )}
    </div>
  );
  const renderLoader = () => (
    <div className="loader-container">
      <TailSpin width={50} height={50} color="blue" />
    </div>
  );
  const failureView = () => (
    <div className="failure-parent">
      <h1>Gettigng Error while fetching data....</h1>
      <p className="failure-msg">Please try after sometime...</p>
    </div>
  );
  const renderComponents = () => {
    switch (apiState) {
      case apiStatus.pending:
        return renderLoader();
      case apiStatus.failure:
        return failureView();
      case apiStatus.success:
        return renderPosts();
      default:
        return;
    }
  };

  return (
    <div>
      <Navbar getUserSearch={getUserSearch} />
      <div className="homepage-bg">{renderComponents()}</div>
    </div>
  );
};
export default HomePage;
