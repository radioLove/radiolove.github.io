var player = $("#radio-player");
var baseUrl = "audio/";
var jingles = [];
var songs = [];
var usedSongs = [];
var usedJingles = [];

$(document).ready(function () {
    $.get("https://api.github.com/repos/radiolove/radiolove.github.io/contents/audio/songs", function(songResults){
        songs = JSON.parse(songResults);

        $.get("https://api.github.com/repos/radiolove/radiolove.github.io/contents/audio/songs", function(jingleResults){
            jingles = JSON.parse(jingleResults);
        });

        if(songs.length === 0 && jingles.length === 0) {
            return;
        }

        switchAudio(
            player,
            nextAudio()
        );

        player.on('ended', function(){
            switchAudio(
                $(this),
                nextAudio()
            );

            if(songs.length === 0) {
                songs = usedSongs;
                songs.length = usedSongs.length;
                usedSongs = [];
            }

            if(jingles.length === 0) {
                jingles = usedJingles;
                jingles.length = usedJingles.length;
                usedJingles = [];
            }
        });
    });
});

function switchAudio(player, src) {
    player[0].src = src;
    player[0].pause();
    player[0].load();
    player[0].play();
}

function nextAudio() {
    var src = "";
    var index = null;
    var dispersionIndex = getRandomIntInclusive(1, 10);

    if(dispersionIndex > 3) {
        index = getRandomIntInclusive(0, songs.length-1);
        src = baseUrl+songs[index].path;
        usedSongs.push(songs.splice(index, 1));
    } else {
        index = getRandomIntInclusive(0, jingles.length-1);
        src = baseUrl+jingles[index].path;
        usedJingles.push(jingles.splice(index, 1))
    }

    console.log(songs.length, usedSongs.length, jingles.length, usedJingles.length);

    return src;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
