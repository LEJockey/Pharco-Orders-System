// =========================== Global Functions ===========================
const url = "http://127.0.0.1/PharcoTask/Task-BackEnd/index.php"

// Display Data List Options
function displayDataList(id, arr) {
    let dataList = document.getElementById(`${id}`)
    for (let i = 0; i < arr.length; i++) {
        dataList.innerHTML = ``
        dataList.innerHTML += `<option value= ${arr[i].name}>` 
    }
}



// Display Select Options
function displaySelectOptions(id, arr, content, option= '') {
    let selectOptions = document.getElementById(`${id}`)
    selectOptions.innerHTML = `<option ${option} selected value="">${content}</option>`
    for (let i = 0; i < arr.length; i++) {
        selectOptions.innerHTML += `<option value=${arr[i].code}> ${!arr[i].name? arr[i].code : arr[i].name}</option>`
    }
}


// Validation of Date Input
let currentDate = new Date().toISOString().split('T')[0];
// Set the minimum date for the input element
document.getElementById("date").min = currentDate;


// =========================== Side Bar ===========================


// Handle sidebar toggle
const sidebar = document.getElementById('sidebar');
const contentSec = document.querySelectorAll('.content-sec');

function handleSidebarToggle() {
    sidebar.classList.toggle('close');
    if (sidebar.classList.contains('close')) {
        contentSec.forEach(section => {
            section.classList.replace('padd-260', 'padd-80');
        });
    } else {
        contentSec.forEach(section => {
            section.classList.replace('padd-80', 'padd-260');
        });
    }
}

// Handle Drop Down Menu in sidebar 
const dropDown = document.querySelector('.dropdown')
dropDown.onclick = () => {
    dropDown.classList.toggle('active');
}


// Check Screen Size:
function checkScreenWidth() {
    if (window.innerWidth <= 768 && !sidebar.classList.contains('close')) {
        sidebar.classList.add('close');
        contentSec.forEach(section => {
            section.classList.replace('padd-260', 'padd-80');
        });
    } 
    
}
checkScreenWidth();
window.addEventListener('resize', function() {
    checkScreenWidth();
});


const homeSection = document.getElementById('home-sec');
handleListItemClick(homeSection);

const links = document.querySelectorAll('.link');
links.forEach((l) => l.addEventListener('click', (e) => handleListItemClick(e.target)));

function handleListItemClick(element) {
    element = (element.classList.contains('link')? element : element.parentElement);
    const clickedItemId = element.id;
    
    showSec(clickedItemId);

    const listItems = document.querySelectorAll('.sidebar-list li');
    listItems.forEach(item => {
        item.classList.remove('active');
    });
    element.parentElement.parentElement.classList.add('active');
}


// =========================== Hide and Show Sections ===========================


function showSec(id){
    contentSec.forEach(section => {
        if (section.id === id) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });

}

// =========================== Handle Form Validation ===========================


const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            form.classList.add('was-validated')
            event.preventDefault()
            event.stopPropagation()
        }else {
            event.preventDefault()
            handleListItemClick(homeSection);
            form.reset()
            form.classList.remove('was-validated')
        }
    })
})

// =========================== Add New Customer ===========================


function addCustomer() {
    // Check if the form is valid
    const form = document.getElementById('customer-form');
    if (!form.checkValidity()) {
        return;
    }

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
        }
    };
    let cName = document.getElementById("cName").value
    let cCountry = document.getElementById("cCountry").value
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let params =`name=${cName}&country=${cCountry}&className=customer&funName=create`;
    req.send(params);
}


// =========================== Add New Product ===========================


function addProduct() {
    const form = document.getElementById('product-form');
    if (!form.checkValidity()) {
        return;
    }

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
        }
    };
    let pName = document.getElementById("pName").value
    let pDescription = document.getElementById("pDescription").value
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let params =`name=${pName}&desc=${pDescription}&className=product&funName=create`;
    req.send(params);
}


// =========================== Create Price List ===========================

