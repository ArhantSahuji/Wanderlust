const express = require("express");
const app=express();
// const users=require("./routes/user.js");
// const posts= require("./routes/post.js");
const path= require ("path");
const session=require("express-session");
const flash = require("connect-flash");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"./views"));

const sessionOptions={
    secret: "mysuperseceretstring", 
        resave:false, 
        saveUninitialized:true 
    }

app.use(session(sessionOptions));
app.use(flash());
// app.use(                            //  karneka aur behatar tarika ki tum options ka ek uppar const hi bana lo 
//     session({
//         secret: "mysuperseceretstring", 
//         resave:false, 
//         saveUninitialized:true 
//     })
// );

app.get("/register",(req,res)=>{
    let {name="anonymus default name"}=req.query;
    req.session.name=name;
    // console.log(req.session.name);
    if(name=="anonymus default name"){
        req.flash("error", "some error occured");
    }
    else{
        req.flash("success", "user register successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req,res)=>{
    res.locals.successmsg= req.flash("success");
    res.locals.errormsg= req.flash("error");
    res.render("page.ejs",{name: req.session.name });
    // res.render("page.ejs",{name: req.session.name, msg: req.flash("success")});  aur ek tarika hai karneka jo uppar kia hai
    // res.send(`hello, ${req.session.name}`);
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count} times`)
})

// app.get("/test",(req,res)=>{
//     res.send("test successful!");
// });


app.listen(3000,()=>{
    console.log("server is listening to 3000");
});