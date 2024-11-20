import db from '../database/db.js'
import bcrypt from 'bcrypt'

export const signUp = async (req, res) => {
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

        res.redirect('/login');
    } catch (err) {
        console.error('Error during signup:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Username already exists');
        }
        res.status(500).send('Internal Server Error');
    }
}

export const logIn = async (req, res) => {
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
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
}

