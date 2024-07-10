import { legacy_createStore as createStore, combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import userProfileReducer from "./reducers/userProfileReducer";
import chatUserProfileReducer from "./reducers/chatUserProfileReducer";

const rootReducer = combineReducers({
  user: userReducer,
  uniqueUser: userProfileReducer,
  chatUser: chatUserProfileReducer,
});

const store = createStore(rootReducer);

export default store;
