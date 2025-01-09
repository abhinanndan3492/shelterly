const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "images/sara-dubler-Koei_7yYtIo-unsplash.jpg",
    set: (v) => (v === "" ? "images/sara-dubler-Koei_7yYtIo-unsplash.jpg" : v),
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
