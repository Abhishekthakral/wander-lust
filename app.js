if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};
console.log(process.env.secret);
const express=require('express');
const app=express();
const mongoose=require('mongoose'); 
const Mongo_url=process.env.Atlas_url;
const path=require("path");
const method_override=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routers/listings.js");
const review=require("./routers/reviews.js");
const UserRouter=require("./routers/userRouter.js");
const MongoStore = require('connect-mongo');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");


main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(method_override("_method"));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl: Mongo_url,
    crypto: {
      secret: 'my secter password'
    },
    touchAfter:24*3600,
  });

const sessionoptions=({
    store,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
})

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currusers=req.user;
    next();
});

// app.get("/demoUser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"abc@gmail.com",
//         username:"abc",
//     });
//    let registeredUser=await User.register(fakeuser,"hello world");
//    res.send(registeredUser);
// })

app.use("/listings",listings);
app.use("/listings/:id/reviews",review);
app.use("/users",UserRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("jai peera di");
});