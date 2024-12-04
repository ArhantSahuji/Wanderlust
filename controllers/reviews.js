const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview = async (req,res)=>{
    console.log("hi");
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "New review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let{id,reviewId}=req.params;
    // console.log(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}