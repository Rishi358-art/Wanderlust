import express from "express";
export const reviewRouter=express.Router({mergeParams:true});
import { wrapAsync } from "../utils/wrapAsync.js";
import { ReviewSchema } from "../ListingSchema.js";
import { ExpressError } from "../utils/ExpressError.js";
import { Listing } from "../models/listing.js";
import { Review } from "../models/review.js";
import {isLogin, validateReview ,isAuthor} from "../middleware.js";
import { deleteReview, postReview } from "../controllers/reviews.js";
// reviews

reviewRouter.post("/",validateReview,isLogin,wrapAsync(postReview));
reviewRouter.delete("/:reviewId",isLogin,isAuthor,wrapAsync(deleteReview))