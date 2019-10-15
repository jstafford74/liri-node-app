var dotEnv = require("dotenv").config();
const axios = require('axios');
var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown');
var moment = require('moment');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
const inquirer = require('inquirer');


//-----Bands in Town Object-----//
const bitData = {
  Name: "",
  Events: "",
  nextEvent: "",
  nextVenue: "",
  nextVenueCity: "",
  nextVenueCountry: ""
};

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

        const BIT = {
          type: 'input',
          name: 'BiT',
          message: 'Please enter the name of an artist or band you would like to search'
        }

        inquirer.prompt(BIT).then(answers => {

          const bitUrl1 = `https://rest.bandsintown.com/artists/${answers.BiT}?app_id=codingbootcamp`;
          const bitUrl2 = `https://rest.bandsintown.com/artists/${answers.BiT}/events?app_id=codingbootcamp`;

          const promise1 = axios.get(bitUrl1).then(
            function (response) {
              let bD = response.data;

              bitData.Name = bD.name;
              bitData.Events = bD.upcoming_event_count;
            });
          const promise2 = axios.get(bitUrl2).then(
            function (response) {
              let bD2 = response.data[0];
              bitData.nextEvent = bD2.datetime;
              bitData.nextVenue = bD2.venue.name;
              bitData.nextVenueCity = bD2.venue.city;
              bitData.nextVenueCountry = bD2.venue.country;
            });



          Promise.all([promise1, promise2]).then(function () {
            console.group(bitData.Name);
            console.log(`Upcoming Events: ${bitData.Events}`);
            console.group(`Next Event Date: ${bitData.nextEvent}`);
            console.log(`Venue: ${bitData.nextVenue}`);
            console.log(`Location: ${bitData.nextVenueCity}, ${bitData.nextVenueCountry}`);
            console.groupEnd();
            console.groupEnd();

          })
        })
        break;

      case 'spotify-this-song':
        var spotify = new Spotify(keys.spotify);
        const spot = {
          type: 'input',
          name: 'sPoT',
          message: 'Please enter the song name you would like to search: '
        }

        inquirer.prompt(spot).then(answers => {

          spotify
            .search({ type: 'track', query: answers.sPoT })
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
        });
        break;
      case 'movie-this':
        const MOV = {
          type: 'input',
          name: 'MoV',
          message: 'Please enter the name of a movie you would like to search'
        }
        inquirer.prompt(MOV).then(answers => {
          const queryUrl = `http://www.omdbapi.com/?t=${answers.MoV}&y=&plot=short&apikey=trilogy`;


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
        });
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
