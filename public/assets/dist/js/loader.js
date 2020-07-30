// $(document).ready(function() {
//     $('#dyncontent').load("/sampler.ejs", function(){
//         $('#dyncontent').fadeIn('slow', function(){
//         });
//     });
// });

$(document).ready(function() {
    $( "#loops" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){
            $('#dyncontent').load("/loops.ejs", function(){
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

$(document).ready(function() {
    $( "#samples" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){ 
            Sample.find({},function(err, allSamples){
                if(err){
                    console.log(err);
                } else {
                    $('#dyncontent').load("sampler.ejs", {samples:allSamples}, function(){
                    $('#dyncontent').fadeIn('slow');
                    });
                }
            });
        });
    });
});

$(document).ready(function() {
    $( "#midi" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){   
            $('#dyncontent').load("midi.ejs", function(){
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

$(document).ready(function() {
    $( "#multitracks" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){   
            $('#dyncontent').load("multitracks.ejs", function(){
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

$(document).ready(function() {
    $( "#presets" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){   
            $('#dyncontent').load("presets.ejs", function(){
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

$(document).ready(function() {
    $( "#plugins" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){   
            $('#dyncontent').load("plugins.ejs", function(){
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

