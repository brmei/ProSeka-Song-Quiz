// GLOBAL VARIABLES
var waitingImage = "https://cdn.discordapp.com/attachments/1048432304575500320/1077849449876951111/image.png";
preloadImage(waitingImage);
updateWindow();
// maps for data
var bandsToListMap = {
    "VIRTUAL SINGER": 1,
    "Leo/need": 2,
    "MORE MORE JUMP!": 3,
    "Vivid BAD SQUAD": 4,
    "Wonderlands x Showtime": 5,
    "Nightcord at 25:00": 6
}
var vocalsToListMap = {
    "Hatsune Miku": 1,
    "Kagamine Rin": 2,
    "Kagamine Len": 3,
    "Megurine Luka": 4,
    "MEIKO": 5,
    "KAITO": 6,
    "Hoshino Ichika": 7,
    "Tenma Saki": 8,
    "Mochizuki Honami": 9,
    "Hinomori Shiho": 10,
    "Hanasato Minori": 11,
    "Kiritani Haruka": 12,
    "Momoi Airi": 13,
    "Hinomori Shizuku": 14,
    "Azusawa Kohane": 15,
    "Shiraishi An": 16,
    "Shinonome Akito": 17,
    "Aoyagi Toya": 18,
    "Tenma Tsukasa": 19,
    "Otori Emu": 20,
    "Kusanagi Nene": 21,
    "Kamishiro Rui": 22,
    "Yoisaki Kanade": 23,
    "Asahina Mafuyu": 24,
    "Shinonome Ena": 25,
    "Akiyama Mizuki": 26
}
// gameplay variables
var audio = new Audio();
var playerPauseFlag = false;
var playerSkipFlag = false;
var playerBackFlag = false;
// stat variables
var songShown = false;
var statShown = false;
var gameNumber = 0;
var prevScores = [];

// FUNCTION DECLARATONS
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function preloadImage(url)
{
    var img=new Image();
    img.src=url;
}

function preloadAudio(url) {
    var audio = new Audio();
    audio.src = url;
}

// collects list of song titles
function collectTitles(songs) {
    listOfTitles = []
    for (var i=0; i<songs.length; i++) {
        listOfTitles = [...listOfTitles, ...songs[i].title]
    }
    return listOfTitles
}

