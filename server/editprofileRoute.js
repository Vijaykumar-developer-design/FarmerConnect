// editProfileRoute.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const { UserModel } = require("./models/User");
const verifyAuthorization = require("./middlewares/authMiddleware");
const fs = require("fs");
const router = express.Router();

// Set up Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + path.extname(file.originalname));
    // const uniquePrefix = Date.now() + "_";
    // cb(null, uniquePrefix + file.originalname);
    const originalName = path.parse(file.originalname).name.replace(/\s/g, ""); // Remove spaces from original filename
    const uniquePrefix = Date.now();
    const fileName =
      originalName + "_" + uniquePrefix + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });
if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

router.post(
  "/",
  verifyAuthorization,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { userId } = req.body;
      console.log("userId=>", req.body);
      // Find the user by userId
      const user = await UserModel.findOne({ userId });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Update profile fields if provided
      for (const key in req.body) {
        if (
          req.body[key] !== "" &&
          req.body[key] !== null &&
          req.body[key] !== undefined
        ) {
          user[key] = req.body[key];
        }
      }

      // Save profile image if provided
      if (req.file) {
        user.profileImage = req.file.filename; // Assuming the filename is stored in the user document
        // console.log("Image details:");
        // console.log("Filename:", req.file.filename);
        // console.log("Content type:", req.file.mimetype);
        // console.log("Original filename:", req.file.originalname);
      } else {
        console.log("image not uploaded");
      }

      await user.save();

      res.json({ msg: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating your profile" });
    }
  }
);

module.exports = router;
