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
