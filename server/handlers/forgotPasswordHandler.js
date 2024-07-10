const { UserModel } = require("../models/User");
const bcrypt = require("bcrypt");

const forgotPasswordHandler = async (req, res) => {
  try {
    const { mobile, newPassword } = req.body;

    // Check if the user exists
    const existingUser = await UserModel.findOne({ mobile });

    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the new password with the existing one
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.password
    );

    if (isSamePassword) {
      return res.status(400).json({ error: "Enter a different password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    existingUser.password = hashedPassword;
    await existingUser.save();

    // Respond with success message
    return res.json({ success: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = forgotPasswordHandler;
