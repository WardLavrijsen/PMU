const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
// const fs = require("fs");
// const https = require("https");

const app = express();
const apiRouter = require("./apiRouter");
const pageRouter = require("./pageRouter");
const changeRouter = require("./changes/changeRouter");
const requestController = require("./utils/requestController");

dotenv.config({ path: "./config.env" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(cors());
// const fs = require("fs");
// const https = require("https");

app.use(helmet());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected succesfull!"));

app.use("/api", apiRouter);
app.use("/api/change", changeRouter);
app.use("/api/insides", requestController);
app.use("/", pageRouter);

app.use(express.static(path.resolve(__dirname, "public/dashboard")));

app.get("/dashboard", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "public/dashboard", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/error", "index.html"));
});

// HTTPS Options
// const options = {
//   key: fs.readFileSync("./cert/key.pem"),
//   cert: fs.readFileSync("./cert/cert.pem"),
// };

app.listen(process.env.PORT || 3443, () =>
  console.log(`connected to port ${process.env.PORT}`)
);

// https
//   .createServer(options, app)
//   .listen(443, () => console.log("listening on port 443"));

// require("greenlock-express")
//   .init({
//     packageRoot: __dirname,
//     configDir: "./greenlock.d",

//     // contact for security and critical bug notices
//     maintainerEmail: "wardlavrijsen@gmail.com",

//     // whether or not to run at cloudscale
//     cluster: false,
//   })
//   // Serves on 80 and 443
//   // Get's SSL certificates magically!
//   .serve(app);
