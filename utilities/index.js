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

// /* **************************************
// * Build the account view HTML
// * ************************************ */
// Util.buildLogin = async function(account){
//   let loginHTML = ''
//   loginHTML += '<div class="login-container">'
//   loginHTML += '<form action="/account/login" method="post" class="login-form">'
//   loginHTML += '<div class="form-group">'
//   loginHTML += '<label for="account_email">Email:</label>'
//   loginHTML += '<input type="email" id="account_email" name="account_email" placeholder="Enter your email address" required>'
//   loginHTML += '</div>'
//   loginHTML += '<div class="form-group">'
//   loginHTML += '<label for="account_password">Password:</label>'
//   loginHTML += '<input type="password" id="account_password" name="account_password" placeholder="Enter your password" required>'
//   loginHTML += '</div>'
//   loginHTML += '<div class="form-group">'
//   loginHTML += '<button type="submit" class="btn btn-primary">LOGIN</button>'
//   loginHTML += '</div>'
//   loginHTML += '</form>'
//   loginHTML += '<div class="register-link">'
//   loginHTML += '<p>No account? <a href="/account/register" title="Create a new account">Sign-up</a></p>'
//   loginHTML += '</div>'
//   loginHTML += '</div>'
  
//   return loginHTML
// }

// /* **************************************
// * Build the register view HTML
// * ************************************ */
// Util.buildRegister = async function(register){
//   let registerHTML = ''
//   registerHTML += '<div class="register-container">'
//   registerHTML += '<form action="/account/register" method="post" class="registration-form">'
//   registerHTML += '<div class="form-group">'
//   registerHTML += '<label for="account_firstname">First name:</label>'
//   registerHTML += '<input type="text" id="account_firstname" name="account_firstname" placeholder="Enter your first name" required>'
//   registerHTML += '</div>'
//   registerHTML += '<div class="form-group">'
//   registerHTML += '<label for="account_lastname">Last name:</label>'
//   registerHTML += '<input type="text" id="account_lastname" name="account_lastname" placeholder="Enter your last name" required>'
//   registerHTML += '</div>'
//   registerHTML += '<div class="form-group">'
//   registerHTML += '<label for="account_email">Email Address:</label>'
//   registerHTML += '<input type="email" id="account_email" name="account_email" placeholder="Enter your email address" required>'
//   registerHTML += '</div>'
//   registerHTML += '<div class="form-group password-group">'
//   registerHTML += '<label for="account_password">Password:</label>'
//   registerHTML += '<div class="password-input-container">'
//   registerHTML += '<input type="password" id="account_password" name="account_password" placeholder="Enter your password" required>'
//   registerHTML += '<button type="button" id="pswdBtn" class="btn btn-secondary show-password-btn">Show Password</button>'
//   registerHTML += '</div>'
//   registerHTML += '</div>'
//   registerHTML += '<div class="form-group">'
//   registerHTML += '<p>Passwords must be a minimum of 12 characters and include 1 capital letter, 1 number and 1 special character</p>'
//   registerHTML += '</div>'
//   registerHTML += '<div class="form-group">'
//   registerHTML += '<button type="submit" class="btn btn-primary">Register</button>'
//   registerHTML += '</div>'
//   registerHTML += '</form>'
//   registerHTML += '<div class="register-link">'
//   registerHTML += '<p>No account? <a href="/account/register" title="Create a new account">Sign-up</a></p>'
//   registerHTML += '</div>'
//   registerHTML += '</div>'
  
//     // Adding JavaScript for show password functionality
//   registerHTML += `
//   <script>
//     const pswdBtn = document.querySelector("#pswdBtn");
//     pswdBtn.addEventListener("click", function() {
//       const pswdInput = document.getElementById("account_password");
//       const type = pswdInput.getAttribute("type");
//       if(type == "password"){
//         pswdInput.setAttribute("type", "text");
//         pswdBtn.innerHTML = "Hide Password";
//       } else {
//         pswdInput.setAttribute("type", "password");
//         pswdBtn.innerHTML = "Show Password";
//       }
//     });
//   </script>
//   `
  
//   return registerHTML
// }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(
  fn(req, res, next)).catch(next)

module.exports = Util

