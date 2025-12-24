import { Listing } from "../models/listing.js";
import { ExpressError } from "../utils/ExpressError.js";

export const index=async(req,res)=>{
        const allListings=await Listing.find({});
     res.render("listings/index",{allListings});

}
export const newListingForm=(req,res)=>{
    res.render("listings/new");
}

export const showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing does not exist");
        return res.redirect("/listing");
    }
    res.render("listings/show",{listing});
    console.log(listing);
}
export const editListingForm=async (req,res)=>{
    let {id}=req.params;   
    let listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing does not exist");
        return res.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250/e_blur:300");
    res.render("listings/edit",{listing , originalImageUrl});
}
export const newListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url," ",filename);
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Added!");
    return res.redirect("/listing");
}
export const editListing=async (req,res)=>{
     if(!req.body.listing)
    {
        throw new ExpressError(404,"Send Valid Data for Listing");
    }
    let id=req.params.id;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
         listing.image={url,filename};
         await listing.save();
    }
    res.redirect(`/listing/${id}`);
}
export const destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted successfully!");
    res.redirect("/listing");
}