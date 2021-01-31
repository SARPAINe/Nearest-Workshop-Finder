const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const bodyParser = require("body-parser");
const ejs=require('ejs');
const session=require('express-session');
const passport =require('passport'); 
const LocalStrategy = require("passport-local");
const passportLocalMongoose =require('passport-local-mongoose'); 
const mongoose=require('mongoose');

dotenv.config({path:'./config/config.env'});

const app=express();

//body parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set("view engine","ejs");

//set public folder
app.use(express.static(path.join(__dirname,'public')));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//set global errors variables
app.locals.errors=null;

const connectDB=require('./config/db');
const MongoStore = require('connect-mongo')(session);

//express session middleware
app.use(session({
  secret:process.env.secret, 
  resave:false,
  saveUninitialized:true,
  store:new MongoStore({mongooseConnection:mongoose.connection})
}))


require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

//connect to database
connectDB();



app.get("*",(req,res,next)=>{
  //cart will be available on every get request because of this below line
  res.locals.user=req.user || null;
  next();
});


//Routes
app.use('/admin/workshops', require('./routes/workshops'));
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));

const PORT =process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on ${process.env.NODE_ENV} mode on port ${PORT}!`); 
});