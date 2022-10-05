const router = require("express").Router();
require("dotenv").config();
const HashFactor = parseInt(process.env.HASH) || 8;
const validateNewUser = require("./validNewUser");
const validateLogin = require("./validLoginUser");
const bcrypt = require("bcryptjs");
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Helpers = require("./middleware/helpers");
const authenticate = require("../auth/middleware/auth-middleware");

// POST /api/auth/login login user - FUNCTIONAL
router.post("/authenticate", validateLogin, async (req, res) => {
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
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
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
// POST /auth/register create new user - FUNCTIONAL
router.post("/user", validateNewUser, async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, HashFactor);
  user.password = hash;

  Users.addUser(user)
    .then((newUser) => {
      const token = jwt.generateToken(newUser);
      res.status(201).json(newUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// http://localhost:5000/api/users?filter={"id":[7]}
// http://localhost:5000/api/users?filter={}&range=[0,9]&sort=["id","ASC"]
// GET display all of the users
router.get("/user", jwt.checkToken(), async (req, res, next) => {
  let columnName, order, columnId, id, startIndex, endIndex;
  // const token = req.headers.authorization;
  // const userToken = jwt.checkToken();
  // console.log(userToken);
  // if (userToken.role === "USER") {
  //   res
  //     .status(401)
  //     .json({ message: "You are not authorized to see this page..." });
  //   // return res.send();
  // }
  try {
    if (req.query.range) {
      startIndex = await JSON.parse(req.query.range)[0];
      endIndex = await JSON.parse(req.query.range)[1];
    }
    if (req.query.sort) {
      columnName = await JSON.parse(req.query.sort)[0];
      order = await JSON.parse(req.query.sort)[1];
    }
    if (req.query.filter) {
      columnId = await JSON.parse(req.query.filter);
      if (columnId.id) {
        id = await JSON.parse(columnId.id[0]);
      }
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }

  Users.find()
    .then((users) => {
      res.setHeader(`Content-Range`, users.length);
      const result = users.slice(startIndex, endIndex);
      let sorted = result;

      if (order === "ASC") {
        sorted = Helpers.sortAsc(result, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(result, columnName);
      }
      if (columnId.id) {
        sorted = result.filter((user) => {
          return columnId.id.includes(user.id);
        });
      }
      res.status(200).json(sorted);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot get users..." });
    });
});

// GET display single user by id
router.get("/user/:id", (req, res) => {
  const id = req.params.id;
  // if (!req.user.isAdmin) {
  //   res
  //     .status(401)
  //     .json({ message: "You are not authorized to see this page..." });
  //   return res.send();
  // }
  Users.getUser(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "Cannot find user in database..." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to get user..." });
    });
});

// PUT /api/auth/update Edit user information - FUNCTIONAL
router.put("/user/:id", (req, res) => {
  // const userId = req.user.subject;
  const userId = req.params.id;
  const changes = req.body;
  // if (!req.user.isAdmin) {
  //   res
  //     .status(401)
  //     .json({ message: "You are not authorized to see this page..." });
  //   return res.send();
  // }
  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }
  if (changes.role_id > 3) {
    res.status(422).json({ error: "Choose between 1-3..." });
  }
  Users.findUnique(userId)
    .then((u) => {
      if (u.id == userId) {
        if (changes.password) {
          const hash = bcrypt.hashSync(changes.password, HashFactor);
          changes.password = hash;
        }

        Users.update(userId, changes)
          .then((user) => {
            // console.log("what is edit user ", user);
            res.status(200).json(user);
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({ error: err });
          });
      } else {
        res.status(404).json({
          message: `The server can not find requested resource. User id: ${userId}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// DELETE user
router.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  Users.findUnique(id)
    .then((user) => {
      if (user) {
        Users.deleteOne(id)
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error });
          });
      } else {
        res
          .status(400)
          .json({ message: `No user with 🆔 ${id} in database..` });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

module.exports = router;
