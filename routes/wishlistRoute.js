const express = require("express")
const router = new express.Router()
const wishlistController = require("../controllers/wishlistController")
const utilities = require("../utilities/")

// Display wishlist page
router.get(
  "/wishlist",
  utilities.checkLogin,
  utilities.handleErrors(wishlistController.buildWishlist)
)

// Add vehicle to wishlist (from detail page)
router.get(
  "/wishlist/add/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(wishlistController.addToWishlist)
)

// Remove vehicle from wishlist
router.get(
  "/wishlist/remove/:wishlist_id",
  utilities.checkLogin,
  utilities.handleErrors(wishlistController.removeFromWishlist)
)

module.exports = router