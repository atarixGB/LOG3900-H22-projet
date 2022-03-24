const mongodb = require("mongodb");
const objectID = mongodb.objectID;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const socket = require('socket.io');

const multer = require('multer')
const path = require('path');

// Include the node file module
var fs = require('fs');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    return crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) {
        return cb(err);
      }
      return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
    });
  }
});

//constants
const DATABASE_URL =
  "mongodb+srv://equipe203:Log3900-H22@polygramcluster.arebt.mongodb.net/PolyGramDB?retryWrites=true&w=majority";
const SERVER_PORT = 3001;

//express service
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin:true,credentials: true}));

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
//==========================================================================================================
// Accout Registration and login
//==========================================================================================================
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
            //check if email is already used
            DB.collection("users")
            .find({ email: email })
            .count(function (err, number) {
              if (number != 0) {
                response.json(406);
                console.log("email already used");
              } else { 
                //insert data
                DB.collection("users").insertOne(insertJson, function (error, res) {
                  response.json(201);
                  console.log("Registration success");
                });
              }
            });
          }
        });
    });

    //login
    app.post("/login", (request, response, next) => {
      var post_data = request.body;
      var email = post_data.email;
      var userPassword = post_data.password;

      //check if identifier exists
      DB.collection("users")
        .find({ email: email })
        .count(function (err, number) {
          if (number == 0) {
            response.json(404);
            console.log("email does not exists");
          } else {
            DB.collection("users").findOne({ email: email },
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

    //Getting a user's data with email
    app.get("/login/:email", (request, response, next) => {
      var email = request.params.email;

      //check if identifier exists
      DB.collection("users").findOne(
        { email: email },
        function (error, user) {
          response.json(user.identifier);
          console.log("Got username after login: ", user.identifier);
        }
      );
    });

    //get all users
    app.get("/getAllUsers", (request, response, next) => {
      var post_data = request.body;

      DB.collection("users")
        .find({}).limit(50).toArray(function (err, result) {
          if (err) {
            response.status(400).send("Error fetching rooms");
          } else {
            response.json(result)
          }
        });
    });

//==========================================================================================================
// ROOM management
//==========================================================================================================
      
    //Rooms
    app.post("/createRoom", (request, response, next) => {
      var post_data = request.body;

      var identifier = post_data.identifier;
      var roomName = post_data.roomName;
      var usersList = post_data.usersList;

      if (typeof usersList === 'string' || usersList instanceof String) {
        usersList = [post_data.usersList];
        console.log("apress", request.body.usersList);
      }

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
            DB.collection("rooms").findOneAndUpdate({ roomName: roomName }, { "$push": { usersList: user } },
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
            DB.collection("rooms").findOneAndUpdate({ roomName: roomName }, { "$pull": { usersList: user } },
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
//==========================================================================================================
// Drawing Management
//==========================================================================================================
    //create drawing
    app.post("/drawing/create", (request, response, next)=> {
      DB.collection("drawings").insertOne(request.body, (err, res) => {
        const drawingData = request.body; 
        drawingData._id = res.insertedId.toHexString();
        console.log(`Drawing "${drawingData.name}" created successfully with ID: ${drawingData._id}!`);
        response.json(drawingData._id); // Drawing ID is send back to client. We will use it to add the corresponding drawing to an album
      })
    })

    //get drawing Parameters
    app.get("/getDrawingParameters/:drawingId", (request, response, next) => {

      var post_data = request.params;
      var drawingId = post_data.drawingId.replaceAll(/"/g, ''); //? pour enlever les "" 

      DB.collection("drawings")
        .findOne({ _id: mongoose.Types.ObjectId(drawingId) }, function (err, result) {
          if (err) {
            console.log("error getting");
            response.status(400).send("Error fetching albums");
          } else {
            response.json(result);
            console.log("Getting One Drawing", result);
          }
        });
    });

    //get all user drawings in DB
    app.get("/getAllUserDrawings/:user", (request, response, next) => {
      var user = request.params.user.replaceAll(/"/g, '');;
      console.log(user);
      DB.collection("drawings")
        .find({owner: user}).limit(50).toArray(function (err, result) {
          if (err) {
            response.status(400).send("Error fetching drawings");
          } else {
            response.json(result)
          }
        });
    });

    //Save drawing data
    app.put("/drawing/:drawingId", (request, response, next) => {

      var drawingId = request.params.drawingId.replaceAll(/"/g, '');
      var data =  request.body.data;

      console.log(drawingId);
      console.log(data);

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingId) }, { $set: {"data": data}}, { returnDocument: 'after' }, (err, res) => {
        response.json(200);
        console.log(drawingId);
        console.log(data);
        console.log(res);
      });
    });
    
    const upload = multer({dest: '/public/data/uploads/'});

// Post files
app.post(
  "/upload/:drawingId",
  multer({
    storage: storage
  }).single('upload'), function(req, res) {
    //console.log(req.file);
    console.log(req.body);
    res.redirect("/uploads/" + req.file.filename);
    console.log(req.file.filename);
    DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.drawingId.replaceAll(/"/g, '')) }, { $set: {"data": req.file.filename}}, { returnDocument: 'after' }, (err, res) => {
      });
    return res.status(200).end(); 
  });

  //get image from DB
   app.get('/drawings/:drawingId', function (req, res){
    DB.collection("drawings")
    .findOne({ _id: mongoose.Types.ObjectId(req.params.drawingId.replaceAll(/"/g, '')) }, function (err, result) {
      if (err) {
        console.log("error getting");
      } else {
    const file = result.data;
    var img = fs.readFileSync(__dirname + "/uploads/" + file, {encoding: 'base64'});
    //console.log("image", img)
    //res.writeHead(200, {'Content-Type': 'image/png' });
    // res.end(img, 'binary');
    var returnedJson = {
      _id: result._id,
      name: result.name,
      owner: result.owner,
      description: result.description,
      data: img,
      members: result.members,
      likes: result.likes
    };
    res.json(returnedJson)
    //console.log("ressss", res);
      }
    });

  });
//==========================================================================================================
// Album Management
//==========================================================================================================
    //create new album
    app.post("/albums", (request, response, next) => {
      var post_data = request.body;
      var members = post_data.members

      console.log("avanntt", request.body.members);
      if (typeof members === 'string' || members instanceof String) {
        request.body.members = [post_data.members];
        console.log("apress", request.body.members);
      }

      DB.collection("albums").insertOne(request.body, (err, res) => {
        request.body._id = res.insertedId.toHexString();
        console.log(`Album "${request.body.name}" created successfully with ID: ${request.body._id}!`);
        response.json(201);
      });
    })

    //get all available albums
    app.get("/albums", (request, response, next) => {
      var post_data = request.body;

      DB.collection("albums")
        .find({}).limit(50).toArray(function (err, result) {
          if (err) {
            console.log("error getting");
            response.status(400).send("Error fetching albums");
          } else {
            response.json(result)
            console.log("fetching succes");
          }
        });
    });

    //get user albums
    app.get("/albums/:username", (request, response, next) => {
      DB.collection("albums").find({ owner: request.params.username }).toArray((err, res) => {
        response.json(res);
        ;
      })
    });

    //get album drawings
    app.get("/albums/Drawings/:albumName", (request, response, next) => { // SUGGESTION: /albums/drawings/:albumId
      DB.collection("albums").findOne({ name: request.params.albumName }, function (err, res) {
        response.json(res.drawingIDs);
        // console.log(res.drawingIDs);
      })
    });



    //add drawing to an album
    app.put("/albums/addDrawing/:albumId", (request, response, next) => {
      let albumId = request.params.albumId;
      let drawingID = request.body.drawing;
      DB.collection("albums").findOneAndUpdate({ name:albumId }, { $push: { drawingIDs: drawingID } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(drawingID, "is added to ", albumId);
      })
    });

    //add one like to a drawing
    app.put("/drawings/addLike/:drawingId", (request, response, next) => {
      let drawingId = request.params.drawingId.replaceAll(/"/g, '');
      let user = request.body.user

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingId) }, { $push: { likes: user } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(drawingId, "is liked");
      })
    });

    //add drawing to a story
    app.put("/drawings/addDrawingToStory/:drawingId", (request, response, next) => {
      let drawingId = request.params.drawingId.replaceAll(/"/g, '');

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingId) }, { $set: { isStory: true } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(drawingId, "is a story");
      })
    });


    //send request to an album
    app.put("/albums/sendRequest/:albumName", (request, response, next) => {
      let albumName = request.params.albumName;
      let usertoAdd = request.body.identifier;
      console.log("USER TO ADD",usertoAdd);
      DB.collection("albums").find({ name: albumName }).toArray(function (err, res) {
        console.log(res[0].membershipRequests);
        if (res[0].membershipRequests != undefined && res[0].membershipRequests.includes(usertoAdd)) {
          response.json(400);
        } else {
          DB.collection("albums").updateOne({ name: albumName }, { $push: { membershipRequests: usertoAdd } }, { returnDocument: 'after' }, (err, res) => {
          response.json(201)
          console.log(usertoAdd, "sent request to join ", albumName);
        });
      }
      })
    });

    app.put("/albums/request/add", (request, response, next) => {
      const userToAdd = request.body.userToAdd;
      const currentUser = request.body.currentUser;
      const albumName = request.body.albumName;
      DB.collection("albums").findOneAndUpdate({ name: albumName }, { $push: { members: userToAdd }, $pull: { membershipRequests: userToAdd} }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(`${userToAdd} has been accepted in the album ${albumName} by ${currentUser}`);
    });
  });
    
    app.put("/albums/request/decline", (request, response, next) => {
      const userToDecline = request.body.userToDecline;
      const currentUser = request.body.currentUser;
      const albumName = request.body.albumName;
      DB.collection("albums").findOneAndUpdate({ name: albumName }, { $pull: { membershipRequests: userToDecline} }, { returnDocument: 'after' }, (err, res) => {
        response.json(201);
        console.log(`${userToDecline} has been refused in the album ${albumName} by ${currentUser}`);
      });

    });

    //update owner when leaving album
    app.put("/albums/:id", (request, response, next) => {
      let albumId = request.params.id;
      let memberToRemove = request.body.memberToRemove;
      DB.collection("albums").findOneAndUpdate({ _id: mongoose.Types.ObjectId(albumId) }, { $pull: { members: memberToRemove } }, { returnDocument: 'after' }, (err, res) => {
        
        let albumOwner = res.value.owner
        res.value.drawingIDs.forEach(element => {
          DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(element.replaceAll(/"/g, '')), owner: memberToRemove }, { $set: { owner: albumOwner } }, { returnDocument: 'after' }, (err, res) => {
            //console.log(albumOwner, "is the new owner of", res.value.name);
          });
        });
        console.log(memberToRemove, "has left album ", albumId);
        response.json(201);
      });
    });

    //delete album with specific id
    app.delete("/albums/:id", (request, response, next) => {
      let albumId = request.params.id;
      DB.collection("albums").findOneAndDelete({ _id: mongoose.Types.ObjectId(albumId) }, (err, res) => {
        console.log(`Album with id ${request.params.id} has been deleted successfully!`);
        response.json(201)
      });
    });    

    //Getting album parameters
    app.get("/getAlbumParameters", (request, response, next) => {

      var post_data = request.query;
      var albumName = post_data.albumName;

      console.log(albumName);

      DB.collection("albums")
        .findOne({ name: albumName }, function (err, result) {
          if (err) {
            console.log("error getting");
            response.status(400).send("Error fetching albums");
          } else {
            response.json(result)
            console.log("Getting One Album", result);
          }
        });
    });

    //update album attributes
    app.post("/albumUpdate", (request, response, next) => {
      var post_data = request.body;
      var oldAlbumName = post_data.oldAlbumName;
      var newAlbumName = post_data.newAlbumName;
      var newDescription = post_data.newDescription;
    
      //check if an album already has the new name
      DB.collection("albums")
        .find({ name: newAlbumName })
        .count(function (err, number) {
          if (number != 0 && oldAlbumName != newAlbumName) {
            response.json(false);
            console.log("album name already used");
          } else {
            // Update album data
            DB.collection("albums").updateOne({ name: oldAlbumName }, {
              $set: {
                "name": newAlbumName,
                "description": newDescription,
              },
            }).then(result => {
              response.json(200);
            });
          }
        });
    });

    //update album attributes
    app.post("/albumUpdate", (request, response, next) => {
      var post_data = request.body;
      var oldAlbumName = post_data.oldAlbumName;
      var newAlbumName = post_data.newAlbumName;
      var newDescription = post_data.newDescription;
    
      //check if an album already has the new name
      DB.collection("albums")
        .find({ name: newAlbumName })
        .count(function (err, number) {
          if (number != 0 && oldAlbumName != newAlbumName) {
            response.json(false);
            console.log("album name already used");
          } else {
            // Update album data
            DB.collection("albums").updateOne({ name: oldAlbumName }, {
              $set: {
                "name": newAlbumName,
                "description": newDescription,
              },
            }).then(result => {
              response.json(200);
            });
          }
        });
    });

//==========================================================================================================
// Profile modification
//==========================================================================================================
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
                "email": newEmail
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
            response.status(400).send("Error fetching users");
          } else {
            response.json(result);
            console.log("Got user data for profile load: ", identifier);
          }
        }
      );
    });

     //Updating a users data
     app.post("/profileUpdate", (request, response, next) => { 
      var post_data = request.body;
      var oldUsername = post_data.oldUsername;
      var newUsername = post_data.newUsername;
      var avatar = post_data.newAvatar;
      var newEmail = post_data.newEmail;
      var description = post_data.newDescription;

      var db = client.db("PolyGramDB");

      //check if a user already has the new name
      db.collection("users")
        .find({ identifier: newUsername })
        .count(function (err, number) {
          if (number != 0 && oldUsername != newUsername) {
            response.json(403);
            console.log("identifier already exists");
          } else {
            // Update user data
            db.collection("users").updateOne({ identifier: oldUsername }, {
              $set : {
                "identifier" : newUsername,
                "avatar" : avatar,
                "description" : description,
                "email": newEmail,
              },
            }).then(result => {
              response.json(200);
              console.log(result)
            });
          }
        });
    });
        app.post("/deleteRoom", (request, response, next) => {
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

        app.get("/getRoomParameters", (request, response, next) => {

          var post_data = request.query;
          var roomName = post_data.roomName;  
    
          var db = client.db("PolyGramDB");

          db.collection("rooms")
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


    // Start web server
    const server = app.listen(SERVER_PORT, () => {
      console.log(
        `connected to MongoDB server, webserver running on port ${SERVER_PORT}`
      );
    });
  }
});
