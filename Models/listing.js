const mongoose=require('mongoose');

const Reviews=require("./Reviews.js");

const Schema=mongoose.Schema;

const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Reviews",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    }
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id : {$in : listing.reviews}});
    }
    
})
const Listing=mongoose.model("listing",ListingSchema);
module.exports=Listing;