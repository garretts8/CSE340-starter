// Needed Resources 
//brings Express in to the scope of the file
const express = require("express")
//uses Express to create a new router object. This keeps server.js file small.
const router = new express.Router() 
//brings the inventory controller into this router document's scope to be used.
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

//exports the router object for use elsewhere.
module.exports = router;
