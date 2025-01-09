const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
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

// app.get("/testlisting", async(req, res) => {
//     let samplelisting = new listing({
//         title: "sample listing",
//         description: "this is a sample listing",
//         price: 100,
//         location: "sample location",
//         country: "sample country",
//     });

//     await samplelisting.save();
//     res.send("listing saved...");
// });

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// new Route
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

// create route
app.post("/listings", async (req, res) => {
  const { title, description, price, location, country } = req.body;
  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
  });
  await newListing.save();
  res.redirect("/listings");
});

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const { title, description, price, location, country } = req.body;
  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
  });
  res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.get("/", (req, res) => {
  res.send("Root is working...");
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:/${port}`);
});
