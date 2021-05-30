const mongoose = require("mongoose")
const { Schema, model } = mongoose



const folderSchema = new Schema(
	{
		name: { type: String, uppercase: true, required: true, trim: true },
		resources: [{ type: Schema.Types.ObjectId, ref: "Code" }],
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
	}
)



module.exports = model("Folder", folderSchema)