// reads input settings and produces a GameSetting from it
function readInputs() {
    return {
        // gameplay
        "numberOfSongs": $("#numberOfSongs").val(),
        "guessTime": $("#guessTime").val(),
        "randomSample": $("#randomSample").is(":checked"),
        // filtering options
        "duplicates": $("#duplicates").is(":checked"),
        "filterCoversBySingers": $("#filterCoversBySingers").is(":checked"),
        "matchAllBands": $("#matchAllBands").is(":checked"),
        "matchAllSingers": $("#matchAllSingers").is(":checked"),
        // song selection
        "serverEN": $("#serverEN").is(":checked"), // servers
        "serverJP": $("#serverJP").is(":checked"),
        "versionVSingersOn": $("#versionVSingersOn").is(":checked"), // song version
        "versionSekaiOn": $("#versionSekaiOn").is(":checked"),
        "versionCoversOn": $("#versionCoversOn").is(":checked"),
        "versionSpecial": $("#versionSpecial").is(":checked"),
        "versionInst": $("#versionInst").is(":checked"),
        "bandOther": $("#bandOther").is(":checked"), // bands
        "bandVS": $("#bandVS").is(":checked"),
        "bandLN": $("#bandLN").is(":checked"),
        "bandMMJ": $("#bandMMJ").is(":checked"),
        "bandVBS": $("#bandVBS").is(":checked"),
        "bandWXS": $("#bandWXS").is(":checked"),
        "band25JI": $("#band25JI").is(":checked"), // vocalists
        "vocalOther": $("#vocalOther").is(":checked"),
        "vocalMiku": $("#vocalMiku").is(":checked"),
        "vocalRin": $("#vocalRin").is(":checked"),
        "vocalLen": $("#vocalLen").is(":checked"),
        "vocalLuka": $("#vocalLuka").is(":checked"),
        "vocalMeiko": $("#vocalMeiko").is(":checked"),
        "vocalKaito": $("#vocalKaito").is(":checked"),
        "vocalIchika": $("#vocalIchika").is(":checked"),
        "vocalSaki": $("#vocalSaki").is(":checked"),
        "vocalHonami": $("#vocalHonami").is(":checked"),
        "vocalShiho": $("#vocalShiho").is(":checked"),
        "vocalMinori": $("#vocalMinori").is(":checked"),
        "vocalHaruka": $("#vocalHaruka").is(":checked"),
        "vocalAiri": $("#vocalAiri").is(":checked"),
        "vocalShizuku": $("#vocalShizuku").is(":checked"),
        "vocalKohane": $("#vocalKohane").is(":checked"),
        "vocalAn": $("#vocalAn").is(":checked"),
        "vocalAkito": $("#vocalAkito").is(":checked"),
        "vocalToya": $("#vocalToya").is(":checked"),
        "vocalTsukasa": $("#vocalTsukasa").is(":checked"),
        "vocalEmu": $("#vocalEmu").is(":checked"),
        "vocalNene": $("#vocalNene").is(":checked"),
        "vocalRui": $("#vocalRui").is(":checked"),
        "vocalKanade": $("#vocalKanade").is(":checked"),
        "vocalMafuyu": $("#vocalMafuyu").is(":checked"),
        "vocalEna": $("#vocalEna").is(":checked"),
        "vocalMizuki": $("#vocalMizuki").is(":checked")
    }
}

// takes a list and maps all values of it
function mapList(list, map) {
    // create a dictionary mapping vocal to ints
    var indexes = [];
    for (var i=0; i<list.length; i++) {
        if (list[i] in map) {
            indexes.push(map[list[i]]);
        } else {
            indexes.push(0); // element is other
        }
    }
    return indexes;
}

// takes gamesetting and applies a standard order to band booleans
function bandsToBitmask(GameSetting) {
    var mask = [];
    mask.push(GameSetting.bandOther, GameSetting.bandVS, GameSetting.bandLN, GameSetting.bandMMJ,
        GameSetting.bandVBS, GameSetting.bandWXS, GameSetting.band25JI);
    return mask;
}

// takes gamesetting and applies a standard order to vocal booleans
function vocalsToBitmask(GameSetting) {
    var mask = [];
    mask.push(GameSetting.vocalOther,
        GameSetting.vocalMiku, GameSetting.vocalRin, GameSetting.vocalLen,
        GameSetting.vocalLuka, GameSetting.vocalMeiko, GameSetting.vocalKaito,
        GameSetting.vocalIchika, GameSetting.vocalSaki, GameSetting.vocalHonami, GameSetting.vocalShiho,
        GameSetting.vocalMinori, GameSetting.vocalHaruka, GameSetting.vocalAiri, GameSetting.vocalShizuku,
        GameSetting.vocalKohane, GameSetting.vocalAn, GameSetting.vocalAkito, GameSetting.vocalToya,
        GameSetting.vocalTsukasa, GameSetting.vocalEmu, GameSetting.vocalNene, GameSetting.vocalRui,
        GameSetting.vocalKanade, GameSetting.vocalMafuyu, GameSetting.vocalEna, GameSetting.vocalMizuki);
    return mask;
}

// takes boolean list and list of indexes, checks if any are true
function filterListAny(list, indexes) {
    for (var i=0; i<indexes.length; i++) {
        if (list[indexes[i]]) {
            return true;
        }
    }
    return false;
}

// takes boolean list and list of indexes, checks if all are true
function filterListAll(list, indexes) {
    for (var i=0; i<indexes.length; i++) {
        list[indexes[i]] = false;
    }
    if (Object.values(list).includes(true)) {
        return false;
    }
    return true;
}

