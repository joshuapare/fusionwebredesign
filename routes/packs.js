var express = require('express');
var router = express.Router();
var db = require("../models");
var aws = require("aws-sdk");

const S3_BUCKET = 'fusionwebredesign-assets';

router.get('/', function(req, res){
    db.Pack.find()
    .then(function(packs){
        res.json(packs);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.post("/", function(req, res){
    
    // INITIATE S3 UPLOAD
    var path = 'images/' + req.files.file.name;
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
    
        //MongoDB POST//
        
        var newPack = {
            name: req.body.name,
            description: req.body.description,
            image: data.Location,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
            
        db.Pack.create(newPack)
        .then(function(){
            res.send("Pack created. Please use the tabs below to upload content to the pack.");
        })
        .catch(function(err){
            res.send(err);
        });
    });     
});

module.exports = router;