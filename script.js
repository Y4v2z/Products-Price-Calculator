// Storage Controller
const storageController = (function () {

})();




// Product Controller
const productController = (function () {
    // Private
    const product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
        products: [],
        selectedProduct: null,
        totalPrice: 0
    }
    // Public
    return {
        getData: function () {
            return data;
        },
        getProducts: function () {
            return data.products
        },
        getProductById: function (id) {
            let product = null;
            data.products.forEach(prd => {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newProduct = new product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(item => {
                total += item.price;
            });
            data.totalPrice = total;
            return data.totalPrice;
        }

    }

})();





// UI Controller
const uiController = (function () {
    // Private
    const selloctors = {
        productList: "#item-list",
        addBtn: "#addBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTl: "#total-tl",
        totalDolar: "#total-dolar"
    }


    // Public
    return {
        createProductList: function (products) {
            let html = `
            
            `;
            products.forEach(prd => {
                html += `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}$</td>
                <td class="text-right">
                   <button type="submit" class="btn btn-warning btn-sm"><i class="fas fa-edit edit-icon"></i></button>
                </td>
           </tr>

               `;

            });
            document.querySelector(selloctors.productList).innerHTML = html;
        },
        getSelloctors: function () {
            return selloctors;
        },
        addProductToList: function (prd) {
            document.querySelector(selloctors.productCard).style.display = "block";
            var newProducts = `
        <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price}$</td>
            <td class="text-right">
               <button type="submit" class="btn btn-warning btn-sm"><i class="fas fa-edit edit-icon" ></i></button>
            </td>
       </tr>

            `;
            document.querySelector(selloctors.productList).innerHTML += newProducts;
        },
        clearInputs: function () {
            document.querySelector(selloctors.productName).value = "";
            document.querySelector(selloctors.productPrice).value = "";
        },
        hideCard: function () {
            document.querySelector(selloctors.productCard).style.display = "none";
        },
        showTotal: function (total) {
            document.querySelector(selloctors.totalDolar).textContent = total;
            document.querySelector(selloctors.totalTl).textContent = total * 18.80;
        }

    }


})();



// App Controller
const app = (function (productCtrl, uiCtrl) {
    const uiSelloctors = uiController.getSelloctors();
    // Add Event uiSelloctors
    const addEventToUiSellectors = function () {
        // Add Product Event
        document.querySelector(uiSelloctors.addBtn).addEventListener("click", productAddSubmit);
        // add Edit Event
        document.querySelector(uiSelloctors.productList).addEventListener("click", productEditSubmit)
    }
    const productAddSubmit = function (e) {
        const productName = document.querySelector(uiSelloctors.productName).value;
        const productPrice = document.querySelector(uiSelloctors.productPrice).value;
        console.log(productName, productPrice);
        if (productName !== "" & productPrice !== "") {
            // Add Product
            const newProduct = productCtrl.addProduct(productName, productPrice);
            // add newProducts To List
            uiController.addProductToList(newProduct);
            //  get total
            const total = productCtrl.getTotal();
            // show tolat
            uiCtrl.showTotal(total);
            // clear Inputs
            uiController.clearInputs();
        }
        e.preventDefault()
    }
    const productEditSubmit = function (e) {
        if (e.target.classList.contains("edit-icon")) {
            const id = e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            // get selected product
            const product = productCtrl.getProductById(id);
            console.log(product);
        }

        e.preventDefault();
    }
    return {
        init: function () {
            console.log("Program Starting...");
            const products = productController.getProducts();
            if (products.length == 0) {
                uiCtrl.hideCard();
            } else {
                uiCtrl.createProductList(products);
            }
            addEventToUiSellectors();
        }
    }
})(productController, uiController);
app.init();