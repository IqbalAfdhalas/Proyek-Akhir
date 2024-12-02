const db = require("../config/database");

// Get all menu items
exports.getAllMenu = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM menu ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error in getAllMenu:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get active menu items
exports.getActiveMenu = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM menu WHERE is_active = true ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error in getActiveMenu:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single menu item
exports.getMenuById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM menu WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.error("Error in getMenuById:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new menu item
exports.createMenu = async (req, res) => {
  const { title, description, price, badge, image_url } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO menu (title, description, price, badge, image_url) VALUES (?, ?, ?, ?, ?)",
      [title, description, price, badge, image_url]
    );
    res.status(201).json({
      message: "Menu created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error in createMenu:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update menu item
exports.updateMenu = async (req, res) => {
  const { title, description, price, badge, image_url } = req.body;

  try {
    // Validasi input yang diperlukan
    if (!title || price === undefined) {
      return res.status(400).json({
        message: "Title and price are required fields",
      });
    }

    // First, check if the menu exists
    const [existingMenu] = await db.execute("SELECT * FROM menu WHERE id = ?", [
      req.params.id,
    ]);

    if (existingMenu.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Siapkan data untuk update, gunakan nilai yang ada atau nilai dari existing menu
    const updateData = {
      title: title,
      description: description ?? existingMenu[0].description, // Gunakan nullish coalescing
      price: price !== undefined ? price : existingMenu[0].price,
      badge: badge ?? existingMenu[0].badge,
      image_url: image_url ?? existingMenu[0].image_url,
      is_active: existingMenu[0].is_active, // Pertahankan nilai is_active yang ada
    };

    const [result] = await db.execute(
      `UPDATE menu 
       SET title = ?, 
           description = ?, 
           price = ?, 
           badge = ?, 
           image_url = ?, 
           is_active = ?
       WHERE id = ?`,
      [
        updateData.title,
        updateData.description,
        updateData.price,
        updateData.badge,
        updateData.image_url,
        updateData.is_active,
        req.params.id,
      ]
    );

    if (result.affectedRows > 0) {
      res.json({
        message: "Menu updated successfully",
        menu: {
          id: req.params.id,
          ...updateData,
        },
      });
    } else {
      res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.error("Error in updateMenu:", error);
    console.error("Request body:", req.body);
    res.status(500).json({
      message: "Failed to update menu",
      error: error.message,
    });
  }
};

// Soft delete menu item (set is_active to false)
exports.softDeleteMenu = async (req, res) => {
  try {
    const [result] = await db.execute(
      "UPDATE menu SET is_active = false WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Menu deactivated successfully" });
    } else {
      res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.error("Error in softDeleteMenu:", error);
    res.status(500).json({ message: error.message });
  }
};

// Hard delete menu item
exports.deleteMenu = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM menu WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows > 0) {
      res.json({ message: "Menu deleted permanently" });
    } else {
      res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.error("Error in deleteMenu:", error);
    res.status(500).json({ message: error.message });
  }
};
