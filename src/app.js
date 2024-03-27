const express = require("express");
const compression = require("compression");
const { helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");

// init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello he he";
  return res.status(200).json({
    message: "welcome hi hi",
    metadata: strCompress.repeat(10000),
  });
});

// handling error

module.exports = app;
