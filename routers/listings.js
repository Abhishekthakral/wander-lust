const express=require('express');
const router=express.Router();
const asyncWrap=require("../utils/wrapasyn.js");
const Listing=require("../Models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedin}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {storage}=require("../cloudconfig.js");
const multer  = require('multer');
const upload = multer({ storage });


const ValidateSchema=(req,res,next)=>{
    const {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>{
            el.message
        }).join(",");
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
};

router.get("/",asyncWrap(async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("index.ejs",{alllistings});
 }));
 
 router.get("/newList",isLoggedin,(req,res)=>{
     res.render("new.ejs");
 });
 
router.get("/:id",asyncWrap(async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!listing){
        req.flash("error","listing you are try to search does not exist");
        res.redirect("/listings");
        return;
    }
    res.render("show.ejs",{listing});
 }));
 
router.post("/",isLoggedin,upload.single("listings[image]"),asyncWrap(async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
     let newList=new Listing(req.body.listings);
     newList.owner=req.user._id;
     newList.image={url,filename};
     await newList.save();
    req.flash("success","new listing created");
     res.redirect("/listings");
 }));

 router.get("/:id/edit",isLoggedin,isOwner,asyncWrap(async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you are try to search does not exist");
        res.redirect("/listings");
    }

    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250/h_300")
    res.render("edit.ejs",{listing,originalUrl});
 }));
 
 router.put("/:id",isLoggedin,isOwner,upload.single("listings[image]"),ValidateSchema,asyncWrap(async(req,res)=>{
     let {id}=req.params;
     let listing=await Listing.findByIdAndUpdate(id,{...req.body.listings});
     if(typeof req.file!=="undefined"){
     let url=req.file.path;
     let filename=req.file.filename;
     listing.image={url,filename};
     await listing.save();
     }
     req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
 }));
 
 router.delete("/:id",isLoggedin,isOwner,asyncWrap(async(req,res)=>{
     let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
     res.redirect("/listings");
 }));

 module.exports=router;