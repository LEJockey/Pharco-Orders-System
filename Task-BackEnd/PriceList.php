<?php

class PriceList
{
    private $db;
    private $table_name = "pricelist";

    // Properties of the Product class
    public $name;
    public $productID;
    public $price;


    // Constructor with database connection
    public function __construct($db)
    {
        $this->db = $db;
    }

    // Create a new product
    public function create()
    {
        $this->name = $_POST['name'];
        $this->productID = $_POST['productID'];
        $this->price = $_POST['price'];

        // SQL query to insert a new price list name into the database

        $qPriceListName = "SELECT COUNT(*) as 'count' FROM `pricelist` WHERE  name=:name";
        $stmt = $this->db->prepare($qPriceListName);
        $stmt->bindParam(":name", $this->name);
        $stmt->execute();
        $result = $stmt->fetch();
        if ($result['count'] == 0) {
            $queryInsertPriceList = "INSERT INTO " . $this->table_name . "
            SET name=:name";
            $stmt = $this->db->prepare($queryInsertPriceList);
            $stmt->bindParam(":name", $this->name);
            $stmt->execute();
        }
        $qPriceListID = "SELECT code FROM `pricelist` WHERE name=:name";
        $stmt = $this->db->prepare($qPriceListID);
        $stmt->bindParam(":name", $this->name);
        $stmt->execute();
        $result = $stmt->fetch();
        $pricelistID = $result['code'];

        // SQL query to insert a new product to Price List

        $qProductOfPriceList = "SELECT COUNT(*) as 'count' FROM `pricelist-products` WHERE pricelistid = " .$pricelistID . " AND productid = " . $this->productID;
        $stmt = $this->db->prepare($qProductOfPriceList);
        $stmt->execute();
        $result = $stmt->fetch();

        if ($result['count'] == 0) {
            $qPriceListAndProduct = "INSERT INTO `pricelist-products` SET pricelistid=:pricelistid, productid=:productid, price=:price";
        }else {
            $qPriceListAndProduct = "UPDATE INTO `pricelist-products` SET price=:price  WHERE pricelistid=:pricelistid AND productid=:productid";
        }
        $stmt = $this->db->prepare($qPriceListAndProduct); 
        $stmt->bindParam(":pricelistid", $pricelistID);
        $stmt->bindParam(":productid", $this->productID);
        $stmt->bindParam(":price", $this->price);
        $stmt->execute();
        return 'Price List successfully created';
    }
    
    // Display Price Lists and Products
    public function getPriceListAndProducts(){
        $qPriceLists = "SELECT `name` FROM `pricelist`";
        $stmt = $this->db->prepare($qPriceLists);
        $stmt->execute();
        $PriceLists = $stmt->fetchAll();
        $qAllProducts = "SELECT `code`, `name` FROM `products`";
        $stmt = $this->db->prepare($qAllProducts);
        $stmt->execute();
        $allProducts = $stmt->fetchAll();
        $data = ['pricelists' => $PriceLists, 'products' => $allProducts];
        $data = json_encode($data);
        return $data;
    }
}
