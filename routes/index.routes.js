const express = require("express")
const router = express.Router()
const axios = require("axios")

// ********* require fileUploader in order to use it *********
const fileUploader = require("../configs/cloudinary.config")

const Code = require("../models/Code.model")
const User = require("../models/User.model")

const routeGuard = require("../configs/route-guard.config")

/* GET home page */
router.get("/", (req, res, next) => res.render("index.hbs"));

// put these in nav drop down then get rid of /pick-new route 
// will be 2 dropdown for pick language resource dev resource
router.get("/pick-new", routeGuard, (req, res) => res.render("pick-new"))



///BOOKMARKS
// router.post('/:id/bm', (req, res, next) => {
	
// 	let tFav = req.body.fav 

// console.log(req.body.fav)
// if(tFav == "no") tFav = "yes"
// else if(tFav == "yes") tFav = "no"

//   Code.findByIdAndUpdate(req.params.id, {fav: tFav}, { new: true })
//     .then((updatedCode) => {	
//       console.log("updated:", updatedCode);
//       res.redirect(`back`);
//     })
//   .catch((err) => console.log(`Error while saving updated fav resource in DB : ${err}`));
// });

// // get for BOOKMARKS
// router.get('/bookmarks', (req, res, next) => {
//   Code.find({$and:[{ userId: req.session.currentUser._id }, { fav: "yes"}]}).sort({ createdAt: -1 })
//   .then((foundFavs) => {
//     //console.log("found code: ", foundFavs);
//     res.render("bookmarks", {foundFavs});
//     })
//   .catch((err) => console.log(`Error while getting bookmarks from DB for editing: ${err}`));
// })

//// DELETE

router.post('/:id/delete', routeGuard, (req, res, next) => {
  Code.findByIdAndDelete(req.params.id)
    .then(() => res.redirect(`back`))
    .catch((err) => console.log(`Error while deleting code from DB: ${err}`));
});



// /// UPDATE  for lang dev bookmark////

// // GET
router.get('/:id/edit', routeGuard, (req, res, next) => {
  Code.findById(req.params.id)
  .then((foundCode) => {
    console.log("found code: ", foundCode);
    // console.log("found res: ", foundCode.resType);
    // console.log("found fav: ", foundCode.fav);
    // console.log("refer: ", req.headers.referer);
    if(foundCode.resType === "code"){
    res.render("code/update-form", {foundCode, referer:req.headers.referer})
    } else if(foundCode.urlType === "repo"){
      res.render("dev/update-form-repo", {foundCode, referer:req.headers.referer})
    } else if(foundCode.resType === "dev"){
      res.render("dev/update-form", {foundCode, referer:req.headers.referer})
    }
    })
  .catch((err) => console.log(`Error while getting  resource from DB for editing: ${err}`));
})
  
// //POST
router.post('/:id/edit', routeGuard, (req, res, next) => {
	const { lang, topic, title, description,referer} = req.body
  Code.findByIdAndUpdate(req.params.id, { lang, topic, title, description, referer}, { new: true })
    .then((updatedCode) => {
      console.log("updated:", updatedCode);
      res.redirect(req.body.referer)
    })
  .catch((err) => console.log(`Error while saving updated resource in DB : ${err}`));
});





module.exports = router
