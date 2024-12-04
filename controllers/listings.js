const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    // Listing.findById(id).then((res)=>{
    //     console.log(res);
    // })
    const listing= await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs",{listing});
    }

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    const newListing= new Listing(req.body.listing);  //new Listing(listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs",{listing , originalImageUrl});
    }

    module.exports.updateListing = async(req,res)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listing");
        // }
        let {id}=req.params;
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file != "undefined"){
            let url=req.file.path;
            let filename = req.file.filename;
            listing.image={url,filename};
            await listing.save();
        }
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
        }

    module.exports.destroyListing = async(req,res)=>{
        let {id}=req.params;
        // let deletedListing=await Listing.findByIdAndDelete(id);
        await Listing.findByIdAndDelete(id)
        // console.log(deletedListing);
        req.flash("success", "Listing Deleted");
        res.redirect("/listings");
        }


// *****************************CREATE LISTING ***************************
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