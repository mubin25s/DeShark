// Checkout.js - Checkout Logic

document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();
    handlePaymentSelection();
    handleFormSubmit();
});

function renderOrderSummary() {
    const cart = db.getCart();
    const summaryDiv = document.querySelector('.checkout-summary .cart-summary');

    // Clear existing dynamic rows if re-rendering (simple append logic here)
    const existingRows = summaryDiv.querySelectorAll('.summary-row:not(.total)');

    let subtotal = 0;

    // Create HTML string
    let itemsHtml = '<h3>Your Order</h3>';

    if (cart.length === 0) {
        window.location.href = 'cart.html'; // Redirect if empty
        return;
    }

    cart.forEach(item => {
        subtotal += item.price * item.qty;
        itemsHtml += `
            <div class="summary-row" style="margin-top: 1rem;">
                <span>${item.name} (x${item.qty})</span>
                <span>$${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    itemsHtml += `
        <div class="summary-row" style="border-top: 1px solid #eee; padding-top: 1rem; margin-top: 1rem;">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-row total">
            <span>Total to Pay</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
    `;

    summaryDiv.innerHTML = itemsHtml;
}

function handlePaymentSelection() {
    const methods = document.querySelectorAll('.payment-method-card');
    methods.forEach(method => {
        method.addEventListener('click', function () {
            methods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function handleFormSubmit() {
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Mock processing
        const btn = form.querySelector('button[type="submit"]');
        const ogText = btn.innerText;
        btn.innerText = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            const orderData = {
                items: db.getCart(),
                customer: {
                    firstName: form.querySelector('input:nth-of-type(1)').value,
                    // ... capture other fields
                    email: form.querySelector('input[type="email"]').value
                },
                total: parseFloat(document.querySelector('.summary-row.total span:last-child').innerText.replace('$', '')),
                status: 'Pending',
                paymentMethod: 'Credit Card' // Mock
            };

            const orderId = db.placeOrder(orderData);
            window.location.href = `confirmation.html?orderId=${orderId}`;
        }, 1500);
    });
}
