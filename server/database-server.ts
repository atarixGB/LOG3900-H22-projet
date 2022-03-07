const mongodb = require("mongodb");
const objectID = mongodb.objectID;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");

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
      var avatar = post_data.avatar;
      var email = post_data.email;
      var description = post_data.description;


      

      var insertJson = {
        identifier: identifier,
        password: password,
        salt: salt,
        avatar: avatar,
        email: email,
        description: description,
      };

      //check if identifier exists
      DB.collection("users")
        .find({ identifier: identifier })
        .count(function (err, number) {
          if (number != 0) {
            response.json(406);
            console.log("identifier already exists");
          } else {
            //insert data
            DB.collection("users").insertOne(insertJson, function (error, res) {
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

      //check if identifier exists
      DB.collection("users")
        .find({ identifier: identifier })
        .count(function (err, number) {
          if (number == 0) {
            response.json(404);
            console.log("identifier does not exists");
          } else {
            DB.collection("users").findOne({ identifier: identifier },
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

          console.log("USER", identifier);
          console.log("ROOM NAME", roomName);
          console.log("USERS LIST", usersList);
          
          var insertJson = {
            identifier: identifier,
            roomName: roomName,
            usersList: usersList
          };
  
    
          //check if room exists
          DB.collection("rooms")
            .find({ roomName: roomName })
            .count(function (err, number) {
              if (number != 0) {
                response.json(406);
                console.log("room already exists");
              } else {
                //insert data
                DB.collection("rooms").insertOne(insertJson, function (error, res) {
                  response.json(201);
                  console.log("Creation success");
                });
              }
            });
        });

        app.get("/getAllRooms", (request, response, next) => {
          var post_data = request.body;

          DB.collection("rooms")
            .find({}).limit(50).toArray(function (err, result) {
              if (err) {
                console.log("error getting");
                response.status(400).send("Error fetching rooms");
              } else {
                response.json(result)
                console.log(result, "add succes");
              }
            });
        });

        app.post("/joinRoom", (request, response, next) => {
          var post_data = request.body;
    
          var user = post_data.user;
          var roomName = post_data.roomName;

          DB.collection("rooms")
          .find({ roomName: roomName })
          .count(function (err, number) {
            if (number == 0) {
              response.json(404);
              console.log("room does not exists");
            } else {
              DB.collection("rooms").findOneAndUpdate({ roomName: roomName }, {"$push": {usersList: user}},
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

          DB.collection("rooms")
          .find({ roomName: roomName })
          .count(function (err, number) {
            if (number == 0) {
              response.json(404);
              console.log("room does not exists");
            } else {
              DB.collection("rooms").findOneAndUpdate({ roomName: roomName }, {"$pull": {usersList: user}},
                function (error, result) {
                    response.json(201);
                    console.log("room updated");
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
      })
    });          
            
    app.post("/deleteRoom", (request, response, next) => {
      var post_data = request.body;

      var roomName = post_data.roomName;

      DB.collection("rooms")
      .find({ roomName: roomName })
      .count(function (err, number) {
        if (number == 0) {
          response.json(404);
          console.log("room does not exists");
        } else {
          DB.collection("rooms").deleteOne({ roomName: roomName },
            function (error, result) {
                response.json(201);
                console.log("room deleted");
            }
          );
          }
        });
    });

    app.get("/getRoomParameters", (request, response, next) => {

      var post_data = request.query;
      var roomName = post_data.roomName;  

      DB.collection("rooms")
        .findOne({ roomName: roomName }, function (err, result) {
          if (err) {
            console.log("error getting");
            response.status(400).send("Error fetching rooms");
          } else {
            response.json(result)
            console.log("Getting One Room");
          }
        });
    });

    //create new album
    app.post("/albums", (request, response, next) => {
      DB.collection("albums").insertOne(request.body, (err, res) => {
        request.body._id = res.insertedId.toHexString();
        console.log(`Album "${request.body.name}" created successfully with ID: ${request.body._id}!`);
        response.json(request.body);
      });
    })

    //get all public album
    app.get("/albums", (request, response, next) => {
      DB.collection("albums").find( {isPrivate : false} ).toArray((err, res) => {
        response.json(res);
        ;
      })
    });

    //get user albums
    app.get("/albums/:username", (request, response, next) => {
      DB.collection("albums").find( { owner: request.params.username }).toArray((err, res) => {
        response.json(res);
        ;
      })
    });

    //update owner when leaving album
    app.put("/albums/:id", (request, response, next) => {
      let albumId = request.params.id;
      let memberToRemove = request.body.memberToRemove;
      DB.collection("albums").findOneAndUpdate({ _id : mongoose.Types.ObjectId(albumId) }, { $pull: { members: memberToRemove } }, { returnDocument: 'after' }, (err, res) => {
        response.json(res)
      })});

    //delete album with specific id
    app.delete("/albums/:id", (request, response, next) => {
      let albumId = request.params.id;
      DB.collection("albums").findOneAndDelete({ _id: mongoose.Types.ObjectId(albumId) }, (err, res) => {
        console.log(`Album with id ${request.params.id} has been deleted successfully!`);
      })
    })
    //Getting a user's data 
    app.get("/profile/:username", (request, response, next) => {
      var identifier = request.params.username;

      //check if identifier exists
      DB.collection("users").findOne(
        { identifier: identifier },
        function (error, user) {
          response.json(user);
          console.log("Got user data for profile load: ", identifier);
        }
      );
    });

    //Updating a users data
    app.post("/profileUpdate", (request, response, next) => { 
      var post_data = request.body;
      var oldUsername = post_data.oldUsername;
      var newUsername = post_data.newUsername;
      var avatar = post_data.newAvatar;
      var description = post_data.newDescription;
      var newEmail = post_data.newEmail;

      //check if a user already has the new name
      DB.collection("users")
        .find({ identifier: newUsername })
        .count(function (err, number) {
          if (number != 0 && oldUsername != newUsername) {
            response.json(false);
            console.log("identifier already exists");
          } else {
            // Update user data
            DB.collection("users").updateOne({ identifier: oldUsername }, {
              $set : {
                "identifier" : newUsername,
                "avatar" : avatar,
                "description" : description,
                "email":newEmail
              },
            }).then(result => {
              response.json(200);
            });
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
