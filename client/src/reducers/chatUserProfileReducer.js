const initialState = {
  chatUserProfile: localStorage.getItem("chatUserDetails") || null,
};
const chatUserProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_CHAT_PROFILE":
      localStorage.setItem("chatUserDetails", action.payload);
      return {
        ...state,
        chatUserProfile: action.payload,
      };
    case "UPDATE_USER_CHAT_PROFILE":
      localStorage.setItem("chatUserDetails", action.payload);
      return {
        ...state,
        chatUserProfile: action.payload,
      };
    default:
      return state;
  }
};
export default chatUserProfileReducer;
