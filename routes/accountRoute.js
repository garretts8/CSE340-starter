const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
)

router.get(
  "/register", 
  utilities.handleErrors(accountController.buildRegister)
)

// Process the registration data
router.post(
    "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)  
)

// Account management route
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)

// Account update routes
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Logout route
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
);
 
module.exports = router;