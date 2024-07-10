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