// takes settings and checks if song matches
function songFilter(song, GameSetting) {
    // check filters in order of size    
    // check servers
    var serverSome = false;
    var serverAll = true;
    if (GameSetting.serverEN) {
        if (song.server.includes("EN")) {
            serverSome = true;
        } else {
            serverAll = false
        }
    }
    if (GameSetting.serverJP) {
        if (song.server.includes("JP")) {
            serverSome = true;
        } else {
            serverAll = false
        }
    }
    // option to include songs in both servers if want
    if (!serverSome) {
        return null;
    }

    // check band
    var bandIndices = mapList(song.bands, bandsToListMap);
    var bandMask = bandsToBitmask(GameSetting);

    if (GameSetting.matchAllBands) {
        if(!filterListAll(bandMask, bandIndices)) {
            return null;
        }
    } else {
        if(!filterListAny(bandMask, bandIndices)) {
            return null;
        }
    }

    // check singers for every song
    var matchingAudio = []
    var matchingSingerAudio = [];
    var matchesFilter = true;
    for (var i=0; i<song.audio.length; i++) {
        var matchesFilter = true;

        var vocalIndices = mapList(song.audio[i].singers, vocalsToListMap); // turn names into mask indexes
        var vocalMask = vocalsToBitmask(GameSetting); // get vocalMask
        // check if any character is in them (any or all, could be a setting).
        if (GameSetting.matchAllSingers) {
            if(!filterListAll(vocalMask, vocalIndices)) {
                matchesFilter = false;
            }
        } else {
            if(!filterListAny(vocalMask, vocalIndices)) {
                matchesFilter = false;
            }
        }
        if (GameSetting.versionInst && song.audio[i].version == "Inst.") {
            matchesFilter = true;
        }
        // check versions
        if ([GameSetting.versionVSingersOn && song.audio[i].version == "VIRTUAL SINGER",
            GameSetting.versionSekaiOn && song.audio[i].version == "SEKAI",
            GameSetting.versionCoversOn && song.audio[i].version == "Cover",
            GameSetting.versionSpecial && song.audio[i].version == "Special",
            GameSetting.versionInst && song.audio[i].version == "Inst."].includes(true)) {
            // matches the specified versions
            matchingAudio.push(song.audio[i]);
            if (matchesFilter) {
                matchingSingerAudio.push(song.audio[i]);
            }
        }
        
    }
    if (matchingSingerAudio.length == 0) {
        return null;
    }
    // randomized selected cover
    var returnAudio;
    if (!GameSetting.filterCoversBySingers) {
        returnAudio = matchingAudio[Math.floor(Math.random() * matchingAudio.length)];
    } else {
        returnAudio = matchingSingerAudio[Math.floor(Math.random() * matchingSingerAudio.length)];
    }

    return returnAudio;
}

// takes game settings and chooses a list of songs that matches
function findSongs(songs, filter, GameSetting) {
    var indexes = [...Array(songs.length).keys()]; // list of indexes for songs
    var selectedSongs = []; // return list of SongSelection
    var i = GameSetting.numberOfSongs; // create counter for number of songs you want

    while (i > 0) {
        while (true) {
            // check if there are any more songs
            if (indexes.length == 0) {
                return selectedSongs;
            }
            // choose random song, check to see if it works
            var songIndex = indexes[Math.floor(Math.random() * indexes.length)];
            // check if duplicates are wanted
            if (!GameSetting.duplicates) {
                indexes.splice(indexes.indexOf(songIndex), 1); // remove song from list  
            }
            // apply filter
            var audio = filter(songs[songIndex], GameSetting);
            if (audio != null) {
                var selection = {"song": songs[songIndex], "audio": audio}; // create new SongSelection
                selectedSongs.push(selection); // add to return list
                   
                i--; // decrement counter
                break;
            }
        }
    }
    return selectedSongs;
}

