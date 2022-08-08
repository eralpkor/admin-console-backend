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

server.use("/api", authRouter);
server.use("/api", authenticate, commentsRouter);
server.use("/api", authenticate, paymentsRouter);
server.use("/api", authenticate, accountsRouter);
server.use("/api", authenticate, jobsRouter);
server.use("/api", authenticate, customerRouter);

server.get("/", (req, res) => {
  res.send("<h2>Let's cook something! 🌽🥕 😄</h2>");
});

module.exports = server;
