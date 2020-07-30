var mongoose = require("mongoose");

var midiSchema = new mongoose.Schema({
	name: String,
	category: String,
	tag: String,
	genre: String,
	bpm: String,
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

module.exports = mongoose.model("Midi", midiSchema);