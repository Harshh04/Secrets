//jshint esversion:6
require('dotenv').config();
const express = require("express") ;
const bodyParser = require("body-parser") ;
const ejs = require("ejs") ;
const mongoose = require("mongoose") ;
const encrypt = require("mongoose-encryption") ;

const app = express() ;


app.use(express.static("public")) ;
app.set('view engine','ejs') ;
app.use(bodyParser.urlencoded({extended: true})) ;

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const secret =  process.env.SECRET ;

const userSchema = new mongoose.Schema({
    email : String , 
    password : String
}) ;

const encryptionOptions = {
    secret: secret,
    encryptedFields: ['password'],
    additionalAuthenticatedFields: ['email']
  };  
  
userSchema.plugin(encrypt, encryptionOptions);

const User = new mongoose.model("User",userSchema) ;

app.get("/",function(req,res)
{
    res.render("home") ;
}) ;

app.get("/login",function(req,res)
{
    res.render("login") ;
}) ;

app.get("/register",function(req,res)
{
    res.render("register") ;
}) ;

app.post("/register",function(req,res)
{
    const newUser = new User(
        {
            email : req.body.username ,
            password : req.body.password
        }
    ) ;

    try
    {
        newUser.save() ;    
        console.log("New User saved !") ;
        res.render("secrets") ;
    }
    catch(err)
    {
        console.log(err) ;
    }
})

app.post("/login",async function(req,res)
{
    const username = req.body.username ;
    const password = req.body.password ;

    try
    {
        const foundUser = await User.findOne({email : username}).exec() ;
        if(foundUser)
        {
            if(foundUser.password === password)
            {
                res.render("secrets")
            }

            else{
                res.send("Incorrect Username or password")
            }
        }
        else{
            res.send("Username not found !")
        }
    }
    catch(err)
    {
        console.log(err) ;
    }
    
    
})



app.listen(3000,function()
{
    console.log("Server running at port 3000") ;
})