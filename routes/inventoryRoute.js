// Needed Resources 
//brings Express in to the scope of the file
const express = require("express")
//uses Express to create a new router object. This keeps server.js file small.
const router = new express.Router() 
//brings the inventory controller into this router document's scope to be used.
const invController = require("../controllers/invController")

// Route to build inventory by classification view
/*The route, which is divided into three elements: 
GET method, the route being watch for(/type/:classificationId), 
and the handler (invController.buildByClassificationId -  will be used to 
fulfill the request sent by the route. */
router.get("/type/:classificationId", invController.buildByClassificationId);

//exports the router object for use elsewhere.
module.exports = router;
