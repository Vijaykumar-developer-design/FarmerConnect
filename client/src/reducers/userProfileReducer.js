const initialState = {
  userProfile: localStorage.getItem("userProfile") || null,
};
const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      localStorage.setItem("userProfile", action.payload);
      return {
        ...state,
        userProfile: action.payload,
      };
    case "UPDATE_USER_PROFILE":
      localStorage.setItem("userProfile", action.payload);
      return {
        ...state,
        userProfile: action.payload,
      };
    default:
      return state;
  }
};
export default userProfileReducer;
