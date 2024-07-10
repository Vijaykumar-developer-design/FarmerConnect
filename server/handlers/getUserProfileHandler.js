const { UserModel, PostModel } = require("../models/User");
// const verifyAuthorization = require("./middleware/verifyAuthorization");

const getUserProfileHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user profile
    const user = await UserModel.findOne({ userId: userId });

    if (user) {
      // Retrieve followers
      let followersArray = [];
      for (let i = 0; i < user.followers.length; i++) {
        const follower = await UserModel.findOne({ userId: user.followers[i] });
        followersArray.push(follower);
      }

      // Retrieve posts
      const posts = await PostModel.find({ userId: userId });
      let postDetails = [];
      for (let item of posts) {
        const postUser = await UserModel.findOne({ userId: item.userId });
        if (postUser) {
          let newObj = {
            userLikes: item.postLikes,
            adminId: postUser.userId,
            description: item.description,
            userPostImage: item.uploadImage,
            userId: item.userId,
            id: item._id,
            userState: postUser.state,
            userPic: postUser.profileImage,
            userName: postUser.username,
          };
          postDetails.push(newObj);
        }
      }

      // Respond with user profile, followers, and posts
      res.json({ postDetails, user, followersArray });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getUserProfileHandler;
