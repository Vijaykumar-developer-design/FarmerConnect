import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { ApiUrl } from "../Api/api";
import "./index.css";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    username: "",
    password: "",
    profileImage: "",
    profileImagePath: "",
    occupationAndDist: "",
    about: "",
    village: "",
    mandal: "",
    district: "",
    state: "",
    vegitables: "",
    millets: "",
    commercial: "",
    otherCrops: "",
    memberDate: "",
    followers: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const updateName = (e) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleString("default", {
      month: "short",
    })}, ${currentDate.getFullYear()}`;

    setFormData({
      ...formData,
      username: e.target.value,
      memberDate: formattedDate,
    });
  };
  const updateMobileNum = (e) => {
    setFormData({ ...formData, mobile: e.target.value });
  };
  const updatePassword = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const changePath = () => {
    history.replace("/api/signin");
  };
  // checking whether mobile number contains only digits or not
  function isNumeric(str) {
    // Regular expression to match only digits
    const regex = /^\d+$/;

    // Test the string against the regular expression
    return regex.test(str);
  }

  const submitForm = (e) => {
    e.preventDefault();
    const {
      username,
      mobile,
      password,
      profileImage,
      profileImagePath,
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
      followers,
    } = formData;

    const userDetails = {
      userId: uuidv4(),
      username,
      mobile,
      password,
      profileImage,
      profileImagePath,
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
      followers,
    };

    // console.log("details", userDetails);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const url = `${ApiUrl}/signup`;
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log("<==>", response);
        if (!response.ok) {
          setError(data.error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          changePath();
          // console.log(data);
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
  const { mobile, password, username } = formData;
  return (
    <div className="sign-up-success-bg">
      <form onSubmit={submitForm} className="form-success-up">
        <h1 className="farmer-logo">Farmer Connect</h1>
        <div className="input-containers-up">
          <label className="form-success-label-up" htmlFor="nameup">
            Farmer name
          </label>
          <input
            required
            value={username}
            onChange={updateName}
            placeholder="Enter your name...."
            className="form-success-input-up"
            type="text"
            id="nameup"
            autoComplete="username"
          />
        </div>
        <div className="input-containers-up">
          <label className="form-success-label-up" htmlFor="mobileup">
            Farmer mobile number
          </label>
          <input
            required
            maxLength={10}
            value={mobile}
            onChange={updateMobileNum}
            placeholder="Enter mobile number...."
            className="form-success-input-up"
            type="text"
            id="mobileup"
            autoComplete="username"
          />
        </div>

        <div className="input-containers-up">
          <label className="form-success-label-up" htmlFor="passwordup">
            Set Password
          </label>
          <input
            required
            onChange={updatePassword}
            value={password}
            placeholder="Enter password...."
            className="form-success-input-up"
            type={showPassword ? "text" : "password"}
            id="passwordup"
            autoComplete="current-password"
          />
        </div>

        {showPassword ? (
          <div className="password-show-parent">
            <BiShow
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon"
            />
            <span>Hide Password</span>
          </div>
        ) : (
          <div className="password-show-parent">
            <BiSolidHide
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon"
            />
            <span>Show Password</span>
          </div>
        )}

        <button className="sign-up-button" type="submit">
          Sign Up
        </button>
        <p>
          Alreday have an account ?{" "}
          <span onClick={changePath} className="sign-up">
            Sign In
          </span>
        </p>
        <p className="signup-error">{error}</p>
      </form>
    </div>
  );
};
export default SignUpPage;
