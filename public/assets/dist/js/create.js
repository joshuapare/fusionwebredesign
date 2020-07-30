// MENU ACTIVE CLICKER
$(document).ready(function () {
    $('.nav a').click(function(e) {

        $('.nav a.active').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
});

// HEART CLICKER
$(document).ready(function () {
    $('.fa-heart').click(function(e) {

        $(this).toggleClass('fas');
        $(this).toggleClass('far');
        e.preventDefault();
    });
});

// WAVEFORM PLAY
$(document).ready(function () {
    $('.fa-play').click(function(e) {
        waveform.playPause();
    });
});




