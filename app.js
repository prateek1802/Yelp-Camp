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
var flash = require('connect-flash');

//routes require
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://prateek:12345@ds135750.mlab.com:35750/blogapp1996");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);

app.listen(3000, function(){
    console.log("Server running on port 3000");
});
module.exports = app;