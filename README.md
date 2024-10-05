
# Smart Inventory System

A simple web application that allows users to manage inventory with CRUD operations.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- Manage inventory items with Create, Read, Update, and Delete (CRUD) operations
- Categorization of inventory items
- User-friendly interface with responsive design

## Technologies Used

- Node.js
- Express.js
- MySQL
- EJS (Embedded JavaScript templating)
- CSS (for styling)
- dotenv (for environment variable management)
- nodemon (for development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Indodanazwide/smart-inventory-system.git
   ```

2. Navigate to the project directory:
   ```bash
   cd smart-inventory-system
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your database configuration:
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   PORT=3000
   ```

## Usage

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

## Routes

- **Home**: `GET /` - Displays the home page.
- **Inventory**: `GET /inventory` - Displays all inventory items.
- **Add Item**: `GET /inventory/new` - Displays form to add a new inventory item.
- **Create Item**: `POST /inventory` - Adds a new inventory item.
- **Edit Item**: `GET /inventory/edit/:id` - Displays form to edit an inventory item.
- **Update Item**: `POST /inventory/edit/:id` - Updates an existing inventory item.
- **Delete Item**: `POST /inventory/delete/:id` - Deletes an inventory item.

## Database Schema

### Tables

- **Category**
  - `category_id` (INT, AUTO_INCREMENT, PRIMARY KEY)
  - `category_name` (VARCHAR(100), NOT NULL)

- **Item**
  - `item_id` (INT, AUTO_INCREMENT, PRIMARY KEY)
  - `item_name` (VARCHAR(100), NOT NULL)

- **Item_Location**
  - `item_id` (INT, FOREIGN KEY references Item(item_id) ON DELETE CASCADE)
  - `location` (VARCHAR(100), NOT NULL, PRIMARY KEY (item_id, location))

- **Inventory**
  - `item_id` (INT, FOREIGN KEY references Item(item_id) ON DELETE CASCADE)
  - `category_id` (INT, FOREIGN KEY references Category(category_id) ON DELETE CASCADE, PRIMARY KEY (item_id, category_id))

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


### Notes:
- Replace the placeholders in the **Installation** section with your actual database connection details.
- If you have specific guidelines for contributing, feel free to add them to the **Contributing** section.
- You can also add sections for screenshots, acknowledgments, or any other relevant information as needed.

