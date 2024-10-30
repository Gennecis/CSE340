// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryById));

// Route for Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to display the add-classification view
router.get("/add-classification", utilities.handleErrors(invController.renderAddClassification));

// Route to handle the form submission with server-side validation
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to display the add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.renderAddInventory));

// Route to handle form submission
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory),
);

// Route to get inventory JSON
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON));

// Route to display the edit-inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.renderEditInventory));

// Route to handle update form submission
router.post("/edit-inventory/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Add a "get" route to match the path that already exists in the inventory management view for the "Delete" link. Be sure to include a parameter to represent the incoming inv_id as part of the URL.
router.get("/delete/:inventoryId", utilities.handleErrors(invController.renderDeleteInventory));

// Add a "post" route handler that will call a controller function to carry out the delete process.
router.post("/delete-inventory/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;