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

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regResult = await invModel.addClassification(classification_name)
    
    if (regResult) {
        req.flash("notice", `Congratulations, you've added the ${classification_name} classification.`)
        res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav: await utilities.getNav(), 
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the classification failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            classification_name,
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
    })
}

/* ***************************
 *  Process new inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { 
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id 
    } = req.body

    const regResult = await invModel.addInventory(
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
    )
    
    if (regResult) {
        req.flash("notice", `Congratulations, you've added the ${inv_make} ${inv_model} to inventory.`)
        res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the inventory item failed.")
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}
/* Brings inventory-model.js file into scope and stores its functionality
into a invModel variable */
module.exports = invCont


