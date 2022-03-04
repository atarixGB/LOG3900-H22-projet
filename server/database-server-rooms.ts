const mongodb = require("mongodb");
const objectID = mongodb.objectID;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//constants
const DATABASE_URL =
  "mongodb+srv://equipe203:Log3900-H22@polygramcluster.arebt.mongodb.net/PolyGramDB?retryWrites=true&w=majority";
const SERVER_PORT = 3001;

//express service
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//create mongoDB client
var mongoClient = mongodb.MongoClient;

mongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.log("unable to connect to the mongoDB server error", err);
  } else {
    console.log("creating...");
    app.post("/createRoom", (request, response, next) => {
      var post_data = request.body;

      var identifier = post_data.identifier;
      var roomName = post_data.roomName;
      

      var insertJson = {
        identifier: identifier,
        roomName: roomName,
      };

      var db = client.db("PolyGramDB");

      //check if identifier exists
      db.collection("rooms")
        .find({ roomName: roomName })
        .count(function (err, number) {
          if (number != 0) {
            response.json(406);
            console.log("room already exists");
          } else {
            //insert data
            db.collection("rooms").insertOne(insertJson, function (error, res) {
              response.json(201);
              console.log("Creation success");
            });
          }
        });
    });

    //join Room
    /*app.post("/joinRoom", (request, response, next) => {
      var post_data = request.body;

      var identifier = post_data.identifier;
      var roomName = post_data.roomName;

      var db = client.db("PolyGramDB");

      db.collection("rooms")
        .find({ roomName: roomName })
        .count(function (err, number) {
          db.collection("users").findOne({ identifier: identifier },
            function (error, user) {              
              response.json(200);
              console.log("join success");
            }
          );
        })
    });*/

    //start web server
    app.listen(SERVER_PORT, () => {
      console.log(
        `connected to MongoDB server, webserver running on port ${SERVER_PORT}`
      );
    });
  }
});
