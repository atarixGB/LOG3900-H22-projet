const mongodb = require("mongodb");
const objectID = mongodb.objectID;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require('mongoose');
//constants
const DATABASE_URL =
  "mongodb+srv://equipe203:Log3900-H22@polygramcluster.arebt.mongodb.net/PolyGramDB?retryWrites=true&w=majority";
const SERVER_PORT = 3000;

//express service
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//create mongoDB client
var mongoClient = mongodb.MongoClient;

//password utils
// create function to random SALT
var genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

var sha512 = function (password, salt) {
  var hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value,
  };
};

function salHashPassword(userPassword) {
  var salt = genRandomString(16); //create 16 random caracters
  var passwordData = sha512(userPassword, salt);
  return passwordData;
}

function checkHashPassword(userPassword, salt) {
  var passwordData = sha512(userPassword, salt);
  return passwordData;
}

mongoClient.connect(DATABASE_URL, { useNewUrlParser: true }, function (err, client) {

  const DB = client.db("PolyGramDB");

  if (err) {
    console.log("unable to connect to the mongoDB server error", err);
  } else {
    console.log("registering...");
    //register
    app.post("/register", (request, response, next) => {
      var post_data = request.body;

      var plaint_password = post_data.password;
      var hash_data = salHashPassword(plaint_password);

      var password = hash_data.passwordHash;
      var salt = hash_data.salt;

      var identifier = post_data.identifier;

      var insertJson = {
        identifier: identifier,
        password: password,
        salt: salt,
      };

      //check if identifier exists
      DB.collection("users")
        .find({ identifier: identifier })
        .count(function (err, number) {
          if (number != 0) {
            response.json(false);
            console.log("identifier already exists");
          } else {
            //insert data
            DB.collection("users").insertOne(insertJson, function (error, res) {
              response.json(true);
              console.log("Registration success");
            });
          }
        });
    });

    //login
    app.post("/login", (request, response, next) => {
      var post_data = request.body;

      var identifier = post_data.identifier;
      var userPassword = post_data.password;

      //check if identifier exists
      DB.collection("users")
        .find({ identifier: identifier })
        .count(function (err, number) {
          if (number == 0) {
            response.json(false);
            console.log("identifier does not exists");
          } else {
            //insert data
            DB.collection("users").findOne(
              { identifier: identifier },
              function (error, user) {
                var salt = user.salt; //get salt from user
                var hashed_password = checkHashPassword(
                  userPassword,
                  salt
                ).passwordHash; //hash password with salt
                var encrypted_password = user.password;
                if (hashed_password == encrypted_password) {
                  response.json(true);
                  console.log("login success");
                } else {
                  response.json(false);
                  console.log("wrong password");
                }
              }
            );
          }
        });
    });

    //create new album
    app.post("/albums", (request, response, next) => {
      DB.collection("albums").insertOne(request.body, (err, res) => {
        request.body._id = res.insertedId.toHexString();
        console.log(`Album "${request.body.name}" created successfully with ID: ${request.body._id}!`);
        // console.log(request.body);
        response.json(request.body);
      });
    })

    //get all public album
    app.get("/albums", (request, response, next) => {
      DB.collection("albums").find( {isPrivate : false} ).toArray((err, res) => {
        // console.log(res);
        response.json(res);
        ;
      })
    });

    //get user albums
    app.get("/albums/:username", (request, response, next) => {
      DB.collection("albums").find( { creator: request.params.username }).toArray((err, res) => {
        console.log(res);
        response.json(res);
        ;
      })
    });

    //update owner when leaving album
    app.put("/albums/:id", (request, response, next) => {
      let albumId = request.params.id;
      let newOwner = request.body.creator;
      console.log(albumId, newOwner);
      DB.collection("albums").findOneAndUpdate( { _id : mongoose.Types.ObjectId(albumId) }, { $set: { creator: newOwner } }, { returnDocument: 'after' }, (err, res) => {
          response.json(res);
      })});

    //delete album with specific id
    app.delete("/albums/:id", (request, response, next) => {
      let albumId = request.params.id;
      DB.collection("albums").findOneAndDelete({ _id: mongoose.Types.ObjectId(albumId) }, (err, res) => {
        console.log(res);
        console.log(`Album with id ${request.params.id} has been deleted successfully!`);
      })
    })

    //start web server
    app.listen(SERVER_PORT, () => {
      console.log(
        `connected to MongoDB server, webserver running on port ${SERVER_PORT}`
      );
    });
  }
});
