import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/signup', (req, res) => {
    res.render('signup', { user: req.session.user });
});

router.get('/signin', (req, res) => {
    res.render('signin', { user: req.session.user });
});

// POST route for user signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        // Hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO User (username, password_hash) VALUES (?, ?)';
        await db.execute(query, [username, passwordHash]);

        res.redirect('/signin');
    } catch (err) {
        console.error('Error during signup:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Username already exists');
        }
        res.status(500).send('Internal Server Error');
    }
});

// POST route for user signin
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        // Find user in the database by username
        const query = 'SELECT * FROM User WHERE username = ?';
        const [rows] = await db.execute(query, [username]);

        if (rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).send('Invalid username or password');
        }

        req.session.user = { id: user.user_id, username: user.username };
        res.redirect('/inventory');
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/signin');
    }
}

// Read all inventory items (READ)
router.get('/inventory', isAuthenticated, async (req, res) => {
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
});

// Show form to add new inventory item (CREATE)
router.get('/inventory/new', isAuthenticated, async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM Category');
        res.render('addItem', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Database error');
    }
});

// Add a new inventory item (CREATE)
router.post('/inventory', isAuthenticated, async (req, res) => {
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
});

// Show form to edit an inventory item (UPDATE)
router.get('/inventory/edit/:id', (req, res) => {
    const itemId = req.params.id;

    // Query to get the item by ID
    const queryItem = `
        SELECT Item.item_id, Item.item_name, Item_Location.location, Inventory.category_id 
        FROM Item 
        JOIN Inventory ON Item.item_id = Inventory.item_id
        JOIN Item_Location ON Item.item_id = Item_Location.item_id
        WHERE Item.item_id = ?`;

    // Query to get all categories
    const queryCategories = 'SELECT * FROM Category';

    // Execute the first query to get the item
    db.query(queryItem, [itemId], (error, itemResults) => {
        if (error) {
            return res.status(500).send('Database error fetching item');
        }

        // If no item is found, handle it (optional)
        if (itemResults.length === 0) {
            return res.status(404).send('Item not found');
        }

        // Now execute the second query to get all categories
        db.query(queryCategories, (error, categoryResults) => {
            if (error) {
                return res.status(500).send('Database error fetching categories');
            }

            const item = itemResults[0]; // Get the first (and should be only) item
            const categories = categoryResults;

            // Render the edit item page, passing user, item, and categories
            res.render('editItem', { user: req.session.user, item, categories });
        });
    });
});


// Update an inventory item (UPDATE)
router.post('/inventory/edit/:id', isAuthenticated, async (req, res) => {
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
});

// Delete an inventory item (DELETE)
router.post('/inventory/delete/:id', isAuthenticated, async (req, res) => {
    const itemId = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM Item WHERE item_id = ?';  // Will cascade to Inventory and Item_Location
        await db.execute(deleteQuery, [itemId]);

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/signin');
    });
});

export default router;
