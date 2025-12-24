import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { User } from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import { login, loginForm, logout, signUp, signUpForm } from "../controllers/users.js";
export const userRouter=express.Router();
userRouter.route("/signup")
.get(signUpForm)
.post(wrapAsync(signUp));
userRouter.route("/login")
.get(loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
failureRedirect:"/login",
failureFlash:true
}
),
login);
userRouter.get("/logout",logout);