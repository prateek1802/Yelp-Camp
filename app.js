var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgrounds = [
    {name: "Alpha", image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f2c57bafe5b1bc_340.jpg"},
    {name: "Beta", image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b0144397f4c371afe9b1_340.jpg"},
    {name: "Gamma", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144397f4c371afe9b1_340.jpg"}
];

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds: campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;

    var newCampground = {name: name,image: image};
    campgrounds.push(newCampground);

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("Server running on port 3000");
});
module.exports = app;