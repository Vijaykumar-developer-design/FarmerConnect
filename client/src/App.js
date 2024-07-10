import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import ForgotPage from "./components/ForgotPage";
import HomePage from "./components/HomePage";
import Profile from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPost from "./components/Post";
import ChatPage from "./components/ChatPage";
import UsersChat from "./components/UsersChat";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/forgot" component={ForgotPage} />
          <ProtectedRoute exact path="/home/:id" component={HomePage} />
          <ProtectedRoute exact path="/userschatbox" component={UsersChat} />
          <ProtectedRoute exact path="/profile/:userId" component={Profile} />
          <ProtectedRoute exact path="/editprofile" component={EditProfile} />
          <ProtectedRoute exact path="/uploadpost" component={UploadPost} />
          <ProtectedRoute
            exact
            path="/userprofile/:userId"
            component={UserProfile}
          />
          <ProtectedRoute exact path="/chat" component={ChatPage} />

          <Redirect to="/signin" />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
