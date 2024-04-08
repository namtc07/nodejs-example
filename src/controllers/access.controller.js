"use strict";

const express = require("express");
const AccessService = require("../services/access.service");
const { CREATED } = require("../core/success.response");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
    // return await res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = new AccessController();
