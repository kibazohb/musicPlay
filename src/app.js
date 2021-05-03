const express = require("express");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");

const AuthRoute = require("./routes/authRoute");

const {verifyAccessTokens} = require('./extras/jwtTokens')

require("dotenv").config();

//start database connection
import { db } from "./config/db";
import {redis_cache} from './config/redis' 

const startDbConnection = async () => db.createConnection();
const startRedisConnection = async ()=> redis_cache.createConnection()

startDbConnection();
startRedisConnection();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessTokens, function (req, res) {
  res.sendFile(path.join(__dirname.replace('src', '') + "/public/index.html"));
});

// Send Style, do not change
app.get("/style.css", function (req, res) {
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname.replace('src', '') + "/public/styles.css"));
});

// Send obfuscated JS, do not change
app.get("/index.js", function (req, res) {
  fs.readFile(
    path.join(__dirname.replace('src', '') + "/public/index.js"),
    "utf8",
    function (err, contents) {
      const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {
        compact: true,
        controlFlowFlattening: true,
      });
      res.contentType("application/javascript");
      res.send(minimizedContents._obfuscatedCode);
    }
  );
});

app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exists"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
