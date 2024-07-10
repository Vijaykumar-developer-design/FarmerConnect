const { PostModel, UserModel } = require("../models/User");

const getPostsHandler = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("userId", id);
    const activeUser = await UserModel.find({ userId: id });
    // console.log(user);
    // Fetch all posts
    // const posts = await PostModel.find({});
    const posts = await PostModel.find({}).sort({ _id: -1 }).exec();
    // Extract all userIds from posts
    const userIds = posts.map((post) => post.userId);
    // console.log("usersIds=>", userIds);
    // Fetch users corresponding to userIds, array of objects(all users obj)
    const users = await UserModel.find({ userId: { $in: userIds } });
    // console.log("users=>", users);
    // Create a map of userId to user object for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user.userId] = user; // adding userObj data to the userId
      return acc; // returning userObj to the userMap
    }, {});
    // console.log("userMap=>", userMap);
    // Construct postDetails array
    const postDetails = posts.map((item) => {
      const user = userMap[item.userId]; // Retrieve user from userMap
      // console.log("mapuser=>", user);
      // Construct postDetails object with all fields, even if some are null
      return {
        adminId: user.userId,
        description: item.description,
        userPostImage: item.uploadImage,
        userId: item.userId,
        id: item._id,
        userState: user.state,
        userPic: user.profileImage,
        userName: user.username,
        userLikes: item.postLikes,
      };
    });

    // Respond with postDetails array
    res.json({ activeUser, posts: postDetails });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getPostsHandler;

// const { PostModel, UserModel } = require("../models/User");
// // const verifyAuthorization = require("./middleware/verifyAuthorization");

// const getPostsHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("homeroute=>", id);
//     const posts = await PostModel.find({});
//     let postDetails = [];

//     for (let item of posts) {
//       const user = await UserModel.findOne({ userId: item.userId });

//       if (user) {
//         let newObj = {
//           adminId: user.userId,
//           description: item.description,
//           userPostImage: item.uploadImage,
//           userId: item.userId,
//           id: item._id,
//           userState: user.state,
//           userPic: user.profileImagePath,
//           userName: user.username,
//           userLikes: item.postLikes,
//         };
//         postDetails.unshift(newObj); // Add new object to the beginning of the array
//       } else {
//         return postDetails; // This line might need to be adjusted based on the logic you intend
//       }
//     }
//     res.json({ postDetails, msg: "hellop" });
//     // res.json({ posts: postDetails }); // Respond with the post details
//   } catch (error) {
//     console.error("Error retrieving posts:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// module.exports = getPostsHandler;
