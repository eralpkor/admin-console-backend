const Users = require("./auth-model");

module.exports = async (req, res, next) => {
  const errors = [];
  const user = req.body;

  function validateLogin(user) {
    const u = req.body;

    !u.username && errors.push({ username: "required" });
    !u.password && errors.push({ password: "required" });

    Object.keys(user).map((x) => {
      if (x === "username" || x === "password") {
        const key = u[x].length;
        //Verify Length Min
        if (key < 4 && x) {
          errors.push({ [x]: "Must be a minimum of 5 chars" });
        }
        //Verifiy Length Max
        if (key > 50 && x) {
          errors.push({ [x]: "Must be a maximum of 50 chars" });
        }
      } else {
        errors.push({ error: `Unexpected key: [${x}] provide` });
      }
    });
  }

  if (!errors.length) {
    req.user = await Users.findByName(user.username);
  }

  validateLogin(user);

  errors.length < 1 ? next() : res.status(401).json({ errors: errors });
};
