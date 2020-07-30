var mongoose = require("mongoose");

var presetSchema = new mongoose.Schema({
	name: String,
	category: String,
	instrument: String,
	tag: String,
	genre: String,
	plugin: String,
	filePath: String,
	packName: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
	
});

module.exports = mongoose.model("Preset", presetSchema);