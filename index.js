import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Setup __dirname to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express server application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Routes

// Home route
app.get('/', (req, res) => {
    res.render('home');
});

// Read all inventory items (READ)
app.get('/inventory', (req, res) => {
    const query = `
        SELECT Item.item_id, Item.item_name, Item_Location.location, Category.category_name
        FROM Item 
        JOIN Inventory ON Item.item_id = Inventory.item_id
        JOIN Category ON Inventory.category_id = Category.category_id
        JOIN Item_Location ON Item.item_id = Item_Location.item_id`;
    
    db.query(query, (error, items) => {
        if (error) {
            return res.status(500).send('Database error');
        }
        res.render('inventory', { items });
    });
});

// Show form to add new inventory item (CREATE)
app.get('/inventory/new', (req, res) => {
    const query = 'SELECT * FROM Category';
    db.query(query, (error, categories) => {
        if (error) {
            return res.status(500).send('Database error');
        }
        res.render('addItem', { categories });
    });
});

// Add a new inventory item (CREATE)
app.post('/inventory', (req, res) => {
    const { item_name, item_location, category_id } = req.body;

    // Insert into Item table first
    const insertItem = 'INSERT INTO Item (item_name) VALUES (?)';
    
    db.query(insertItem, [item_name], (error, results) => {
        if (error) {
            return res.status(500).send('Database error');
        }

        const itemId = results.insertId;

        // Insert into Item_Location table
        const insertLocation = 'INSERT INTO Item_Location (item_id, location) VALUES (?, ?)';
        db.query(insertLocation, [itemId, item_location], (error) => {
            if (error) {
                return res.status(500).send('Database error in location');
            }

            // Insert into Inventory table
            const insertInventory = 'INSERT INTO Inventory (item_id, category_id) VALUES (?, ?)';
            db.query(insertInventory, [itemId, category_id], (error) => {
                if (error) {
                    return res.status(500).send('Database error in inventory');
                }

                res.redirect('/inventory');
            });
        });
    });
});

// Show form to edit an inventory item (UPDATE)
app.get('/inventory/edit/:id', (req, res) => {
    const itemId = req.params.id;
    
    // First query to get the item by ID
    const queryItem = `
        SELECT Item.item_id, Item.item_name, Item_Location.location, Inventory.category_id 
        FROM Item 
        JOIN Inventory ON Item.item_id = Inventory.item_id
        JOIN Item_Location ON Item.item_id = Item_Location.item_id
        WHERE Item.item_id = ?`;
    
    // Second query to get all categories
    const queryCategories = 'SELECT * FROM Category';
    
    // Execute the first query
    db.query(queryItem, [itemId], (error, itemResults) => {
        if (error) {
            return res.status(500).send('Database error fetching item');
        }
        
        // Now execute the second query for categories
        db.query(queryCategories, (error, categoryResults) => {
            if (error) {
                return res.status(500).send('Database error fetching categories');
            }

            const item = itemResults[0];
            const categories = categoryResults;
            res.render('editItem', { item, categories });
        });
    });
});

// Update an inventory item (UPDATE)
app.post('/inventory/edit/:id', (req, res) => {
    const { id } = req.params;
    const { item_name, item_location, category_id } = req.body;

    // First, update Item
    const updateItem = 'UPDATE Item SET item_name = ? WHERE item_id = ?';
    db.query(updateItem, [item_name, id], (err) => {
        if (err) {
            return res.status(500).send('Database error updating item');
        }

        // Second, update Item_Location
        const updateLocation = 'UPDATE Item_Location SET location = ? WHERE item_id = ?';
        db.query(updateLocation, [item_location, id], (err) => {
            if (err) {
                return res.status(500).send('Database error updating location');
            }

            // Finally, update Inventory
            const updateInventory = 'UPDATE Inventory SET category_id = ? WHERE item_id = ?';
            db.query(updateInventory, [category_id, id], (err) => {
                if (err) {
                    return res.status(500).send('Database error updating inventory');
                }

                res.redirect('/inventory');
            });
        });
    });
});

// Delete an inventory item (DELETE)
app.post('/inventory/delete/:id', (req, res) => {
    const itemId = req.params.id;

    const query = 'DELETE FROM Item WHERE item_id = ?';  // Will cascade to Inventory and Item_Location
    db.query(query, [itemId], (error) => {
        if (error) {
            return res.status(500).send('Database error');
        }
        res.redirect('/inventory');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});