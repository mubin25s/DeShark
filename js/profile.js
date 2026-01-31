// Profile.js - User Profile Logic

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    renderUserProfile(user);
    renderOrderHistory(user.email);
});

function renderUserProfile(user) {
    document.getElementById('profile-name').innerText = user.firstName || 'User';
    document.getElementById('profile-email').innerText = user.email;
    document.getElementById('profile-avatar').src = `https://ui-avatars.com/api/?name=${user.email}&background=random`;
}

function renderOrderHistory(userEmail) {
    const orders = db.getOrders();
    // Filter orders for this user (mock match by email)
    const userOrders = orders.filter(o => o.customer && o.customer.email === userEmail);

    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (userOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No orders found.</td></tr>';
        return;
    }

    userOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${getStatusClass(order.status)}">${order.status}</span></td>
            <td><button class="btn-sm btn-outline">View</button></td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered': return 'success';
        case 'pending': return 'warning';
        case 'shipped': return 'success';
        default: return 'danger';
    }
}
