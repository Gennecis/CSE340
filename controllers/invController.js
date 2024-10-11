const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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



module.exports = invCont
