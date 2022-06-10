const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if (err) {
        res
          .status(401)
          .json({ message: "Invalid Token, you will need to Log back in" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ error: "No Token Provided, you will need to Login!" });
  }
};
