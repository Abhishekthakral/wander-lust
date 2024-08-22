const mongoose=require('mongoose');
const initData=require('./data.js');
const listing=require("../Models/listing.js");

const Mongo_url="mongodb://127.0.0.1:27017/mainProject";

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDB=async() => {
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>(
        {...obj,owner:'66b7a337a6bf356715e60933'}
    ));
    listing.insertMany(initData.data);
    console.log("data was saved");
};

initDB();