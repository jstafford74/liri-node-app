var dotEnv = require("dotenv").config();
const axios = require('axios');
var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
const inquirer = require('inquirer');
const fs = require('fs');
const csv = require('csv-parser')

var Sep_2019 = require("./2019_SEPTEMBER.json");
var Oct_2019 = require("./2019_OCTOBER.json");
var Nov_2019 = require("./2019_NOVEMBER.json");
var Dec_2019 = require("./2019_DECEMBER.json");
var Jan_2020 = require("./2020_JANUARY.json");
var Feb_2020 = require("./2020_FEBRUARY.json");
var Mar_2020 = require("./2020_MARCH.json");
var Apr_2020 = require("./2020_APRIL.json");
var May_2020 = require("./2020_MAY.json");
var Jun_2020 = require("./2020_JUNE.json");
var Jul_2020 = require("./2020_JULY");
var Aug_2020 = require("./2020_AUGUST.json");
var Sep_2020 = require("./2020_SEPTEMBER.json");
var Oct_2020 = require("./2020_OCTOBER.json");
var Nov_2020 = require("./2020_NOVEMBER.json");
var Dec_2020 = require("./2020_DECEMBER.json");

const { toDate, format, getMonth } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const { Console } = require("console");

const nyTimeZone = 'America/New_York'
const DISTANCE_CONVERSION = 1609;

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

const dataDump = [
  { year: "2019", month: "Sep", data: Sep_2019 },
  { year: "2019", month: "Oct", data: Oct_2019 },
  { year: "2019", month: "Nov", data: Nov_2019 },
  { year: "2019", month: "Dec", data: Dec_2019 },
  { year: "2020", month: "Jan", data: Jan_2020 },
  { year: "2020", month: "Feb", data: Feb_2020 },
  { year: "2020", month: "Mar", data: Mar_2020 },
  { year: "2020", month: "Apr", data: Apr_2020 },
  { year: "2020", month: "May", data: May_2020 },
  { year: "2020", month: "Jun", data: Jun_2020 },
  { year: "2020", month: "Jul", data: Jul_2020 },
  { year: "2020", month: "Aug", data: Aug_2020 },
  { year: "2020", month: "Sep", data: Sep_2020 },
  { year: "2019", month: "Oct", data: Oct_2020 },
  { year: "2020", month: "Dec", data: Dec_2020 },
  { year: "2020", month: "Jan", data: Jan_2020 },
]
function convertStringToTimeDateStamp(string) {
  let date = toDate(Number(string)),
    nyDate = utcToZonedTime(date, nyTimeZone);
  return format(nyDate, 'yyyy-MM-dd hh:mm:ss zzz aaaa', { timeZone: 'America/New_York' })
}

function convertStringToDate(string) {
  let date = toDate(Number(string));
  return format(date, 'yyyy-MM-dd')
}

function main() {
  console.log('Hello..I am LIRI. Your Language Interpreter & Responsive Interface.');
  liriHouse();
}

function monthPlaces(data) {
  let placementArray = data.timelineObjects
    .filter(ea => ea.placeVisit);

  return placementArray.map((place) => {
    if (!place) {
      debugger;
      return null
    }
    let { placeVisit } = place
      , { location, duration } = placeVisit
      , { address, name } = location
      , { startTimestampMs, endTimestampMs } = duration
      , durationStart = convertStringToTimeDateStamp(startTimestampMs)
      , durationEnd = convertStringToTimeDateStamp(endTimestampMs)
      , date = convertStringToDate(startTimestampMs)
      ;

    return {
      [date]: {
        durationStart,
        durationEnd,
        address,
        name,
      }
    }
  })
}

function monthActivities(data) {
  let activityArray = data.timelineObjects
    .filter(ea => ea.activitySegment);

  return activityArray.map((activity) => {
    if (!activity) {
      debugger;
      return null
    }
    let { activitySegment } = activity;
    let { startLocation,
      endLocation,
      duration,
      distance,
      activityType,
    } = activitySegment;

    let { startTimestampMs, endTimestampMs } = duration;
    let durationStart = convertStringToTimeDateStamp(startTimestampMs);
    let durationEnd = convertStringToTimeDateStamp(endTimestampMs)
      , date = convertStringToDate(startTimestampMs)

    return {
      [date]: {
        durationStart,
        durationEnd,
        distance: Number.parseFloat(distance / DISTANCE_CONVERSION).toPrecision(4),
        startLoc: { lat: startLocation.latitudeE7, lon: startLocation.longitudeE7 },
        endLoc: { lat: endLocation.latitudeE7, lon: endLocation.longitudeE7 },
        activityType,
      }
    }
  })
}

function extractActionsAsCSV(activitiesArray) {
  const header = ["Year, Month, Total Dates, Total Miles, Avg Mile/Day"];

  let outputArray = activitiesArray.map((eachActivityArray) => {
    let totalMiles = null
      , avgMiles = null
      , { month, year, data } = eachActivityArray;

    var actionValues = Object.values(data);

    var actionMiles = actionValues.map(day => {
      let vals = Object.values(day)
      return vals.flatMap(ea => ea.distance)
    }).flatMap(mile => Number.parseFloat(mile).toPrecision(3));

    var actionDates = new Set(actionValues.flatMap(ea => Object.keys(ea)));

    if (actionMiles && actionMiles.length) {
      actionMiles = actionMiles.map(ea => {
        if (isNaN(ea)) {
          return 0
        }
        return Number.parseFloat(ea)
      })
    }
    totalMiles = actionMiles.reduce((a, b) => a + b, 0)
    avgMiles = Number.parseFloat(totalMiles / actionDates.size).toPrecision(4) || 0;

    return { year, month, totalDates: actionDates.size, totalMiles, avgMiles }
  });

  const rows = outputArray.map(ea =>
    `${ea.year}, ${ea.month}, ${ea.totalDates}, ${ea.totalMiles}, ${ea.avgMiles}`
  );

  return header.concat(rows).join("\n")
}

