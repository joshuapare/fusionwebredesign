var mongoose = require("mongoose");

var sampleSchema = new mongoose.Schema({
	name: String,
	keyid: String,
	category: String,
	instrument: String,
	tag: String,
	genre: String,
	key: String,
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

module.exports = mongoose.model("Sample", sampleSchema);