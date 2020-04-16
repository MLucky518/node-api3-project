const express = require("express");
const cors = require("cors");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");
const server = express();

server.use(express.json());
server.use(cors());

server.use(logger);

server.use("/users", userRouter);
server.use("/posts", postRouter);

//custom middleware

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "something went wrong",
  });
});

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.ip} ${req.method} ${req.url}`);
  next();
}

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
