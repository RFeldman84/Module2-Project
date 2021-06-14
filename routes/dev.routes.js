const express = require("express")
const router = express.Router()
const axios = require("axios")
const mongoose = require("mongoose");

/// DEV ///
// ********* require fileUploader in order to use it *********
const fileUploader = require("../configs/cloudinary.config")

const Code = require("../models/Code.model")
const User = require("../models/User.model")

const routeGuard = require("../configs/route-guard.config")




//dev MAIN & SEARCH
router.get("/", routeGuard, (req, res) => {
	if (req.query.search) {
    Code.find({$and: [{$text: {$search: req.query.search}}, { userId: req.session.currentUser._id }, { resType: "dev"}]})
    .sort({ createdAt: -1 })
    .then(codeFromDB => {
      //console.log(codeFromDB)
      res.render("dev/dev-all", { devAll: codeFromDB })
    })
	} else {
		Code.find({$and:[{ userId: req.session.currentUser._id }, { resType: "dev"}]})
			.sort({ createdAt: -1 })
			.then(codeFromDB => {
				//console.log(codeFromDB)
				res.render("dev/dev-all", { devAll: codeFromDB })
			})
			.catch(err => console.log(`Error while getting dev  from the DB: ${err}`))
	}
});








//MODIFY ALL FOR DEV SIDE

// // add new type resource form
// FORM PICTURE
router.get("/newPic", routeGuard, (req, res) => res.render("dev/new-pic"))


//FORM VIDEO
router.get("/newVid", routeGuard,  (req, res) => res.render("dev/new-vid"))

//FORM WEBLINK
router.get("/newLink", routeGuard,  (req, res) => res.render("dev/new-link"))


// FORM GITHUB REPO
router.get("/newGitRepo", routeGuard,  (req, res) => res.render("dev/new-gitRepo"))

//GITHUB USERS
// FORM
//on user page



// POST RESOURCES  
const urlE = "please provide a url"
const urlInvalid = "please enter valid url including http/https"	
 
//POST PICTURE
router.post("/newPic/add", routeGuard, fileUploader.single("image"),(req, res) => {
	const { lang, topic, title, description, urlType, resType } = req.body

	if (!lang || !title ) {
    res.render("dev/new-pic", {errorMessage: true, ...req.body});
    return;
  } else if (!req.file) {
    res.render("dev/new-pic", { ...req.body,
      errorImg: "Please select image file: JPEG/PNG/SVG/GIF/...(up to 10MB)"
    });
    return;
  }


	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, imageUrl: req.file.path})
		.then((pic) => {
			console.log('new pic', pic)
			res.redirect("/dev")
		})
		.catch(err => console.log("Error while creating a new pic resource: ", err))
	});


// //POST VIDEO

router.post("/newVid/add",routeGuard,(req, res) => {
	
	const { lang, topic, title, description, urlType, resType } = req.body

	const regexYt = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/
	
  const urlYe = req.body.vidUrl.replace(".be/", "be.com/embed/").replace('watch?v=',"embed/")


	if (!lang || !title ) {
		return res.render("dev/new-vid", {errorMessage: true, ...req.body})
		}else if (!req.body.vidUrl) {
		return res.render("dev/new-vid", {errorUrl: urlE, ...req.body});
		}else if (!regexYt.test(req.body.vidUrl) || (!req.body.vidUrl.indexOf("http://") == 0 && !req.body.vidUrl.indexOf("https://") == 0)){
			return res.render("dev/new-vid", {errorUrl: urlInvalid +` for Youtube`, ...req.body})
		;
		}


	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, vidUrl:urlYe})
		.then((vid) =>{ 
			console.log('new vid', vid)
			res.redirect("/dev")
		})
		.catch(err => console.log("Error while creating a new vid resource: ", err))
});


// //POST WEBLINK
router.post("/newLink/add",routeGuard,(req, res) => {

	const { lang, topic, title, description, webUrl, urlType, resType } = req.body

	if (!lang || !title ) {
		return res.render("dev/new-link", {errorMessage: true, ...req.body});
	} else if (!webUrl) {
		return res.render("dev/new-link", {errorUrl: urlE, ...req.body});
	} else if(webUrl.indexOf("http://") !== 0 && webUrl.indexOf("https://") !== 0){
		return res.render("dev/new-link", {errorUrl: urlInvalid, ...req.body});
	}

	
	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, webUrl})
		.then((link) => {
			console.log('new weblink', link)
			res.redirect("/dev")
		})
		.catch(err => console.log("Error while creating a new web link resource: ", err))
});


// //POST GIT REPO
router.post("/newGitRepo/add",routeGuard,(req, res) => {

	const { lang, description, gitRepo, urlType, resType } = req.body
		if (!lang || (!lang && !gitRepo)) {
		return res.render("dev/new-gitRepo", {errorMessage: true, ...req.body})
		}else if (!gitRepo) {
    res.render("dev/new-gitRepo", { ...req.body,
      errorInput: "Please input username/repo"
    });
    return;
  }
	
	Code.create({userId: req.session.currentUser, lang, description, urlType, resType, gitRepo})
		.then((newRepo) => {
			console.log('new repo', newRepo)
			res.redirect("/dev")
		})
		.catch(err => console.log("Error while creating  new github repo resource: ", err))
});


// //POST GIT USER
router.post("/github-users",routeGuard, (req, res) => {

	const { gitUser, resType } = req.body

	if (!gitUser) {
		Code.find({$and:[{ userId: req.session.currentUser._id }, { resType: "gituser"}]})
	.sort({ createdAt: -1 })
	.then(gitUsersDB => {
		console.log("gitUsers", gitUsersDB)
		res.render("dev/github-users.hbs", { gitUsersDB, errorInput: "Please input username", ...req.body })
	})
    return;
  }
	
	Code.create({userId: req.session.currentUser, resType, gitUser})
		.then((newUser) => {
			console.log('new repo', newUser)
			res.redirect("/dev/github-users")
		})
		.catch(err => console.log("Error while creating a new web link resource: ", err))
});


// GET SHOW GITHUB USERS 
router.get("/github-users", routeGuard, (req, res) => {
	Code.find({$and:[{ userId: req.session.currentUser._id }, { resType: "gituser"}]})
	.sort({ createdAt: -1 })
	.then(gitUsersDB => {
		console.log("gitUsers", gitUsersDB)
		res.render("dev/github-users.hbs", { gitUsersDB })
	})
	.catch(err => console.log(`Error while getting gituser from the DB: ${err}`))
})




module.exports = router