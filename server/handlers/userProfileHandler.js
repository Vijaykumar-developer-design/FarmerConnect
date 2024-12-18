const { UserModel, PostModel } = require("../models/User");

const userProfileHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user profile excluding password
    const user = await UserModel.findOne({ userId }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Fetch all followers at once
    const followersArray = await UserModel.find({
      userId: { $in: user.followers },
    }).select("-password");

    // Fetch user's posts and join with user data using aggregation
    const posts = await PostModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "users", // The collection where user details are stored
          localField: "userId",
          foreignField: "userId",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" }, // Unwind to get the user data
      {
        $project: {
          userLikes: "$postLikes",
          adminId: "$userDetails.userId",
          description: "$description",
          userPostImage: "$uploadImage",
          userId: "$userId",
          id: "$_id",
          userState: "$userDetails.state",
          userPic: "$userDetails.profileImage",
          userName: "$userDetails.username",
        },
      },
    ]);

    const postDetails = posts.map((item) => ({
      userLikes: item.userLikes,
      adminId: item.adminId,
      description: item.description,
      userPostImage: item.userPostImage,
      userId: item.userId,
      id: item.id,
      userState: item.userState,
      userPic: item.userPic,
      userName: item.userName,
    }));

    // Respond with the profile details
    return res.json({ postDetails, user, followersArray });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = userProfileHandler;
