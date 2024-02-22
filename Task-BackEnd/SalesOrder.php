<?php

class SalesOrder {
    
    private $db;
    private $table_name = "salesorder";

    // Properties of the Sales Order Class
    public $priceListId;
    public $orderDetails;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // Get Name of Price Lists & Customers
    public function getAllCustomersAndPriceLists(){
        // Get all Orders Lists
        $qAllOrdersId = "SELECT * FROM `salesorder`";
        $stmt = $this->db->prepare($qAllOrdersId);
        $stmt->execute();
        $allOrdersId = $stmt->fetchAll();

        // Get all Price Lists
        $qAllPriceLists = "SELECT `code`, `name` FROM `pricelist`";
        $stmt = $this->db->prepare($qAllPriceLists);
        $stmt->execute();
        $allPriceLists = $stmt->fetchAll();

        // Get all Customers
        $qAllCustomers = "SELECT `code`, `name` FROM `customers`";
        $stmt = $this->db->prepare($qAllCustomers);
        $stmt->execute();
        $allCustomers = $stmt->fetchAll();
        $data = ['orders' => $allOrdersId , 'pricelists' => $allPriceLists,  'customers' => $allCustomers];
        $data = json_encode($data);
        return $data;
    }
    
    // Get Price List Data Chosen
    public function getPriceListDataChosen(){
        $this->priceListId = $_POST['priceListId'];
        $qAllProductsOfPL = "SELECT * FROM `pricelist-products` JOIN `products` WHERE `pricelist-products`.`productid`= `products`.`code` AND `pricelist-products`.`pricelistid`=:priceListId";
        $stmt = $this->db->prepare($qAllProductsOfPL);
        $stmt->bindParam(":priceListId", $this->priceListId);
        $stmt->execute();
        $result = $stmt->fetchAll();
        $data = json_encode($result);
        return $data;
    }

    // Create Order Sales
    public function createOrderSales () {
        $this->orderDetails = json_decode($_POST['orderDetails']);
        $OrderId = $this->orderDetails->orderId;
        if ($OrderId == "" ) {
            $query = "INSERT INTO " .$this->table_name ." SET pricelistid= '" . $this->orderDetails->pricelistId . "', customerid='" . $this->orderDetails->customerId . "', date='" . $this->orderDetails->date . "'";

            $stmt = $this->db->prepare($query);

            // Execute the query
            $stmt->execute();

            $qThisOrderId = "SELECT `code` FROM `salesorder` ORDER BY `code` DESC LIMIT 1";
            $stmt = $this->db->prepare($qThisOrderId);
            $stmt->execute();
            $result = $stmt->fetch();
            $this->orderDetails->orderId = $result['code'];
        }

        $qOrderProducts = "INSERT INTO `orderproducts` SET orderid=:orderId, productid=:productId, qty=:qty, price=:price, totalprice=:totalprice";

        $stmt = $this->db->prepare($qOrderProducts);

        // Bind parameters
        $stmt->bindParam(":orderId", $this->orderDetails->orderId);
        $stmt->bindParam(":productId", $this->orderDetails->productId);
        $stmt->bindParam(":qty", $this->orderDetails->qty);
        $stmt->bindParam(":price", $this->orderDetails->price);
        $stmt->bindParam(":totalprice", $this->orderDetails->totalPrice);

        // Execute the query
        $stmt->execute();
        return "done";

    }

    function showAllOrders() {

        // $qAllOrders = "SELECT salesorder.code, salesorder.date, customers.name AS 'customerName', pricelist.name AS 'priceListName' FROM `salesorder` JOIN `customers` JOIN `pricelist` WHERE salesorder.customerid= customers.code AND salesorder.pricelistid= pricelist.code;";
        $qAllOrders = "SELECT salesorder.code, salesorder.date, customers.name AS 'customerName', pricelist.name AS 'priceListName' FROM `salesorder` JOIN `customers` JOIN `pricelist` WHERE salesorder.customerid= customers.code AND salesorder.pricelistid= pricelist.code ORDER BY salesorder.code ASC";
        
        // SELECT salesorder.code, salesorder.date, customers.name AS 'customerName', pricelist.name AS 'priceListName' FROM `salesorder` JOIN `customers` JOIN `pricelist` WHERE salesorder.customerid= customers.code AND salesorder.pricelistid= pricelist.code ORDER BY `salesorder`.`code` ASC
        $stmt = $this->db->prepare($qAllOrders);
        $stmt->execute();
        // return $stmt;
        $allOrders = $stmt->fetchAll();
        return json_encode($allOrders);
    }

    function showOrderDetails(){

        $code = $_GET['id'];
        $qOrderDetails = "SELECT salesorder.code, salesorder.date, customers.name AS 'customerName', pricelist.name AS 'priceListName' FROM `salesorder` JOIN `customers` JOIN `pricelist` WHERE salesorder.customerid= customers.code AND salesorder.pricelistid= pricelist.code AND salesorder.code = :code";
        $stmt = $this->db->prepare($qOrderDetails);
        $stmt->bindParam(":code", $code);
        $stmt->execute();
        $orderDetails = $stmt->fetch();
        $qOrderProducts = "SELECT * FROM `orderproducts` JOIN `products` WHERE orderproducts.productid=products.code AND orderproducts.orderid= :code";
        $stmt = $this->db->prepare($qOrderProducts);
        $stmt->bindParam(":code", $code);
        $stmt->execute();
        $orderProducts = $stmt->fetchAll();
        $orderDetails["products"]=$orderProducts;
        return json_encode($orderDetails);

    }
}

















