const router = require("express").Router();
require("dotenv").config();
const HashFactor = parseInt(process.env.HASH) || 8;
const validateNewUser = require("./validNewUser");
const validateLogin = require("./validLoginUser");
const bcrypt = require("bcryptjs");
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");

// GET display all of the users
// IMPORTANT IMPLEMENT SECURITY
router.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      // res.status(200).json({ users: users });
      res.status(200).json({ users });
      console.log("All users ", users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot get users..." });
    });
});

// GET filter-search user ie: "/filter?username=jatinder or ?id=2"
//http://localhost:5000?city=Metropolis&age=21
router.get("/filter", (req, res, next) => {
  const filters = req.query;
  console.log("filtered user ", filters);

  Users.findBy(filters)
    .then((user) => {
      if (user.length > 0) {
        console.log("We found user", user);
        res.status(200).json({ user: user });
      } else {
        res.status(404).json({ message: "User does not exist..." });
        console.log("No user");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: `internal server error ${err}` });
    });
});

// GET display single user by id
router.get("user/:id", (req, res) => {
  const id = req.params.id;

  Users.getUser(id)
    .then((user) => {
      console.log("By id ", user);
      if (user) {
        res.status(200).json({ user: user });
      } else {
        res.status(400).json({ message: "Cannot find user in database..." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to get user..." });
    });
});

// POST /auth/register register new user - FUNCTIONAL
router.post("/register", validateNewUser, (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, HashFactor);
  user.password = hash;
  console.log("New user body object ", user);
  Users.addUser(user)
    .then((newUser) => {
      console.log("NEW user register object ", newUser);
      const token = jwt.generateToken(newUser);
      res.status(201).json({
        message: `Welcome ${newUser.username}, your account is created.`,
        user: newUser,
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// validateLogin
// POST /api/auth/login login user - FUNCTIONAL
router.post("/authenticate", validateLogin, (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then((u) => {
      if (u && bcrypt.compareSync(password, u.password)) {
        const token = jwt.generateToken(u);

        res.status(200).json({
          message: `Welcome back ${u.username}`,
          user: u.username,
          token,
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
        });
      } else {
        console.log("Wrong creds.");
        res.status(401).json({ message: `Wrong login credentials.` });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/auth/update Edit user information - FUNCTIONAL
router.put("/update", jwt.checkToken(), (req, res) => {
  const userId = req.user.subject;
  const changes = req.body;

  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }

  Users.findById(userId)
    .then((u) => {
      if (u.id === userId) {
        if (changes.password) {
          const hash = bcrypt.hashSync(changes.password, HashFactor);
          changes.password = hash;
        }
        Users.editById(userId, changes)
          .then((user) => {
            res.status(200).json({
              message: `${Object.keys(changes)} updated successfully`,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({ error: err });
          });
      } else {
        res.status(404).json({
          message: `The server can not find requested resource. User id: ${id}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
