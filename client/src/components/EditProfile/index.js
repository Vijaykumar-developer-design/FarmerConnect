import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { IoPersonCircle } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../actions/userActions";
import { ApiUrl } from "../Api/api";
import "./index.css";
// import { AiFillPlusCircle } from "react-icons/ai";

const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [file, setFile] = useState("");
  const userId = useSelector((state) => state.user.userId);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    userId: userId,
    username: "",
    presentMobile: "",
    mobile: "",
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
  });
  const [error, setError] = useState("");
  const handleName = (e) => {
    setFormData({ ...formData, username: e.target.value });
  };

  const handlePresentMobile = (e) => {
    setFormData({ ...formData, presentMobile: e.target.value });
  };
  const handleNewMobile = (e) => {
    const newNum = e.target.value;
    setFormData({ ...formData, mobile: newNum });
  };

  const handleOccupationAndDist = (e) => {
    setFormData({ ...formData, occupationAndDist: e.target.value });
  };
  const handleAbout = (e) => {
    setFormData({ ...formData, about: e.target.value });
  };
  const handleVillage = (e) => {
    setFormData({ ...formData, village: e.target.value });
  };
  const handleMandal = (e) => {
    setFormData({ ...formData, mandal: e.target.value });
  };
  const handleDist = (e) => {
    setFormData({ ...formData, district: e.target.value });
  };
  const handleState = (e) => {
    setFormData({ ...formData, state: e.target.value });
  };
  const handleVegitables = (e) => {
    setFormData({ ...formData, vegitables: e.target.value });
  };
  const handleMillets = (e) => {
    setFormData({ ...formData, millets: e.target.value });
  };
  const handleCommercial = (e) => {
    setFormData({ ...formData, commercial: e.target.value });
  };
  const handleOtherCrops = (e) => {
    setFormData({ ...formData, otherCrops: e.target.value });
  };

  //  numeric validation
  function isNumeric(str) {
    // Regular expression to match only digits
    const regex = /^\d+$/;

    // Test the string against the regular expression
    return regex.test(str);
  }
  // saving profile
  const redirectToProfile = (image) => {
    // dispatch(updateMobileNumber(formData.mobile));
    history.replace(`/api/profile/${userId}`);
    dispatch(updateUserProfile(image));
  };

  const goToProfile = (e) => {
    e.preventDefault();
    if (mobile === "") {
      formData.mobile = presentMobile;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    const fetchData = async () => {
      const jwt_token = Cookies.get("jwt_token");
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          // "Content-Type": "multipart/form-data",
        },

        body: formDataToSend,
      };
      const url = `${ApiUrl}/editprofile`;
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log(response);
        // console.log("data=>>", data);
        if (response.ok) {
          redirectToProfile(profileImage);
          // console.log("Profile Updated Successfully");
        } else {
          console.error("Error updating profile:", data.error);
          setError(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // console.log("form=>", formData);
    const checkNum = mobile === "" ? presentMobile : mobile;
    if (isNumeric(presentMobile) && isNumeric(checkNum)) {
      if (presentMobile.length === 10 && checkNum.length === 10) {
        fetchData();
      } else {
        setError("Mobile number should consist of 10 digits");
      }
    } else {
      setError("Mobile number should contain only numbers");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    // console.log(file);
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const {
    username,
    presentMobile,
    mobile,
    profileImage,
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
  } = formData;
  return (
    <form name="userform" onSubmit={goToProfile} className="edit-profile-bg">
      <div className="edit-head">
        <div className="profiles-icon">
          <label className="image-label" htmlFor="profileImage">
            <div className="upload-profile-img">
              {imagePreview ? (
                <img className="profile-pic-edit" src={imagePreview} alt="" />
              ) : (
                <IoPersonCircle fontSize={100} />
              )}
            </div>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {/* <AiFillPlusCircle className="add-image-icon" /> */}
          </label>
        </div>

        <div className="all-inputs">
          <div>
            <ul className="person-details">
              <li>Name :</li>
              <li>Occupation & Dist :</li>
              <li>Present Number :</li>
              <li>New Number :</li>
            </ul>
          </div>
          <div className="input-types">
            <div className="name-input">
              {/* <label className="label-element" htmlFor="profilename">
              Name :{" "}
            </label> */}
              <input
                onChange={handleName}
                value={username}
                id="profilename"
                className="name-occupation-contact"
                type="text"
                placeholder="Enter name...."
              />
            </div>
            <div>
              {/* <label className="label-element" htmlFor="profileoccupation">
              Occupation & Dist :{" "}
            </label> */}
              <input
                onChange={handleOccupationAndDist}
                value={occupationAndDist}
                id="profileoccupation"
                className="name-occupation-contact"
                type="text"
                placeholder="Enter Occupation & Dist...."
              />
            </div>
            <div className="contact-input">
              {/* <label htmlFor="profilecontact">Present Number : </label> */}
              <input
                required
                onChange={handlePresentMobile}
                value={presentMobile}
                maxLength={10}
                id="profilecontact"
                className="name-occupation-contact"
                type="text"
                placeholder="Enter Present number...."
              />
            </div>
            <div>
              {/* <label htmlFor="profilecontact">New Number : </label> */}
              <input
                // required
                onChange={handleNewMobile}
                value={mobile}
                maxLength={10}
                id="profilenumber"
                className="name-occupation-contact"
                type="text"
                placeholder="Enter New number to Update...."
              />
            </div>
          </div>
        </div>
      </div>
      <h1 className="edit-about-head">About</h1>
      <input
        onChange={handleAbout}
        value={about}
        className="edit-about"
        placeholder="Explain in brief...."
        type="text"
        id="about"
      />
      <div className="viilage-mandal-container">
        <div className="village-input">
          <label className="label-edit" htmlFor="village">
            Village :{" "}
          </label>
          <input
            onChange={handleVillage}
            value={village}
            id="village"
            className="village-input-box"
            type="text"
            placeholder="Enter village name...."
          />
        </div>
        <div className="village-input">
          <label className="label-edit" htmlFor="mandal">
            Mandal :{" "}
          </label>
          <input
            onChange={handleMandal}
            value={mandal}
            id="mandal"
            className="mandal-input-box"
            type="text"
            placeholder="Enter mandal name...."
          />
        </div>
        <div className="village-input">
          <label className="label-edit" htmlFor="district">
            District :{" "}
          </label>
          <input
            onChange={handleDist}
            value={district}
            id="district"
            className="mandal-input-box"
            type="text"
            placeholder="Enter district name...."
          />
        </div>
        <div className="village-input">
          <label className="label-edit" htmlFor="state">
            State :{" "}
          </label>
          <input
            onChange={handleState}
            value={state}
            id="state"
            className="mandal-input-box"
            type="text"
            placeholder="Enter state name...."
          />
        </div>
      </div>
      {/* vegitbles section */}
      <div className="all-cultivations">
        <div className="crop-input">
          <label className="label-edit" htmlFor="vegitable">
            Vegitables :{" "}
          </label>
          <textarea
            onChange={handleVegitables}
            value={vegitables}
            cols={5}
            rows={5}
            id="vegitable"
            className="crop-input-box"
            type="text"
            placeholder="Enter vegitables name...."
          ></textarea>
        </div>
        <div className="crop-input">
          <label className="label-edit" htmlFor="millets">
            Millets :{" "}
          </label>
          <textarea
            value={millets}
            onChange={handleMillets}
            cols={5}
            rows={5}
            id="millets"
            className="crop-input-box"
            type="text"
            placeholder="Enter millets name...."
          ></textarea>
        </div>
        <div className="crop-input">
          <label className="label-edit" htmlFor="commercial">
            Commercial :{" "}
          </label>
          <textarea
            value={commercial}
            cols={5}
            rows={5}
            onChange={handleCommercial}
            id="commercial"
            className="crop-input-box"
            type="text"
            placeholder="Enter commercial crops name...."
          ></textarea>
        </div>
        <div className="crop-input">
          <label className="label-edit" htmlFor="other">
            Other :{" "}
          </label>
          <textarea
            value={otherCrops}
            onChange={handleOtherCrops}
            cols={5}
            rows={5}
            id="other"
            className="crop-input-box"
            type="text"
            placeholder="Enter other crops name...."
          ></textarea>
        </div>
      </div>
      <div className="save-btn-container">
        <button className="save-btn" type="submit">
          {" "}
          Save{" "}
        </button>
      </div>
      <p className="error-edit">{error}</p>
    </form>
  );
};
export default EditProfile;
