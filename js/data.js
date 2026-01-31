// Data.js - Mock Database & Utilities

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Classic White Tee",
        category: "T-Shirts",
        price: 25.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "The essential white tee for every wardrobe. Crafted from 100% organic cotton, this t-shirt offers breathable comfort and a perfect fit.",
        rating: 4.5,
        reviews: 45
    },
    {
        id: 2,
        name: "Urban Jacket",
        category: "Jackets",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A stylish urban jacket perfect for layering. Features water-resistant fabric and multiple pockets for functionality.",
        rating: 4.8,
        reviews: 28
    },
    {
        id: 3,
        name: "Oxford Shirt",
        category: "Shirts",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "A classic Oxford shirt for formal or casual wear. Tailored fit with a crisp finish.",
        rating: 4.6,
        reviews: 60
    },
    {
        id: 4,
        name: "Slim Fit Chinos",
        category: "Pants",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Modern slim fit chinos available in various colors. Comfortable stretch fabric.",
        rating: 4.4,
        reviews: 32
    },
    {
        id: 5,
        name: "Casual Hoodie",
        category: "Jackets",
        price: 60.00,
        image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Soft and warm hoodie for everyday comfort. Features a kangaroo pocket and adjustable hood.",
        rating: 4.7,
        reviews: 50
    },
    {
        id: 6,
        name: "Denim Jeans",
        category: "Pants",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Classic denim jeans with a durable build. Perfect for any casual outfit.",
        rating: 4.3,
        reviews: 120
    }
];

// Initialize Data
function initData() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem('cart_guest')) {
        localStorage.setItem('cart_guest', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { email: 'admin@example.com', password: 'admin', name: 'Admin User', role: 'admin' }
        ]));
    }
}

// Data Access Object (DAO)
const db = {
    getProducts: () => JSON.parse(localStorage.getItem('products')),
    getProduct: (id) => JSON.parse(localStorage.getItem('products')).find(p => p.id == id),

    getCartKey: () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? `cart_${user.email}` : 'cart_guest';
    },
    getCart: () => JSON.parse(localStorage.getItem(db.getCartKey())) || [],
    addToCart: (item) => {
        let cart = db.getCart();
        const existing = cart.find(i => i.id == item.id && i.size == item.size);
        if (existing) {
            existing.qty += item.qty;
        } else {
            cart.push(item);
        }
        localStorage.setItem(db.getCartKey(), JSON.stringify(cart));
        updateCartCount();
    },
    removeFromCart: (index) => {
        let cart = db.getCart();
        cart.splice(index, 1);
        localStorage.setItem(db.getCartKey(), JSON.stringify(cart));
        updateCartCount();
    },
    updateCartQty: (index, qty) => {
        let cart = db.getCart();
        if (qty < 1) return;
        cart[index].qty = qty;
        localStorage.setItem(db.getCartKey(), JSON.stringify(cart));
        updateCartCount();
    },
    clearCart: () => {
        localStorage.setItem(db.getCartKey(), JSON.stringify([]));
        updateCartCount();
    },

    getOrders: () => JSON.parse(localStorage.getItem('orders')),
    placeOrder: (order) => {
        let orders = db.getOrders();
        order.id = '#DS' + (88292 + orders.length); // Mock ID logic
        order.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        db.clearCart();
        return order.id;
    },

    // Reviews
    addReview: (productId, review) => {
        let products = db.getProducts();
        const pIndex = products.findIndex(p => p.id == productId);
        if (pIndex > -1) {
            if (!products[pIndex].reviewsList) products[pIndex].reviewsList = [];
            products[pIndex].reviewsList.push(review);

            // Recalculate Rating
            const total = products[pIndex].reviewsList.reduce((acc, r) => acc + r.rating, 0);
            products[pIndex].rating = total / products[pIndex].reviewsList.length;
            products[pIndex].reviews = products[pIndex].reviewsList.length;

            localStorage.setItem('products', JSON.stringify(products));
        }
    },

    // Users
    getUsers: () => JSON.parse(localStorage.getItem('users')),
    registerUser: (user) => {
        let users = db.getUsers();
        if (users.find(u => u.email === user.email)) return false;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },
    loginUser: (email, password) => {
        const users = db.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    },
    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../pages/login.html';
    },

    // Additional Product Logic
    deleteProduct: (id) => {
        let products = db.getProducts();
        products = products.filter(p => p.id != id);
        localStorage.setItem('products', JSON.stringify(products));
    },
    addProduct: (product) => {
        let products = db.getProducts();
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        return product;
    },
    updateProduct: (id, updatedData) => {
        let products = db.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index > -1) {
            products[index] = { ...products[index], ...updatedData };
            localStorage.setItem('products', JSON.stringify(products));
            return true;
        }
        return false;
    }
};

// Global Init
initData();
updateCartCount();

function updateCartCount() {
    const cart = db.getCart();
    const count = cart.reduce((acc, item) => acc + parseInt(item.qty), 0);
    // ... Badge update logic (moved from app.js or kept there)
    // We will emit an event or update directly if this file is included everywhere
    const event = new CustomEvent('cartUpdated', { detail: count });
    document.dispatchEvent(event);
}

// Listen for updates in specific pages if needed
document.addEventListener('cartUpdated', (e) => {
    const count = e.detail;
    const cartIcons = document.querySelectorAll('.fa-shopping-cart');
    cartIcons.forEach(icon => {
        let badge = icon.parentElement.querySelector('.cart-badge');
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = `position: absolute; top: -8px; right: -8px; background-color: var(--accent-color); color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 50%;`;
                icon.parentElement.style.position = 'relative';
                icon.parentElement.appendChild(badge);
            }
            badge.innerText = count;
        } else if (badge) {
            badge.remove();
        }
    });
});
