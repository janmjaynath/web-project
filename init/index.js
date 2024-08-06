const mongoose  = require("mongoose");
const Listing = require("../model/listing.js");
const initData = require("./data.js");

main().then(()=>{
  console.log("successfull");
}).catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Hello"); 

}

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((OBJ)=>({...OBJ , owner : "66afc200755a8c6c61eff00d" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialize");
}

initDB();