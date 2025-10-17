const utilities = require("../utilities/")

const errorController = {}

/* ***************************
 *  Build intentional error route
 * ************************** */
errorController.triggerError = async function(req, res, next) {
    const error = new Error("Intentional 500 Error - Test Error Handling")
    error.status = 500
    throw error
    
}

/* ***************************
 *  Build error test view 
 * ************************** */
errorController.buildErrorTest = async function(req, res, next) {
  const nav = await utilities.getNav()
  res.render("errors/error-test", {
    title: "Server Error",
    nav,
    message: "Oh no! There was a crash. Maybe try a different route?"
  })
}

module.exports = errorController