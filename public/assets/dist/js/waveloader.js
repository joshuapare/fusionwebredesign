
var waveloaders = [];

$(document).ready(function(){

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
    
    waveloaders[i].load(samples[i].filePath);

    $('#s'+i).

    }
}); 