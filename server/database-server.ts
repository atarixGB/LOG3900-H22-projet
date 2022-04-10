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
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

//constants
const SERVER_PORT = 3001;
const UPLOAD_DIR = 'uploads/'

const storage = multer.diskStorage({
  destination: `./${UPLOAD_DIR}`,
  filename: function (req, file, cb) {
    return crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) {
        return cb(err);
      }
      return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
    });
  }
});

//express service
var app = express();
app.use(express.json({ limit: '100mb' }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

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
mongoClient.connect(process.env.POLYGRAM_APP_DATABASE_URL, { useNewUrlParser: true }, function (err, client) {

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

      var collaborationCount = post_data.collaborationCount;
      var totalCollaborationTime = post_data.totalCollaborationTime;

      var insertJson = {
        identifier: identifier,
        password: password,
        salt: salt,
        avatar: avatar,
        email: email,
        description: description,
        collaborationCount: collaborationCount,
        totalCollaborationTime: totalCollaborationTime,
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
      var messages = post_data.messages

      if (typeof usersList === 'string' || usersList instanceof String) {
        usersList = [post_data.usersList];
      }

      var insertJson = {
        identifier: identifier,
        roomName: roomName,
        usersList: usersList,
        messages : []
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
            console.log("add succes");
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

    // get all users in the public chatroom (aka all signed up users)
    app.get("/chat/users", (request, response) => {
      DB.collection("users").aggregate([{ $project: { identifier: 1 } }]).toArray((err, res) => {
        if (err) throw err;
        response.json(res);
      })
    })
    //==========================================================================================================
    // Drawing Management
    //==========================================================================================================

    //create drawing
    app.post("/drawing/create", (request, response, next) => {
      DB.collection("drawings").insertOne(request.body, (err, res) => {
        if (err) throw err;
        const drawingData = request.body;
        drawingData._id = res.insertedId.toHexString();
        console.log(`Drawing "${drawingData.name}" created successfully with ID: ${drawingData._id}!`);
        response.json(drawingData._id); // Drawing ID is send back to client. We will use it to add the corresponding drawing to an album
      })
    })

    //get drawing Parameters
    app.get("/getDrawingParameters/:drawingId", (request, response, next) => {

      var post_data = request.params;
      var drawingId = post_data.drawingId.replace(/"/g, ''); //? pour enlever les "" 

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

      var user = request.params.user.replace(/"/g, '');
      // var user = request.params.user.replaceAll(/"/g, '');

      DB.collection("drawings")

        .find({ owner: user }).limit(50).toArray(function (err, result) {

          if (err) {

            response.status(400).send("Error fetching drawings");

          } else {

            response.json(result)

          }

        });

    });

    //Save drawing data (desktop client)
    app.post("/drawing/save/:drawingId", (request, response, next) => {
      let drawingId = request.params.drawingId;
      let drawingName = request.body.name;
      let owner = request.body.owner;

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingId) }, { $set: { data: `${drawingId}.png` } }, { returnDocument: 'after' }, (err, res) => {
        response.json("Metadata sauvegardé")
      });

    });

    app.put("/drawing/save/:drawingId", (request, response) => {
      const imageData = request.body.data;

      saveImageAsPNG(imageData, request.params.drawingId, `./${UPLOAD_DIR}`);

      response.json("DataUrl sauvegardé")
    })

    // Post files (mobile client)
    app.post(
      "/upload/:drawingId",
      multer({
        storage: storage
      }).single('upload'), function (req, res) {
        res.redirect(`/${UPLOAD_DIR}` + req.file.filename);
        DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.drawingId.replaceAll(/"/g, '')) }, { $set: { "data": req.file.filename } }, { returnDocument: 'after' }, (err, res) => {
        });// ici tu par chercher le drawingID en base et tu mets le data de cet element au filename 
        return res.status(200).end();
      });

  //get image from DB
   app.get('/drawings/:drawingId', function (req, res){
    DB.collection("drawings")
    .findOne({ _id: mongoose.Types.ObjectId(req.params.drawingId.replace(/"/g, '')) }, function (err, result) {
      if (err) throw err

        const file = result.data;
        if (fs.existsSync(__dirname + "/uploads/" + file, {encoding: 'base64'})) {
          var img = fs.readFileSync(__dirname + "/uploads/" + file, {encoding: 'base64'});
          var returnedJson = {
            _id: result._id,
            name: result.name,
            owner: result.owner,
            description: result.description,
            data: img,
            members: result.members,
            likes: result.likes,
            albumName:result.albumName,
            creationDate:result.creationDate
          };
          res.json(returnedJson)
        } else{
          console.log(`File ${file} does not exist on server`);
        }

    });
  });

  //delete drawing with specific id
  app.delete("/drawing/delete/:id", (request, response, next) => {
    let drawingId = request.params.id;
    DB.collection("drawings").findOneAndDelete({ _id: mongoose.Types.ObjectId(drawingId) }, (err, res) => {
      console.log(`Drawing with id ${request.params.id} has been deleted successfully!`);
      response.json(201)
    });
  });    
    //get all drawings that specified user liked
    app.get("/drawings/favorite/:username", (request, response) => {
      let username = request.params.username;
      DB.collection("drawings").find({ likes: { $all: [username] } }).toArray(function (error, result) {
        if (error) throw error;
        response.json(result);
      })
    })

    //get all drawings of specified user that has at least one Like
    app.get("/drawings/top/:username", (request, response) => {
      let username = request.params.username;
      DB.collection("drawings")
        .find({ $and: [{ owner: username }, { likes: { $exists: true, $not: { $size: 0 } } }] }).toArray(function (error, result) {
          if (error) throw error;

          // Sort result by descending order of number of likes
          result.sort((a, b) => a.likes.length < b.likes.length ? 1 : a.likes.length > b.likes.length ? - 1 : 0);

          response.json(result);
        })
    })
  

//==========================================================================================================
// Album Management
//==========================================================================================================


    //get all drawings that specified user liked
    app.get("/drawings/favorite/:username", (request, response) => {
      let username = request.params.username;
      DB.collection("drawings").find({ likes: { $all: [username] } }).toArray(function (error, result) {
        if (error) throw error;
        response.json(result);
      })
    })

    //get all drawings of specified user that has at least one Like
    app.get("/drawings/top/:username", (request, response) => {
      let username = request.params.username;
      DB.collection("drawings")
        .find({ $and: [{ owner: username }, { likes: { $exists: true, $not: { $size: 0 } } }] }).toArray(function (error, result) {
          if (error) throw error;

          result.sort((a, b) => a.likes.length < b.likes.length ? 1 : a.likes.length > b.likes.length ? -1 : 0);
          response.json(result);
        })
    })

    //delete all drawings pour faire le menage
    app.delete("/drawing/deleteAll", (request, response, next) => {
      DB.collection("drawings").deleteMany({}, (err, res) => {
        response.json(201)
      });
    });

    //delete drawing with specific id from collection
    app.delete("/drawing/delete/:id", (request, response, next) => {
      let drawingId = request.params.id;

      // Remove drawing from collection 'drawings'
      DB.collection("drawings").findOneAndDelete({ _id: mongoose.Types.ObjectId(drawingId) }, (err, res) => {

        // Remove drawing from the upload directory in the server
        fs.unlink(`./${UPLOAD_DIR}` + drawingId + ".png", function (err, res) {
          if (err) throw err;
          console.log(` Drawing with ID ${drawingId} has been deleted from server`);
        });

        console.log(`Drawing with id ${drawingId} has been deleted from database`);
        response.json(201)
      });
    });

    //update drawing name
    app.post("/drawingUpdate", (request, response, next) => {
      var post_data = request.body;
      var drawingID = post_data.drawingID
      var newDrawingName = post_data.newDrawingName;

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingID) }, { $set: { "name": newDrawingName } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(drawingID, "is now named ", newDrawingName);
      })
    });

    //==========================================================================================================
    // Album Management
    //==========================================================================================================

    //create new album
    app.post("/albums", (request, response, next) => {
      var post_data = request.body;
      var members = post_data.members

      if (typeof members === 'string' || members instanceof String) {
        request.body.members = [post_data.members];
      }

      DB.collection("albums").insertOne(request.body, (err, res) => {
        request.body._id = res.insertedId.toHexString();
        console.log(`Album "${request.body.name}" created successfully with ID: ${request.body._id}!`);
        response.json(request.body._id); // Return album ID 
      });
    })

    //get all available albums
    app.get("/albums", (request, response, next) => {
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

    //get user albums // to Switch for userID
    app.get("/albums/:username", (request, response, next) => {
      DB.collection("albums").find({ owner: request.params.username }).toArray((err, res) => {
        response.json(res);
        ;
      })
    });

    //get album drawings CHANGE
    app.get("/albums/Drawings/:albumID", (request, response, next) => { // SUGGESTION: /albums/drawings/:albumId
      console.log(request.params.albumID)
      DB.collection("albums").findOne({ _id: mongoose.Types.ObjectId(request.params.albumID) }, function (err, res) {
        response.json(res.drawingIDs);
      })
    });

    //add drawing to an album CHANGE
    app.put("/albums/addDrawing/:albumId", (request, response, next) => {
      let albumId = request.params.albumId;
      let drawingID = request.body.drawing;
      DB.collection("albums").findOneAndUpdate({ _id: mongoose.Types.ObjectId(albumId) }, { $push: { drawingIDs: drawingID } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(drawingID, "is added to ", albumId);
      })
    });

    //add one like to a drawing
    app.put("/drawings/addLike/:drawingId", (request, response, next) => {
      let drawingId = request.params.drawingId.replace(/"/g, '');
      let user = request.body.user

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingId) }, { $push: { likes: user } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(`Drawing with ID ${drawingId} is liked by ${user}`);
      })
    });

    //add drawing to a story
    app.put("/drawings/addDrawingToStory/:drawingId", (request, response, next) => {
      let drawingId = request.params.drawingId.replace(/"/g, '');

      DB.collection("drawings").findOneAndUpdate({ _id: mongoose.Types.ObjectId(drawingId) }, { $set: { isStory: true } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(drawingId, "is a story");
      })
    });


    //send request to an album // Switch for ID 
    app.put("/albums/sendRequest/:albumName", (request, response, next) => {
      let albumName = request.params.albumName;
      let usertoAdd = request.body.identifier;

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
      DB.collection("albums").findOneAndUpdate({ name: albumName }, { $push: { members: userToAdd }, $pull: { membershipRequests: userToAdd } }, { returnDocument: 'after' }, (err, res) => {
        response.json(201)
        console.log(`${userToAdd} has been accepted in the album ${albumName} by ${currentUser}`);
      });
    });

    app.put("/albums/request/decline", (request, response, next) => {
      const userToDecline = request.body.userToDecline;
      const currentUser = request.body.currentUser;
      const albumName = request.body.albumName;
      DB.collection("albums").findOneAndUpdate({ name: albumName }, { $pull: { membershipRequests: userToDecline } }, { returnDocument: 'after' }, (err, res) => {
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
            console.log(albumOwner, "is the new owner of", res.value.name);
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

    //remove a drawing id from drawingIDs in album
    app.post("/removeDrawing", (request, response, next) => {
      var post_data = request.body;


      var albumId = post_data.albumID;
      var drawingID = post_data.drawingID;

      DB.collection("albums")
        .find({ _id: mongoose.Types.ObjectId(albumId) })
        .count(function (err, number) {
          if (number == 0) {
            response.json(404);
            console.log("album does not exist");
          } else {
            DB.collection("albums").findOneAndUpdate({ _id: mongoose.Types.ObjectId(albumId) }, { "$pull": { drawingIDs: drawingID } },
              function (error, result) {
                response.json(201);
                console.log(`Drawing with ID ${drawingID} has been successfuly removed from album ${albumId}`);
              }
            );
          }
        });
    });

    //Getting album parameters
    app.get("/getAlbumParameters", (request, response, next) => {

      var post_data = request.query;
      var albumName = post_data.albumName;

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
      var chatThemeId = post_data.newChatThemeId;

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
              $set: {
                "identifier": newUsername,
                "avatar": avatar,
                "description": description,
                "chatThemeId" : chatThemeId // add new theme id
              }
            }).then(result => {
              // DB.collection("drawings").findOneAndUpdate({ owner: oldUsername }, { $set: { owner: newUsername } }, { returnDocument: 'after' }, (err, res) => {})
              // DB.collection("albums").findOneAndUpdate({ owner: oldUsername }, { $set: { owner: newUsername } }, { returnDocument: 'after' }, (err, res) => {})
              // DB.collection("albums").findOneAndUpdate({ identifier: oldUsername }, { $set: { identifier: newUsername } }, { returnDocument: 'after' }, (err, res) => {})
              response.json(200);
            });
          }
        });
    });


    //get userid when we send username 
    app.get("/getUserID/:username", (request, response, next) => {

      let username = request.params.username;

      DB.collection("users")
        .findOne({ identifier: username }, function (err, result) {
          if (err) {
            console.log("error getting");
            response.status(400).send("Error fetching id");
          } else {
            response.json(result._id);
          }
        });
    });

    //==========================================================================================================
    // Profile : Statistics
    //==========================================================================================================

    // Get the total number of collabs that userId has participated in
    app.get("/profile/stats/collabs/:username", (request, response) => {
      const identifier = request.params.username;

      DB.collection("users").findOne({ identifier: identifier }, function (error, user) {
        if (error) throw error;
        response.json(user.collaborationCount);
      });
    })

    // Get the average duration of userId in a collab session
    app.get("/profile/stats/collabs/session/:username", (request, response) => {
      const identifier = request.params.username;

      DB.collection("users").findOne({ identifier: identifier }, function (error, user) {
        if (error) throw error;
        if (user.collaborationCount == 0) {
          response.json('0j 0h 0m 0s');
        } else {
          const collabTimeMean = Math.round(user.totalCollaborationTime / user.collaborationCount);
          response.json(stringifySeconds(collabTimeMean));
        }
      });
    })

    // Get the total duration of username in collab sessions
    app.get("/profile/stats/collabs/total-duration/:username", (request, response) => {
      const identifier = request.params.username;

      DB.collection("users").findOne({ identifier: identifier }, function (error, user) {
        if (error) throw error;
        if (user.collaborationCount == 0) {
          response.json('0j 0h 0m 0s');
        } else {
          response.json(stringifySeconds(user.totalCollaborationTime));
        }
      });
    })

    //Update collab stats
    app.put("/profile/stats/collabs/update/:username", (request, response, next) => {
      const identifier = request.params.username;
      const secondsSpentInCollab = request.body.secondsSpentInCollab;

      DB.collection("users").findOneAndUpdate({ identifier: identifier },
        { $inc: { collaborationCount: 1, totalCollaborationTime: secondsSpentInCollab } }, { returnDocument: 'after' }, (err, res) => {
          response.json(201)
          console.log(`Updated collab stats for ${identifier}`);
        })
    });

    // Get the total number of drawings created by username 
    app.get("/profile/stats/drawings/:username", (request, response) => {
      const username = request.params.username;

      DB.collection("drawings").find({ owner: username }).toArray((error, result) => {
        if (error) throw error;

        const totalNbrOfDrawingsCreated = result.length;
        response.json(totalNbrOfDrawingsCreated)
      })
    })

    // Get the total number of likes by username 
    app.get("/profile/stats/drawings/likes/:username", (request, response) => {
      const username = request.params.username;

      DB.collection("drawings").find({ likes: { $all: [username] } }).toArray((error, result) => {
        if (error) throw error;

        let likesCount = 0;
        for (const drawing of result) {
          likesCount += drawing.likes.length;
        }

        response.json(likesCount);
      })
    })

    // Get the total number of private albums created by username 
    app.get("/profile/stats/albums/:username", (request, response) => {
      const username = request.params.username;

      DB.collection("albums").find({ owner: username }).toArray((error, result) => {
        if (error) throw error;
        const totalNbrOfAlbumsCreated = result.length;
        response.json(totalNbrOfAlbumsCreated);
      })
    })

    // Get the total number of likes by username 
    app.get("/profile/stats/drawings/likes/:username", (request, response) => {
      const username = request.params.username;

      DB.collection("drawings").find({ likes: { $all: [username] } }).toArray((error, result) => {
        if (error) throw error;

        let likesCount = 0;
        for (const drawing of result) {
          likesCount += drawing.likes.length;
        }

        response.json(likesCount);
      })
    })

    // Get the total number of private albums created by username 
    app.get("/profile/stats/albums/:username", (request, response) => {
      const username = request.params.username;

      DB.collection("albums").find({ owner: username }).toArray((error, result) => {
        if (error) throw error;
        const totalNbrOfAlbumsCreated = result.length;
        response.json(totalNbrOfAlbumsCreated);
      })
    })
    
    //==========================================================================================================
    // Advanced Search 
    //==========================================================================================================

    app.get("/search/:category/:attribute/:keyword", (request, response) => {
      const category = request.params.category;
      const attribute = request.params.attribute;
      const keyword = request.params.keyword;

      DB.collection(category).find({ [attribute]: { $regex: keyword } }).toArray((error, result) => {
        if (error) throw error;
        response.json(result);
      })
    })

    //==========================================================================================================
    // Reset password
    //==========================================================================================================
    let uniqueCode = null;

    // send unique code to user if emails exists
    app.post("/forgotPassword", (request, response) => {
      const email = request.body.email;

      DB.collection("users").findOne({ email: email }, (error, result) => {
        if (error) throw err;

        if (result) {
          uniqueCode = generateUniqueCode();

          sendEmail(result.email, uniqueCode)
            .then(() => { console.log(`Email sent to ${result.email}`) })
            .catch((error) => { throw error });

          response.json(204);

        } else {
          response.json(404);
        }
      })

    });

    // verify unique code received by the user
    app.post("/verifyUniqueCode", (request, response) => {
      const userCode = request.body.code;
      if (userCode == uniqueCode) {
        response.json(204);
        uniqueCode = null;
      } else {
        response.json(-1)
      }
    })

    // change the password if unique code is valid
    app.put("/resetPassword", (request, response) => {
      const email = request.body.email;
      const newPassword = request.body.newPassword;
      const confirmedPassword = request.body.confirmedPassword;

      if (newPassword == confirmedPassword) {
        const hashData = salHashPassword(newPassword);
        const hashPassword = hashData.passwordHash;
        const salt = hashData.salt;
        DB.collection("users").update({ email: email }, { $set: { password: hashPassword, salt: salt } }, ((error, result) => {
          if (error) throw err;
          if (result) {
            response.json(204)
          } else {
            response.json(404);
          }
        }))
      }

    })

    //==========================================================================================================
    // For Development Purpose Only
    //==========================================================================================================

    // Delete all element from specified collection from DB
    app.delete("/delete/:collection", (request, response) => {
      let collection = request.params.collection;
      DB.collection(collection).remove({}, (err, result) => {
        if (err) console.log(`CANNOT DELETE ${collection}`);
        else response.json(`DELETE ${collection} OK`)
      })
    })

    //-----------------------------------
    // Start web server
    //-----------------------------------
    const server = app.listen(SERVER_PORT, () => {
      console.log(
        `connected to MongoDB server, webserver running on port ${SERVER_PORT}`
      );
    });
  }
});



