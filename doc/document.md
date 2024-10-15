---

# Smart Inventory Documentation

## Project Overview
**Smart Inventory** is a Node.js application built with **Express.js**, **EJS** for templating, and **MySQL** for data persistence. This system provides user authentication and allows CRUD operations for managing an inventory, including items, categories, and item locations.

---

## Table of Contents

1. [Installation and Setup](#installation-and-setup)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Database Schema](#database-schema)
5. [Routing and Controllers](#routing-and-controllers)
6. [Views and Templates](#views-and-templates)
7. [Authentication and Session Management](#authentication-and-session-management)
8. [Inventory Management](#inventory-management)
9. [Running the Application](#running-the-application)
10. [License](#license)

---

## Installation and Setup

### Prerequisites:
1. **Node.js** (v14 or later)
2. **MySQL** database
3. **NPM** or **Yarn**

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Indodanazwide/Smart-Inventory-System.git
   cd Smart-Inventory-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** based on the `.env.example` template. Add the following environment variables:
   ```
   DB_HOST=your-database-host
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=group_db
   PORT=3000
   ```

4. **Run database migrations** (manual setup):
   - Create and populate the database as outlined in the [Database Schema](#database-schema) section.

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:3000`.

---

## Project Structure

The project structure follows the MVC (Model-View-Controller) architecture, which helps in organizing the logic effectively.

```
.
├── database        # Database connection and migrations
├── doc             # Documentation files
├── node_modules    # Project dependencies
├── routes          # Express.js routes for handling HTTP requests
├── server          # Main server setup
├── views           # EJS templates for rendering views
├── .env            # Environment variables
├── package.json    # Project metadata and dependencies
└── README.md       # Project documentation
```

---

## Environment Variables

The following environment variables are used to configure the database connection and other settings:

- `DB_HOST`: The host of your MySQL database.
- `DB_USER`: Your MySQL database username.
- `DB_PASSWORD`: Your MySQL database password.
- `DB_NAME`: The database name (set as `group_db`).
- `PORT`: The port on which the server will run (default is `3000`).

---

## Database Schema

The MySQL database has the following schema:

1. **User**: Stores users' login credentials.
   ```sql
   CREATE TABLE User (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL UNIQUE,
       password_hash VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Category**: Defines different item categories.
   ```sql
   CREATE TABLE Category (
       category_id INT AUTO_INCREMENT PRIMARY KEY,
       category_name VARCHAR(100) NOT NULL
   );
   ```

3. **Item**: Stores information about inventory items.
   ```sql
   CREATE TABLE Item (
       item_id INT AUTO_INCREMENT PRIMARY KEY,
       item_name VARCHAR(100) NOT NULL
   );
   ```

4. **Item_Location**: Stores the location of items in the inventory.
   ```sql
   CREATE TABLE Item_Location (
       item_id INT,
       location VARCHAR(100),
       PRIMARY KEY (item_id, location),
       FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE
   );
   ```

5. **Inventory**: Connects items to their categories.
   ```sql
   CREATE TABLE Inventory (
       item_id INT,
       category_id INT,
       PRIMARY KEY (item_id, category_id),
       FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE,
       FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
   );
   ```

---

## Routing and Controllers

The routes are defined in `routes/router.js`. The main features include:

- **User Authentication**: Sign-up, sign-in, and sign-out functionalities.
- **CRUD Operations**: Creating, reading, updating, and deleting inventory items.

Example route handlers:
- `/signup`: User registration (POST)
- `/signin`: User login (POST)
- `/inventory`: Displays all items (GET)
- `/inventory/new`: Adds new items (GET and POST)

**Authentication Middleware**: 
Routes that require user authentication use the `isAuthenticated` middleware to protect access. If not authenticated, users are redirected to the sign-in page.

---

## Views and Templates

The views are rendered using **EJS**. EJS templates are located in the `views` directory:

- `home.ejs`: Home page.
- `signup.ejs`: User sign-up page.
- `signin.ejs`: User sign-in page.
- `inventory.ejs`: Displays the list of inventory items.
- `addItem.ejs`: Form to add new items.
- `editItem.ejs`: Form to edit existing items.

The views follow a dynamic structure where session-based user data is passed using `res.locals`.

---

## Authentication and Session Management

- **bcrypt** is used for password hashing. When a user signs up, their password is securely hashed before being stored in the database.
- **express-session** manages user sessions. A session is created upon login and is destroyed upon logout. Sessions are stored in memory for this demo, but for production use, a more persistent session store (e.g., Redis) is recommended.

---

## Inventory Management

Inventory items are associated with both a category and a location. Users can perform CRUD operations for inventory items, as managed in the following routes:

- **GET `/inventory`**: Displays all inventory items.
- **POST `/inventory`**: Adds a new item to the inventory.
- **POST `/inventory/edit/:id`**: Updates an existing item.
- **POST `/inventory/delete/:id`**: Deletes an item from the inventory.

---

## Running the Application

To run the application, ensure that your environment variables are correctly set up, your database is running, and that the database schema has been created.

Run the server using:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

### Additional Notes:

- Future enhancements could include adding test coverage, optimizing performance, and expanding error handling.
- For production, consider implementing better security practices (e.g., HTTPS, helmet.js for securing HTTP headers).

---