/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get ("/", baseController.buildHome)
// app.get("/", function (req, res){
//   res.render("index", {title: "Home"})
// })

// Inventory routes
/*app.use is an Express function that directs the application to use the resources
 passed in as parameters. The /inv indicates that a route that contains this word 
 will use this route file to work in the inventory-related processes. InventoryRoute
 is the variable representing the inventoryRoute.js file. Any route that starts with
 /inv will be redirected to the inventoryRoute.js file.*/
app.use("/inv", inventoryRoute)

app.use (async(req, res, next) => {
  next({status: 404, message: '<h1>Bummer!! Wrong web page!!</h1><img src="/images/404_image/404-error.png"/>'});
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  //calls the "error.ejs" view in an "error" folder.
  res.render("errors/error", {
    // sets the value of the "title" for the view. It will use 
    // the status code or "Server Error" as the title if no status code is set.
    title: err.status || 'Server Error',
    /* sets the message to be displayed in the error view to the message 
    sent in the error object. */
    message: err.message,
    // sets the navigation bar for use in the error view.
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

