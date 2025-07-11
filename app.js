
if(process.env.NODE_ENV!="production") {
require('dotenv').config();
}

const express= require('express');
const MongoStore = require('connect-mongo');
const app = express();
const mongoose = require('mongoose');
const path=require('path');
const methodoverride=require('method-override');
const ExpressError=require('./utils/ExpressError.js');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const port=8080;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);

const listingRouter=require('./routes/listingRoutes.js');
const reviewRouter=require('./routes/reviewRoutes.js');
const userRouter=require('./routes/userRoutes.js');

//const dburl=process.env.AtlasUrl;
const MONGO_URL = "process.env.AtlasUrl";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{console.log("success!")}).catch((err)=>{console.log(err)});

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
});

const store = MongoStore.create({
  //mongoUrl: dburl,
  mongoUrl:MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on('error',()=>{
  console.log('Error on mongo session store',err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie :{
    expires:Date.now() + 7*24*60*60*100,
    maxAge:7*24*60*60*100,
    httpOnly:true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use('/listings',listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use('/',userRouter);

 app.all('*',(req,res,next)=>{
 next(new ExpressError(404,'page not found'));
  });

  app.use((err,req,res,next)=>{
    let {statusCode=500,message='something went wrong'}=err
    res.render("listings/error.ejs",{message});
  });