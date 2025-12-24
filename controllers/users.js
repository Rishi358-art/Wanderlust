import { User } from "../models/user.js";
import { ExpressError } from "../utils/ExpressError.js";
export const signUpForm=async (req,res)=>{
    res.render("listings/signup");

}
export const signUp=async (req,res,next)=>{
    try {
    let {username,email,password}=req.body;
    let newUser=new User({email,username});
    let registeredUser=await User.register(newUser,password);
   
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
         req.flash("success","Welcome to WanderLust");
          res.redirect("/listing");
    })
    } catch (error) {
        req.flash("error","User credentials already exists");
        res.redirect("/signup")
    }
    
}
export const loginForm=async (req,res)=>{
    res.render("listings/login");
}
export const login=async (req,res)=>{
   req.flash("success","Welcome Back to WanderLust");
   let redirect=res.locals.redirectUrl? res.locals.redirectUrl : "/listing";
   res.redirect(redirect);
}
export const logout=async (req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
           return next(err);
        }
        req.flash("success","you logged out successfully");
         res.redirect("/listing");
    });
}