//==========================================================================================================
// UTILITY FUNCTIONS
//==========================================================================================================

let saveImageAsPNG = function (imageData, drawingId, filepath) {
  console.log("Image succesfully saved in the server as PNG")
  const metadata = imageData.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = Buffer.from(metadata, "base64");
  fs.writeFile(`${filepath}/${drawingId}.png`, dataBuffer, (error) => {
    if (error) throw error;
  });
}

let stringifySeconds = function (timeInSeconds) {
  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;

  const days = Math.floor(timeInSeconds / secondsInDay);
  timeInSeconds = timeInSeconds % secondsInDay;

  const hours = Math.floor(timeInSeconds / secondsInHour);
  timeInSeconds = timeInSeconds % secondsInHour;

  const minutes = Math.floor(timeInSeconds / secondsInMinute);
  timeInSeconds = timeInSeconds % secondsInMinute;

  return days + 'j ' + hours + 'h ' + minutes + 'm ' + timeInSeconds + 's';
}

async function sendEmail(email, uniqueCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false,
    // requireTLS: true,
    // sendmail: true,
    auth: {
      user: process.env.POLYGRAM_APP_GMAIL,
      pass: process.env.POLYGRAM_APP_GMAIL_PASSWORD,
    },
  });

  const messageWithCode = {
    from: `"Poly-Gram 🎨" <${process.env.POLYGRAM_APP_GMAIL}>`,
    to: email,
    subject: "Poly-Gram - Changement de mot de passe",
    html: `
    <html>
      <body>
        Salut!
        <br><br>
        Il parait que tu as oublié ton mot de passe!
        <br><br>
        Entre ce code unique dans l'application pour le réinitialiser :
        <br><br>
        <b>${uniqueCode}</b>
        <br><br>
        L'équipe de Poly-Gram 🎨
      </body>
    </html>
    `,
  }

  await transporter.sendMail(messageWithCode, (error, result) => {
    if (error) throw error;

  });
}

let generateUniqueCode = () => {
  return Math.floor(Math.random() * 100000);
}