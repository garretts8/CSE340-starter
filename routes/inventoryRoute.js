// Needed Resources 
//brings Express in to the scope of the file
const express = require("express")
//uses Express to create a new router object. This keeps server.js file small.
const router = new express.Router() 
//brings the inventory controller into this router document's scope to be used.
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/error/", utilities.handleErrors(invController.errorRoute));


// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to process new classification
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process new inventory
router.post(
    "/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

//exports the router object for use elsewhere.
module.exports = router;
