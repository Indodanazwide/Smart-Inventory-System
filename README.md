
# Smart Inventory System

## Overview

The Smart Inventory System is a web application built with Node.js, Express, EJS, and MySQL. It provides user authentication and a simple interface for managing an inventory of items, including adding, updating, and deleting items, as well as organizing them into categories.

## Features

- **User Authentication**: Sign up and sign in functionalities using bcrypt for password hashing.
- **Inventory Management**: CRUD (Create, Read, Update, Delete) operations for managing inventory items.
- **Categories**: Ability to categorize items for better organization.
- **User-Friendly Interface**: EJS templates for rendering views.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Templating Engine**: EJS
- **Session Management**: express-session
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL Server
- A package manager (npm or yarn)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Indodanazwide/Smart-Inventory-System.git
   cd Smart-Inventory-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your database configuration:
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_username
   DB_PASSWORD=your_database_password
   DB_NAME=group_db
   PORT=3000
   ```

4. **Set Up the Database**:
   Execute the SQL scripts provided in the project to create the necessary database and tables.

5. **Run the Application**:
   Start the server in development mode:
   ```bash
   npm run dev
   ```

6. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## File Structure

```
smart-inventory/
├── .env                # Environment variables
├── database/           # Database connection and SQL scripts
├── doc/                # Documentation files
├── node_modules/       # Node.js modules
├── package-lock.json   # Dependency lock file
├── package.json        # Project metadata and dependencies
├── routes/             # Express routes
├── server/             # Server setup and configuration
└── views/              # EJS templates
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/) - Web framework for Node.js
- [EJS](https://ejs.co/) - Templating engine
- [MySQL](https://www.mysql.com/) - Database management system
```

### Notes
- Make sure to customize the placeholders (like `your_database_host`, `your_database_username`, etc.) with your actual configurations.
- If you have specific instructions or notes for using your application, feel free to add those to the `README.md` as well.
- You can also include screenshots or examples in the documentation if you think it would be helpful.
