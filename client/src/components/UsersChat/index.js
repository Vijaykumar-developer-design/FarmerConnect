import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoPersonCircle } from "react-icons/io5";
import { ApiUrl } from "../Api/api";
import { setChatUserProfile } from "../../actions/userActions";
import { useDispatch } from "react-redux";
import "./index.css";
const UsersChat = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.user.userId);
  const effectRan = useRef(false);
  const [userSearch, setUserSearch] = useState("");
  const [usersData, setUsersData] = useState([]);
  const fetchData = async () => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userschatbox`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setUsersData(data);
      } else {
        throw new Error("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!effectRan.current) {
      // console.log("Effect applied - only on the FIRST mount");
      fetchData(); // Fetch data only on the first mount
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  const filteredUserData = usersData.filter(
    (each) => each.userId !== activeUser
  );
  const filteredUsers = filteredUserData.filter((eachUser) =>
    eachUser.username
      .toLowerCase()
      .trim()
      .includes(userSearch.toLocaleLowerCase().trim())
  );
  const getUserDetails = (id) => {
    const user = usersData.filter((each) => each.userId === id);
    const { profileImage, username, state, userId } = user[0];
    const newObj = {
      profileImage,
      username,
      state,
      userId,
    };
    dispatch(setChatUserProfile(newObj));
    history.push("/api/chat");
  };

  const fetchApi = async (userId) => {
    const jwt_token = Cookies.get("jwt_token");
    const url = `${ApiUrl}/userschatbox`;
    const userData = { senderId: activeUser, receiverId: userId };
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    try {
      const response = await fetch(url, options);
      // console.log(userData);
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        alert(data.message);
      } else {
        alert(
          "Getting Error while deleting Chat and try again after some time..."
        );
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error while fetching data from the server", error);
    }
  };
  const clearChat = (id) => {
    const confirmDeleteChat = window.confirm(
      "Chat will be deleted on both sides,Are you sure want to DELETE chat, Once the data is deleted can't be recovered"
    );
    if (confirmDeleteChat) {
      fetchApi(id);
    } else {
      return;
    }
  };
  return (
    <div className="user-chat-box-bg">
      <div className="chat-user-search-parent">
        <input
          placeholder="Search User To Chat...."
          onChange={(e) => setUserSearch(e.target.value)}
          className="search-user-chat"
          type="text"
        />
        <button
          className="back-tohome-arrow"
          onClick={() => history.goBack()}
          type="button"
        >
          <TiArrowBackOutline title="Back To Home" />
        </button>
      </div>
      <div className="chats-parent-users">
        {filteredUsers.map((each) => (
          <div className="chatuser-parent" key={each._id}>
            <div
              className="chatuser-profile"
              onClick={() => getUserDetails(each.userId)}
            >
              {each.profileImage === "" ? (
                <IoPersonCircle className="chat-empty-profile" />
              ) : (
                <img
                  className="chat-user-profile-pic"
                  src={each.profileImage}
                  alt={each.username}
                />
              )}

              <h1 className="chat-user-profile-name">{each.username}</h1>
            </div>
            <button
              onClick={() => clearChat(each.userId)}
              className="clear-btn"
              type="button"
            >
              Clear Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UsersChat;
