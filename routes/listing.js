const express=require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");


// index route
router.get("/",wrapAsync(async(req,res)=>{
    // Listing.find({}).then((res)=>{
    //     console.log(res);
    // })
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
    })
);


//Create route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
});

// Show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // Listing.findById(id).then((res)=>{
    //     console.log(res);
    // })
    const listing= await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs",{listing});
    })
);

// create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    // let {title,description,image,price,country,location}=req.body;    //hum aisa bhi likh sakte hai but new method dekh
    // let listing=req.body.listing;   //new ejs mai html dekh        
    // console.log(listing);


    // try{
    //     const newListing= new Listing(req.body.listing);  //new Listing(listing);
    //     await newListing.save();
    //     res.redirect("/listings");                    //Aisa kar sakta hai but we have used wrapAsync
    // }catch(err){
    //     next(err);
    // } 

    // error handling
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }

    // using joi
    const newListing= new Listing(req.body.listing);  //new Listing(listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
    })
);

// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
    })
);

// update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
    })
);

// DELETE route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // let deletedListing=await Listing.findByIdAndDelete(id);
    await Listing.findByIdAndDelete(id)
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
    })
);

module.exports=router;