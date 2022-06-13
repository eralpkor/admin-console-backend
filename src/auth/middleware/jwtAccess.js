const jwt = require("jsonwebtoken");
require("dotenv").config();

// generate new token
const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

const checkToken = () => {
  return (req, res, next) => {
    const token = req.headers.authorization;

    token &&
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          res.status(401).json({
            errors: [{ token: "Invalid token, you will need to log back in" }],
          });
        } else {
          req.user = decoded;

          next();
        }
      });
    // no token, no pass
    !token &&
      res
        .status(401)
        .json({ error: "No Token Provided, you will need to Login" });
  };
};

module.exports = {
  generateToken,
  checkToken,
};
