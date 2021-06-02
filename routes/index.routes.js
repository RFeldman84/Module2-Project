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
