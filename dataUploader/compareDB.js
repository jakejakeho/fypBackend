var csv = require('fast-csv');
var request = require('request');
const mongoose = require('mongoose');
const Movie = require('../api/models/movie');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'diff.csv',
    header: [
        { id: 'movieId', title: 'movieId' },
        { id: 'title', title: 'title' },
        { id: 'genres', title: 'genres' }
    ]
});
// connect to database
mongoose.connect('mongodb://admin:awesomefyp@fypbackend.mooo.com:27017/dev?authSource=admin'
    , { useNewUrlParser: true });

var dataArr = [];
var apiURL = [];
var videoURL = [];
var actorURL = [];
var inital = 0;
var numberOfItems = inital;
var intervalID = 0;
var movieMap = [];


csv.fromPath("movies.csv", { headers: true })
    .on("data", data => {
        // push data in to array
        dataArr.push(data);
    }).on("end", () => {
        // read data from file
        csv.fromPath("links.csv", { headers: true })
            .on("data", data => {
                // get tmdbId
                var tmdbId = String(data.tmdbId);

                // get the api request url
                var url = "https://api.themoviedb.org/3/movie/" + tmdbId + "?api_key=0f7f0c503ea285b9af1accef89a81dfd&language=en-US";
                var videourl = "http://api.themoviedb.org/3/movie/" + tmdbId + "/videos?api_key=0f7f0c503ea285b9af1accef89a81dfd";
                var actorurl = "https://api.themoviedb.org/3/movie/" + tmdbId + "/credits?api_key=0f7f0c503ea285b9af1accef89a81dfd";
                // save the api request in array
                apiURL.push(url);
                videoURL.push(videourl);
                actorURL.push(actorurl);
            }).on("end", () => {
                // finished reading to dataArr
                // sort by movieId
                dataArr.sort(function (a, b) {
                    return a.movieId - b.movieId;
                });
                console.log(dataArr);

                Movie.find({}, function (err, movies) {
                    var id = 0;
                    movies.forEach(function (movie) {
                        console.log(id);
                        movieMap[id++] = movie;
                    });
                    console.log(movieMap);
                    console.log("comparing DB...");

                    var uniqueResultOne = dataArr.filter(function (obj) {
                        return !movieMap.some(function (obj2) {
                            return parseInt(obj.movieId) == parseInt(obj2.movieId);
                        });
                    });

                    //Find values that are in result2 but not in result1
                    var uniqueResultTwo = movieMap.filter(function (obj) {
                        return !dataArr.some(function (obj2) {
                            return parseInt(obj.movieId) == parseInt(obj2.movieId);
                        });
                    });

                    //Combine the two arrays of unique entries
                    var result = uniqueResultOne.concat(uniqueResultTwo);
                    console.log("diff1");
                    console.log(result);
                    console.log("diff2");

                    csvWriter.writeRecords(result)       // returns a promise
                        .then(() => {
                            console.log('...Done');
                        });
                });
            });
    });




