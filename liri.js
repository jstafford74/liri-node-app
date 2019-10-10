var dotEnv = require("dotenv").config();
const axios = require('axios');
var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown');
var moment = require('moment');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
const inquirer = require('inquirer');


//-----Bands in Town-----//
// let artistName = process.argv.slice(2);
// var bitUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
var commAnd = {
  type: 'list',
  name: 'command',
  message: 'Which command would you like to give me?',
  choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
};

function main() {
  console.log('Hello..I am LIRI. Your Language Interpreter & Responsive Interface.');
  liriHouse();
}

function liriHouse() {
  inquirer.prompt(commAnd).then(answers => {

    switch (answers.command) {
      case 'concert-this':
        console.log('Bands in Town')
        let bitUrl = "https://rest.bandsintown.com/artists/ + artist + /events?app_id=codingbootcamp"
        break;

      case 'spotify-this-song':
        var spotify = new Spotify(keys.spotify);
        console.log('Spotify');
        spotify
          .search({ type: 'track', query: 'All the Small Things' })
          .then(function (response) {
            console.group(response.tracks.items[0].name);
            console.log('Artist Name: ' + response.tracks.items[0].artists[0].name);
            console.log('Album Name: ' + response.tracks.items[0].album.name);
            console.log('Preview Link: ' + response.tracks.items[0].artists[0].external_urls.spotify);
            console.groupEnd();
          })
          .catch(function (err) {
            console.log(err);
          });

        break;
      case 'movie-this':
        console.log('OMDB');
        let movieName = 'Superman';
        const queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;


        axios.get(queryUrl).then(
          function (response) {
            let movData = response.data;
            console.group(`${movData.Title}`);
            console.log(`Year: ${movData.Year}`);
            console.log(`${movData.Ratings[0].Source} : ${movData.Ratings[0].Value}`);
            console.log(`${movData.Ratings[1].Source} : ${movData.Ratings[1].Value}`);
            console.log(`Country: ${movData.Country}`);
            console.log(`Language: ${movData.Language}`);
            console.log(`Plot: ${movData.Plot}`);
            console.log(`Actors: ${movData.Actors}`);
            console.groupEnd();
          }).catch(function (error) {
            if (error.response) {
              console.log('---------------Data---------------');
              console.log(error.response.data);
              console.log('---------------Status---------------');
              console.log(error.response.status);
              console.log('---------------Status---------------');
              console.log(error.response.headers);
            } else if (error.request) {

              console.log(error.request);
            } else {

              console.log('Error', error.message);
            }
            console.log(error.config);
          })

        break;
      case 'do-what-it-says':
        console.log('Rando');
        break;
      default:
        console.log('Please enter a command')
    }

  })

}

main();
