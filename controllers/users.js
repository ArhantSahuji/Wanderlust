const User=require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.login = async(req,res)=>{
    // res.send("you are logged in");
    req.flash("success","Welcome back to Wanderlust!");
    // console.log(res.locals.redirectUrl, "hi");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports. logout= (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    }
)
}