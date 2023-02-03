// Storage Controller
const storageController = (function () {

})();




// Product Controller
const productController = (function () {
    // Private
    const Product = function (id, name, price) {
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
        setCurrentProduct: function () {
            data.selectedProduct = Product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        updateProduct: function (name, price) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });
            return product;
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
        productListItems: "#item-list tr",
        addBtn: "#addBtn",
        saveBtn: ".saveBtn",
        deleteBtn: ".deleteBtn",
        cancelBtn: ".cancelBtn",
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
        updateProduct: function (prd) {
            let updatedItem = null;
            let items = document.querySelectorAll(selloctors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + " $";
                    updatedItem = item;
                }
            })
            return updatedItem;
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
        },
        addProductToForm: function () {
            const selectedProduct = productController.getCurrentProduct();
            document.querySelector(selloctors.productName).value = selectedProduct.name;
            document.querySelector(selloctors.productPrice).value = selectedProduct.price;
        },
        addingState: function (item) {
            if (item) {
                item.classList.remove("bg-warning");
            }
            uiController.clearInputs();
            document.querySelector(selloctors.addBtn).style.display = "inline";
            document.querySelector(selloctors.saveBtn).style.display = "none";
            document.querySelector(selloctors.deleteBtn).style.display = "none";
            document.querySelector(selloctors.cancelBtn).style.display = "none";
        },
        editState: function (tr) {
            const parent = tr.parentNode;
            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove("bg-warning");
            }
            tr.classList.add("bg-warning");
            document.querySelector(selloctors.addBtn).style.display = "none";
            document.querySelector(selloctors.saveBtn).style.display = "inline";
            document.querySelector(selloctors.deleteBtn).style.display = "inline";
            document.querySelector(selloctors.cancelBtn).style.display = "inline";

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
        document.querySelector(uiSelloctors.productList).addEventListener("click", productEditClick)
        // edit product submit
        document.querySelector(uiSelloctors.saveBtn).addEventListener("click", editProductSubmit);
    }
    const productAddSubmit = function (e) {
        const productName = document.querySelector(uiSelloctors.productName).value;
        const productPrice = document.querySelector(uiSelloctors.productPrice).value;
        console.log(productName, productPrice);
        if (productName !== "" & productPrice !== "") {
            // Add Product
            const newProduct = productCtrl.addProduct(productName, productPrice);
            // add newProducts To List
            uiCtrl.addProductToList(newProduct);
            //  get total
            const total = productCtrl.getTotal();
            // show tolat
            uiCtrl.showTotal(total);
            // clear Inputs
            uiCtrl.clearInputs();
        }
        e.preventDefault()
    }
    const productEditClick = function (e) {
        if (e.target.classList.contains("edit-icon")) {
            const id = e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            // get selected product
            const product = productCtrl.getProductById(id);
            // set curret product
            productCtrl.setCurrentProduct(product);
            // add product to UI
            uiCtrl.addProductToForm();
            uiCtrl.editState(e.target.parentNode.parentNode.parentNode);
        }

        e.preventDefault();
    }
    const editProductSubmit = function (e) {
        const productName = document.querySelector(uiSelloctors.productName).value;
        const productPrice = document.querySelector(uiSelloctors.productPrice).value;
        if (productName !== "" && productPrice !== "") {
            // update product
            const updateProduct = productCtrl.updateProduct(productName, productPrice);
        }
        // update ui
        let item = uiCtrl.updateProduct(updateProduct);
        //  get total
        const total = productCtrl.getTotal();
        // show tolat
        uiCtrl.showTotal(total);
        uiCtrl.addingState(item)

        e.preventDefault();

    }
    return {
        init: function () {
            console.log("Program Starting...");
            uiCtrl.addingState();
            const products = productCtrl.getProducts();
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