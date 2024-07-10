const { UserModel } = require("../models/User");
// const verifyAuthorization = require("./middleware/verifyAuthorization");

const updateUserProfileHandler = async (req, res) => {
  const { userId } = req.params; // User ID of the user to follow/unfollow
  const { uniqueId } = req.body; // User ID of the currently logged-in user

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "Provide a valid user ID" });
    }

    // Find the user profile based on userId
    const user = await UserModel.findOne({ userId: userId });
    const followingUser = await UserModel.findOne({ userId: uniqueId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the logged-in user is already following the target user
    const isFollowing = user.followers.includes(uniqueId);

    // Toggle follow/unfollow based on current status
    if (isFollowing) {
      // If already following, unfollow
      const index = user.followers.indexOf(uniqueId);
      user.followers.splice(index, 1);
      await user.save();
      res.json({
        msg: "Successfully Unfollowed the user",
        data: followingUser,
      });
    } else {
      // If not following, follow
      user.followers.unshift(uniqueId);
      await user.save();
      res.json({
        msg: "Successfully Followed the user",
        data: followingUser,
      });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateUserProfileHandler;
