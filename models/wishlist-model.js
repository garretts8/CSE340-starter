const pool = require("../database/")

/* ***************************
 *  Get all wishlist items for a specific user
 * ************************** */
async function getWishlistByAccountId(account_id) {
  try {
    const sql = `
      SELECT w.wishlist_id, w.added_date,
             i.inv_id, i.inv_make, i.inv_model, i.inv_year, 
             i.inv_price, i.inv_description, i.inv_image, 
             i.inv_thumbnail, i.inv_color, i.inv_miles
      FROM wishlist w
      JOIN inventory i ON w.inv_id = i.inv_id
      WHERE w.account_id = $1
      ORDER BY w.added_date DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getWishlistByAccountId error: " + error)
    throw error
  }
}

/* ***************************
 *  Add item to wishlist
 * ************************** */
async function addToWishlist(account_id, inv_id) {
  try {
    // Check if item already exists in wishlist to prevent duplicates
    const checkSql = `SELECT * FROM wishlist WHERE account_id = $1 AND inv_id = $2`
    const checkResult = await pool.query(checkSql, [account_id, inv_id])
    
    if (checkResult.rowCount > 0) {
      return { success: false, message: "This vehicle is already in your wishlist." }
    }

    // Add to wishlist
    const sql = `INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *`
    const data = await pool.query(sql, [account_id, inv_id])
    return { success: true, data: data.rows[0] }
  } catch (error) {
    console.error("addToWishlist error: " + error)
    throw error
  }
}

/* ***************************
 *  Remove item from wishlist
 * ************************** */
async function removeFromWishlist(wishlist_id, account_id) {
  try {
    const sql = `DELETE FROM wishlist WHERE wishlist_id = $1 AND account_id = $2 RETURNING *`
    const data = await pool.query(sql, [wishlist_id, account_id])
    return { success: data.rowCount > 0 }
  } catch (error) {
    console.error("removeFromWishlist error: " + error)
    throw error
  }
}

/* ***************************
 *  Check if item is in user's wishlist
 * ************************** */
async function isInWishlist(account_id, inv_id) {
  try {
    const sql = `SELECT * FROM wishlist WHERE account_id = $1 AND inv_id = $2`
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount > 0
  } catch (error) {
    console.error("isInWishlist error: " + error)
    throw error
  }
}

module.exports = {
  getWishlistByAccountId,
  addToWishlist,
  removeFromWishlist,
  isInWishlist
}