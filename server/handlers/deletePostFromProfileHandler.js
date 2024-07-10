const { PostModel } = require("../models/User");
// const verifyAuthorization = require("./middleware/verifyAuthorization");

const deletePostFromProfileHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PostModel.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.json({ msg: "Successfully Deleted Your Post" });
    } else {
      res.status(404).json({ msg: "Post Not Found or Already Deleted" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = deletePostFromProfileHandler;
