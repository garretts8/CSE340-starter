//Requires the inventory-model(invModel) file to get data
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
//create an empty Util object
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
/*creates an asynchronous function, which accepts the request, response and next
parameters. The function is then stored in a getNav variable of the Util object*/
Util.getNav = async function (req, res, next) {
  //calls the getClassification function from the invModel and stores the resultset 
  //in the data variable
  let data = await invModel.getClassifications()
  // console.log(data)
  //creates a variable named list and assigns a string(HTML unordered list) to it.
  let list = "<ul>"
  /* the list variable has an additional string added. += is an append operator.
  A new list item, containing a link to the index route is added to the 
  unordered list.*/
  list += '<li><a href="/" title="Home page">Home</a></li>'
  //Uses a forEach loop to move through th rows of the data array one at a time.
  data.rows.forEach((row) => {
    //appends an opening list item to the string in the list variable.
    list += "<li>"
    //appends the code as a string to the list variable
    list +=
      '<a href="/inv/type/' +
      row.classification_id +  //the classification id value added into the link route.
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<img src="' + vehicle.inv_thumbnail 
      +'" alt="' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'

      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(vehicle){
  let detailHTML = ''
    if(vehicle){
    detailHTML += '<section class="vehicle-detail">'
    detailHTML += '<div class="vehicle-content">'
    detailHTML += '<div class="vehicle-image">'
    detailHTML += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />'
    detailHTML += '</div>'
    
    detailHTML += '<div class="vehicle-info">'
    detailHTML += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    detailHTML += '<div class="vehicle-details-grid">'
    detailHTML += '<div class="detail-item">'
    detailHTML += '<span class="detail-label">Price: </span>'
    detailHTML += '<span class="detail-value">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
    detailHTML += '</div>'
    
    detailHTML += '<div class="detail-item">'
    detailHTML += '<span class="detail-label">Description: </span>'
    detailHTML += '<span class="detail-value">' + vehicle.inv_description + '</span>'
    detailHTML += '</div>'
    
    detailHTML += '<div class="detail-item">'
    detailHTML += '<span class="detail-label">Color: </span>'
    detailHTML += '<span class="detail-value">' + vehicle.inv_color + '</span>'
    detailHTML += '</div>'
    
    detailHTML += '<div class="detail-item">'
    detailHTML += '<span class="detail-label">Miles: </span>'
    detailHTML += '<span class="detail-value">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
    detailHTML += '</div>'
    detailHTML += '</div>' 
    detailHTML += '</div>' 
    detailHTML += '</section>' 
  } else {
    detailHTML += '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  
  return detailHTML
}

/* ****************************************
 * Build classification select list
 * *************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(
  fn(req, res, next)).catch(next)


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Account Type for Authorization
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && 
      (res.locals.accountData.account_type === 'Employee' || 
       res.locals.accountData.account_type === 'Admin')) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access this area.")
    return res.redirect("/account/login")
  }
}

module.exports = Util