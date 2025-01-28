const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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

app.get("/", (req, res) => {
  res.send("Root is working...");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// new Route
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

// create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // const { title, description, price, location, country } = req.body;
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listings");
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //   throw new ExpressError(400, result.error);
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

// edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // const { title, description, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!!!" } = err;
  res.status(status).render("error.ejs", { message });
  // res.status(status).send(message);
  // res.send("Something went wrong...");
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:/${port}`);
});
