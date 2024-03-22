const express = require("express");
const app = express();

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`WLC with ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server");
    // notify.send();
  });
});
