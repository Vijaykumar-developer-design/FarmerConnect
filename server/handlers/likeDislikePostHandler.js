const { PostModel } = require("../models/User");
// const verifyAuthorization = require("./middleware/verifyAuthorization");

const likeDislikePostHandler = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    let post = await PostModel.findOne({ _id: id });

    if (post) {
      const checkUser = post.postLikes.includes(userId);

      if (checkUser) {
        let itemIndex = post.postLikes.indexOf(userId);
        post.postLikes.splice(itemIndex, 1);
        await post.save();
        res.json({ msg: "Successfully Disliked the post" });
      } else {
        post.postLikes.unshift(userId);
        await post.save();
        res.json({ msg: "Successfully Liked the post" });
      }
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error liking/disliking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = likeDislikePostHandler;
