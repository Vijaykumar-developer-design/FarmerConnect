const multer = require("multer");

// Store files in memory for quick upload to Cloudinary
const postImageStorage = multer.memoryStorage();

const postImageUpload = multer({
  storage: postImageStorage,
  limits: { fileSize: 40 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"), false); // Reject the file
    }
  },
});

module.exports = {
  postImageUpload,
};
// for static file serving using local uploads file
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// // For profile images
// const profileImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/profiles/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     const filename = `${path.basename(
//       file.originalname,
//       ext
//     )}-${uniqueSuffix}${ext}`;
//     cb(null, filename);
//   },
// });

// const profileImageUpload = multer({ storage: profileImageStorage });

// // For post images
// const postImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/posts/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     const filename = `${path.basename(
//       file.originalname,
//       ext
//     )}-${uniqueSuffix}${ext}`;
//     cb(null, filename);
//   },
// });

// const postImageUpload = multer({ storage: postImageStorage });

// module.exports = {
//   profileImageUpload,
//   postImageUpload,
// };
