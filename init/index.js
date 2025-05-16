const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: "pk.eyJ1IjoibWFwNjV1c2VyIiwiYSI6ImNtYW5vZDcwNTAxM2Qybm9rM3J5ajcweGUifQ.4bhdr81hX1w5ykljOJnu3Q" });


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
   console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initgeomentry(initData) {
for(data of initData.data){
let response =await geocodingClient.forwardGeocode({
  query: data.location,
  limit: 2,
})
  .send()
  data.geometry=response.body.features[0].geometry;
   //await Listing.deleteMany({});
 // await Listing.insertMany(data);
  //console.log(data);
}
}
initgeomentry(initData);


const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"681de4f71e8d59b69aacc19a"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
  console.log(initData.data);
};

initDB();
//console.log(initData.data);*/