var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	
	// GENERAL INFO //
	
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	campus: String,
	role: String,
	image: String,
	bio: String,
	
	// CONTRIBUTIONS
	
	contributedPacks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pack"
		}
	],
	
	contributedPlugins: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Preset"
		}
	],
	
	
	// FAVORITES
	
	favPacks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pack"
		}
	
	],
	
	favSamples: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sample"
		}
	
	],
	
	favLoops: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Loop"
		}
	
	],
	
	favMidi: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Midi"
		}
		
	],
	
	favPresets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Preset"
		}
		
	],
	
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);