// Add Price List Details
function addPriceListDetails() {
    const form = document.getElementById('pricelist-form');
    if (!form.checkValidity()) {
        return;
    }

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
        }
    };
    let priceListName = document.getElementById("pricelistInput").value
    let chosenProductID = document.getElementById("addproductfordatalist").value
    let price = document.getElementById("price").value

    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let params =`name=${priceListName}&productID=${chosenProductID}&price=${price}&className=pricelist&funName=create`;
    req.send(params);
}

let priceListsNames =[]

// Get Price Lists and All Products from DB 
function getPricelistsAndProducts() {
    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let data = (JSON.parse(this.responseText))

            displayDataList('pricelistName', data.pricelists)

            displaySelectOptions('addproductfordatalist', data.products, 'Add Product to this Price List', 'disabled')
        }
    
    };
    let params =`className=pricelist&funName=getPriceListAndProducts`;
    req.open("GET", url+"?"+params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}
//  Run Function:
const createPriceListLink = document.getElementById('create-pricelist');
createPriceListLink.addEventListener('click', getPricelistsAndProducts);


// =========================== Create Order ===========================


let allOrders = []

// Display All Customers and Price Lists to create Order
function getCustomersAndPriceLists() {

    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            let data = (JSON.parse(this.responseText))

            allOrders = data.orders
            
            displaySelectOptions('orderId', data.orders, 'New Order')

            displaySelectOptions('companyName', data.customers ,'Choose..', 'disabled')
            
            displaySelectOptions('pLName', data.pricelists, 'Choose..', 'disabled')
        }
    
    };
    let params =`className=ordersales&funName=getCustomersAndPriceLists`;
    req.open("GET", url+"?"+params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}

const customerSelection= document.getElementById('companyName')
const priceListSelection= document.getElementById('pLName')
const orderIdInput = document.getElementById('orderId');
const date = document.getElementById('date')
orderIdInput.addEventListener('change', fillOrderData);

// Fill Order Data 
function fillOrderData() {

    let selectedOrderId = orderIdInput.value
    
    if (!selectedOrderId == '') {
        
        for (let i = 0; i < allOrders.length; i++) {
            if (allOrders[i].code === +(selectedOrderId)) {
                customerSelection.value = allOrders[i].customerid
                customerSelection.setAttribute('disabled', true)
                priceListSelection.value = allOrders[i].pricelistid
                priceListSelection.setAttribute('disabled', true)
                date.value = allOrders[i].date
                date.setAttribute('disabled', true)
                getPriceListDataChosen(allOrders[i].pricelistid)
            }
        }
    }else {
        customerSelection.value = ''
        customerSelection.removeAttribute('disabled')
        priceListSelection.value = ''
        priceListSelection.removeAttribute('disabled')
        date.value = ''
        date.removeAttribute('disabled')
    }
}

// Run Function:
const createOrder = document.getElementById('create-order');
createOrder.addEventListener('click', getCustomersAndPriceLists);

let priceListData = []

// Get Chosen Price List
let priceListSelected = document.getElementById('pLName')

priceListSelected.addEventListener('change', function(e) {

    getPriceListDataChosen(e.target.value)

})

// Get Data Related to Chosen Price List
function getPriceListDataChosen(id) {

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            priceListData = (JSON.parse(this.responseText))

            displaySelectOptions('proName', priceListData, 'Add a Product to  an Order', 'disabled')
        }
    };
    let priceListId = +(id)

    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let params =`priceListId=${priceListId}&className=ordersales&funName=getPriceListDataChosen`;
    req.send(params);
}

// Get Desc and Price of Chosen Product
let productSelected = document.getElementById('proName')
productSelected.addEventListener('change', function(e) {
    console.log (e.target.value)
    getProductDetailsByCode(e.target.value, priceListData)
})

