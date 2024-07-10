import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ApiUrl } from "../Api/api";
import { FadeLoader } from "react-spinners";
import "./index.css";
const UploadPost = () => {
  const userId = useSelector((state) => state.user.userId);
  const [apiStatus, setApiStatus] = useState(false);
  const history = useHistory();
  const [file, setFile] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    userId: userId,
    description: "",
  });
  const [isUploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = React.createRef();
  const redirectToHome = () => {
    history.replace(`/api/home/${userId}`);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDescription = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const fetchData = async () => {
    setApiStatus(true);
    const jwtToken = Cookies.get("jwt_token");

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        // "Content-Type": "application/json",
      },
      body: formDataToSend,
    };
    const url = `${ApiUrl}/uploadpost`;
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(response);
      // console.log(data);
      if (response.ok) {
        setApiStatus(false);
        // console.log("Success");
        redirectToHome();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.log("Error while uploading your post", error);
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    if (isUploaded === false) {
      setError("* Please Upload an image file");
    } else {
      setError("");
      fetchData();
    }
  };
  return (
    <div className="upload-post-bg">
      {apiStatus && (
        <div className="loader-overlay">
          <p>Uploading your post...</p>
          <FadeLoader color="white" fontSize={50} />
        </div>
      )}
      <div>
        <Link className="backto-home" to={`/api/home/${userId}`}>
          <LuLogOut className="post-backward" />
        </Link>
      </div>
      <div className="post-details">
        <div className="image-upload">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          {imagePreview ? (
            <div className="upload-preview-parent">
              <img
                src={imagePreview}
                alt="Preview"
                className="upload-preview"
              />
            </div>
          ) : (
            <div className="image-view">Please Upload an Image...</div>
          )}
          <button className="upload-btn" onClick={handleUploadClick}>
            Upload
          </button>
        </div>
        <div className="description-parent">
          <textarea
            value={formData.description}
            onChange={handleDescription}
            rows={15}
            cols={10}
            placeholder="Describe something about your post here..."
            className="upload-description"
          />
        </div>
      </div>
      <div className="upload-post-btn-parent">
        <button onClick={handleUpload} className="upload-post-btn">
          Upload Post
        </button>
        <p className="upload-error">{error}</p>
      </div>
    </div>
  );
};
export default UploadPost;
