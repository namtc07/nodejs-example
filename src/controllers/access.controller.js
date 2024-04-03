"use strict";

const express = require("express");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      // 200 OK
      // 201 CREATED
      return await res.status(201).json({
        code: "20001",
        metadata: { userId: 1 },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
