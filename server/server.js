import express from 'express';
import session from 'express-session';
import db from '../database/db.js';
import router from '../routes/router.js'
import dotenv from 'dotenv';
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
app.use(express.static('public'));
app.use(session({
    secret: 'aee5ff05d0349cb824473a38260817a5e9e75825626932ca02b4fb0ce18232c6',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', router);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});