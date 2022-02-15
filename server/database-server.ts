var mongodb=require('mongodb');
var objectID=mongodb.objectID;
var express = require ('express');
var bodyParser = require ('body-parser');

//express service 
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//create mongoDB client
var mongoClient= mongodb.MongoClient;

//connection URL 
var url='mongodb+srv://equipe203:Log3900-H22@polygramcluster.arebt.mongodb.net/PolyGramDB?retryWrites=true&w=majority'

mongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(err)
        console.log('unable to connect to the mongoDB server error',err);
    else{
        
        //register
        app.post('/register',(request,response,next)=>{
            var post_data=request.body;

            var plaint_password=post_data.password;
            var hash_data=salHashPassword(plaint_password);

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
        app.listen(3000,()=>{
            console.log('connected to MongoDB server, webserver running on port 3000');
        })
    }

})