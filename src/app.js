const dotenv = require("dotenv");
const Path = require("path");
dotenv.config({ path: Path.resolve(__dirname, "../.env") });

const express = require('express')
const morgan = require('morgan')
const path = require("path");
const createError = require('http-errors')
const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");

//start database connection
import { connectDB } from "config/db.ts"

const db = connectDB.createConnection();

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Send Style, do not change
app.get("/style.css", function(req, res) {
    //Feel free to change the contents of style.css to prettify your Web app
    res.sendFile(path.join(__dirname + "/public/style.css"));
});

// Send obfuscated JS, do not change
app.get("/index.js", function(req, res) {
    fs.readFile(
        path.join(__dirname + "/public/index.js"),
        "utf8",
        function(err, contents) {
            const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {
                compact: true,
                controlFlowFlattening: true,
            });
            res.contentType("application/javascript");
            res.send(minimizedContents._obfuscatedCode);
        }
    );
});


app.use(async(req, res, next) => {
    next(createError.NotFound("This route does not exists"))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})