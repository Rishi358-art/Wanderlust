if (process.env.NODE_ENV !== "production") {
    const dotenv = await import('dotenv');
    dotenv.config();
}

import express from "express";
import mongoose from "mongoose";
import { Listing } from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import engine from "ejs-mate";
import { wrapAsync } from "./utils/wrapAsync.js";
import { ExpressError } from "./utils/ExpressError.js";
import { ListingSchema, ReviewSchema } from "./ListingSchema.js";
import { Review } from "./models/review.js";
import { router } from "./routes/listing.js";
import { reviewRouter } from "./routes/review.js";
import { userRouter } from "./routes/user.js";
import flash from "connect-flash";
import session, { Cookie } from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "./models/user.js";
const app=express();
const port=8080;
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLAS_URL;
const listings=router;
const reviews=reviewRouter;
const users=userRouter;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
})
const secretOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
import methodOverride from "method-override";
async function main()
{
  await mongoose.connect(dbUrl);
}
main().then((res)=>console.log("database is connected")).catch((err)=>console.log("err"));
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',engine);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(express.static(path.join(__dirname,"public")));
app.use(session(secretOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
app.get("/",async (req,res)=>{
     const allListings=await Listing.find({});
     res.render("listings/index",{allListings});
})
app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",users);
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"}=err;
    res.status(statusCode).render("listings/error",{err});
    
});

app.listen(port,()=>{
    console.log("the server is listening");
});
