"use strict";

const mongoose = require("mongoose");

const countConnect = () => {
  const numConnection = mongoose.connection.length;
  console.log(`Number of connections::`, numConnection);
};

module.exports = { countConnect };
