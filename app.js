var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var Campground = require('./models/campground');
var Comment = require("./models/comment");
var seedDB = require('./seeds');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');


//routes require
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Hala Madrid",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});


app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);

app.listen(3000, function(){
    console.log("Server running on port 3000");
});
module.exports = app;