// Required Dependencies
const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// Initialize Express App and HTTP Server
const app = express();
const server = http.createServer(app);
server.timeout = 30000;
const io = socketIo(server, {
  cors: {
    origin: "https://farmer-connect-world.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "X-Requested-With", "Authorization"],
  },
});

// Middleware: Security and Data Parsing
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "https://farmer-connect-world.vercel.app"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: true,
    xssFilter: true,
    noSniff: true,
    frameguard: { action: "deny" },
  })
);
app.use(express.json({ limit: "40mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: "https://farmer-connect-world.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Database Connection
const uri = process.env.DATABASE_ADDRESS;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Import Handlers and Middlewares
const { postImageUpload } = require("./middlewares/multerConfig");
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

// Configure Socket.IO Authentication and Connection
io.use(authenticateSocket);
io.on("connection", handleConnection);
initializeChatNamespace(io);

// API Routes
app.post(
  "/api/editprofile",
  verifyAuthorization,
  postImageUpload.single("file"),
  updateProfileHandler
);
app.post("/api/signin", signInHandler);
app.post("/api/signup", signUpHandler);
app.post("/api/forgot", forgotPasswordHandler);
app.get("/api/profile/:userId", verifyAuthorization, userProfileHandler);
app.delete("/api/profile/:userId", verifyAuthorization, deleteProfileHandler);
app.post(
  "/api/uploadpost",
  verifyAuthorization,
  postImageUpload.single("file"),
  uploadPostHandler
);
app.put("/api/home/:id", verifyAuthorization, likeUnlikePostHandler);
app.get("/api/home/:id", verifyAuthorization, getPostsHandler);
app.delete("/api/home/:id", verifyAuthorization, deletePostHandler);
app.post("/api/userprofile/:id", verifyAuthorization, likeDislikePostHandler);
app.delete(
  "/api/userprofile/:id",
  verifyAuthorization,
  deletePostFromProfileHandler
);
app.get("/api/userprofile/:userId", verifyAuthorization, getUserProfileHandler);
app.put(
  "/api/userprofile/:userId",
  verifyAuthorization,
  updateUserProfileHandler
);
app.get("/api/userschatbox", verifyAuthorization, getChatUsersHandler);
app.delete("/api/userschatbox", verifyAuthorization, deleteUsersChatboxHandler);

// Start the Server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the App (for Testing/Other Uses)
module.exports = app;
