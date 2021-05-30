require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const hbs = require('hbs');

const app = express(); // ---------------------
//                                            |
// require database configuration             |
require("./configs/db.config"); //            |
//                                            |
app.use(cookieParser());
require("./configs/session.config")(app); // <-

// to create a "global" variable userInSession to be used in any view wherever we need it
const bindUserToLocals = require("./configs/user-locals.config");
app.use(bindUserToLocals);

// Middleware Setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + "/views/partials")

// default value for title local
app.locals.titlePage = "YouGle It!";

// const index = require('./routes/index');
// app.use('/', index);
//      |  |  |
//      V  V  V
app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/auth.routes"));

app.use("/languages", require("./routes/languages.routes"));
app.use("/dev", require("./routes/dev.routes"));
app.use("/", require("./routes/folder.routes"));

module.exports = app;
