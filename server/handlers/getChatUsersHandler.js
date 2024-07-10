const { UserModel } = require("../models/User");
const getChatUsersHandler = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = getChatUsersHandler;
