# liri-node-app
Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

## Critical Elements:
- axios: https://www.npmjs.com/package/axios
- [X] installed
- Bands in Town: https://www.npmjs.com/package/bandsintown-rest
- [X] installed
- Spotify: https://www.npmjs.com/package/node-spotify-api
- [X] installed
- OMDB: http://www.omdbapi.com/
- [X] installed 
- Moment: https://www.npmjs.com/package/moment
- [X] installed
- DotEnv: https://www.npmjs.com/package/dotenv
- [X] installed

### Submission Guide
As this is a CLI App, it cannot be deployed to GitHub pages or Heroku. 
Include:
- Screenshots
- GIF
- and/or a video showing the app working with no bugs

You can include these screenshots/GIFs or a link to a video in a README.md file.
### Criteria for README.md submission file:
- [ ] Clearly state the problem the app is trying to solve (i.e. what is it doing and why)
- [ ] Give a high-level overview of how the app is organized
- [ ] Give start-to-finish instructions on how to run the app
- [ ] Include screenshots, gifs or videos of the app functioning
- [ ] Contain a link to a deployed version of the app
- [ ] Clearly list the technologies used in the app
- [ ] State your role in the app development

## Instructions

  - [X] Navigate to the root of your project and run npm init -y — this will initialize a package.json file for your project
  - [X] Make a .gitignore file and add the following lines to it:
    - node_modules
    - .DS_Store
    - .env

  - [X] Make a JavaScript file named keys.js.
      Inside keys.js your file will look like this:

           console.log('this is loaded');

           exports.spotify = {
             id: process.env.SPOTIFY_ID,
             secret: process.env.SPOTIFY_SECRET
           };

  - [X] Create a file named .env add the following to it(replacing the values with your API keys (no quotes) once you have them):

        # Spotify API keys

        SPOTIFY_ID=your-spotify-id
        SPOTIFY_SECRET=your-spotify-secret

This file will be used by the dotenv package to set what are known as environment variables to the global process.env object in node. These are values that are meant to be specific to the computer that node is running on, and since we are gitignoring this file, they won't be pushed to github — keeping our API key information private.

If someone wanted to clone your app from github and run it themselves, they would need to supply their own .env file for it to work.

- [X] Make a file called random.txt, inside of random.txt put the following in with no extra characters or white space:

      spotify-this-song,"I Want it That Way"

 - [X] Make a JavaScript file named liri.js. At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:

       require("dotenv").config();

 - [X] Add the code required to import the keys.js file and store it in a variable.

       var keys = require("./keys.js");


  - [X] You should then be able to access your keys information like so
       
       var spotify = new Spotify(keys.spotify);

  - [X] Make it so liri.js can take in one of the following commands:
      - [X] concert-this
      - [X] spotify-this-song
      - [X] movie-this
      - [X] do-what-it-says
      

## What Each Command Should Do:

## node liri.js concert-this <artist/band name here>
This will search the Bands in Town Artist Events API for an artist and render the following information about each event to the terminal:

#### Name of the venue

#### Venue location

#### Date of the Event (use moment to format this as "MM/DD/YYYY")


## node liri.js spotify-this-song <song name here>

This will show the following information about the song in your terminal/bash window

  - [X] Artist(s)
  - [X] The song's name
  - [X] A preview link of the song from Spotify
  - [X] The album that the song is from
  - [ ] If no song is provided then your program will default to "The Sign" by Ace of Base.
  - [X] You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.

## node liri.js movie-this <movie name here>

This will output the following information to your terminal/bash window:
  - [X] Title of the movie.
  - [X] Year the movie came out.
  - [X] IMDB Rating of the movie.
  - [X] Rotten Tomatoes Rating of the movie.
  - [X] Country where the movie was produced.
  - [X] Language of the movie.
  - [X] Plot of the movie.
  - [X] Actors in the movie.
  - [ ] If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'


## node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.

Edit the text in random.txt to test out the feature for movie-this and concert-this.

BONUS
  - [ ] In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
  - [ ] Make sure you append each command you run to the log.txt file.
  - [ ] Do not overwrite your file each time you run a command.
