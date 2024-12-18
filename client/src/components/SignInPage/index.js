import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUserId, setUserProfile } from "../../actions/userActions";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { ApiUrl } from "../Api/api";
import "./index.css";
const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobileNum] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const redirectToHome = (data) => {
    // saving token for authentication
    Cookies.set("jwt_token", data.jwt_token, { expires: 10 });
    let id = data.userId;
    history.replace(`/home/${id}`);
    dispatch(setUserId(data.userId));
    dispatch(setUserProfile(data.userProfile));
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  const updateMobileNum = (e) => {
    setMobileNum(e.target.value);
  };

  const changePath = () => {
    history.replace("/signup");
  };
  const changeForgot = () => {
    history.replace("/forgot");
  };

  // Helper function to check if a string contains only numbers
  const isNumeric = (str) => /^\d+$/.test(str);

  const submitForm = (e) => {
    e.preventDefault();
    const userDetails = { mobile, password };

    // console.log(userDetails, "details");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const url = `${ApiUrl}/signin`;
    const fetchData = async () => {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data, "==>data");
      // console.log(data.jwt_token, "=> token");
      try {
        // console.log("<==>", response);
        if (response.ok) {
          redirectToHome(data);
          // console.log("userId==>", data.userId);
        } else {
          // console.log(data.error);
          setError(data.error);
          // console.log(data); setError(data.error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (isNumeric(mobile)) {
      if (mobile.length === 10) {
        fetchData();
      } else {
        setError("Mobile number should consist of 10 digits");
      }
    } else {
      setError("Mobile number should contain only numbers");
    }
  };

  // Handle the Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitForm(e);
    }
  };
  return (
    <div className="sign-in-success-bg">
      <form name="signinform" onSubmit={submitForm} className="form-success">
        <h1 className="farmer-logo">Farmer Connect</h1>
        <div className="input-containers">
          <label className="form-success-label" htmlFor="name">
            Farmer mobile number
          </label>
          <input
            required
            maxLength={10}
            value={mobile}
            onChange={updateMobileNum}
            placeholder="Enter mobile number...."
            className="form-success-input"
            type="text"
            id="name"
          />
        </div>
        <div className="input-containers">
          <label className="form-success-label" htmlFor="password">
            Farmer Password
          </label>
          <input
            autoComplete="true"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={updatePassword}
            onKeyDown={handleKeyPress}
            placeholder="Enter your password...."
            className="form-success-input"
            id="password"
          />
        </div>
        <div>
          {showPassword ? (
            <div className="password-show-parent-signin">
              <BiShow
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon-signin"
              />
              <span>Hide Password</span>
            </div>
          ) : (
            <div className="password-show-parent-signin">
              <BiSolidHide
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon-signin"
              />
              <span>Show Password</span>
            </div>
          )}
        </div>
        <button className="sign-in-button" type="submit">
          Sign In
        </button>
        <p>
          Don’t have an account ?{" "}
          <span onClick={changePath} className="sign-up">
            Sign Up
          </span>
        </p>
        <button type="button" onClick={changeForgot} className="forgot-text">
          Forgot password ?
        </button>
        <p className="signin-error">{error}</p>
      </form>
    </div>
  );
};
export default SignInPage;
