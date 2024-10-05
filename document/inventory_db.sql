CREATE TABLE IF NOT EXISTS Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Item (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Item_Location (
    item_id INT,
    location VARCHAR(100) NOT NULL,
    PRIMARY KEY (item_id, location),
    FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Inventory (
    item_id INT,
    category_id INT,
    PRIMARY KEY (item_id, category_id),
    FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

-- Insert categories into the Category table
INSERT INTO Category (category_name) VALUES
('Boards'),
('Sensors'),
('Actuators'),
('Communication modules'),
('Software and Tools'),
('Accessories and Miscellaneous');