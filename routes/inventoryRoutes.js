// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view
router.get("/detail/:inventoryId", invController.buildInventoryById);

// Route for Inventory Management View
router.get("/", invController.buildManagementView);

// Route to display the add-classification view
router.get("/add-classification", invController.renderAddClassification);

// Route to handle the form submission with server-side validation
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
);

// Route to display the add-inventory view
router.get("/add-inventory", invController.renderAddInventory);

// Route to handle form submission
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory,
);

// Route to get inventory JSON
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON));

// Route to display the edit-inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.renderEditInventory));

// Route to handle update form submission
router.post("/edit-inventory/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

module.exports = router;