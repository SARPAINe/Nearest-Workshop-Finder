const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const bodyParser = require("body-parser");
const ejs=require('ejs');
const session=require('express-session');
const mongoose=require('mongoose');

const connectDB=require('./config/db');
//connect to database
connectDB();

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

//set global errors variables
app.locals.errors=null;

const MongoStore = require('connect-mongo')(session);

//express session middleware
app.use(session({
  secret:'keyborad cat',
  resave:true,
  saveUninitialized:true,
  store:new MongoStore({mongooseConnection:mongoose.connection})
}))

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Routes
app.use('/admin/workshops', require('./routes/workshops'));

const PORT =process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on ${process.env.NODE_ENV} mode on port ${PORT}!`); 
});