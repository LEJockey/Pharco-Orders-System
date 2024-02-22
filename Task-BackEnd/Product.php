<?php

class Product {
    private $db;
    private $table_name = "products";

    // Properties of the Product class
    public $name;
    public $desc;


    // Constructor with database connection
    public function __construct($db) {
        $this->db = $db;
    }

    // Create a new product
    public function create() {

        $this->name = $_POST['name'];
        $this->desc = $_POST['desc'];
        
        // SQL query to insert a new product record into the database
        $query = "INSERT INTO " . $this->table_name . "
            SET name=:name, description=:desc";

        // Prepare the query statement
        $stmt = $this->db->prepare($query);

        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->desc = htmlspecialchars(strip_tags($this->desc));

        // Bind parameters
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":desc", $this->desc);

        // Execute the query
        if ($stmt->execute()) {
            return true; // Return true if the product is successfully created
        }
        return false; // Return false if there was an error in creating the product
    }
}





