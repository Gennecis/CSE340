const pool = require("../database")

/*  **********************
* Get all classification data
*************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`, [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inv_id]
    );
   
    return data.rows;
  } catch (error) {
    console.error(" getInventoryById error " + error);
  }
}

/* ***************************
 *  Insert New Classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`;
    const data = await pool.query(sql, [classification_name]);
    return data.rows;
  } catch (error) {
    console.error("Error inserting classification:", error);
    return null;
  }
}

/* ***************************
 *  Insert New Inventory Item insertInventory
 * ************************** */
async function insertInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_miles, inv_color, classification_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`;

    const result = await pool.query(sql, [
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
    ]);

    // Check if insertion was successful
    if (result.rowCount > 0) {
      return result; // Return the entire result object
    } else {
      throw new Error('Insert failed. No rows were affected.');
    }
  } catch (error) {
    // Log the full error for more details
    console.error("Error inserting inventory item:", error);
    throw error; // Re-throw the error to let the controller handle it properly
  }
}


/* ***************************
 *  Insert update Inventory
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year= $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";

    const result = await pool.query(sql, [
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
      inv_id
    ]);

    // Check if update was successful was successful
    if (result) {
      return result.rows[0]; // Return the entire result object
    } else {
      throw new Error('Update failed. No rows were affected.');
    }
  } catch (error) {
    // Log the full error for more details
    console.error("Error update inventory item:", error);
    throw error; // Re-throw the error to let the controller handle it properly
  }
}


// module.exports = {getClassifications, getInventoryByClassificationId, getInventory, getInventoryById};
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, insertClassification, insertInventory, updateInventory};