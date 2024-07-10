// In a separate file (e.g., models/User.js)
const mongoose = require("mongoose");

// schema for out table
const userSchema = new mongoose.Schema({
  userId: { type: String },
  username: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: {
    type: String, // Store image data as binary
  },
  profileImagePublicId: {
    type: String,
  },
  occupationAndDist: { type: String },
  about: { type: String },
  village: { type: String },
  mandal: { type: String },
  district: { type: String },
  state: { type: String },
  vegitables: { type: String },
  millets: { type: String },
  commercial: { type: String },
  otherCrops: { type: String },
  memberDate: { type: String },
  followers: [{ type: String }],
});
const postSchema = new mongoose.Schema({
  userId: { type: String },
  uploadImage: { type: String },
  description: { type: String },
  postLikes: [{ type: String }],
  publicId: { type: String }, //for getting num of likes when fetching data on ui
});

// Define the schema for messages
const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Define the schema for conversation
const conversationSchema = new mongoose.Schema({
  // conversationId: { type: String, required: true, unique: true }, // Custom conversationId field
  participants: [{ type: String }],
  messages: [messageSchema],
});

const UserModel = mongoose.model("FarmUser", userSchema);
const PostModel = mongoose.model("FarmPost", postSchema);
const MessageModel = mongoose.model("FarmMessage", messageSchema);
const ConversationModel = mongoose.model(
  "FarmConversation",
  conversationSchema
);
module.exports = { UserModel, PostModel, MessageModel, ConversationModel };
