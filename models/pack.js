var mongoose = require("mongoose");

var packSchema = new mongoose.Schema({
	name: String,
	description: String,
	image: String,
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

var Pack = mongoose.model("Pack", packSchema);

module.exports = Pack;