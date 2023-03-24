//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bp=require("body-parser");
const ejs=require("ejs");
const { urlencoded } = require('body-parser');
const port=55555;
const app= express();
const mongoose=require('mongoose');
const encrypt=require("mongoose-encryption");

app.use(bp.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose
.connect("mongodb+srv://secrets:secrets@cluster0.iv55zpn.mongodb.net/secretsDB",{useNewUrlParser:true})
.then(()=>{
    console.log("connected sucessfully");
})
.catch((err)=>{
    console.log(err);
});
const schema=new mongoose.Schema({
    email:String,
    password:String
});
//
//encryption

schema.plugin(encrypt,{secret:process.env.secretkey,encryptedFields: ['password']})

const usersDB=new mongoose.model("user",schema);


app.get("/",function(req,res){
    res.render('home');
});
app.get("/login",function(req,res){
    res.render('login');
});
app.post("/login",function(req,res){
    const user=req.body.username;
    const pass=req.body.password;
    usersDB.findOne({email : user}).then((result)=>{
        if(result.password === pass){
            res.render('secrets');
        }else{
            res.render("login");
        }
    })
    .catch((err)=>{
        console.log(err);
    });


});


app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const user=new usersDB({
        email:req.body.email,
        password:req.body.password
    });
    user.save()
    .then(()=>{
        res.render('secrets');
    })
    .catch((err)=>{
        console.log(err);
    })


});



app.listen(port,function(){
    console.log('listening on port : '+port);
});