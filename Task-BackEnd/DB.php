<?php

class Database {
    private $host = "localhost";
    private $db_name = "pharco";
    private $username = "root";
    private $password = "";
    private $connection;
    
    
        // Get database connection
        public function getConnection(){

            $this->connection = null;
    
            try {
                // Create a new PDO instance for connecting to the database
                $this->connection = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name,
                    $this->username, $this->password);
                // Set error mode to exception to handle errors
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $e) {
                // If connection fails, display an error message
                echo 'Connection Error: ' . $e->getMessage();
            }
    
            // Return the database connection
            return $this->connection;
        }

}

