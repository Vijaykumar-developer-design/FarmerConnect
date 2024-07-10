const {
  UserModel,
  ConversationModel,
  MessageModel,
  PostModel,
} = require("../models/User");

const deleteProfileHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User Profile Not Found" });
    }

    // Conditions for deleting related data
    const conditionOne = { senderId: userId };

    const conditionTwo = {
      $or: [{ "participants.0": userId }, { "participants.1": userId }],
    };

    // Delete user, related messages, and conversations,posts
    await UserModel.deleteOne({ userId });
    await MessageModel.deleteMany(conditionOne);
    await ConversationModel.deleteOne(conditionTwo);
    await PostModel.deleteMany({ userId });
    // Respond with success message
    return res.json({ message: "Your Profile Deleted Successfully..!" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = deleteProfileHandler;
