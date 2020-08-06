var express = require('express');
var router = express.Router();
var db = require("../models");
var aws = require("aws-sdk");
var nanoid = require("nanoid");

const S3_BUCKET = 'fusionwebredesign-assets';


router.get('/', function(req, res){
    db.Sample.find()
    .then(function(samples){
        res.json(samples);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.post('/one', function(req, res){
	console.log(req.body);
    db.Sample.findById(req.body.id)
    .then(function(samples){
        res.json(samples);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.post('/', function(req, res){
	console.log(req.body);
	console.log(req.files)
	db.Pack.find({"name": req.body.packName})
	.then(function(foundPack){

		// PULL PACK IMAGE DATA//
		var packimage = foundPack[0].image;

		// INITIATE S3 UPLOAD
		var path = 'audio/' + req.files.file.name;
		const params = {
			Bucket: S3_BUCKET,
			Key: path,
			Body: req.files.file.data
		};

		const s3 = new aws.S3({
			// HEROKU DEPLOYMENT
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY

		});

		s3.upload(params, function(err, data) {
			if (err) {
				console.log(err);
				throw err;
			}
			console.log(`File uploaded successfully. ${data.Location}`);
			
			// SETUP NEW SAMPLE CREATION //
			var newSample = {
			name: req.body.name, 
			keyid: "s" + nanoid.nanoid(),
			category: req.body.category, 
			instrument: req.body.instrument, 
			tag: req.body.tag, 
			genre: req.body.genre,
			key: req.body.key,
			filePath: data.Location,
			packName: req.body.packName,
			author: {
				id: req.user._id,
				username: req.user.username
			},
			packImage: packimage,
			};
			
			// CREATE SAMPLE AND PUSH TO MONGODB //
			
			db.Sample.create(newSample, function(err){
				if(err){
					res.send(err);
				} else {
					
					// FIND SAMPLE IN DATABASE, GRAB ID AND INSERT INTO PACK // 
					
					db.Sample.find({"keyid": newSample.keyid}, function(err, foundSample){
						if(err){
							console.log(err);
						} else {
							console.log(foundSample);
							
							// UPDATE PACK WITH SAMPLE ID //
							db.Pack.findOneAndUpdate(
							{ "name": newSample.packName }, 
							{ $push: { samples: foundSample[0]._id } },
							function (error, success) {
								if (error) {
									res.send(error);
								} else {
									res.send("Successfully uploaded! Feel free to refill out the form below with another sample and submit.");
								}
							});
						}
					});
				}
			});
		});
	});
});




module.exports = router;