var express      = require("express"),
	app          = express(),
	bodyParser   = require("body-parser"),
	mongoose     = require("mongoose"),
	passport	 = require("passport"),
	LocalStrategy= require("passport-local"),
	Schema		 = mongoose.Schema,
	methodOverride= require("method-override"),
	upload		 = require("express-fileupload"),
	fs		 	 = require("fs"),
	path		 = require("path"),
	aws			 = require("aws-sdk"),
	
	// INCLUDING MODELS //
	Sample		 = require("./models/sample"),
	Midi		 = require("./models/midi"),
	Pack		 = require("./models/pack"),
	Preset		 = require("./models/preset"),
	Loop		 = require("./models/loop"),
	Multitrack	 = require("./models/multitrack"),
	
	User		 = require("./models/user"),
	Comment		 = require("./models/comment");	

	require('dotenv').config();	
	
	// AWS SETUP

	//REGION
	aws.config.region = 'us-east-1';

	//BUCKET FROM ENV VARIABELS
	const S3_BUCKET = process.env.S3_BUCKET;

			   

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fusionmusicwebapp', {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(methodOverride("_method"));
app.use(upload());


app.use(require("express-session")({
	secret: "Aida is the cutest dog ever shut up",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PASSTHROUGH OF USER DATA
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//AWS SIGNing

app.get('/sign-s3', (req, res) => {
	const s3 = new aws.S3();
	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];
	const s3Params = {
	  Bucket: S3_BUCKET,
	  Key: fileName,
	  Expires: 60,
	  ContentType: fileType,
	  ACL: 'public-read'
	};
  
	s3.getSignedUrl('putObject', s3Params, (err, data) => {
	  if(err){
		console.log(err);
		return res.end();
	  }
	  const returnData = {
		signedRequest: data,
		url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
	  };
	  res.write(JSON.stringify(returnData));
	  res.end();
	});
});



// MAIN ROUTE


app.get("/", function(req, res){
	res.render("index");
});

// USER ROUTES //

app.get("/user/:id", function(req, res){
	res.render("user.ejs");
});

// CREATE ROUTES//

app.get("/samples", function(req, res){
	Sample.find({},function(err, allSamples){
		if(err){
			console.log(err);
		} else {
			res.render("samples.ejs",{samples:allSamples},{loops:allLoops});
		}
	})
});

app.get("/loops", function(req, res){
	Loop.find({},function(err, allLoops){
		if(err){
			console.log(err);
		} else {
			res.render("loops.ejs",{loops:allLoops});
		}
	})
});

app.get("/multitracks", function(req, res){
	Multitrack.find({},function(err, allMultitracks){
		if(err){
			console.log(err);
		} else {
			res.render("multitracks.ejs",{multitracks:allMultitracks});
		}
	})
});

app.get("/midi", function(req, res){
	Midi.find({},function(err, allMidis){
		if(err){
			console.log(err);
		} else {
			res.render("midi.ejs",{midi:allMidis});
		}
	})
});

app.get("/presets", function(req, res){
	Preset.find({},function(err, allPresets){
		if(err){
			console.log(err);
		} else {
			res.render("presets.ejs",{preset:allPresets});
		}
	})
});

app.get("/plugins", function(req, res){
	Plugin.find({},function(err, allPlugins){
		if(err){
			console.log(err);
		} else {
			res.render("plugins.ejs",{plugins:allPlugins});
		}
	})
});

// SUBMIT PAGE // 

app.get("/submit", function(req, res){
	res.render("submit.ejs");
});


// SAMPLE SUBMISSION //


app.get("/submit/sample", isLoggedIn, function(req, res){
	Pack.find({},function(err, allPacks){
		if(err){
			console.log(err);
		} else {
			res.render("submit-sample",{packs:allPacks});
		}
	})
});

app.post("/submit/sample", isLoggedIn, function(req, res){
	if(req.files) {
		console.log(req.files);
		var file = req.files.file;
		var filename = file.name;
		console.log(filename);

		// S3 Upload Prep
		const fileContent = fs.readFileSync(filename);

		const params = {
			Bucket: S3_BUCKET,
			Key: filename,
			Body: fileContent
		};

		s3.upload(params, function(err, data) {
			if (err) {
				throw err;
			}
			console.log(`File uploaded successfully. ${data.Location}`);
		});
		
		//MongoDB POST//
		
		var name 		= req.body.name,
			category 	= req.body.category,
			instrument 	= req.body.instrument,
			tag 		= req.body.tag,
			genre 		= req.body.genre,
			key 		= req.body.key,
			filePath 	= req.body.file-url,
			packName 	= req.body.packname,
			author = {
						id: req.user._id,
						username: req.user.username
					};
	
	function PostSample(packval){
		Pack.find({"name": packval},function(err, foundPack){
			if(err){
				console.log(err);
			} else {
				
				// PULL PACK IMAGE DATA//
				var pack = foundPack;
				var packimage = pack[0].image;
				
				
				// SETUP NEW SAMPLE CREATION //
				var newSample = {
				name: name, 
				category: category, 
				instrument: instrument, 
				tag: tag, 
				genre: genre,
				key: key,
				filePath: filePath,
				packName: packName,
				author: author,
				packImage: packimage,
				};
				
				// CREATE SAMPLE AND PUSH TO MONGODB //
				
				Sample.create(newSample, function(err, newlyCreated){
					if(err){
						console.log("Could not create Sample");
					} else {
						
						// FIND SAMPLE IN DATABASE, GRAB ID AND INSERT INTO PACK // 
						
						Sample.find({"name": req.body.name}, function(err, foundSample){
							if(err){
								console.log(err);
							} else {
								console.log(foundSample);
								
								// UPDATE PACK WITH SAMPLE ID //
								Pack.findOneAndUpdate(
								   { "name": packval }, 
								   { $push: { samples: foundSample[0]._id } },
								  function (error, success) {
										if (error) {
											console.log(error);
										} else {
											console.log(success);
										}
									});
							}
						});
			// MOVE FILE FROM TEMP LOCATION TO PERMANENT LOCATION //

						// file.mv("public/assets/samples/"+filename, function(err){
						// 	if(err){
						// 		console.log(err);
						// 		res.send("ERROR");
						// 	} else {
						// 		res.send("SUCCESS");
						// 	}
						// });
					}
				});
			}
		});
	}
	PostSample(req.body.packname);
}
});

// MULTITRACK SUBMISSION //

app.get("/submit/multitrack", isLoggedIn, function(req, res){
	res.render("submit-multitrack.ejs");
});

app.post("/submit/multitrack", isLoggedIn, function(req, res){
	if(req.files) {
		console.log(req.files);
		var exampleFile = req.files.examplefile,
			stemFiles = req.files.stemfiles,
			proToolsFiles = req.files.protoolsfiles,
			logicFiles = req.files.logicfiles,
			flStudioFiles = req.files.flstudiofiles,
			cubaseFiles = req.files.cubasefiles,
			garageBandFiles = req.files.garagebandfiles,
			abletonFiles = req.files.abletonfiles;
		
		//MongoDB POST//
		
		var projectName 	= req.body.name,
			artist 			= req.body.artist,
			bpm 			= req.body.bpm,
			genre 			= req.body.genre,
			key 			= req.body.key,
			description		= req.body.description,
			stemsExists		= true,
			proToolsExists 	= req.body.protoolsgiven ? true : false,
			logicExists 	= req.body.logicgiven ? true : false,
			flStudioExists 	= req.body.flstudiogiven ? true : false,
			cubaseExists 	= req.body.cubasegiven ? true : false,
			garageBandExists = req.body.garagebandgiven ? true : false,
			abletonExists 	= req.body.abletongiven ? true : false;
			
		var exampleFileName = exampleFile.name,
			stemFilesName = stemFiles.name,
			proToolsFilesName = (proToolsExists) ? proToolsFiles.name : "none",
			logicFilesName = (logicExists) ? logicFiles.name : "none",
			flStudioFilesName = (flStudioExists) ? flStudioFiles.name : "none",
			cubaseFilesName = (cubaseExists) ? cubaseFiles.name : "none",
			garageBandFilesName = (garageBandExists) ? garageBandFiles.name : "none",
			abletonFilesName = (abletonExists) ? abletonFiles.name : "none",
			author = {
						id: req.user._id,
						username: req.user.username
					};
			
			
		console.log(
			"Stems: " + stemFilesName + " | " +
			"ProTools: " + proToolsFilesName + " | " +
			"Logic: " + logicFilesName + " | " +
			"flStudio: " + flStudioFilesName + " | " +
			"Cubase: " + cubaseFilesName + " | " +
			"GarageBand: " + garageBandFilesName + " | " +
			"Ableton: " + abletonFilesName
		);
			
			fs.mkdir("public/assets/multitracks/"+projectName, (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('Main directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/stems", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('Stems directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/protools", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('Pro Tools directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/logic", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('Logic directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/flstudio", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('FL Studio directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/cubase", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('Cubase directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/garageband", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('GarageBand directory created successfully!'); 
				});
			fs.mkdir("public/assets/multitracks/"+projectName+"/ableton", (err) => { 
					if (err) { 
						return console.error(err); 
					} 
					console.log('Ableton directory created successfully!'); 
				});
		
		var	exampleFilePath		= "/assets/multitracks/"+projectName+"/"+exampleFileName,
			stemsFilePath = "/assets/multitracks/"+projectName+"/stems/"+stemFilesName,
			proToolsFilePath = "/assets/multitracks/"+projectName+"/protools/"+proToolsFilesName,
			logicFilePath = "/assets/multitracks/"+projectName+"/logic/"+logicFilesName,
			flStudioFilePath = "/assets/multitracks/"+projectName+"/flstudio/"+flStudioFilesName,
			cubaseFilePath = "/assets/multitracks/"+projectName+"/cubase/"+cubaseFilesName,
			garageBandFilePath = "/assets/multitracks/"+projectName+"/garageband/"+garageBandFilesName,
			abletonFilePath = "/assets/multitracks/"+projectName+"/ableton/"+abletonFilesName;
		
		
		var newMultitrack = {
			projectName: projectName,
			artist: artist,
			key: key,
			bpm: bpm,
			genre: genre,
			description: description,
			example: exampleFilePath,
			author:author,
			
			stems: {
				exists: stemsExists,
				filePath: stemsFilePath
			},

			proTools: {
				exists: proToolsExists,
				filePath: proToolsFilePath
			},

			logic: {
				exists: logicExists,
				filePath: logicFilePath
			},

			flStudio: {
				exists: flStudioExists,
				filePath: flStudioFilePath
			},

			cubase: {
				exists: cubaseExists,
				filePath: cubaseFilePath
			},
			
			garageband: {
				exists: garageBandExists,
				filePath: garageBandFilePath
			},

			ableton: {
				exists: abletonExists,
				filePath: abletonFilePath
			},
		};
			
		Multitrack.create(newMultitrack, function(err, newlyCreated){
				if(err){
					console.log("Could not create Multitrack");
				} else {

					exampleFile.mv("public"+exampleFilePath, function(err){
					if(err){
						console.log(err);
						res.send("ERROR");
					}
					});
						
					stemFiles.mv("public"+stemsFilePath, function(err){
					if(err){
						console.log(err);
						res.send("STEM UPLOAD ERROR");
					}
					});
					
					
					if(proToolsExists){
						proToolsFiles.mv("public"+proToolsFilePath, function(err){
						if(err){
							console.log(err);
							res.send("PRO TOOLS UPLOAD ERROR");
						}
						});
					}
					
					if(logicExists){
						logicFiles.mv("public"+logicFilePath, function(err){
						if(err){
							console.log(err);
							res.send("LOGIC UPLOAD ERROR");
						}
						});
					}
					
					if(flStudioExists){
						flStudioFiles.mv("public"+flStudioFilePath, function(err){
						if(err){
							console.log(err);
							res.send("FL STUDIO UPLOAD ERROR");
						}
						});
					}

					if(cubaseExists){
					cubaseFiles.mv("public"+cubaseFilePath, function(err){
					if(err){
						console.log(err);
						res.send("CUBASE UPLOAD ERROR");
					}
					});
					}

					if(garageBandExists){
					garageBandFiles.mv("public"+garageBandFilePath, function(err){
					if(err){
						console.log(err);
						res.send("GARAGEBAND UPLOAD ERROR");
					}
					});
					}

					if(abletonExists){
					abletonFiles.mv("public"+abletonFilePath, function(err){
					if(err){
						console.log(err);
						res.send("ABLETON ERROR");
					}
					});
					}
					
				res.send("SUCCESS");				
				}
		});
		}
});	

// PACK SUBMISSION //
app.get("/submit/pack", isLoggedIn, function(req, res){
	res.render("submit-pack");
});

app.post("/submit/pack", isLoggedIn, function(req, res){
		if(req.files) {
		console.log(req.files);
		var file = req.files.file;
		var filename = file.name;
		console.log(filename);
		
		//MongoDB POST//
		
		var name 		= req.body.name,
			description = req.body.description,
			author = {
						id: req.user._id,
						username: req.user.username
					},
			image 		= "/pictures/pack/"+filename;
		
		var newPack = {
			name: name,
			description: description,
			image: image,
			author: author
		};
			
		Pack.create(newPack, function(err, newlyCreated){
				if(err){
					console.log("Could not create Pack");
				} else {

					file.mv("public/pictures/pack/"+filename, function(err){
					if(err){
						console.log(err);
						res.send("ERROR");
					} else {
						res.send("SUCCESS");
					}
		});
		}
	});
	}
});

// LOOP SUBMISSION // 

app.get("/submit/loop", isLoggedIn, function(req, res){
	Pack.find({},function(err, allPacks){
		if(err){
			console.log(err);
		} else {
			res.render("submit-loop.ejs",{packs:allPacks});
		}
	})
});

app.post("/submit/loop", isLoggedIn, function(req, res){
	if(req.files) {
		console.log(req.files);
		var file = req.files.file;
		var filename = file.name;
		console.log(filename);
		
		//MongoDB POST//
		
		var name 		= req.body.name,
			category 	= req.body.category,
			instrument 	= req.body.instrument,
			tag 		= req.body.tag,
			genre 		= req.body.genre,
			key 		= req.body.key,
			bpm			= req.body.bpm,
			filePath 	= "/assets/loops/"+filename,
			packName 	= req.body.packname,
			author = {
						id: req.user._id,
						username: req.user.username
					};
	
	function PostLoop(packval){
		Pack.find({"name": packval},function(err, foundPack){
			if(err){
				console.log(err);
			} else {
				
				// PULL PACK IMAGE DATA//
				var pack = foundPack;
				var packimage = pack[0].image;
				
				
				// SETUP NEW LOOP CREATION //
				var newLoop = {
				name: name, 
				category: category, 
				instrument: instrument, 
				tag: tag, 
				genre: genre,
				key: key,
				bpm: bpm,
				filePath: filePath,
				packName: packName,
				author: author,
				packImage: packimage,
				};
				
				// CREATE LOOP AND PUSH TO MONGODB //
				
				Loop.create(newLoop, function(err, newlyCreated){
					if(err){
						console.log("Could not create Loop");
					} else {
						
						// FIND SAMPLE IN DATABASE, GRAB ID AND INSER INTO PACK // 
						
						Loop.find({"name": req.body.name}, function(err, foundLoop){
							if(err){
								console.log(err);
							} else {
								console.log(foundLoop);
								
								// UPDATE PACK WITH SAMPLE ID //
								Pack.findOneAndUpdate(
								   { "name": packval }, 
								   { $push: { loops: foundLoop[0]._id } },
								  function (error, success) {
										if (error) {
											console.log(error);
										} else {
											console.log(success);
										}
									});
							}
						});
			// MOVE FILE FROM TEMP LOCATION TO PERMANENT LOCATION //

						file.mv("public/assets/loops/"+filename, function(err){
							if(err){
								console.log(err);
								res.send("ERROR");
							} else {
								res.render("success.ejs");
							}
						});
					}
				});
			}
		});
	}
	PostLoop(req.body.packname);
}
});

//======================
//AUTHORIZATION ROUTES
//======================

app.get("/register", function(req, res){
	res.render("register");
})

app.post("/register", function(req, res){
	if(req.files) {
		console.log(req.files);
		var file = req.files.file;
		var filename = file.name;
		console.log(filename);
	
		var newUser = new User({
			username: req.body.username,
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			campus: req.body.campus,
			bio: req.body.bio,
			role: "student",
			image: "/pictures/users/"+filename,
		});
		User.register(newUser, req.body.password, function(err, user){
			if(err){
			console.log(err);
			return res.render("register");
		}
			file.mv("public/pictures/users/"+filename, function(err){
				if(err){
					console.log(err);
					res.send("ERROR");
				}
			});
			
			passport.authenticate("local")(req, res, function(){
			res.redirect("/");
			});
		});
	}
});


// LOGIN FORM

app.get("/login", function(req, res){
	res.render("login");
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"}), function(req, res){
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/create");
});

//MIDDLEWARE FUNCTION
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}










// TEACH ROUTES //

app.get("*", function(req, res){
	res.render("index");
})

const port = process.env.PORT || 3000;

app.listen(port,function(){
	console.log("Request Made");
});

