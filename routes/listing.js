const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //Index Route
  .post(
    //Create Route
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// Search Route
router.get(
  "/search",
  wrapAsync(async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.redirect("/listings");
    }

    const regex = new RegExp(escapeRegex(query), "i");

    const listings = await Listing.find({
      $or: [{ title: regex }, { location: regex }],
    });

    res.render("listings/index", { allListings: listings, query });
  })
);

// Utility function to escape special regex chars
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//Filter by category Route
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings: listings, query: category });
});

//New listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //Show Data Route
  .put(
    //Update Route
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    //Delete Route
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
