import mongoose from "mongoose";
import { Review } from "./review.js";
import { ListingSchema } from "../ListingSchema.js";
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:
    {
        type:String,
        required:true
    },
    description:String,
    image:{
           filename:{
          type:String,
          default:"listingimage"
        },
        url:{
            type:String,
            default:"https://lp-cms-production.imgix.net/2024-12/GettyRF178407725.jpg?auto=format,compress&q=72&fit=crop",
            set:(v)=>v===""? "https://lp-cms-production.imgix.net/2024-12/GettyRF178407725.jpg?auto=format,compress&q=72&fit=crop":v
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }
],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})
export const Listing=mongoose.model("Listing",listingSchema);