// update info in side panel
function updateSongPanel(selection) {
    $("#songPanelId").text(selection.song.id);
    $("#songPanelTitle").text(selection.song.title.join(', '));
    $("#songPanelBand").text(selection.song.bands.join(', '));
    $("#songPanelServer").text(selection.song.server.join(', '));
    $("#songPanelDifficulty").text(selection.song.difficulties.join(', '));
    $("#songPanelCategory").text(selection.song.category.join(', '));
    $("#songPanelTime").text(selection.song.time);
    $("#songPanelArranger").text(selection.song.arranger);
    $("#songPanelComposer").text(selection.song.composer);
    $("#songPanelLyricist").text(selection.song.lyricist);
    $("#songPanelDance").text(selection.song["dance members"].join(', '));
    $("#songPanelATitle").text(selection.audio.title);
    $("#songPanelAVersion").text(selection.audio.version);
    $("#songPanelASinger").text(selection.audio.singers.join(', '));
}

// checks player input to see it's correct
function checkAnswer(song, answer) {
    for (var i=0; i<song.title.length; i++) {
        if (song.title[i].toLowerCase() == answer.toLowerCase()) {
            return true;
        }
    }
    return false;
}

// prints to stat
function printSong(num, songStat) {
    var text = num + ": " + songStat.song.title[songStat.song.title.length - 1];
    var color = "red";
    if (songStat.player.correct) {
        color = "green";
    }
    var statTag = $("<p>").text(text).css({"color": color});
    $("#statPanel").append(statTag);

    if (!songStat.player.correct && songStat.player.guess != "") {
        text = "Guess: " + songStat.player.guess;
        var guessTag = $("<p>").text(text).css({"padding-left": "1em"});
        $("#statPanel").append(guessTag);
    }
}

function printScore(score, numSongs) {
    var scoreTag = $("<p>").text("SCORE: " + score + "/" + numSongs);
    $("#statPanel").append(scoreTag);
}

// given a decimal, give a rank
function finalRank(score) {
    var scoreRank = {
        0: "D",
        1: "C",
        2: "B",
        3: "A",
        4: "S"
    }
    return scoreRank[Math.floor(score * 4)];
}

