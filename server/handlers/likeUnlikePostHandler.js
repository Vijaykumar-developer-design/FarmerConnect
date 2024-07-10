const { PostModel } = require("../models/User");

const likeUnlikePostHandler = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    // Find the post by id
    let post = await PostModel.findOne({ _id: id });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const checkUserLiked = post.postLikes.includes(userId);

    if (checkUserLiked) {
      // User has already liked the post, so unlike it
      const userIndex = post.postLikes.indexOf(userId);
      post.postLikes.splice(userIndex, 1);
      await post.save();
      return res.json({ msg: "Successfully Disliked the post" });
    } else {
      // User has not liked the post, so like it
      post.postLikes.unshift(userId);
      await post.save();
      return res.json({ msg: "Successfully Liked the post" });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = likeUnlikePostHandler;
