var csv = require('fast-csv');
var request = require('request');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

// connect to database
mongoose.connect('mongodb://admin:awesomefyp@fypbackend.mooo.com:27017/dev?authSource=admin'
    , { useNewUrlParser: true });

var dataArr = [];
var apiURL = [];
var year = [];
var inital = 0;
var numberOfItems = inital;
var intervalID = 0;

// read data from file
csv.fromPath("movies.csv", { headers: true })
    .on("data", data => {
        // push data in to array
        dataArr.push(data);

        // get title
        var title = String(data.title);

        // get movie Name
        var movieName = title.substr(0, title.indexOf('('));

        // get movie Year
        var movieYear = title.substr(title.length - 5, title.length - 1).replace(")", "");

        // get the api request url
        var url = "https://api.themoviedb.org/3/search/movie?api_key=0f7f0c503ea285b9af1accef89a81dfd&language=en-US&include_adult=false&query=" + movieName

        // save the api request in array
        apiURL.push(url);

        // save the year in array
        year.push(movieYear);
    }).on("end", () => {
        // finished reading to dataArr
        // sort by movieId
        dataArr.sort(function (a, b) {
            return a.movieId - b.movieId;
        });

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

                        // check if it is valid
                        if (info.results.length >= 2) {
                            // sort to the cloest year
                            info.results.sort(function (a, b) {
                                distA = Math.abs(new Date(year[currentID]) - new Date(a.release_date));
                                distB = Math.abs(new Date(year[currentID]) - new Date(b.release_date));
                                return distA - distB;
                            });
                        }

                        // check if the data result is valid
                        if (info.results != null && info.results.length >= 1 && info.results[0].poster_path != null && info.results[0].overview != null) {
                            dataArr[currentID].poster_path = "https://image.tmdb.org/t/p/original" + info.results[0].poster_path;
                            dataArr[currentID].overview = info.results[0].overview;
                        }

                        // check if no valid poster path
                        if (dataArr[currentID].poster_path == null) {
                            dataArr[currentID].poster_path = "https://png.pngtree.com/element_origin_min_pic/16/07/05/23577bd40722106.jpg";
                        }

                        // check if no valid overview discrption
                        if (dataArr[currentID].overview == null) {
                            dataArr[currentID].poster_path = "no overview";
                        }

                        // print the result
                        console.log("\n");
                        console.log(currentID);
                        console.log(apiURL[currentID]);
                        console.log("dataArr[currentID].poster_path = " + dataArr[currentID].poster_path);

                        // estimate time that all the task will finish
                        var distance = (dataArr.length - currentID) * 251;
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

                        // if this is the last id
                        if (currentID == dataArr.length - 1) {

                            // add all items into database
                            console.log("adding");

                            // sorting
                            dataArr.sort(function (a, b) {
                                return a.movieId - b.movieId;
                            });
                            console.log(dataArr);

                            // add to database
                            Movie.insertMany(dataArr);

                            // stop the interval task
                            clearInterval(intervalID);
                        }
                    }
                })
            }
            numberOfItems++;
        }, 251);
    });



