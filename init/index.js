const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

// async function connectToDB() {
//   try {
//     await mongoose.connect("mongodb://127.0.01:27017/shelterly");
//     console.log("Connected to DB");
//   } catch (err) {
//     console.log(err);
//   }
// }
// connectToDB();

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.01:27017/shelterly");
}


const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("data was initialized");
};
initDB();
