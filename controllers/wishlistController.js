const wishlistModel = require("../models/wishlist-model")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const wishlistController = {}

/* ***************************
 *  Display user's wishlist
 * ************************** */
wishlistController.buildWishlist = async function (req, res, next) {
  try {
    if (!res.locals.loggedin) {
      req.flash("notice", "Please log in to view your wishlist.")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const wishlistItems = await wishlistModel.getWishlistByAccountId(account_id)
    const nav = await utilities.getNav()

    // Format data for display
    wishlistItems.forEach(item => {
      item.formatted_price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(item.inv_price)
      
      item.formatted_miles = new Intl.NumberFormat('en-US').format(item.inv_miles)
      
      item.formatted_date = new Date(item.added_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    })

    res.render("./account/wishlist", {
      title: "My Wishlist",
      nav,
      wishlistItems,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add item to wishlist (from detail page)
 * ************************** */
wishlistController.addToWishlist = async function (req, res, next) {
  try {
    if (!res.locals.loggedin) {
      req.flash("notice", "Please log in to add vehicles to your wishlist.")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.params.inv_id)

    // Validate inventory exists
    const inventory = await invModel.getInventoryById(inv_id)
    if (!inventory) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv/")
    }

    // Add to wishlist
    const result = await wishlistModel.addToWishlist(account_id, inv_id)
    
    if (result.success) {
      req.flash("notice", "Vehicle added to your wishlist!")
      return res.redirect("/account/wishlist")
    } else {
      req.flash("notice", result.message)
      return res.redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    console.error("addToWishlist controller error:", error)
    req.flash("notice", "There was an error adding the vehicle to your wishlist.")
    res.redirect("/inv/")
  }
}

/* ***************************
 *  Remove item from wishlist
 * ************************** */
wishlistController.removeFromWishlist = async function (req, res, next) {
  try {
    if (!res.locals.loggedin) {
      req.flash("notice", "Please log in to manage your wishlist.")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const wishlist_id = parseInt(req.params.wishlist_id)

    const result = await wishlistModel.removeFromWishlist(wishlist_id, account_id)

    if (result.success) {
      req.flash("notice", "Vehicle removed from your wishlist.")
    } else {
      req.flash("notice", "Unable to remove vehicle from wishlist.")
    }
    
    res.redirect("/account/wishlist")
  } catch (error) {
    console.error("removeFromWishlist controller error:", error)
    req.flash("notice", "There was an error removing the vehicle from your wishlist.")
    res.redirect("/account/wishlist")
  }
}

module.exports = wishlistController
