const utilities = require("../utilities")
  const { body, validationResult } = require("express-validator")
  const accountModel = require("../models/account-model")
  
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
        throw new Error("Email exists. Please login or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minUppercase: 1,
          minLowercase: 0,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* **********************************************************
 * Check data and return errors or continue to registration
 * ************************************************************* */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)

  //Check if there are any validation errors
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

// Remove duplicate "Invalid value" messages - same as inventory validation
    const errorMap = new Map();
    errors.array().forEach(error => {
      // Group by field and keep only the most relevant message
      if (!errorMap.has(error.path) || 
          !error.msg.includes('Invalid value')) {
        errorMap.set(error.path, error);
      }
    });
    
    const filteredErrors = {
      ...errors,
      array: () => Array.from(errorMap.values())
    }

    res.render("account/register", {
       errors: filteredErrors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    // Remove duplicate "Invalid value" messages for login as well
    const errorMap = new Map();
    errors.array().forEach(error => {
      if (!errorMap.has(error.path) || 
          !error.msg.includes('Invalid value')) {
        errorMap.set(error.path, error);
      }
    });
    
    const filteredErrors = {
      ...errors,
      array: () => Array.from(errorMap.values())
    }

    res.render("account/login", {
      errors: filteredErrors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}
 
module.exports = validate