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
      

      var insertJson = {
        identifier: identifier,
        password: password,
        salt: salt,
        avatar: avatar,
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
        }
      );
        app.post("/createRoom", (request, response, next) => {
          var post_data = request.body;
    
          var identifier = post_data.identifier;
          var roomName = post_data.roomName;
          var usersList = post_data.usersList;
          
          
    
          var insertJson = {
            identifier: identifier,
            roomName: roomName,
            usersList: usersList
          };
    
          var db = client.db("PolyGramDB");
    
          //check if room exists
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

        app.get("/getRooms", (request, response, next) => {
          var post_data = request.body;
  
    
          var db = client.db("PolyGramDB");

          db.collection("rooms")
            .find({}).limit(50).toArray(function (err, result) {
              if (err) {
                console.log("error getting");
                response.status(400).send("Error fetching rooms");
              } else {
                response.json(result)
                console.log("add succes");
              }
            });
        });

        app.post("/joinRoom", (request, response, next) => {
          var post_data = request.body;
    
          var user = post_data.user;
          var roomName = post_data.roomName;
          
    
          var db = client.db("PolyGramDB");

          db.collection("rooms")
          .find({ roomName: roomName })
          .count(function (err, number) {
            if (number == 0) {
              response.json(404);
              console.log("room does not exists");
            } else {
              db.collection("rooms").findOneAndUpdate({ roomName: roomName }, {"$push": {usersList: user}},
                function (error, result) {
                    response.json(201);
                    console.log("room updated");
                }
              );
              }
            });
        });

        app.post("/quitRoom", (request, response, next) => {
          var post_data = request.body;
    
          var user = post_data.user;
          var roomName = post_data.roomName;
          
    
          var db = client.db("PolyGramDB");

          db.collection("rooms")
          .find({ roomName: roomName })
          .count(function (err, number) {
            if (number == 0) {
              response.json(404);
              console.log("room does not exists");
            } else {
              db.collection("rooms").findOneAndUpdate({ roomName: roomName }, {"$pull": {usersList: user}},
                function (error, result) {
                    response.json(201);
                    console.log("room updated");
                }
              );
              }
            });
        });

        app.delete("/deleteRoom", (request, response, next) => {
          var post_data = request.body;
    
          var roomName = post_data.roomName;
          
    
          var db = client.db("PolyGramDB");

          db.collection("rooms")
          .find({ roomName: roomName })
          .count(function (err, number) {
            if (number == 0) {
              response.json(404);
              console.log("room does not exists");
            } else {
              db.collection("rooms").deleteOne({ roomName: roomName },
                function (error, result) {
                    response.json(201);
                    console.log("room deleted");
                }
              );
              }
            });
        });


    //start web server
    app.listen(SERVER_PORT, () => {
      console.log(
        `connected to MongoDB server, webserver running on port ${SERVER_PORT}`
      );
    });
  }
});
