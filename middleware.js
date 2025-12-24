import { Listing } from "./models/listing.js";
import { ListingSchema } from "./ListingSchema.js";
import { ExpressError } from "./utils/ExpressError.js";
import { ReviewSchema } from "./ListingSchema.js";
import { Review } from "./models/review.js";
export const isLogin=(req,res,next)=>{
     if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","you must be logged in first.");
            return res.redirect("/login");
        }
        next();
}
export const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
export const isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not the owner of this listing.")
        return res.redirect(`/listing/${id}`);
    }
    next();
}
export const  validateListing=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
export const validateReview=(req,res,next)=>{
    let {error}=ReviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
export const isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","you didn't created this review.")
        return res.redirect(`/listing/${id}`);
    }
    next();
}