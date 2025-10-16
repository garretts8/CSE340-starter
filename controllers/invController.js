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
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inv_id)
  const detailHTML = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_year + " " + data.inv_make + " " + data.inv_model,
    nav,
    detailHTML,
  })
}

module.exports = invCont/* Brings inventory-model.js file into scope and stores its functionality
into a invModel variable */


