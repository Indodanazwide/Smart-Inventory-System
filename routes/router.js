import express from 'express'
import db from '../database/db.js'
import { logIn, signUp } from '../controllers/user.controller.js'
import { createNewInventory, deleteInventory, readAllInventory, readFormInventory, updateInventory } from '../controllers/inventory.controller.js'
import isAuthenticated from '../middleware/auth.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Smart Inventory System',
        user: req.session.user || null
    })
})

router.get('/about', (req, res) => {
    res.render('about')
})

router.get('/signup', (req, res) => {
    res.render('signup', { 
        title: 'Sign Up',
        user: req.session.user 
    })
})

router.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Log In',
        user: req.session.user 
    })
})

router.post('/signup', signUp)
router.post('/login', logIn)
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out')
        }
        res.redirect('/login')
    })
})

router.get('/inventory', isAuthenticated, readAllInventory)
router.get('/inventory/new', isAuthenticated, readFormInventory)
router.post('/inventory', isAuthenticated, createNewInventory)

router.post('/inventory/edit/:id', isAuthenticated, updateInventory)
router.post('/inventory/delete/:id', isAuthenticated, deleteInventory)

router.get('/inventory/edit/:id', isAuthenticated, async (req, res) => {
    const itemId = req.params.id;

    try {
        // Query to get the item by ID
        const queryItem = `
            SELECT Item.item_id, Item.item_name, Item_Location.location, Inventory.category_id 
            FROM Item 
            JOIN Inventory ON Item.item_id = Inventory.item_id
            JOIN Item_Location ON Item.item_id = Item_Location.item_id
            WHERE Item.item_id = ?`;

        // Query to get all categories
        const queryCategories = 'SELECT * FROM Category';

        // Execute both queries asynchronously
        const [itemResults] = await db.execute(queryItem, [itemId]);
        const [categoryResults] = await db.execute(queryCategories);

        // If no item is found, handle it
        if (itemResults.length === 0) {
            return res.status(404).send('Item not found');
        }

        const item = itemResults[0];  // Get the first (and should be only) item
        const categories = categoryResults;

        // Render the edit item page, passing user, item, and categories
        res.render('editItem', { user: req.session.user, item, categories });
    } catch (error) {
        console.error('Error fetching data for item editing:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router
