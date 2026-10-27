// Product details
let products = [
    { id: 1, name: "Smartphone", category: "Electronics", price: 15000, icon: "📱" },
    { id: 2, name: "Headphones", category: "Electronics", price: 2000, icon: "🎧" },
    { id: 3, name: "Smart Watch", category: "Electronics", price: 3500, icon: "⌚" },
    { id: 4, name: "T-Shirt", category: "Fashion", price: 800, icon: "👕" },
    { id: 5, name: "Sneakers", category: "Fashion", price: 2500, icon: "👟" },
    { id: 6, name: "Backpack", category: "Accessories", price: 1200, icon: "🎒" },
    { id: 7, name: "Sunglasses", category: "Accessories", price: 900, icon: "🕶️" },
    { id: 8, name: "Laptop", category: "Electronics", price: 45000, icon: "💻" }
];

let cart = [];
let discountApplied = false;

function displayProducts() {
    let category = document.getElementById("category").value;
    let sorting = document.getElementById("sort").value;
    let search = document.getElementById("search").value.toLowerCase();

    let result = [];

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        if (
            (category === "All" || product.category === category) &&
            product.name.toLowerCase().includes(search)
        ) {
            result.push(product);
        }
    }

    if (sorting === "low") {
        result.sort((a, b) => a.price - b.price);
    } else if (sorting === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    let output = "";

    for (let i = 0; i < result.length; i++) {
        let product = result[i];

        output += `
            <div class="product-card">
                <div class="product-icon">${product.icon}</div>
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <p>Price: ₹${product.price}</p>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    }

    if (result.length === 0) {
        output = "<p>No products found.</p>";
    }

    document.getElementById("product-list").innerHTML = output;
}


function addToCart(id) {
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    displayCart();
}



function displayCart() {
    let output = "";
    let subtotal = 0;
    let count = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let product = products.find(p => p.id === item.id);

        if (!product) {
            continue;
        }

        let itemTotal = product.price * item.quantity;

        subtotal += itemTotal;
        count += item.quantity;

        output += `
            <div class="cart-item">
                <div>
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Item Total: ₹${itemTotal}</p>

                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>

                <button class="remove-btn"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
    }

    if (cart.length === 0) {
        output = "<p>Your cart is empty.</p>";
        discountApplied = false;
    }

    let discount = 0;

    if (discountApplied) {
        discount = subtotal * 0.10;
    }

    let total = subtotal - discount;

    document.getElementById("cart-items").innerHTML = output;
    document.getElementById("cart-count").textContent = count;
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("discount").textContent = discount.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);

    if (cart.length === 0) {
        document.getElementById("coupon").value = "";
        document.getElementById("coupon-message").textContent = "";
    }
}



function changeQuantity(id, amount) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity += amount;

            if (cart[i].quantity <= 0) {
                cart.splice(i, 1);
            }

            break;
        }
    }

    displayCart();
}



function removeFromCart(id) {
    let newCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== id) {
            newCart.push(cart[i]);
        }
    }

    cart = newCart;
    displayCart();
}



document.getElementById("apply-coupon").addEventListener("click", function() {
    let code = document.getElementById("coupon").value.trim().toUpperCase();
    let message = document.getElementById("coupon-message");

    if (cart.length === 0) {
        discountApplied = false;
        message.textContent = "Add products to your cart first.";
        message.style.color = "red";
    } else if (code === "SAVE10") {
        discountApplied = true;
        message.textContent = "10% discount applied successfully!";
        message.style.color = "green";
    } else {
        discountApplied = false;
        message.textContent = "Invalid coupon code.";
        message.style.color = "red";
    }

    displayCart();
});



document.getElementById("category").addEventListener("change", displayProducts);
document.getElementById("sort").addEventListener("change", displayProducts);
document.getElementById("search").addEventListener("input", displayProducts);


document.getElementById("checkout").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Please add products to your cart first.");
        return;
    }

    document.getElementById("checkout-section").classList.remove("hidden");

    document.getElementById("checkout-section").scrollIntoView({
        behavior: "smooth"
    });
});


document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let customerName = document.getElementById("name").value.trim();
    let total = document.getElementById("total").textContent;
    let payment = document.getElementById("payment").value;

    document.getElementById("order-message").textContent =
        "Thank you, " + customerName +
        "! Your order of ₹" + total +
        " has been placed successfully. Payment: " + payment + ".";

    cart = [];
    discountApplied = false;

    displayCart();

    document.getElementById("checkout-form").reset();
});


displayProducts();
displayCart();