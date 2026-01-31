// Admin.js - Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check for admin access
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '../pages/login.html';
        return;
    }

    // Determine which page we are on
    const path = window.location.pathname;

    if (path.includes('dashboard.html')) {
        renderDashboardStats();
        renderRecentOrders();
    } else if (path.includes('orders.html')) {
        renderAllOrders();
    } else if (path.includes('products.html')) {
        renderProductsTable();
    }

    // Handle Logout
    const logoutBtn = document.querySelector('a[href="../index.html"][class="admin-nav-link"] i.fa-sign-out-alt')?.parentElement;
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            db.logout();
        });
    }
    // Handle Form Submit
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
});

function renderDashboardStats() {
    const orders = db.getOrders();
    const products = db.getProducts();
    const users = db.getUsers();

    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const totalOrders = orders.length;
    const customers = users.filter(u => u.role === 'customer').length;

    if (document.getElementById('stat-revenue')) document.getElementById('stat-revenue').innerText = `$${totalRevenue.toFixed(2)}`;
    if (document.getElementById('stat-orders')) document.getElementById('stat-orders').innerText = totalOrders;
    if (document.getElementById('stat-customers')) document.getElementById('stat-customers').innerText = customers;
    if (document.getElementById('stat-products')) document.getElementById('stat-products').innerText = products.length;
}

function renderRecentOrders() {
    const orders = db.getOrders().slice(0, 5); // Last 5
    const listBody = document.getElementById('recent-orders-list');
    if (!listBody) return;
    listBody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id.toString().replace('#', '')}</td>
            <td>${order.customer.firstName}</td>
            <td>${order.date}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${getStatusClass(order.status)}">${order.status}</span></td>
            <td style="text-align: right;"><button class="admin-btn-action"><i class="fas fa-eye"></i></button></td>
        `;
        listBody.appendChild(row);
    });
}

function renderAllOrders() {
    // Similar to recent but all, maybe with filter logic
    renderRecentOrders(); // Reusing for demo, but would render all 'orders'
}

function renderProductsTable() {
    const products = db.getProducts();
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${p.image}" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover; border: 1px solid rgba(0,0,0,0.05);"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td><span class="status-badge status-success">In Stock</span></td>
            <td style="text-align: right;">
                <button class="admin-btn-action" onclick="openProductModal(${p.id})" style="margin-right: 5px;"><i class="fas fa-edit"></i></button>
                <button class="admin-btn-action" style="color: #dc3545;" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    modal.style.display = 'flex';

    if (productId) {
        title.innerText = 'Edit Product';
        const product = db.getProduct(productId);
        document.getElementById('productId').value = product.id;
        document.getElementById('pName').value = product.name;
        document.getElementById('pCategory').value = product.category;
        document.getElementById('pPrice').value = product.price;
        document.getElementById('pImage').value = product.image;
        document.getElementById('pDescription').value = product.description;
    } else {
        title.innerText = 'Add Product';
        form.reset();
        document.getElementById('productId').value = '';
    }
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('pName').value,
        category: document.getElementById('pCategory').value,
        price: parseFloat(document.getElementById('pPrice').value),
        image: document.getElementById('pImage').value,
        description: document.getElementById('pDescription').value,
        rating: 4.5, // Default for new
        reviews: 0   // Default for new
    };

    if (id) {
        db.updateProduct(id, productData);
        alert('Product updated successfully');
    } else {
        db.addProduct(productData);
        alert('Product added successfully');
    }

    closeProductModal();
    renderProductsTable();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        db.deleteProduct(id);
        alert('Product deleted successfully');
        renderProductsTable();
    }
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered': return 'success';
        case 'pending': return 'warning';
        case 'shipped': return 'success'; // or info
        default: return 'danger';
    }
}
