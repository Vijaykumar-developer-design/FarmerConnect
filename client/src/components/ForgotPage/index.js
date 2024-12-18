import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BiSolidHide, BiShow } from "react-icons/bi";
import { ApiUrl } from "../Api/api";
import "./index.css";

const ForgotPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobileNum] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const redirectToSignIn = () => {
    history.replace("/signin");
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
    const url = `${ApiUrl}/forgot`;
    const fetchData = async () => {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data, "==>data");
      // console.log(data.jwt_token, "=> token");
      try {
        // console.log(response, "<==");
        if (!response.ok) {
          setError(data.error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          redirectToSignIn();
          // console.log(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    // checking whether an entered number is numeric or not
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
  const updateMobileNum = (e) => {
    setMobileNum(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  // Handle the Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitForm(e);
    }
  };
  return (
    <div className="sign-up-success-bg-forgot">
      <form onSubmit={submitForm} className="form-success-up-forgot">
        <h1 className="farmer-logo">Farmer Connect</h1>
        <div className="input-containers-up-forgot">
          <label
            className="form-success-label-up-forgot"
            htmlFor="mobileupforgot"
          >
            Farmer mobile number
          </label>
          <input
            maxLength={10}
            required
            value={mobile}
            onChange={updateMobileNum}
            placeholder="Enter mobile number...."
            className="form-success-input-up-forgot"
            type="text"
            id="mobileupforgot"
          />
        </div>

        <div className="input-containers-up-forgot">
          <label
            className="form-success-label-up-forgot"
            htmlFor="passwordupforgot"
          >
            Enter new password
          </label>
          <input
            required
            onChange={updatePassword}
            onKeyDown={handleKeyPress}
            value={password}
            placeholder="Enter new password...."
            className="form-success-input-up-forgot"
            type={showPassword ? "text" : "password"}
            id="passwordupforgot"
          />
        </div>
        {showPassword ? (
          <div className="password-show-parent-forgot">
            <BiShow
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon-forgot"
            />
            <span>Hide Password</span>
          </div>
        ) : (
          <div className="password-show-parent-forgot">
            <BiSolidHide
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-icon-forgot"
            />
            <span>Show Password</span>
          </div>
        )}
        {error && <p className="forgot-error">{error}</p>}
        <button className="sign-button-forgot" type="submit">
          Reset Password
        </button>
        <p>
          Go to SignIn ?{" "}
          <span onClick={redirectToSignIn} className="forgot-signin">
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};
export default ForgotPage;
