const mongoose = require("mongoose");
// const multer = require("multer");
const express = require("express");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const upload = require("./middlewares/multerConfig");
const { postImageUpload } = require("./middlewares/multerConfig");

const app = express();
//chat modules
const socketIo = require("socket.io");
const http = require("http");
const port = process.env.PORT || 5000;
const server = http.createServer(app);

const updateProfileHandler = require("./handlers/updateProfileHandler");
const signUpHandler = require("./handlers/signUpHandler");
const signInHandler = require("./handlers/signInHandler");
const verifyAuthorization = require("./middlewares/authMiddleware");
const forgotPasswordHandler = require("./handlers/forgotPasswordHandler");
const userProfileHandler = require("./handlers/userProfileHandler");
const deleteProfileHandler = require("./handlers/deleteProfileHandler");
const likeUnlikePostHandler = require("./handlers/likeUnlikePostHandler");
const likeDislikePostHandler = require("./handlers/likeDislikePostHandler");
const getPostsHandler = require("./handlers/getPostsHandler");
const deletePostHandler = require("./handlers/deletePostHandler");
const deletePostFromProfileHandler = require("./handlers/deletePostFromProfileHandler");
const getUserProfileHandler = require("./handlers/getUserProfileHandler");
const updateUserProfileHandler = require("./handlers/updateUserProfileHandler");
const deleteUsersChatboxHandler = require("./handlers/deleteUsersChatboxHandler");
const uploadPostHandler = require("./handlers/uploadPostHandler");
const {
  handleConnection,
  authenticateSocket,
  initializeChatNamespace,
} = require("./handlers/chatHandler");

const getChatUsersHandler = require("./handlers/getChatUsersHandler");
// Use the editProfileRoute middleware
// telling to the express that json object included in api request
app.use(express.json({ limit: "40mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// express security
app.use(helmet());
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         "default-src": ["'self'"],
//         "img-src": ["'self'", "data:", "http://localhost:5000"], // Allow image source
//         "connect-src": ["'self'", "http://localhost:3000"], // Allow API calls
//       },
//     },
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   })
// );

// it means if server running in anyport it can take resources from ui hosting port
// but we need to give frontend(react) running host address here
app.use(
  cors({
    origin: "https://farmer-connect-world.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    path: "/api/chat",
    origin: "https://farmer-connect-world.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// console.log("port===>>", process.env.PORT);
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// database connection address
const uri = process.env.DATABSE_ADDRESS || "mongodb://127.0.0.1:27017/farmers";
// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
const secretKey = process.env.SECRET_KEY;
// Serve static files from the "uploads" directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(
//   "/uploads/profiles",
//   express.static(path.join(__dirname, "uploads/profiles"))
// );
// app.use(
//   "/uploads/posts",
//   express.static(path.join(__dirname, "uploads/posts"))
// );

// };
app.post(
  "/api/editprofile",
  verifyAuthorization,
  postImageUpload.single("file"),
  updateProfileHandler
);

// Signin/login
app.post("/api/signin", signInHandler);

// Signup/Register

app.post("/api/signup", signUpHandler);

// forgot password API
app.post("/api/forgot", forgotPasswordHandler);

// socket.ioChat chatting between two users

// Initialize chat namespace

// Middleware to authenticate socket connections

io.use(authenticateSocket);

// Handle socket connections
io.on("connection", handleConnection);

// Initialize chat namespace (/chat) with custom handling
initializeChatNamespace(io);

app.get("/api/profile/:userId", verifyAuthorization, userProfileHandler);

//delete userProfile API

app.delete("/api/profile/:userId", verifyAuthorization, deleteProfileHandler);

// upload post API

app.post(
  "/api/uploadpost",
  verifyAuthorization,
  postImageUpload.single("file"),
  uploadPostHandler
);

// like post from home page API

app.put("/api/home/:id", verifyAuthorization, likeUnlikePostHandler);

// getting all posts details API

app.get("/api/home/:id", verifyAuthorization, getPostsHandler);

// delete specific post from home page API

app.delete("/api/home/:id", verifyAuthorization, deletePostHandler);

// like post in the userprofile API

app.post("/api/userprofile/:id", verifyAuthorization, likeDislikePostHandler);

// delete post from profile API

app.delete(
  "/api/userprofile/:id",
  verifyAuthorization,
  deletePostFromProfileHandler
);

// getting specific userprofile API

app.get("/api/userprofile/:userId", verifyAuthorization, getUserProfileHandler);

// follow/unfollow user profile API

app.put(
  "/api/userprofile/:userId",
  verifyAuthorization,
  updateUserProfileHandler
);

//getting all users

app.get("/api/userschatbox", verifyAuthorization, getChatUsersHandler);
// deleting userChat API
app.delete("/api/userschatbox", verifyAuthorization, deleteUsersChatboxHandler);

// starting server

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// we are exporting only server because server is crated using app on the above
module.exports = server;
