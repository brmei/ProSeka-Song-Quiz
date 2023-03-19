# Proseka Song Quiz!
<sup>developed by <a href="https://github.com/The85thLetter">The85thLetter</a> and <a>DDia</a></sup>

<a>ProSeka Song Quiz</a> is a game that allows players to test their song knowledge of Project Sekai. It is modeled after <a href="https://animemusicquiz.com/">AMQ</a>, adding more customization features specifically around ProSeka.

All the code runs locally, but the assets are grabbed directly from other websites. This means this game will not work offline unless the database is updated to reference local files. If anyone wants to do that, feel free. Just update the information in songs.js.

Assets sourced from <a href="https://sekai.best/">Sekai Viewer</a> and <a href="https://projectsekai.fandom.com/wiki/Project_SEKAI_Wiki">Project SEKAI Wiki</a>.

# How to Play
## Game Settings
On the main screen, choose the settings you want to play with! _By default, settings are set for general EN players_. When you are ready, hit the __START__ button to begin the game. More details about each setting can be found under changelog (CTRL+F to find a specific setting).

## Guessing Phase
When a game starts, the program selects a list of songs that fall under the specifications of the settings and shuffles them. If not enough songs are found, the game will alert the player before starting.

Once the songs are selected, they are played one by one for the player to guess them. The game keeps track of which songs are guessed correctly/incorrectly.

In the center of the game screen, an [input box] is provided. Enter the correct name of the song in order to earn a point. Any official variation of the name will be counted as correct. A timer will be counting below it. When the timer reaches 0, the game moves onto the __Reveal Phase__. The player can also press __Skip Phase__ to skip the timer.

## Reveal Phase
The title of the corresponding song will be shown at the top. If correct, it will be <span style="color:green">green</span>. If incorrect, it will be <span style="color:red">red</span>. When the guess is correct, the score counter will increase.

## End Phase
When all the songs have been played, the final score and a corresponding rank is shown. After 5 seconds, the player will return to the main screen.

# Other Features
## Song Control
A volume slider and pause button are included for player control. Use pause button at your own discretion.

## Side Panels
Two side panels are provided for player convenience. The one on the left displays information about the last song and the specific cover played. Song information from Sekai Viewer shown here. The panel on the right keeps track of the songs that the player guessed correctly or incorrectly.


# Planned Features
- EN Exclusive songs (Highlight, Music Like Magic!, Sharing the World, Blue Star)
- Inclusion of 2DMV
- Different guessing information (given information is customizable like by image, group, singers, etc.)
- Different answering modes (choice to answer using different song information like group, singers, cover title, etc.)
- God is a Woman

# Changelog
## 2-22-23
Initial Release with basic features:
- Songs of ID up to 100 included
- Song selection and guess verification system
- Customizable amount of songs, guess time, and song starting point
- Score and song number tracker
- Dropdown to select song name, or to click filtered song name after typing a part of it
- Allows filtering of songs using the following specifications
    - Duplicate Songs, Filter Cover by Vocals, Match All Groups, Match All Singers (more detail below)
    - Song server (EN or JP)
    - Song version (VSINGER, SEKAI, Cover, Special)
    - Groups
    - Character Vocals
- Buttons to skip timer and exit game
- Three separate phases in the gameplay loop
    - Guessing phase where player inputs their guess in the box
    - Reveal phase where song information is shown
    - End screen displaying final score and rank
- Volume Slider!

More details about "Filtering Settings":
> <u>Duplicate Songs</u> allows the same song to be selected multiple times.

> <u>Filter Cover by Vocals</u> only plays audio that matches the specified vocals selection.

> <u>Match All Groups</u> only plays songs that include ALL the specified bands. By default, songs that contain ANY selected band are selected.

> <u>Match All Singers</u> only plays songs that include ALL the specified vocals. By default, songs that contain ANY selected vocals are selected.

## 3-19-23
Addition of cleaner UI and quality of life features:
- Settings reorganized to be cleaner
- Background window now surrents the settings
- Icons for groups and singers are now shown beside their respective checkboxes
- START button now matches design of everything else
- Added pause button
- Return and Skip buttons now respond faster
- Addition of side panels
    - Song Panel displays song information
    - Stat Panel displays player statistics of previous games in session
    - When there is more information than can fit on screen, a scrollbar is shown
- Alert is now played when not enough songs are found
- Included all songs in Project Sekai as of March 19, 2023
- Added support for instrumental songs (End Mark ni Kibou to Namida wo soete, the EmpErroR, Don't Fight the Music)
- Bug Fixes:
    - Gameplay proceeds even when no songs are found
    - Some song information is corrected
# Contact
## The85thLetter

<u>Email</u>: The85thLetter@gmail.com

<u>Discord</u>: The85thLetter#9504