// App.js - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('Deshark App Initialized');

    updateCartCount();
    initInteractions();
    initSmoothScroll();
    initMobileMenu();
    checkAuthState();
});

function initMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    if (navContainer && navLinks && !document.querySelector('.mobile-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-toggle';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        toggle.style.cssText = 'font-size: 1.5rem; color: var(--accent-color); display: none;'; // Hidden on desktop

        // Insert before logo or at end? At end usually.
        // Actually, usually it's Logo - Links - Icons. Mobile: Logo - Icons - Toggle?
        // Let's place it after nav-icons or simply append to container
        navContainer.appendChild(toggle);

        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
}

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
            if (container.children.length === 0) container.remove();
        });
    }, 3000);
}

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navIcons = document.querySelector('.nav-icons');

    if (user && navIcons) {
        // Change User Icon to Avatar/Profile Link
        const userLink = navIcons.querySelector('a[href="login.html"], a[href="../pages/login.html"], a[href="pages/login.html"]');
        if (userLink) {
            userLink.href = window.location.pathname.includes('pages/') ? 'profile.html' : 'pages/profile.html';
            userLink.innerHTML = '<i class="fas fa-user-circle"></i>';
            userLink.title = 'My Profile';
        }

        // Add Logout Button
        if (!document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.id = 'logout-btn';
            logoutBtn.title = 'Logout';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                logout();
            };
            navIcons.appendChild(logoutBtn);
        }
    }
}

function logout() {
    db.logout();
}

function initInteractions() {
    // Add to Cart Buttons
    const addToCartBtns = document.querySelectorAll('.btn-primary[onclick="addToCart()"], .product-overlay .icon-btn:nth-child(2)');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart();
        });
    });

    // Thumbnail Switching
    // (Handled by inline script in product.html for simplicity, or we can move it here)
}

// Cart Logic
function addToCart(product) {
    if (!product) {
        console.warn('addToCart called without product');
        return;
    }
    
    db.addToCart(product);

    // Visual Feedback
    const btn = event.target.closest('button') || event.target;
    const ogText = btn.innerHTML;

    if (btn.classList.contains('btn-primary')) {
        btn.innerHTML = 'Added!';
        setTimeout(() => {
            btn.innerHTML = ogText;
        }, 1500);
    } else {
        btn.style.color = 'var(--accent-color)';
    }

    showToast('Item added to cart!', 'success');
}

function updateCartCount() {
    const cart = db.getCart() || [];
    const count = cart.reduce((acc, item) => acc + parseInt(item.qty), 0);
    // Find cart icons and maybe add a badge
    const cartIcons = document.querySelectorAll('.fa-shopping-cart');
    cartIcons.forEach(icon => {
        // Check if badge already exists
        let badge = icon.parentElement.querySelector('.cart-badge');
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: var(--accent-color);
                    color: white;
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    border-radius: 50%;
                `;
                icon.parentElement.style.position = 'relative';
                icon.parentElement.appendChild(badge);
            }
            badge.innerText = count;
        }
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
