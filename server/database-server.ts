var mongodb=require('mongodb');
var objectID = mongodb.objectID;
var express = require ('express');
var crypto = require ('crypto');
var bodyParser = require ('body-parser');
//import {saltHashPassword,checkHashPassword} from './crypto-utils';

//constants
const DATABASE_URL = 'mongodb+srv://equipe203:Log3900-H22@polygramcluster.arebt.mongodb.net/PolyGramDB?retryWrites=true&w=majority';
const SERVER_PORT = 3001;

//express service 
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var genRandomString= function (length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
}

var sha512= function(password,salt){
    var hash=crypto.createHmac('sha512',salt);
    hash.update(password)
    var value =hash.digest('hex');
    return{
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userPassword){
    var salt = genRandomString(16); //create 16 random caracters 
    var passwordData=sha512(userPassword,salt);
    return passwordData;
}

function checkHashPassword (userPassword,salt){
    var passwordData=sha512(userPassword,salt);
    return passwordData;
}

//create mongoDB client
var mongoClient = mongodb.MongoClient;

//connection URL 
var url = DATABASE_URL;

mongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(err)
        console.log('unable to connect to the mongoDB server error',err);
    else{
        
        //register
        app.post('/register',(request,response,next)=>{
            var post_data=request.body;

            var plaint_password=post_data.password;
            var hash_data=saltHashPassword(plaint_password);

            var password=hash_data.passwordHash;
            var salt = hash_data.salt;

            
            var identifier = post_data.identifier;

            var insertJson={
                'identifier':identifier,
                'password':password,
                'salt':salt,
            }

            var db =client.db('PolyGramDB');

            //check if identifier exists
            db.collection('users')
                .find({'identifier':identifier}).count(function(err,number){
                    if(number!=0){
                        response.json('identifier already exists');
                        console.log('identifier already exists');
                    }
                    else{
                        //insert data
                        db.collection('users')
                            .insertOne(insertJson,function(error,res){
                                response.json('Registration succes');
                                console.log('Registration succes');
                            })
                    }
                })
        });

        //login
        app.post('/login',(request,response,next)=>{
            var post_data=request.body;

            
            var identifier = post_data.identifier;
            var userPassword = post_data.password;


            var db =client.db('PolyGramDB');

            //check if identifier exists
            db.collection('users')
                .find({'identifier':identifier}).count(function(err,number){
                    if(number==0){
                        response.json('identifier do not exists');
                        console.log('identifier do not exists');
                    }
                    else{
                        //insert data
                        db.collection('users')
                            .findOne({'identifier':identifier},function(error,user){
                                var salt= user.salt; //get salt from user
                                var hashed_password= checkHashPassword(userPassword,salt).passwordHash;//hash password with salt
                                var encrypted_password= user.password;
                                if(hashed_password==encrypted_password){
                                    response.json('login success');
                                    console.log('login success');
                                }
                                else{
                                    response.json('wrong password');
                                    console.log('wrong password');
                                }
                            
                            })
                    }
                })
        });
        
        //start web server
        app.listen(SERVER_PORT, () => {
            console.log('connected to MongoDB server, webserver running on port 3001');
        })
    }

})