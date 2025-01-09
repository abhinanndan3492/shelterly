const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");

const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public/css")));

app.set("view angle", "ejs");
app.set("views", path.join(__dirname, "/views"));

async function connectToDB() {
  try {
    await mongoose.connect("mongodb://127.0.01:27017/shelterly");
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
}
connectToDB();

app.get("/testlisting", async(req, res) => {
    let samplelisting = new listing({
        title: "sample listing",
        description: "this is a sample listing",
        price: 100,
        location: "sample location",
        country: "sample country",
    });
    await samplelisting.save();
    res.send("listing saved...");

});

app.get("/", (req, res) => {
  res.send("Root is working...");
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:/post`);
});
