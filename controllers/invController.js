/* Brings inventory-model.js file into scope and stores its functionality
into a invModel variable */
const invModel = require("../models/inventory-model")
/* Brings the utilities > index.js file into scope and stores its functionality 
into an utilities variable. */
const utilities = require("../utilities/")

//creates an empty object in the invCont variable.
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
/* creates an asynchronous, anonymous function which accepts the request and response 
objects, along with the Express next function as parameters. The function is stored 
into a named method of buildByClassificationId. */
invCont.buildByClassificationId = async function (req, res, next) {
  /*collects the classification_id that has been sent, as a named parameter, 
  through the URL and stores it into the classification_id variable.  */
  const classification_id = req.params.classificationId
  /* calls the getInventoryByClassificationId function, which is in the 
  inventory-model file and passes the classification_id as a parameter. 
  The function "awaits" the data to be returned, and the data is stored 
  in the data variable.*/
  const data = await invModel.getInventoryByClassificationId(classification_id)
  /* calls a utility function to build a grid, containing all vehicles within 
  that classification. The "data" array is passed in as a parameter. 
  An HTML string, containing a grid, is returned and stored in the grid variable. */
  const grid = await utilities.buildClassificationGrid(data)
  /* calls the function to build the navigation bar for use in the view and 
  stores it in the nav variable. */
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  /* calls the Express render function to return a view to the browser. The view
   to be returned is named classification, which will be created within an 
   inventory folder, within the already existing views folder. */
  res.render("./inventory/classification", {
    //build the "title" value used in the head partial
    title: className + " vehicles",
    //contains the nav variable - display navigation bar of view.
    nav,
    //contains the HTML sting, contianing the grid inventory items.
    grid,
  })
}

  module.exports = invCont