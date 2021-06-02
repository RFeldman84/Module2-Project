const express = require("express")
const router = express.Router()
const axios = require("axios")
const mongoose = require("mongoose");

// LANGUAGES/////
// ********* require fileUploader in order to use it *********
const fileUploader = require("../configs/cloudinary.config")

const Code = require("../models/Code.model")
const User = require("../models/User.model")

const routeGuard = require("../configs/route-guard.config");



//Lang MAIN & SEARCH
router.get("/", routeGuard, (req, res) => {
	if (req.query.search) {
    Code.find({$and: [{$text: {$search: req.query.search}}, { userId: req.session.currentUser._id }, { resType: "code"}]})
    .sort({ createdAt: -1 })
    .then(codeFromDB => {
      //console.log(codeFromDB)
      res.render("code/language-all", { langAll: codeFromDB })
    })
	} else {
		Code.find({$and:[{ userId: req.session.currentUser._id }, { resType: "code"}]})
			.sort({ createdAt: -1 })
			.then(codeFromDB => {
				//console.log(codeFromDB)
				res.render("code/language-all", { langAll: codeFromDB })
			})
			.catch(err => console.log(`Error while getting code from the DB: ${err}`))
	}
});






// add new type resource form
// FORM PICTURE
router.get("/newPic", routeGuard, (req, res) => res.render("code/new-pic"))

//FORM VIDEO
router.get("/newVid", routeGuard,  (req, res) => res.render("code/new-vid"))

//FORM WEBLINK
router.get("/newLink", routeGuard,  (req, res) => res.render("code/new-link"))

//FORM CODEPEN
router.get("/newPen", routeGuard,  (req, res) => res.render("code/new-pen"))

//FORM REPLiT
router.get("/newReplit", routeGuard,  (req, res) => res.render("code/new-replit"))


// POST RESOURCES  
const urlE = "please provide a url"
const urlInvalid = "please enter valid url including http/https"

//POST PICTURE
router.post("/newPic/add", routeGuard, fileUploader.single("image"),(req, res) => {
	const { lang, topic, title, description, urlType, resType } = req.body

	if (!lang || !title ) {
    res.render("code/new-pic", {errorMessage: true, ...req.body});
    return;
  } else if (!req.file) {
    res.render("code/new-pic", { ...req.body,
      errorImg: "Please select image file: JPEG/PNG/SVG/GIF/...(up to 10MB)"
    });
    return;
  }

	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, imageUrl: req.file.path})
		.then(() => res.redirect("/languages"))
		.catch(err => console.log("Error while creating a new pic resource: ", err))
	});

// 500 from bin/www 400 wrong type of file or wrong size HOW TO HANDLE with message??
	// ERROR POST /languages/newPic/add {
	// 	message: 'Invalid image file',
	// 	name: 'Error',
	// 	http_code: 400,
	// 	storageErrors: []
	// }






//  validator for URL format http://

// for some reason rest wont work without fileUploader.single("image") so leave in
// //POST WEBLINK
router.post("/newLink/add",routeGuard,fileUploader.single("image"),(req, res) => {
	// console.log('body', req.body)
	// console.log('requser', req.session.currentUser)
	const { lang, topic, title, description, webUrl, urlType, resType } = req.body
  if (!lang || !title ) {
   return res.render("code/new-link", {errorMessage: true, ...req.body});
  } else if (!webUrl) {
   return res.render("code/new-link", {errorUrl: urlE, ...req.body});
  } else if(webUrl.indexOf("http://") !== 0 && webUrl.indexOf("https://") !== 0){
		return res.render("code/new-link", {errorUrl: urlInvalid, ...req.body});
	}



	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, webUrl})
	.then(() => {
		res.redirect("/languages")
})
.catch(err => console.log(`Error while getting code from the DB: ${err}`))
	})




//POST VIDEO

