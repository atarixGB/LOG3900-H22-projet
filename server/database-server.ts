const mongodb = require("mongodb");
const objectID = mongodb.objectID;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

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
      var avatar = post_data.avatar;
      var email = post_data.email
      

      var insertJson = {
        identifier: identifier,
        password: password,
        salt: salt,
        avatar: avatar,
        email: email,
      };

      var db = client.db("PolyGramDB");

      //check if identifier exists
      db.collection("users")
        .find({ identifier: identifier })
        .count(function (err, number) {
          if (number != 0) {
            response.json(406);
            console.log("identifier already exists");
          } else {
            //insert data
            db.collection("users").insertOne(insertJson, function (error, res) {
              response.json(201);
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

      var db = client.db("PolyGramDB");

      //check if identifier exists
      db.collection("users")
        .find({ identifier: identifier })
        .count(function (err, number) {
          if (number == 0) {
            response.json(404);
            console.log("identifier does not exists");
          } else {
            db.collection("users").findOne({ identifier: identifier },
              function (error, user) {
                var salt = user.salt; //get salt from user
                var hashed_password = checkHashPassword(
                  userPassword,
                  salt
                ).passwordHash; //hash password with salt
                var encrypted_password = user.password;
                if (hashed_password == encrypted_password) {
                  response.json(200);
                  console.log("login success");
                } else {
                  response.json(403);
                  console.log("wrong password");
                }
              }
            );
            }
          });
        });

    //Getting a user's data 
    app.get("/users", (request, response, next) => {
      
      var db = client.db("PolyGramDB");
      db.collection("users")
        .find({}).limit(50).toArray(function (err, result) {
          if (err) {
            response.status(400).send("Error fetching rooms");
          } else {
            response.json(result)
            console.log("add succes");
          }
        });
    });

    app.get("/profile/:username", (request, response, next) => {
    
      var identifier = request.params.username;
      console.log(identifier.toString());
      var db = client.db("PolyGramDB");

      //check if identifier exists
      db.collection("users").findOne(
        { identifier: identifier },
        function (error, result) {
          if (err) {
            console.log("error getting");
            response.status(400).send("Error fetching rooms");
          } else {
          console.log(result)
          response.json(result);
          console.log("Got user data for profile load: ", identifier);
        }
      }
      );
    });

    

    //start web server
    app.listen(SERVER_PORT, () => {
      console.log(
        `connected to MongoDB server, webserver running on port ${SERVER_PORT}`
      );
    });
  }
});
