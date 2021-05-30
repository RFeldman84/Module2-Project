const mongoose = require("mongoose")
const { Schema, model } = mongoose


const sDate = new Date().toDateString().split(" ").splice(1).join(" ")

const codeSchema = new Schema(
	{
		lang: { type: String, uppercase: true, trim: true},
		topic: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String},
		webUrl: { type: String, trim: true, default:""},
		imageUrl: { type: String, trim: true, default:""},
		vidUrl: { type: String, trim: true, default:""},
		cpUrl: { type: String, trim: true, default:""},
		riUrl: { type: String, trim: true, default:""},
		gitRepo: { type: String, trim: true, default:""},
		gitUser: { type: String, trim: true, default:""},
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		fav: { type: String, default: "no" },
		urlType: { type: String, enum: ["picture", "video", "weblink", "codepen","replit", "repo"] },
		resType: { type: String, enum: ["code", "dev", "gituser"]},
		date: { type: String, default: sDate },
		
	},
	{
		timestamps: true,
	}
)

codeSchema.index({ "$**": "text" })
//MyModel.find({$text: {$search: searchString}})

module.exports = model("Code", codeSchema)


