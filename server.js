const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`WLC with ${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log("Exit server");
//     // notify.send();
//   });
// });
