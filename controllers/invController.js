const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {}



/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId

    // Fetch data from model
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
    // Build grid and navigation
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()

    // Extract the classification name
    const className = data[0].classification_name

    // Render the classification view
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error building classification view:", error)
    res.status(500).send("Internal Server Error")
  }
}


// /* ***************************
//  *  Build inventory by classification view
//  * ************************** */
invCont.buildInventoryById = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inv_id)
  const vehicleMake = data[0].inv_make
  const vehicleModel = data[0].inv_model
  const vehicleYear = data[0].inv_year
  const grid = await utilities.buildInventoryById(data)
  let nav = await utilities.getNav()

  res.render("./inventory/vehicle", {
    title: vehicleMake + " " + vehicleModel + " " + vehicleYear,
    nav,
    grid,
  })
}


/****************************
 * Serve the management view
 * ************************** */
invCont.buildManagementView = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect
    });
  } catch (err) {
    console.error("Error serving the management view: ", err);
    res.status(500).send("Server Error");
  }
};



/* ***************************
 *  Render Add Classification View
 * ************************** */
invCont.renderAddClassification = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } catch (err) {
    console.error("Error rendering add-classification view: ", err);
  }
};

/* ***************************
 *  Handle Add Classification Form Submission
 * ************************** */
invCont.addClassification = async (req, res) => {

  try {
    const { classification_name } = req.body;
    // Insert new classification into the database
    const result = await invModel.insertClassification(classification_name);
    const classificationList = await utilities.buildClassificationList();
    const nav = await utilities.getNav();
    if (result) {
      // Flash success message and render management view
      req.flash("notice", "Classification added successfully.");
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        classificationList,
      })
    } else {
      // Handle failure to add classification
      const nav = await utilities.getNav();
      req.flash("notice", "Failed to add classification.");
      res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "Error adding classification. Please try again.");
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
  });
  }
};



/* ***************************
 *  Render Add Inventory View
 * ************************** */
invCont.renderAddInventory = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(); // Generate the select list for classifications
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
    });
  } catch (err) {
    console.error("Error rendering add-inventory view:", err);
    res.status(500).send("Server Error");
  }
};


/* ***************************
 *  Handle Add Inventory Form Submission
 * ************************** */
invCont.addInventory = async (req, res) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail } = req.body;
  const nav = await utilities.getNav();

  try {
    // pass the values individually, not as an object
    const result = await invModel.insertInventory(
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    );

    // If result is truthy, vehicle was added successfully
    if (result.rowCount > 0) {
      req.flash("notice", "Vehicle added successfully.");
      const classificationList = await utilities.buildClassificationList();
      res.status(201).render("./inventory/management", {   
        title: "Inventory Management",
        nav,
        classificationList,
        errors: null,
      });
    } else {
      // Handle case where insert did not succeed
      req.flash("notice", "Error adding new vehicle. Please try again.");
      const classificationList = await utilities.buildClassificationList();
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      });
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    req.flash("notice", `Error adding new vehicle: ${inv_make} ${inv_model}`);
    const classificationList = await utilities.buildClassificationList();
    res.status(500).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
// invCont.getInventoryJSON = async (req, res, next) => {
//   const classification_id = parseInt(req.params.classification_id)
//   const invData = await invModel.getInventoryByClassificationId(classification_id)
//   if (invData[0].inv_id) {
//     return res.json(invData)
//   } else {
//     next(new Error("No data returned"))
//   }
// }


invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId);

  // Validate classification_id
  if (isNaN(classification_id)) {
    return res.status(400).json({ error: "Invalid classification ID. It must be an integer." });
  }

  try {
    const invData = await invModel.getInventoryByClassificationId(classification_id);

    // Check if data was returned
    if (invData && invData.length > 0 && invData[0].inv_id) {
      return res.json(invData);
    } else {
      // If no data found, respond with a 404 status and message
      return res.status(404).json({ message: "No inventory data found for the provided classification ID." });
    }
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    next(error); // Passes the error to the error-handling middleware
  }
};


/* ***************************
 *  Render edit inventory View
 * ************************** */
