const Listing=require("./Models/listing.js");
const Reviews=require("./Models/Reviews.js");
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in before creating an new listings");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirectUrl=req.session.redirecturl;
    }
    next();
};


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currusers._id)){
        req.flash("error","you are not allowed to change someones else listings");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isreviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviews=await Reviews.findById(reviewId);
    if(!reviews.author._id.equals(res.locals.currusers._id)){
        req.flash("error","you are not allowed to change someones else reviews");
        return res.redirect(`/listings/${id}`);
    }
    next();
};