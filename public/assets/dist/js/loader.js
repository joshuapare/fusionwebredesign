$(document).ready(function() {
    $('#dyncontent').load("/sampler.ejs", function(){
        $.getJSON("/api/samples")
        .then(loadSamples);
        
        $.getJSON("/api/samples")
        .then(loadWaveforms)

        $.getJSON('/api/users/favsamples')
        .then(function(data){
            data.forEach((item) => {
                var formData = new FormData();
                formData.append('id', item);

                $.ajax({
                    type: "POST",
                    url: "/api/samples/one",
                    data: formData,
                    processData: false,
                    contentType: false
                }).then(function(returned){
                    $('#h'+returned.keyid).toggleClass('fas');
                    $('#h'+returned.keyid).toggleClass('far');
                });

            });

        });

        $.getJSON('/api/users/collections')
        .then(function(data){
            // get collection name from returned json
            data.forEach((collection) => {
                $('#collectionList').append(
                    '<a class="dropdown-item collections" id="'+ collection._id +'">'+ collection.name +'</a>'
                );
            })
        })

        favoriteToggle();

        $('#dyncontent').fadeIn('slow');
        
    });
});

$(document).ready(function() {
    $( "#loops" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){
            $('#dyncontent').load("/loops.ejs", function(){
                favoriteToggle();
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

$(document).ready(function() {
    $( "#samples" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){ 
            $('#dyncontent').load("/sampler.ejs", function(){
                $.getJSON("/api/samples")
                .then(loadSamples);
                
                $.getJSON("/api/samples")
                .then(loadWaveforms);

                $.getJSON('/api/users/favsamples')
                .then(function(data){
                    data.forEach((item) => {
                        var formData = new FormData();
                        formData.append('id', item);

                        $.ajax({
                            type: "POST",
                            url: "/api/samples/one",
                            data: formData,
                            processData: false,
                            contentType: false
                        }).then(function(returned){
                            $('#h'+returned.keyid).toggleClass('fas');
                            $('#h'+returned.keyid).toggleClass('far');
                        });

                    });

                });
                
                favoriteToggle();
                $('#dyncontent').fadeIn('slow');
            });
        });
    });
});

$(document).ready(function() {
    $( "#midi" ).on( "click", function(){
        $('#dyncontent').fadeOut('slow', function(){   
            $('#dyncontent').load("midi.ejs", function(){
                favoriteToggle();
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

function loadSamples(samples){

    for (var i = 0; i < samples.length; i++) {
        var newSample = $(
                '<tr>'
                    +'<td><i class="fas fa-play" id="s'+ i +'"></i></td>'
                    +'<td><img class="samplerart" src="'+ samples[i].packImage +'"></td>'
                    +'<td>'+ samples[i].name +'</td>'
                    +'<td><div class="waveformrender" id="'+ samples[i].keyid +'"></div></td>'
                    +'<td>'
                    +   '<button type="button" class="btn btn-light">'+ samples[i].instrument +'</button>'
                    +   '<button type="button" class="btn btn-light">'+ samples[i].genre +'</button>'
                    +'</td>'
                    +'<td>'+ samples[i].key +'</td>'
                    +'<td>'+ samples[i].bpm +'</td>'
                    +'<td>'
                    +   '<i id="c'+samples[i].keyid+'" class="fas fa-plus" ></i>'
                    +   '<i id="h'+samples[i].keyid+'" class="far fa-heart"></i>'
                    +   '<a href="'+ samples[i].filePath +'" download><i class="fas fa-arrow-circle-down"></i></a>'
                    +'</td>'
                +'</tr>'
        );
        $('#samplerload').append(newSample);
    }
}

function loadWaveforms(samples) {

    const playclickers = document.querySelectorAll('.fa-play');
    var waveloaders = [];
            for (var i=0; i < samples.length; i++) {
                waveloaders[i] = WaveSurfer.create({
                                    container: '#'+samples[i].keyid,
                                    waveColor: '#D9DCFF',
                                    progressColor: '#4353FF',
                                    cursorColor: '#4353FF',
                                    barWidth: 1,
                                    barRadius: 3,
                                    cursorWidth: 0,
                                    height: 25,
                                    barGap: 2,
                                    fillParent: true,
                                    responsive: true
                                });
                // LOAD AUDIO DATA
                waveloaders[i].load(samples[i].filePath);
            }

        playclickers.forEach(function(element, index){
            element.addEventListener('click', () => { 
                waveloaders[index].play();
            });
        });
}

function favoriteToggle(){
    setTimeout(function(){
        $('.fa-heart').click(function(e) {

            e.preventDefault();
            var waveid = $(this).attr("id").substring(1);

            if ($(this).hasClass('far')){
                $.post("/api/users/favsamples", {id: waveid})
            }
            else if ($(this).hasClass('fas')){
                $.ajax({
                    type: "DELETE",
                    url: "/api/users/favsamples",
                    data: {id: waveid}
                })
            }

            $(this).toggleClass('fas');
            $(this).toggleClass('far');
            
        });
    }, 500);
}
