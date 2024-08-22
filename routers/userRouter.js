const express=require('express');
const router=express.Router();
const user=require("../Models/user.js");
const passport=require("passport");
const {saveredirecturl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new user({email,username});
    const registereduser=await user.register(newUser,password);
    req.login(registereduser,(err)=>{
        if(err){
            next(err);
        }
    })
    req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/users/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("login.ejs");
});
router.post("/login",saveredirecturl,passport.authenticate("local",{failureRedirect:'/users/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","welcome to wanderlust");
    let saved=res.locals.redirectUrl||"/listings";
    res.redirect(saved);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","you have been logged out");
        res.redirect("/listings");
    })
})


module.exports=router;