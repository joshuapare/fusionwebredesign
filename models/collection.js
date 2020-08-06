var mongoose = require("mongoose");

var collectionSchema = new mongoose.Schema({
	name: String,
	
    created_date: {
		type: Date,
		default: Date.now
    },

    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
    },

    comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
    ],
    
    samples: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sample"
		}
	
	],
	
	loops: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Loop"
		}
	
	],
	
	midi: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Midi"
		}
		
	],
	
	presets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Preset"
		}
		
	],
});

var Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;