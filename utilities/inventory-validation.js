const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const invModel = require("../models/inventory-model")

/* ***************************
 *  Classification Validation Rules
 * ************************** */
validate.classificationRules = () => {
    return [
      // Classification name must not contain spaces or special characters
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Classification name must not contain spaces or special characters."),
    ];
  };
  
  /* ***************************
   *  Check Classification Data
   * ************************** */
  validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors,
        classification_name,
      });
      return;
    }
    next();
  };


/* ***************************
 *  Inventory Validation Rules
 * ************************** */
validate.inventoryRules = () => {
    return [
      body("classification_id").notEmpty().withMessage("Please choose a classification."),
      body("inv_make").trim().notEmpty().withMessage("Please provide the make."),
      body("inv_model").trim().notEmpty().withMessage("Please provide the model."),
      body("inv_year").isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("Please provide a valid year."),
      body("inv_description").trim().notEmpty().withMessage("Please provide a description."),
      body("inv_price").isFloat({ min: 0 }).withMessage("Please provide a valid price."),
      body("inv_miles").isInt({ min: 0 }).withMessage("Please provide valid mileage."),
      body("inv_color").trim().notEmpty().withMessage("Please provide a color."),
      body("inv_image").trim().notEmpty().withMessage("Please provide an image path."),
      body("inv_thumbnail").trim().notEmpty().withMessage("Please provide a thumbnail path."),
    ];
  };
  
  
  /* ***************************
   *  Check Inventory Data
   * ************************** */
  validate.checkInventoryData = async (req, res, next) => {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_price,
      inv_miles,
      inv_color,
      inv_year,
      inv_thumbnail,
      classification_id,
    } = req.body;
    let errors = validationResult(req);
   
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(
        classification_id
      ); // Pass classification_id to make dropdown sticky
   
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_price,
        inv_miles,
        inv_color,
        inv_year,
        inv_thumbnail,
        classificationList,
        classification_id,
      });
      return;
    }
    next();
  };



  /* ***************************
   *  direct errors to the edit view
   * ************************** */
  validate.checkUpdateData = async (req, res, next) => {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_price,
      inv_miles,
      inv_color,
      inv_year,
      inv_thumbnail,
      classification_id,
    } = req.body;
    let errors = validationResult(req);
   
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(
        classification_id
      ); // Pass classification_id to make dropdown sticky
   
      res.render("inventory/edit-inventory", {
        errors,
        title: "edit Inventory",
        nav,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_price,
        inv_miles,
        inv_color,
        inv_year,
        inv_thumbnail,
        classificationList,
        classification_id,
      });
      return;
    }
    next();
  };

  module.exports = validate