function extractPlacesAsCSV(placesArray) {

  const header1 = ["Year,Month,Total Dates, Total Places"];
  const header2 = ["Year,Month,Place, Count"];

  let outputArray = placesArray.map((eachPlaceArray) => {
    let { month, year, data } = eachPlaceArray;
    var placeValues = Object.values(data)
      , placeNames = placeValues.flatMap(ea => Object.values(ea))
      , placeDates = new Set(placeValues.flatMap(ea => Object.keys(ea)))
      , places = new Set(placeNames.map(place => place.name))
      , placeCount = []
      , placesSorted = null
      ;

    const reduced = (array, val) => {
      return array.filter((element) => element === val).length
    }

    [...places].forEach((pl) => {
      let nameArray = placeNames.map(ea => ea.name)
      placeCount.push({ year, month, place: pl, count: reduced(nameArray, pl) })
    })

    if (placeCount) {
      placesSorted = placeCount.sort((a, b) => b.count - a.count)
    }

    return {
      year,
      month,
      totalDates: placeDates.size,
      totalPlaces: places.size,
      placesSorted
    }
  })

  const rows1 = outputArray.map(ea => {
    let { year, month, totalDates, totalPlaces } = ea;

    return ` ${year},${month},${totalDates}, ${totalPlaces}`
  });


  let placesSorted = outputArray.map(month => month.placesSorted)
  placesSorted = placesSorted.flatMap((each) => each)
  const rows2 = placesSorted.map((each) => {
    let { year, month, place, count } = each;
    return `${year}, ${month}, ${place}, ${count}`
  })

  return header1.concat(rows1, header2, rows2).join("\n")
}

function runMonth(dataArray) {
  /*
  * ======Actions & Places======
  */

  var actionsArray = dataArray.map(each => {
    let { year, month, data } = each;
    return {
      year,
      month,
      data: monthActivities(data)
    }
  });
  var placesArray = dataArray.map(each => {
    let { year, month, data } = each;
    return {
      year,
      month,
      data: monthPlaces(data)
    }
  });

  const actionsFilename = "activities.csv";
  const placesFilename = "places.csv";

  fs.writeFile(actionsFilename, extractActionsAsCSV(actionsArray), err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.group("=========Actions Array=========")
      console.log("Done");
      console.log(`saved as ${actionsFilename}`);
      console.groupEnd()
    }
  });

  fs.writeFile(placesFilename, extractPlacesAsCSV(placesArray), err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.group("=========Places Array=========")
      console.log("Done");
      console.log(`saved as ${placesFilename}`);
      console.groupEnd()
    }
  });
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

            const text = `concert-this, "${bitData.Name}"`;
            fs.appendFile('log.txt', `\n${text}\n`, function (err) {
              if (err) {
                console.log(err);
              }
            });


          });
        });
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

              const text = `spotify-this-song, "${response.tracks.items[0].name}"`;
              fs.appendFile('log.txt', `\n${text}\n`, function (err) {
                if (err) {
                  console.log(err);
                }
              });

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

              const text = `movie-this, "${movData.Title}"`;
              fs.appendFile('log.txt', `\n${text}\n`, function (err) {
                if (err) {
                  console.log(err);
                }
              });

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


        // const text = process.argv[2];
        fs.readFile('random.txt', 'utf8', function (error, data) {
          if (error) {
            return console.log(error);
          }
          const dataArr = data.split(',').map((it) => it.trim());
          console.log(dataArr[0]);
          console.log(dataArr[1]);
        });
        // // Next, we append the text into the "sample.txt" file.
        // // If the file didn't exist, then it gets created on the fly.
        // fs.appendFile('sample.txt', `, ${text}\n`, function (err) {

        //   // If an error was experienced we will log it.
        //   if (err) {
        //     console.log(err);
        //   } else { // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        //     console.log('Content Added!');
        //   }

        // });
        break;
      default:
        console.log('Please enter a command')
    }

  })

}

// main();
runMonth(dataDump)
// Promise.all(
//   [runMonth("2019", "Sep", Sep_2019),
//   runMonth("2019", "Oct", Oct_2019),
//   runMonth("2019", "Nov", Nov_2019),
//   runMonth("2019", "Dec", Dec_2019),
//   runMonth("2020", "Jan", Jan_2020),
//   runMonth("2020", "Feb", Feb_2020),
//   runMonth("2020", "Mar", Mar_2020),
//   runMonth("2020", "Apr", Apr_2020),
//   runMonth("2020", "May", May_2020),
//   runMonth("2020", "Jun", Jun_2020),
//   runMonth("2020", "Jul", Jul_2020),
//   runMonth("2020", "Aug", Aug_2020),
//   runMonth("2020", "Sep", Sep_2020),
//   runMonth("2020", "Oct", Oct_2020),
//   runMonth("2020", "Nov", Nov_2020),
//   runMonth("2020", "Dec", Dec_2020)]
// )
//   .then(resp => console.log("done"));