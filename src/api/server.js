const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("../auth/auth-router");
const jobsRouter = require("../auth/auth-jobs-router");
const authenticate = require("../auth/middleware/auth-middleware");
const customerRouter = require("../auth/auth-customer-router");
const paymentsRouter = require("../auth/auth-payments-router");
const commentsRouter = require("../auth/auth-comments-router");
const logsRouter = require("../auth/auth-log-router");
const userJob = require("../auth/user-jobs-router");
const server = express();

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  exposedHeaders: ["Content-Range"], // add X-Content-Range
};

server.use(helmet());
server.use(cors(corsOptions));
server.use(express.json());

server.use("/api", authRouter); // users
server.use("/api", authenticate, commentsRouter);
server.use("/api", authenticate, paymentsRouter);
server.use("/api", authenticate, jobsRouter);
server.use("/api", authenticate, customerRouter);
server.use("/api", authenticate, logsRouter);
server.use("/api", userJob);

let count = 0;
server.get("/", (req, res) => {
  count++;
  res.send(
    `<h2>Let's cook something together!!! 🌽🥕 😄</h2>Page visited ${count} times<p></p>`
  );
});

module.exports = server;
