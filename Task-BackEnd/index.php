<?php
header("Access-Control-Allow-Origin: *");
include('DB.php');
include('Product.php');
include('Customer.php');
include('PriceList.php');
include('SalesOrder.php');

$database = new Database();
$db = $database->getConnection();
$className = $_REQUEST['className'];
$funName = $_REQUEST['funName'];

switch ($className) {
    case 'product':
    
        $products = new Product($db);
        switch ($funName) {
            case 'create':
                
                return $products->create();

                break;
            
            default:
                # code...
                break;
        }
        break;

    case 'customer':
        
        $customers = new Customer($db);
        switch ($funName) {
            case 'create':
                
                return $customers->create();

                break;
            
            default:
                # code...
                break;
        }
        break;

    case 'pricelist':

        $pricelist = new PriceList($db);
        switch ($funName) {
            case 'create':
            
                echo $pricelist->create();
                
                break;

            case 'getPriceListAndProducts':
            
                echo $pricelist->getPriceListAndProducts();
                
                break;
            
            default:
                # code...
                break;
        }
        break;

    case 'ordersales':

        $salesorder = new SalesOrder($db);

        switch ($funName) {
            case 'create':
                
                print_r($salesorder->createOrderSales());

                break;
        
            case 'getCustomersAndPriceLists':

                echo $salesorder->getAllCustomersAndPriceLists();
                
                break;

            case 'getPriceListDataChosen':

                echo $salesorder->getPriceListDataChosen();
                
                break;

            case 'orders':

                echo $salesorder->showAllOrders();

                break;

            case 'showorder':

                echo $salesorder->showOrderDetails();

                break;
            
            default:
                # code...
                break;
        }
        break;
        
    default:
        # code...
        break;
}

















