const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to display error test page (optional)
router.get("/test", utilities.handleErrors(errorController.buildErrorTest))

// Route to trigger intentional error
router.get("/trigger", utilities.handleErrors(errorController.triggerError))

module.exports = router
