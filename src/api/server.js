const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("../auth/auth-router");
const jobsRouter = require("../auth/auth-jobs-router");
const authenticate = require("../auth/middleware/auth-middleware");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

// //node js
// server.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

server.use("/api/private", jobsRouter);

server.use("/api/auth", authRouter);

// server.use("/jobs", authenticate, jobsRouter);

server.get("/", (req, res) => {
  res.send("<h2>Let's cook something! 🌽🥕 😄</h2>");
});

module.exports = server;