invCont.renderEditInventory = async (req, res) => {
  const inv_id = parseInt(req.params.inventoryId);
  try {
    const nav = await utilities.getNav();
    const data = await invModel.getInventoryById(inv_id);
    const name = `${data[0].inv_make} ${data[0].inv_model}`;
    const classificationList = await utilities.buildClassificationList(); 
    res.render("./inventory/edit-inventory", {
      title: `Edit ${name}`,
      nav,
      classificationList,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_description: data[0].inv_description,
      inv_price: data[0].inv_price,
      inv_miles: data[0].inv_miles,
      inv_color: data[0].inv_color,
      inv_image: data[0].inv_image,
      inv_thumbnail: data[0].inv_thumbnail,
      classification_id: data[0].classification_id,
    });
  } catch (err) {
    console.error("Error rendering edit-inventory view:", err);
    res.status(500).send("Server Error");
  }
};




/* ***************************
 *  Handle update Inventory Form Submission
 * ************************** */
invCont.updateInventory = async (req, res) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, inv_id } = req.body;
  const nav = await utilities.getNav();

  try {
    // pass the values individually, not as an object
    const updateResult = await invModel.updateInventory(
      inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    );

    // If updateResult is truthy, vehicle was updated successfully
    if (updateResult) {
      const name = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `${name} updated successfully.`);
      res.redirect(".");
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const name = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + name,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
  } catch (error) {
    console.error("Error updating inventory:", error);
  }
};




/* ***************************
 *  Render delete inventory View
 * ************************** */
invCont.renderDeleteInventory = async (req, res) => {
  const inv_id = parseInt(req.params.inventoryId);
  try {
    const nav = await utilities.getNav();
    const data = await invModel.getInventoryById(inv_id);
    const name = `${data[0].inv_make} ${data[0].inv_model}`;
    // const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/delete-confirmation", {
      title: `Delete ${name}`,
      nav,
      // classificationList,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_price: data[0].inv_price,
    });
  } catch (err) {
    console.error("Error rendering delete-confirmation view:", err);
    res.status(500).send("Server Error");
  }
};


/* ***************************
 *  Handle delete Inventory Form Submission
 * ************************** */
invCont.deleteInventory = async (req, res) => {
  const {inv_id} = req.body;
  parseInt(inv_id);

  // const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, inv_id } = req.body;
  const nav = await utilities.getNav();

  try {
    const data = await invModel.getInventoryById(inv_id);
    const itemName = `${data[0].inv_make} ${data[0].inv_model}`;

    // pass the values individually, not as an object
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    // If updateResult is truthy, vehicle was updated successfully
    if (deleteResult) {
      // const name = deleteResult.inv_make + " " + deleteResult.inv_model
      req.flash("notice", `${itemName} deleted successfully.`);
      res.redirect(".");
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect("inventory/delete-confirmation")
    }
  } catch (error) {
    console.error("Error deleting inventory:", error);
  }
};


/* ***************************
 *  Render Search Inventory View
 * ************************** */
invCont.renderSearchInventory = async (req, res) => {
  try {
      const nav = await utilities.getNav();
      res.render("./inventory/search-inventory", {
          title: "Search Inventory",
          nav,
          errors: null,
      });
  } catch (error) {
      console.error("Error rendering search-inventory view:", error);
      res.status(500).send("Server Error");
  }
};

/* ***************************
*  Handle Search Inventory Form Submission
* ************************** */
invCont.searchInventory = async (req, res) => {
  const { inv_id } = req.body; // use inventory ID for search
  const nav = await utilities.getNav();

  try {
      // Search by ID
      const results = await invModel.findInventoryById(inv_id);

      // Check if results were found
      if (results && results.length > 0) {
          res.render("./inventory/search-results", {
              title: "Search Results",
              nav,
              results,
              errors: null,
          });
      } else {
          req.flash("notice", "No vehicle found with the given ID.");
          res.render("./inventory/search-inventory", {
              title: "Search Inventory",
              nav,
              errors: null,
          });
      }
  } catch (error) {
      console.error("Error searching inventory:", error);
      req.flash("notice", "Error searching inventory. Please try again.");
      res.render("./inventory/search-inventory", {
          title: "Search Inventory",
          nav,
          errors: null,
      });
  }
};

module.exports = invCont
