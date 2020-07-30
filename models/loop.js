var mongoose = require("mongoose");

var loopSchema = new mongoose.Schema({
	name: String,
	category: String,
	instrument: String,
	tag: String,
	genre: String,
	key: String,
	bpm: String,
	filePath: String,
	packName: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	
	packImage: String
});

module.exports = mongoose.model("Loop", loopSchema);