// MAIN FUNCTION
async function main() {
    // collect songs that match the criteria
    var settings = readInputs();
    var selectedSongs = findSongs(songs, songFilter, settings);
    // only play if there are songs
    if (selectedSongs.length == 0) {
        alert("No selected songs found");
        return;
    } else if (selectedSongs.length < settings.numberOfSongs) {
        alert("Not enough songs found, playing with " + selectedSongs.length + " songs");
    }

    // switch to game interface 
    $("#startScreen").hide();
    $("#gameScreen").show();
    $("#phaseEnd").hide();
    $("#scoreText").show();
    $("#gameInterface").show();
    $("#endInterface").hide();
    // setup game input
    var listOfTitles = collectTitles(songs);
    $("#songList").empty();
    for (var i=0; i<listOfTitles.length; i++) {
        var newOption = "<option value=\"" + listOfTitles[i] + "\">";
        $("#songList").append(newOption);
    }
    // setup stat sidepanel
    gameNumber++;
    var gameTag = $("<p>").text("Game #" + gameNumber).css({"text-decoration": "underline"});
    $("#statPanel").append(gameTag);
    // reset score
    var score = 0;
    $("#playerScore").text(score);
    
    // begin gameplay loop
    var i = 0;
    while (i < selectedSongs.length) {
        // preload data
        $("#playerGuess").val("");
        $("#playerGuess").prop("disabled", false);
        $("#songImage").attr("src", waitingImage);
        preloadImage(selectedSongs[i].song.image);
        $("#phaseGuess").show();
        $("#phaseReveal").hide();
        var songTitle = selectedSongs[i].song.title[selectedSongs[i].song.title.length - 1];
        $("#songTitle").text(songTitle);
        var t = settings.guessTime;
        $("#countdown").text(t);
        $("#songNumber").text(i+1 + "/" + selectedSongs.length);
        // preload next song
        if (i+1 < selectedSongs.length) {
            preloadAudio(selectedSongs[i+1].audio.links[0]);
        }

        // play audio with selected settings
        audio = new Audio(selectedSongs[i].audio.links[0]);
        audio.volume = $("#songVolume").val() / 100;
        // wait until metadata is loaded
        while (audio.readyState == 0) {
            await sleep(100);
        }
        // check if random sample is desired
        var startTime = 0;
        if (settings.randomSample) {
            var audibleTime = audio.duration - settings.guessTime // audible portion
            if (audibleTime < 0) {
                audibleTime = 0;
            }
            startTime = audibleTime * Math.random();
        }
        // wait audio is playable
        while (audio.readyState < 4) {
            await sleep(100);
        }
        audio.currentTime = startTime;
        audio.play();

        // countdown for guess phase
        while (t > 0) {
            $("#countdown").text(t);

            for (var t2 = 0; t2 < 10; t2++) {
                if (playerSkipFlag) {
                    break;
                } else if (playerPauseFlag) {
                    audio.pause();
                    $("#playerPause").text("Unpause");
                    $("#phaseGuess").text("Paused");
                    while (playerPauseFlag) {
                        await sleep(100);
                        if (!playerPauseFlag) {
                            break;
                        }
                    }
                    audio.play();
                    $("#playerPause").text("Pause");
                    $("#phaseGuess").text("Guessing Time");
                }
                await sleep(100);
            }
            if (playerSkipFlag) {
                $("#playerSkip").prop("disabled", false);
                playerSkipFlag = false;
                break;
            }

            t--;
        }

        // scoring
        var guess = $("#playerGuess").val();
        var correct = checkAnswer(selectedSongs[i].song, guess);
        if (correct) {
            score++;
            $("#playerScore").text(score);
            $("#songTitle").css("color", "green");
        } else {
            $("#songTitle").css("color", "red");
        }
        // save to stats
        var scoredSong = selectedSongs[i];
        var scoring = {"correct": correct, "guess": guess}
        scoredSong.player = scoring;
        printSong(i+1, scoredSong);
        // reveal
        $("#phaseGuess").hide();
        $("#phaseReveal").show();
        $("#songImage").attr("src", selectedSongs[i].song.image);
        $("#playerGuess").prop("disabled", true);
        updateSongPanel(selectedSongs[i]);
        // replay audio
        audio.currentTime = startTime;
        audio.play();
        // countdown for replay phase
        t = settings.guessTime;
        while (t > 0) {
            $("#countdown").text(t);

            for (var t2 = 0; t2 < 10; t2++) {
                if (playerSkipFlag) {
                    break;
                } else if (playerPauseFlag) {
                    audio.pause();
                    $("#playerPause").text("Unpause");
                    $("#phaseGuess").text("Paused");
                    while (playerPauseFlag) {
                        await sleep(100);
                        if (!playerPauseFlag) {
                            break;
                        }
                    }
                    audio.play();
                    $("#playerPause").text("Pause");
                    $("#phaseGuess").text("Guessing Time");
                }
                await sleep(100);
            }            
            if (playerSkipFlag) {
                $("#playerSkip").prop("disabled", false);
                playerSkipFlag = false;
                break;
            }

            t--;
        }

        // stop playing and increment
        audio.pause();
        i++;

        // check if player wants to exit
        if (playerBackFlag) {
            $("#playerBack").prop("disabled", false);
            playerBackFlag = false;
            break;
        }
    }

    // end phase
    audio.play();
    $("#finalScore").text(score + "/" + selectedSongs.length);
    $("#endRank").text("RANK: " + finalRank(score/selectedSongs.length));
    $("#phaseReveal").hide();
    $("#gameInterface").hide();
    $("#endInterface").show();
    
    printScore(score, selectedSongs.length);

    $("#phaseEnd").show();
    await sleep(10000);

    audio.pause();
    $("#startScreen").show();
    $("#gameScreen").hide();
}

