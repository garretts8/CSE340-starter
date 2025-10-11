
//Requires the inventory-model(invModel) file to get data
const invModel = require("../models/inventory-model")
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
  console.log(data)
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
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(
  fn(req, res, next)).catch(next)


module.exports = Util