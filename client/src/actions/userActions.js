// saving chatUser profile

export const setChatUserProfile = (chatUserDetails) => {
  const details = JSON.stringify(chatUserDetails);
  localStorage.setItem("chatUserDetails", details);
  return {
    type: "SET_USER_CHAT_PROFILE",
    payload: details,
  };
};
// saving userId
export const setUserId = (userId) => {
  localStorage.setItem("userId", userId);
  return {
    type: "LOGIN_SUCCESS",
    payload: userId,
  };
};

// Action creator
export const setUserProfile = (userProfile) => {
  // Save user profilepic to local storage
  localStorage.setItem("userProfile", userProfile);

  return {
    type: "SET_USER_PROFILE",
    payload: userProfile,
  };
};
export const updateUserProfile = (userProfile) => {
  // Save profile picture to local storage
  localStorage.setItem("userProfile", userProfile);

  return {
    type: "UPDATE_USER_PROFILE",
    payload: userProfile,
  };
};
