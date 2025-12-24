import mongoose from "mongoose";
import { Listing } from "../models/listing.js";
import { sampleListings } from "./data.js";
const dbUrl=process.env.ATLAS_URL;
async function main()
{
  await mongoose.connect(dbUrl);
}
main().then((res)=>console.log("database is connected")).catch((err)=>console.log("err"));
const initDB=async ()=>{
    await Listing.deleteMany({});
    const listingsWithOwner = sampleListings.map(obj => ({
  ...obj,
  owner: "69412bf92291f364c1910fe7"
}));

    await Listing.insertMany(listingsWithOwner);
    console.log("successful");
} 
initDB();