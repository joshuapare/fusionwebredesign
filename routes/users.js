var express = require('express');
var router = express.Router();
var db = require("../models");
var aws = require("aws-sdk");

const S3_BUCKET = 'fusionwebredesign-assets';


router.get('/', function(req, res){
    console.log(req.user._id);
    db.User.findById(req.user._id)
    .then(function(user){
        res.json(user);
    })
    .catch(function(err){
        res.send(err);
    })
});

//-------------------------------------------------------------//

router.get('/favsamples', function(req, res){
    console.log(req.user._id);
    db.User.findById(req.user._id)
    .then(function(user){
        res.json(user.favSamples);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.post('/favsamples', function(req, res){
    console.log(req.user._id);
    console.log(req.body.id);
    db.Sample.find({"keyid": req.body.id})
    .then(function(foundSample){
        console.log(foundSample);
        db.User.findByIdAndUpdate(
            req.user._id, 
            {$push: {"favSamples": foundSample}},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                if (err){
                console.log(err); 
                } else {
                console.log(model);
                }
        });
    });
});

router.delete('/favsamples', function(req, res){
    db.Sample.find({"keyid": req.body.id})
    .then(function(foundSample){
        db.User.findByIdAndUpdate(
            req.user._id,
            {$pullAll: {"favSamples": foundSample}}
        )
        .then(function(user){
            res.json(user.favSamples);
        })
        .catch(function(err){
            res.send(err);
        })
    });
});

//-------------------------COLLECTIONS------------------------------------//
router.get("/collections", function(req, res){
    db.User.findById(req.user._id)
    .then(function(returned){
        var collections = returned.collections;
        db.Collection.find({
            '_id': { $in: collections}
        })
        .then(function(returned2){
            res.send(returned2);
        })
    })
})

router.post("/collections", function(req, res){
    // build new collection
    var newCollection = {
        name: req.body.name,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }

    // post new collection
    db.Collection.create(newCollection)
    .then(function(returnedCollection){
        console.log(returnedCollection);
        // ADD COLLECTION TO USER COLLECTION ARRAY // 
        db.User.findByIdAndUpdate(
            req.user._id, 
            {$push: {"collections": returnedCollection}},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                if (err){
                console.log(err); 
                } else {
                console.log(model);
                }
        });
    })
});






//-------------------------LOOPS------------------------------------//
router.get('/favloops', function(req, res){
    console.log(req.user._id);
    db.User.findById(req.user._id)
    .then(function(user){
        res.json(user.favLoops);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.get('/favmidi', function(req, res){
    console.log(req.user._id);
    db.User.findById(req.user._id)
    .then(function(user){
        res.json(user.favMidi);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.get('/fappacks', function(req, res){
    console.log(req.user._id);
    db.User.findById(req.user._id)
    .then(function(user){
        res.json(user.favPacks);
    })
    .catch(function(err){
        res.send(err);
    })
});

router.get('/fappresets', function(req, res){
    console.log(req.user._id);
    db.User.findById(req.user._id)
    .then(function(user){
        res.json(user.favPresets);
    })
    .catch(function(err){
        res.send(err);
    })
});

module.exports = router;