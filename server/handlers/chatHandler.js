const { UserModel, PostModel } = require("../models/User");
const userProfileHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user profile excluding password
    const user = await UserModel.findOne({ userId }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Fetch followers details
    let followersArray = [];
    for (let i = 0; i < user.followers.length; i++) {
      const follower = await UserModel.findOne({ userId: user.followers[i] });
      followersArray.push(follower);
    }

    // Fetch user's posts details
    const posts = await PostModel.find({ userId });
    let postDetails = [];
    for (let item of posts) {
      const user = await UserModel.findOne({ userId: item.userId });

      let newObj = {
        userLikes: item.postLikes,
        adminId: user.userId,
        description: item.description,
        userPostImage: item.uploadImage,
        userId: item.userId,
        id: item._id,
        userState: user.state,
        userPic: user.profileImage,
        userName: user.username,
      };
      postDetails.push(newObj);
    }
    // Respond with profile details

    return res.json({ postDetails, user, followersArray });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = userProfileHandler;

// const jwt = require("jsonwebtoken");
// const { MessageModel, ConversationModel } = require("../models/User");
// const secretKey = process.env.SECRET_KEY;

// // Authenticate socket connections
// const authenticateSocket = function (socket, next) {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error("Authentication error: Token missing"));
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return next(new Error("Authentication error: Invalid or expired token"));
//     }
//     socket.decoded = decoded; // Store decoded data for future use
//     next();
//   });
// };

// // Handle new connections
// const handleConnection = async function (socket) {
//   const senderId = socket.handshake.query.senderId;
//   const receiverId = socket.handshake.query.receiverId;

//   if (!senderId || !receiverId) {
//     socket.disconnect(true);
//     console.error("Connection error: Missing senderId or receiverId");
//     return;
//   }

//   console.log("A user connected:", socket.id, { senderId, receiverId });

//   // Join a room for the two participants
//   const roomName = [senderId, receiverId].sort().join("_");
//   socket.join(roomName);

//   try {
//     // Fetch initial messages
//     const initialMessages = await MessageModel.find({
//       $or: [
//         { senderId, receiverId },
//         { senderId: receiverId, receiverId: senderId },
//       ],
//     }).sort({ timestamp: 1 }); // Sort messages by timestamp

//     // Emit initial messages to the client
//     socket.emit("initial_messages", initialMessages);
//   } catch (err) {
//     console.error("Error fetching initial messages:", err);
//   }

//   // Handle message sending
//   socket.on("sent_message", async (messageObject) => {
//     try {
//       const { message, senderId, receiverId } = messageObject;
//       if (!message || !senderId || !receiverId) {
//         return socket.emit("error", { message: "Invalid message object" });
//       }

//       const newMessage = new MessageModel({
//         message,
//         senderId,
//         receiverId,
//         timestamp: new Date(),
//       });

//       await newMessage.save();

//       // Update or create conversation
//       let conversation = await ConversationModel.findOne({
//         $or: [
//           { participants: [senderId, receiverId] },
//           { participants: [receiverId, senderId] },
//         ],
//       });

//       if (!conversation) {
//         conversation = new ConversationModel({
//           participants: [senderId, receiverId],
//           messages: [newMessage],
//         });
//       } else {
//         conversation.messages.push(newMessage);
//       }

//       await conversation.save();

//       // Broadcast the message to the room
//       socket.to(roomName).emit("receive_message", messageObject);
//     } catch (err) {
//       console.error("Error saving message to MongoDB:", err);
//       socket.emit("error", { message: "Failed to send message" });
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// };

// // Initialize chat namespace
// const initializeChatNamespace = function (io) {
//   const chatNamespace = io.of("/chat");

//   chatNamespace.use(authenticateSocket);
//   chatNamespace.on("connection", handleConnection);
// };

// module.exports = {
//   authenticateSocket,
//   handleConnection,
//   initializeChatNamespace,
// };
