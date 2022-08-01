const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("../auth/auth-router");
const jobsRouter = require("../auth/auth-jobs-router");
const authenticate = require("../auth/middleware/auth-middleware");
const customerRouter = require("../auth/auth-customer-router");
const accountsRouter = require("../auth/auth-accounts-router");
const paymentsRouter = require("../auth/auth-payments-router");
const commentsRouter = require("../auth/auth-comments-router");
const server = express();

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  exposedHeaders: ["Content-Range"],
};

server.use(helmet());
server.use(cors(corsOptions));
server.use(express.json());
//node js
// server.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
server.use("/api", commentsRouter);
server.use("/api", paymentsRouter);
server.use("/api", accountsRouter);
server.use("/api", jobsRouter);
server.use("/api", customerRouter);
server.use("/api", authRouter);

// server.use("/jobs", authenticate, jobsRouter);

server.get("/", (req, res) => {
  res.send("<h2>Let's cook something! 🌽🥕 😄</h2>");
});

module.exports = server;
