"use strict";

const express = require("express");
const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout OK!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login OK!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