router.post("/newVid/add",routeGuard,fileUploader.single("image"),(req, res) => {

	const { lang, topic, title, description, urlType, resType } = req.body
	const regexYt = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/
  const urlYe = req.body.vidUrl.replace(".be/", "be.com/embed/").replace('watch?v=',"embed/")


	if (!lang || !title ) {
  return res.render("code/new-vid", {errorMessage: true, ...req.body})
  }else if (!req.body.vidUrl) {
   return res.render("code/new-vid", {errorUrl: urlE, ...req.body});
    
  }
	
	if (!regexYt.test(req.body.vidUrl) || (!req.body.vidUrl.indexOf("http://") == 0 && !req.body.vidUrl.indexOf("https://") == 0)){
		res.render("code/new-vid", {errorUrl: urlInvalid, ...req.body});
		return;
	}


	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, vidUrl:urlYe})

		.then(() => res.redirect("/languages"))
		.catch(err => console.log("Error while creating a new vid resource: ", err))
});




//POST CODE PEN
router.post("/newPen/add",routeGuard,fileUploader.single("image"),(req, res) => {
	const { lang, topic, title, description, urlType, resType } = req.body

	
	if (!lang || !title ) {
  return res.render("code/new-pen", {errorMessage: true, ...req.body})
  }else if (!req.body.cpUrl) {
   return res.render("code/new-pen", {errorUrl: urlE, ...req.body});
  } else if(req.body.cpUrl.indexOf("https://codepen.io/") !== 0 ){
	return  res.render("code/new-pen", {errorUrl: urlInvalid, ...req.body})
	 
	}

	let urlCe = req.body.cpUrl.replace("/pen", "/embed")

	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, cpUrl:urlCe})
		.then(() => res.redirect("/languages"))
		.catch(err => console.log("Error while creating a new codepen resource: ", err))
});




//POST REPLiT

router.post("/newReplit/add",routeGuard,fileUploader.single("image"),(req, res) => {

	const { lang, topic, title, description, urlType, resType } = req.body


	if (!lang || !title ) {
    res.render("code/new-replit", {errorMessage: true, ...req.body});
    return;
  }

	
	if (!req.body.riUrl) {
   return res.render("code/new-replit", {errorUrl: urlE, ...req.body});
  } else if (req.body.riUrl.indexOf("https://replit.com/@") !== 0 ){
		return res.render("code/new-replit", {errorUrl: urlInvalid, ...req.body});
	}


	//url.split('#')[0]
	let riFix = req.body.riUrl.split('#')[0]
	
	Code.create({userId: req.session.currentUser, lang, topic, title, description, urlType, resType, riUrl: riFix})
		.then(() => res.redirect("/languages"))
		.catch(err => console.log("Error while creating a new replit resource: ", err))
});


// // Post add codewars username 
router.post('/add-cw-user', (req, res, next) => {
	const {cwName} = req.body
	req.session.currentUser.cwName = cwName
  User.findByIdAndUpdate(req.session.currentUser, {cwName, ...req.session}, { new: true })
    .then((updatedCode) => {
      res.redirect(`/languages`);
    })
  .catch((err) => console.log(`Error while saving cwName resource in DB : ${err}`));
});




/// CODEWARS API
	//new Date().toDateString().split(" ").splice(1).join(" ")
router.get("/my-katas", routeGuard, (req, res) => {
// 	//console.log("test res", res)
axios.get(`https://www.codewars.com/api/v1/users/${req.session.currentUser.cwName}/code-challenges/completed?access_key=${process.env.CW_KEY}`)
		.then((resp)=> {
      // console.log(resp.data.data)
      // console.log(Object.entries(resp.data.data).length)
    let cw = resp.data.data  
		console.log(cw)
		let dateFix = cw.map(e => e.completedAt = new Date(e.completedAt).toDateString().split(" ").splice(1).join(" "))
		console.log(dateFix)
	
	
  res.render("code/katas.hbs", {cw })
 }) 
 .catch(err => console.log(`Error while getting cw from the DB: ${err}`))
})







module.exports = router










