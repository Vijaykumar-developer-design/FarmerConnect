const { MessageModel, ConversationModel } = require("../models/User");
// const verifyAuthorization = require("./middleware/verifyAuthorization");

const deleteUsersChatboxHandler = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if senderId and receiverId are provided
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ error: "Provide both senderId and receiverId" });
    }

    // Construct conditions to delete messages and conversation
    const conditionOne = {
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };

    // Delete messages
    await MessageModel.deleteMany(conditionOne);

    const conditionTwo = {
      $or: [
        { participants: [senderId, receiverId] },
        { participants: [receiverId, senderId] }, // Also check for the reverse order
      ],
    };

    // Delete conversation
    await ConversationModel.deleteOne(conditionTwo);

    res.json({ message: "User Chats Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting user chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = deleteUsersChatboxHandler;
