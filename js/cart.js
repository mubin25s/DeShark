// Cart.js - Shopping Cart Logic

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cart = db.getCart();
    const tbody = document.querySelector('.cart-table tbody');
    tbody.innerHTML = '';

    let subtotal = 0;

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Your cart is empty. <a href="shop.html" style="color:var(--accent-color)">Go shopping</a></td></tr>';
        updateSummary(0);
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <p style="font-weight: 600;">${item.name}</p>
                        <p style="font-size: 0.9rem; color: #999;">Size: ${item.size}</p>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" value="${item.qty}" min="1" class="quantity-input" style="width: 60px;" onchange="updateQty(${index}, this.value)">
            </td>
            <td style="font-weight: 600;">$${itemTotal.toFixed(2)}</td>
            <td><span class="cart-action" onclick="removeItem(${index})"><i class="fas fa-trash"></i> Remove</span></td>
        `;
        tbody.appendChild(row);
    });

    updateSummary(subtotal);
}

function updateQty(index, newQty) {
    db.updateCartQty(index, parseInt(newQty));
    renderCart();
}

function removeItem(index) {
    if (confirm('Remove this item?')) {
        db.removeFromCart(index);
        renderCart();
    }
}

function updateSummary(subtotal) {
    const summaryRows = document.querySelectorAll('.cart-summary .summary-row span:last-child');
    // 0: Subtotal, 1: Shipping, 2: Total
    summaryRows[0].innerText = `$${subtotal.toFixed(2)}`;
    // Shipping is free text
    summaryRows[2].innerText = `$${subtotal.toFixed(2)}`;
}
