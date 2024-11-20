import db from '../database/db.js'

export const createNewInventory = async (req, res) => {
    const { item_name, item_location, category_id } = req.body;

    try {
        const insertItem = 'INSERT INTO Item (item_name) VALUES (?)';
        const [itemResult] = await db.execute(insertItem, [item_name]);

        const itemId = itemResult.insertId;

        const insertLocation = 'INSERT INTO Item_Location (item_id, location) VALUES (?, ?)';
        await db.execute(insertLocation, [itemId, item_location]);

        const insertInventory = 'INSERT INTO Inventory (item_id, category_id) VALUES (?, ?)';
        await db.execute(insertInventory, [itemId, category_id]);

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const readAllInventory = async (req, res) => {
    const query = `
        SELECT Item.item_id, Item.item_name, Item_Location.location, Category.category_name
        FROM Item 
        JOIN Inventory ON Item.item_id = Inventory.item_id
        JOIN Category ON Inventory.category_id = Category.category_id
        JOIN Item_Location ON Item.item_id = Item_Location.item_id
    `;

    try {
        const [items] = await db.execute(query);
        res.render('inventory', { items });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).send('Database error');
    }
}

export const readFormInventory = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM Category');
        res.render('addItem', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Database error');
    }
}

export const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { item_name, item_location, category_id } = req.body;

    try {
        const updateItem = 'UPDATE Item SET item_name = ? WHERE item_id = ?';
        await db.execute(updateItem, [item_name, id]);

        const updateLocation = 'UPDATE Item_Location SET location = ? WHERE item_id = ?';
        await db.execute(updateLocation, [item_location, id]);

        const updateInventory = 'UPDATE Inventory SET category_id = ? WHERE item_id = ?';
        await db.execute(updateInventory, [category_id, id]);

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).send('Internal Server Error');
    }
}



export const deleteInventory = async (req, res) => {
    const itemId = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM Item WHERE item_id = ?';  // Will cascade to Inventory and Item_Location
        await db.execute(deleteQuery, [itemId]);

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).send('Internal Server Error');
    }
}

