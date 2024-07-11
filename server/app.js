// const mongoose = require("mongoose");
// const express = require("express");
// const helmet = require("helmet");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// const app = express();
// const http = require("http");
// const socketIo = require("socket.io");
// const server = http.createServer(app);
// // origin: "https://farmer-connect-world.vercel.app",
// const corsOptions = {
//   origin: "https://farmer-connect-world.vercel.app",
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "X-Requested-With", "Authorization"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// // Set CORS headers manually
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://farmer-connect-world.vercel.app"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, X-Requested-With, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

// // Handle preflight requests
// app.options("*", (req, res) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://farmer-connect-world.vercel.app"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, X-Requested-With, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(200);
// });
// Helmet configuration
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         "default-src": ["'self'"],
//         "img-src": [
//           "'self'",
//           "data:",
//           "https://farmer-connect-server-application.vercel.app/api",
//         ],
//         "connect-src": ["'self'", "https://farmer-connect-world.vercel.app"],
//       },
//     },
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     hsts: true,
//     xssFilter: true,
//     noSniff: true,
//     frameguard: { action: "deny" },
//   })
// );

// app.use((req, res, next) => {
//   console.log(`Request: ${req.method} ${req.url}`);
//   console.log(`Headers: ${JSON.stringify(req.headers)}`);
//   next();
// });
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const corsOptions = {
  origin: "https://farmer-connect-world.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Requested-With", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Set CORS headers manually
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://farmer-connect-world.vercel.app"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, X-Requested-With, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });
// app.options("*", cors());

// Handle preflight requests explicitly
app.options(corsOptions.origin, (req, res) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://farmer-connect-world.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});
// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: corsOptions.origin,
    methods: corsOptions.methods,
    allowedHeaders: corsOptions.allowedHeaders,
    credentials: corsOptions.credentials,
  },
});

// const io = socketIo(server, {
//   cors: {
//     origin: "https://farmer-connect-world.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
// io.origins((origin, callback) => {
//   if (origin === "https://farmer-connect-world.vercel.app") {
//     callback(null, true);
//   } else {
//     callback("Origin not allowed", false);
//   }
// });
// Middleware to handle JSON and URL-encoded data
app.use(express.json({ limit: "40mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// Database connection
const uri = process.env.DATABASE_ADDRESS;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Import handlers and middlewares
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

// Middleware to authenticate socket connections
io.use(authenticateSocket);

// Handle socket connections
io.on("connection", handleConnection);

// Initialize chat namespace (/chat) with custom handling
initializeChatNamespace(io);

// Log response headers in each route handler
// app.post("/api/signin", (req, res) => {
//   res.json({ key: `Response Headers: ${JSON.stringify(res.getHeaders())}` });
//   // Your route handling logic
// });
// Routes
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

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
