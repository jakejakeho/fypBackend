var csv = require('fast-csv');
var request = require('request');
const mongoose = require('mongoose');
const Movie = require('../api/models/movie');

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
                numberOfItems = 0;
                // save the task interval ID for later clear
                intervalID = setInterval(function () {

                    // remember the id 
                    const currentID = numberOfItems;
                    if (currentID < dataArr.length) {
                        // request from the online api server
                        request(apiURL[currentID], function (error, response, body) {
                            if (!error && response.statusCode == 200) {

                                // prase to object
                                var info = JSON.parse(body);

                                // check if the data result is valid
                                if (info != null && info.poster_path != null && info.overview != null) {
                                    dataArr[currentID].poster_path = "https://image.tmdb.org/t/p/original" + info.poster_path;
                                    dataArr[currentID].overview = info.overview;
                                    dataArr[currentID].release_date = info.release_date;
                                }

                                request(videoURL[currentID], function (error, response, body) {
                                    // prase to object
                                    var info = JSON.parse(body);

                                    // check if the data result is valid
                                    if (info != null && info.results != null && info.results.length > 0 && info.results[0].key != null) {
                                        dataArr[currentID].trailerId = info.results[0].key;
                                    }


                                    request(actorURL[currentID], function (error, response, body) {
                                        // print the result
                                        console.log("\n");
                                        console.log(currentID);
                                        console.log(apiURL[currentID]);
                                        console.log(videoURL[currentID]);
                                        console.log(actorURL[currentID]);
                                        //prase to object
                                        var info = JSON.parse(body);

                                        //check if the data result is valid
                                        if (info != null && info.cast != null && info.cast.length > 0)
                                            //add all actor to data
                                            dataArr[currentID].actorName = "";
                                        for (var i = 0; i < info.cast.length; i++) {
                                            // check for validation
                                            if (info.cast[i].name != null)
                                                dataArr[currentID].actorName += info.cast[i].name + "|";
                                        }


                                        console.log(dataArr[currentID]);

                                        Movie.insertMany(dataArr[currentID]);

                                        // estimate time that all the task will finish
                                        var distance = (dataArr.length - currentID) * 751;
                                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                        console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

                                        // if this is the last id
                                        if (currentID == dataArr.length - 1) {
                                            // stop the interval task
                                            clearInterval(intervalID);
                                        }
                                    });
                                });
                            }
                        });
                    }
                    numberOfItems++;
                }, 1000);
            });
    });




