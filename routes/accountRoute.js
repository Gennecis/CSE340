// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const { check } = require("express-validator")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// process the login attepmt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// account route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// update account route
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// route to update account
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// route to change password
router.post("/change-password", 
  regValidate.changePasswordRules(), 
  regValidate.checkChangePassword, 
  utilities.handleErrors(accountController.buildChangePassword));

// route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;