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
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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


//google-login
passport.use(new GoogleStrategy({
    clientID: "607453674122-20gu28fstnmgdhnucvkki8ll51f84vvp.apps.googleusercontent.com",
    clientSecret: "73-NTuqB8ZA0aFk6WIwTdLEC",
    callbackURL: "https://glacial-harbor-58042.herokuapp.com/campgrounds"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    res.redirect('/');
});

app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);

// app.listen(3000, function(){
//     console.log("Server running on port 3000");
// });

var port = process.env.PORT||3000; // Use 8080 for local development

app.listen(port, function (){
  console.log(`test app listening on port ${port}!`);
});

module.exports = app;