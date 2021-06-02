const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

//// ~~~bookmarks/folders~~~/////


const Code = require("../models/Code.model")
const User = require("../models/User.model")
const Folder = require("../models/Folder.model")

const routeGuard = require("../configs/route-guard.config")

///BOOKMARKS

// POST TOGGLE BOOKMARK
router.post("/:id/bm", routeGuard, (req, res, next) => {
	let tFav = req.body.fav

	console.log(req.body.fav)
	if (tFav == "no") tFav = "yes"
	else if (tFav == "yes") tFav = "no"

	Code.findByIdAndUpdate(req.params.id, { fav: tFav }, { new: true })
		.then(updatedCode => {
			console.log("updated:", updatedCode)
			res.redirect(`back`)
		})
		.catch(err =>
			console.log(`Error while saving updated fav resource in DB : ${err}`)
		)
})

// Display bookmarks & folders 
router.get("/bookmarks", routeGuard, (req, res, next) => {
	Code.find({ $and: [{ userId: req.session.currentUser._id }, { fav: "yes" }] })
		.sort({ updatedAt: -1 })
		.then(foundFavs => {
			//console.log("found code: ", foundFavs);
			Folder.find({ userId: req.session.currentUser._id }).then(foldersDB => {
				res.render("folder/bookmarks.hbs", { foundFavs, foldersDB })
			})
		})
		.catch(err =>
			console.log(`Error while getting bookmarks from DB for editing: ${err}`)
		)
})


/// POST SEE FOLDER
router.post("/bookmarks/new-folder", routeGuard, (req, res, next) => {
	const { name } = req.body


	Folder.create({ name, userId: req.session.currentUser })
		.then(() => res.redirect("/bookmarks"))
		.catch(err => {
      // how to render page without dissapear with error message.. can combine with above?
			if (err instanceof mongoose.Error.ValidationError) {
				// res.render("folder/bookmarks.hbs", {
				// 	errorMessage: "enter a folder name"
				// })
        res.redirect('back')
			} else {
				console.log("Error while creating a new folder: ", err)
			}
		})
})

//// DELETE

router.post("/bookmarks/folder/:id/delete", routeGuard, (req, res, next) => {
	Folder.findByIdAndDelete(req.params.id)
		.then(() => res.redirect(`back`))
		.catch(err => console.log(`Error while deleting folder from DB: ${err}`))
})

//// UPDATE GET FORM
router.get('/bookmarks/folder/:id/edit', routeGuard, (req, res, next) => {
  Folder.findById(req.params.id)
  .then((foundFolder) => {
    console.log("found code: ", foundFolder);
    res.render("folder/update-form", {folder: foundFolder})
  
    })
  .catch((err) => console.log(`Error while getting  resource from DB for editing: ${err}`));
})



/// UPDATE POST
router.post('/bookmarks/folder/:id/edit', routeGuard, (req, res, next) => {
const {name} = req.body
  Folder.findByIdAndUpdate(req.params.id, { name}, { new: true })
    .then((updatedCode) => {
      console.log("updated:", updatedCode);
      res.redirect('/bookmarks')
    })
  .catch((err) => console.log(`Error while saving updated folder in DB : ${err}`));
});

// name: { type: String, uppercase: true, required: true, trim: true },
// 		resources: [{ type: Schema.Types.ObjectId, ref: "Code" }],
// 		userId: { type: Schema.Types.ObjectId, ref: "User" },


// GET ORIGINAL pick folder for resource


router.get("/bookmarks/choose-folders/:resId", routeGuard, (req, res, next) => {
  Code.findById(req.params.resId)
  .then((foundRes ) => {
		console.log({foundRes })
    Folder.find({userId:req.session.currentUser})
    .then((foldersFromDB) => {
			// console.log({foldersFromDB})
			const folders = foldersFromDB.map(folder => {
				folder.folderSelected = folder.resources.includes(String(foundRes._id)) 
				// console.log("folder", folder)
				// console.log("selected", folder.folderSelected) 
        return folder;
      })
			res.render("folder/choose-folder", { foundRes, foldersFromDB, folders })
    }).catch(err => next(err))
  }).catch((err) => console.log(`Error while displaying the form choose folder: ${err}`));
});




// UPDATE- ADD REMOVE
router.get('/bookmarks/addRemove/:folderId/:resId', routeGuard, (req, res, next) => {
  Folder.findById(req.params.folderId)
  .then(foldersFromDB => {
    console.log(foldersFromDB)
    foldersFromDB.resources.includes(String(req.params.resId)) ? foldersFromDB.resources.pull(req.params.resId) : foldersFromDB.resources.push(req.params.resId);
    foldersFromDB.save()
    .then(updatedFoldersFromDB => {
			console.log({updatedFoldersFromDB})
      res.redirect(`back`);
    }).catch(err => next(err));
  }).catch(err => next(err));
})




// // get for  BOOKMARKS in a folder

// is this redundant?
// router.get('/bookmarks/folder/:folderId',  routeGuard, (req, res, next) => {
//   Folder.findById(req.params.folderId).populate('resources')
//   .then((foundFolder) => {
//     console.log("found folder: ", foundFolder);
// 		// logic if resource.fav === "yes" return resource
// 		// WORKS*
// 		const bookmarked = foundFolder.resources.map(resource => {
// 			resource.bookmark = resource.fav == "yes"
// 			console.log("resource", resource.fav)
// 			return resource;
// 		})
// 		// logic if resource.fav === "no" pull() that resource
// 			// WORKS*
// 			foundFolder.resources.forEach(resource => {
// 				if(resource.fav == "no")
// 				foundFolder.resources.pull(resource._id)
// 				foundFolder.save()
// 			})
// 			console.log('updated res', foundFolder)
//     res.render("folder/folder.hbs", {foundFolder, bookmarked});
//     })
//   .catch((err) => console.log(`Error while getting folder from DB  ${err}`));
// })


/// refactor do i need bookmarked if pull works? seems not
router.get('/bookmarks/folder/:folderId',  routeGuard, (req, res, next) => {
  Folder.findById(req.params.folderId).populate('resources')
  .then((foundFolder) => {
    console.log("found folder: ", foundFolder);
			// logic if remove bookmark:resource.fav === "no" - pull() that resource
			foundFolder.resources.forEach(resource => {
				if(resource.fav == "no")
				foundFolder.resources.pull(resource._id)
				foundFolder.save()
			})
			console.log('updated res', foundFolder)
    res.render("folder/folder.hbs", {foundFolder});
    })
  .catch((err) => console.log(`Error while getting folder from DB  ${err}`));
})





module.exports = router