// Get Order Details depending on Chosen Product
let orderDetails = {
    orderId: '',
    customerId: '',
    pricelistId: '',
    date: '',
    productId: '',
    name: '',
    desc: '',
    price: '',
    qty: '',
    totalPrice: ''
}
function getProductDetailsByCode(code, products) {

    for (let i = 0; i < products.length; i++) {
        if (products[i].code === +(code)) {
            
            document.getElementById('proDescription').value=products[i].description
            document.getElementById('proPrice').value=products[i].price
            orderDetails.orderId = document.getElementById('orderId').value
            orderDetails.customerId = document.getElementById('companyName').value
            orderDetails.pricelistId = products[i].pricelistid
            orderDetails.date = document.getElementById('date').value
            orderDetails.productId = products[i].code
            orderDetails.name = products[i].name
            orderDetails.desc = products[i].description
            orderDetails.price = products[i].price
        }
        console.log (orderDetails)
    }
    return null; // Product not found
}

let totalOrderDetails = {}

// Get Desc and Price of Chosen Product
let productQty = document.getElementById('qty')
productQty.addEventListener('change', function(e) {
    console.log (e.target.value)
    orderDetails.qty = e.target.value
    document.getElementById('totalPrice').value = orderDetails.price * orderDetails.qty
    orderDetails.totalPrice = orderDetails.price * orderDetails.qty
    console.log (orderDetails)
    console.log (JSON.stringify(orderDetails))
    totalOrderDetails = orderDetails
})

function createNewOrder() {
    const form = document.getElementById('createorder-form');
    if (!form.checkValidity()) {
        return;
    }

    // Proceed with adding the customer
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
        }
    };
    let orderDetails = totalOrderDetails
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let params =`orderDetails=${JSON.stringify(orderDetails)}&className=ordersales&funName=create`;
    req.send(params);
    getAllOrders()
}


// =========================== Get and Display All Orders ===========================


// Get All Orders
function getAllOrders() {

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let data = (JSON.parse(this.responseText))
            console.log (data)
            showAllOrders(data)
        }
    };
    let params =`className=ordersales&funName=orders`;
    req.open("GET", url+"?"+params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}

getAllOrders()

// Show All Orders 
function showAllOrders(orders) {
    let tableInfo = ``
    for (let i = 0; i < orders.length; i++) {

        tableInfo += `
        <tr>
                    <th class="rounded-2" scope="row">${orders[i].code}</th>
                    <td class="">${orders[i].customerName}</td>
                    <td class="d-none d-sm-table-cell">${orders[i].priceListName}</td>
                    <td class="link cursor-pointer hovering" title="Get All Order Details" onclick="showOrder(${orders[i].code})">${orders[i].date}</td>
        </tr>
        `
    }
    document.getElementById('table-content').innerHTML = tableInfo
}


// =========================== Show Order Details ===========================


function showOrder(id){
    showSec('order-details')
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText)
            let data = (JSON.parse(this.responseText))
            console.log (data)

            let orderProducts = data.products
            console.log (orderProducts)
            document.getElementById('order-details-id').textContent = data.code
            document.getElementById('order-details-customerName').textContent = data.customerName
            document.getElementById('order-details-priceList').textContent = data.priceListName
            document.getElementById('order-details-date').textContent = data.date
            

            let orderProductsTable = ``
            let totalOrderPrice = 0
            for (let i = 0; i < orderProducts.length; i++) {
                orderProductsTable += `
                <tr class="rounded-2">
                    <th class="rounded-2 border-0" id="order-details-product">
                        ${orderProducts[i].name}
                    </th>
                    <td class="rounded-2 border-0 d-none d-md-table-cell"  id="order-details-desc">
                        ${orderProducts[i].description}
                    </td>
                    <td class="rounded-2 border-0" id="order-details-price">
                        ${orderProducts[i].price}
                    </td>
                    <td class="rounded-2 border-0"  id="order-details-qty">
                        ${orderProducts[i].qty}
                    </td>
                    <td class="rounded-2 border-0 d-none d-sm-table-cell"  id="order-details-total">
                        ${orderProducts[i].totalprice}
                    </td>
                </tr>    `
                totalOrderPrice += orderProducts[i].totalprice
            }
            document.getElementById('order-products').innerHTML = orderProductsTable
            document.getElementById('totalOrderPrice').innerHTML = totalOrderPrice
        }
    };
    let params =`id=${id}&className=ordersales&funName=showorder`;
    req.open("GET", url+"?"+params, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}







