var mongoose = require("mongoose");

var multitrackSchema = new mongoose.Schema({
	projectName: String,
	artist: String,
	key: String,
	bpm: String,
	genre: String,
	description: String,
	example: String,
	
	// UPLOADS GIVEN
	
	stems: {
		exists: Boolean,
		filePath: String
	},
	
	proTools: {
		exists: Boolean,
		filePath: String
	},
	
	logic: {
		exists: Boolean,
		filePath: String
	},
	
	flStudio: {
		exists: Boolean,
		filePath: String
	},
	
	cubase: {
		exists: Boolean,
		filePath: String
	},
	
	ableton: {
		exists: Boolean,
		filePath: String
	},
	
	garageBand: {
		exists: Boolean,
		filePath: String
	},
	
	// COMMENTS SECTION OF MULTITRACK //
	
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	
	// CREATOR INFO //
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
	
});

module.exports = mongoose.model("Multitrack", multitrackSchema);