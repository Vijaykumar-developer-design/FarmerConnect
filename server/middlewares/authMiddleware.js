const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const verifyAuthorization = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  jwt.verify(token, secretKey, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      // Attach the decoded payload to the request for further use
      //req.user = payload;

      // Proceed to the next middleware or route handler
      next();
    }
  });
};
module.exports = verifyAuthorization;