// LISTENERS AND UI
function updateWindow() {
    $("#content").css({height: window.innerHeight});
    $(".panel").css({height: window.innerHeight});
    $(".reveal").css({top: window.innerHeight / 2 - 32});

    hidePanels();
}
window.addEventListener("resize", updateWindow);

function hidePanels() {
    newX = -0.2 * window.innerWidth;
    $("#songPanel").css({left: newX});
    $("#statPanel").css({right: newX});
    $("#songReveal").css({left: 0});
    $("#statReveal").css({right: 0});
    $("#statPanel").hide();
    $("#songPanel").hide();
    songShown = false;
    statShown = false;
}

$("#songVolumePre").click(function(e) {
    $("#songVolume").val(e.currentTarget.value);
    audio.volume = e.currentTarget.val() / 100;
})
$("#songVolume").click(function(e) {
    audio.volume = e.currentTarget.value / 100;
})

$("#vocalAll").click(function() {
    $(".vocal").prop("checked", $("#vocalAll").is(":checked"));
})

$("#startButton").click(function () {
    main();
});

$("#playerBack").click(function() {
    $("#playerBack").prop("disabled", true);
    playerBackFlag = true;
})
$("#playerSkip").click(function() {
    $("#playerSkip").prop("disabled", true);
    playerSkipFlag = true;
})
$("#playerPause").click(function() {
    playerPauseFlag = !playerPauseFlag;
})

$("#songReveal").click(function() {
    if (songShown) {
        hideSongPanel();
    } else {
        showSongPanel();
    }
})
$("#statReveal").click(function() {
    if (statShown) {
        hideStatPanel();
    } else {
        showStatPanel();
    }
})

async function showSongPanel () {
    $("#songPanel").show();
    $("#songPanel").css({'transition-duration': '0.5s'});
    $("#songReveal").css({'transition-duration': '0.5s'});
    newX = 0.2 * window.innerWidth;
    $("#songPanel").css({left: 0});
    $("#songReveal").css({left: newX});
    await sleep(500);
    $("#songPanel").css({'transition-duration': '0s'});
    $("#songReveal").css({'transition-duration': '0s'});
    songShown = true;
}
async function showStatPanel () {
    $("#statPanel").show();
    $("#statPanel").css({'transition-duration': '0.5s'});
    $("#statReveal").css({'transition-duration': '0.5s'});
    newX = 0.2 * window.innerWidth;
    $("#statPanel").css({right: 0});
    $("#statReveal").css({right: newX});
    await sleep(500);
    $("#statPanel").css({'transition-duration': '0s'});
    $("#statReveal").css({'transition-duration': '0s'});
    statShown = true;
}

async function hideSongPanel () {
    $("#songPanel").css({'transition-duration': '0.5s'});
    $("#songReveal").css({'transition-duration': '0.5s'});
    newX = -0.2 * window.innerWidth;
    $("#songPanel").css({left: newX});
    $("#songReveal").css({left: 0});
    await sleep(500);
    $("#songPanel").hide();
    $("#songPanel").css({'transition-duration': '0s'});
    $("#songReveal").css({'transition-duration': '0s'});
    songShown = false;
}
async function hideStatPanel () {
    $("#statPanel").css({'transition-duration': '0.5s'});
    $("#statReveal").css({'transition-duration': '0.5s'});
    newX = -0.2 * window.innerWidth;
    $("#statPanel").css({right: newX});
    $("#statReveal").css({right: 0});
    await sleep(500);
    $("#statPanel").hide();
    $("#statPanel").css({'transition-duration': '0s'});
    $("#statReveal").css({'transition-duration': '0s'});
    statShown = false;
}