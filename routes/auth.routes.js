const express = require("express");
const router = express.Router();
// import mongoose when dealing with errors in .catch()
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const User = require("../models/User.model");

const saltRounds = 10;

const routeGuard = require("../configs/route-guard.config");

// **need to move these signup and login  routes to render right place on or from homepage not away from it**
////////// SIGNUP //////////////////////

// GET the signup 
router.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST route signup
router.post("/signup", (req, res, next) => {
  //   console.log(req.body);
  const { username, email, userPassword } = req.body;

  if (!username || !email || !userPassword) {
    res.render("auth/signup.hbs", {
      errorMessage: "All fields are mandatory. Please provide username, email and password."
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(userPassword)) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "Password needs to be at least 6 characters long, and needs to have at least one number, one lowercase and one uppercase letter."
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPassword, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      }).then((userFromDB) => {
        // console.log(userFromDB);
        res.redirect("/");
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.render("auth/signup.hbs", {
          errorMessage: "Username and email need to be unique. Either username or email is already used."
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.render("auth/signup.hbs", { errorMessage: err.message });
      } else {
        console.log("Error while creating a user: ", err);
      }
    });
});


////////// LOGIN //////////////////////

// GET login 
router.get("/auth/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  const { email, userPassword } = req.body;

  if (!email || !userPassword) {
    res.render("auth/login.hbs", {
      errorMessage: "All fields are mandatory. Please provide both, email and password."
    });
    return;
  }

  User.findOne({ email })
    .then((responseFromDB) => {
      // responseFromDB can be either NULL if the email doesn't exist 
      // or the USER OBJECT since the user is found in the DB based on the provided email
      // console.log("session: ", req.session);
      if (!responseFromDB) {
        res.render("auth/login.hbs", { errorMessage: "Email is not registered. Try different email please." });
      } else if (bcryptjs.compareSync(userPassword, responseFromDB.passwordHash)) {
      console.log("logged in user is: ", responseFromDB);
        // currentUser ==> this is a placeholder
        req.session.currentUser = responseFromDB;
         console.log("do i have user in session: ", req.session.currentUser);
        res.redirect("/");
      } else {
        res.render("auth/login.hbs", { errorMessage: "Incorrect password." });
      }
    })
    .catch((err) => console.log(`Error while user login: ${err}`));
});


////////// LOGOUT //////////////////////

router.post("/logout", (req, res, next) => {
  // console.log("user in sess before: ", req.session.currentUser);
  req.session.destroy();
  // console.log("user in sess after: ", req.session);
  res.redirect("/");
});



module.exports = router;
