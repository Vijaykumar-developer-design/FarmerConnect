const jwt = require("jsonwebtoken");
const { MessageModel, ConversationModel } = require("../models/User");
const secretKey = process.env.SECRET_KEY;

// Function to authenticate socket connections
const authenticateSocket = function (socket, next) {
  const token = socket.handshake.auth.token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.decoded = decoded;
    next();
  });
};

// Function to handle new socket connections
const handleConnection = async function (socket) {
  const sender = socket.handshake.query.senderId;
  const receiver = socket.handshake.query.receiverId;
  console.log("a user connected", socket.id);

  try {
    const initialMessages = await MessageModel.find({
      $or: [
        { senderId: sender, receiverId: receiver },
        { senderId: receiver, receiverId: sender },
      ],
    });
    socket.emit("initial_messages", initialMessages);
  } catch (err) {
    console.error("Error fetching initial messages:", err);
  }

  socket.on("sent_message", async (messageObject) => {
    try {
      const { message, senderId, receiverId } = messageObject;
      const newMessage = new MessageModel({
        message: message,
        senderId: senderId,
        receiverId: receiverId,
        timestamp: new Date(),
      });

      await newMessage.save();

      let conversation = await ConversationModel.findOne({
        $or: [
          { participants: [senderId, receiverId] },
          { participants: [receiverId, senderId] },
        ],
      });

      if (!conversation) {
        conversation = new ConversationModel({
          participants: [senderId, receiverId],
          messages: [newMessage],
        });
      } else {
        conversation.messages.push(newMessage);
      }

      await conversation.save();

      socket.nsp.emit("receive_message", messageObject);
    } catch (err) {
      console.error("Error saving message to MongoDB:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

// Function to initialize chat namespace
const initializeChatNamespace = function (io) {
  const chatNamespace = io.of("/chat");

  chatNamespace.use(authenticateSocket);
  chatNamespace.on("connection", handleConnection);
};

module.exports = {
  authenticateSocket,
  handleConnection,
  initializeChatNamespace,
};
