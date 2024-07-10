const path = require("path");
const fs = require("fs");
const { UserModel } = require("../models/User");
const cloudinary = require("../middlewares/cloudinaryConfig");

const updateProfileHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    let userUploadPicUrl;

    // Find the user by userId
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Upload the new profile image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "uploads/profiles" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });

        userUploadPicUrl = result.secure_url;

        // Remove previous profile image from Cloudinary if it exists
        if (user.profileImage) {
          try {
            await cloudinary.uploader.destroy(user.profileImagePublicId);
          } catch (cloudinaryError) {
            console.error(
              "Error removing previous image from Cloudinary:",
              cloudinaryError
            );
          }
        }

        user.profileImage = userUploadPicUrl;
        user.profileImagePublicId = result.public_id;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
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

    await user.save();

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Error updating profile");
  }
};

module.exports = updateProfileHandler;

// for static file serving
// const path = require("path");
// const fs = require("fs");
// const { UserModel } = require("../models/User");
// const updateProfileHandler = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     // console.log("profileDetails=>", req.body);
//     const profileImage = req.file ? req.file.filename : undefined;
//     const userUploadPicUrl = profileImage
//       ? `${req.protocol}://${req.get("host")}/uploads/profiles/${profileImage}`
//       : undefined;
//     // const userUploadPicUrl = profileImage
//     //   ? `${req.protocol}://${req.get("host")}/uploads/${profileImage}`
//     //   : undefined;
//     // Find the user by userId
//     const user = await UserModel.findOne({ userId });

//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     // Update profile fields if provided
//     for (const key in req.body) {
//       if (
//         req.body[key] !== "" &&
//         req.body[key] !== null &&
//         req.body[key] !== undefined
//       ) {
//         user[key] = req.body[key];
//       }
//     }

//     // Save profile image if provided
//     if (req.file) {
//       // Remove previous profile image if it exists
//       if (user.profileImage) {
//         const previousImagePath = path.join(
//           __dirname,
//           "../uploads/profiles",
//           user.profileImage
//         );
//         if (fs.existsSync(previousImagePath)) {
//           fs.unlinkSync(previousImagePath);
//         }
//       }
//       user.profileImage = profileImage;
//       user.profileImagePath = userUploadPicUrl; // Assuming the filename is stored in the user document
//       // console.log("Image details:");
//       // console.log("Filename:", req.file.filename);
//       // console.log("Content type:", req.file.mimetype);
//       // console.log("Original filename:", req.file.originalname);
//     } else {
//       // res.json({ msg: "image not uploaded" });
//       console.log("image not uploaded");
//     }

//     await user.save();

//     res.json({ msg: "Profile updated successfully" });
//   } catch (err) {
//     res.status(500).send("Error updating profile");
//   }
// };

// module.exports = updateProfileHandler;
