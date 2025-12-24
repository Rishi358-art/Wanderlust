import express from "express";
export const router=express.Router({mergeParams:true});
import { wrapAsync } from "../utils/wrapAsync.js";
import { Review } from "../models/review.js";
import { Listing } from "../models/listing.js";
import { ExpressError } from "../utils/ExpressError.js";
import { ListingSchema } from "../ListingSchema.js";
import { isLogin,isOwner,validateListing } from "../middleware.js";
import {  editListingForm, index, newListingForm, showListing,newListing, destroyListing, editListing, } from "../controllers/listings.js";
import { storage } from "../cloudConfig.js";
import multer from "multer";
// all listing
const upload=multer({storage});
// newroute
router.get("/destination", async (req, res) => {
  const { destination } = req.query;

  const allListings = await Listing.find({
    location: { $regex: destination, $options: "i" }
  });

  res.render("listings/seachDest", { allListings });
});

router.get("/new",isLogin,newListingForm);
router.route("/")
.get(wrapAsync(index))
.post(isLogin,upload.single("listing[image][url]"),validateListing,wrapAsync(newListing));
router.route("/:id")
.get(showListing)
.put(isLogin,isOwner,upload.single("listing[image][url]"),validateListing,editListing)
.delete(isLogin,isOwner,destroyListing);


router.get("/:id/edit",isLogin,editListingForm);



