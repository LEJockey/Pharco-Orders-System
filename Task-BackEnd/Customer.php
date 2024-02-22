<?php
class Customer {
    private $db;
    private $table_name = "customers";

    // Properties of the Product class
    public $name;
    public $country;


    // Constructor with database connection
    public function __construct($db) {
        $this->db = $db;
    }

    // Create a new product
    public function create() {

        $this->name = $_POST['name'];
        $this->country = $_POST['country'];
        
        // SQL query to insert a new product record into the database
        $query = "INSERT INTO " . $this->table_name . "
            SET name=:name, country=:country";

        // Prepare the query statement
        $stmt = $this->db->prepare($query);

        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->country = htmlspecialchars(strip_tags($this->country));

        // Bind parameters
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":country", $this->country);

        // Execute the query
        if ($stmt->execute()) {
            return true; // Return true if the product is successfully created
        }
        return false; // Return false if there was an error in creating the product
    }
}