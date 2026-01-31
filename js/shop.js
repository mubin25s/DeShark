// Shop.js - Product Listing Logic
// Requires: data.js, wishlist.js

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    filterProducts();
    initEventListeners();
});

function renderProducts(products) {
    const grid = document.querySelector('.grid');
    const showingText = document.querySelector('.shop-header p');
    
    if(!grid) return;

    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: #888;">No products found matching your criteria.</p>';
        if(showingText) showingText.innerText = 'Showing 0 results';
        return;
    }

    if(showingText) showingText.innerText = `Showing ${products.length} results`;

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Determine brand label based on category or custom logic
        let brandLabel = "DESHARK";
        if (product.category === 'T-Shirts') brandLabel = "ESSENTIALS";
        if (product.category === 'Jackets') brandLabel = "OUTERWEAR";
        if (product.category === 'Pants') brandLabel = "BOTTOMS";
        if (product.category === 'Shirts') brandLabel = "FORMAL";

        // Generate HTML
        card.innerHTML = `
            <div class="product-image-container">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                <div class="quick-view-overlay">QUICK VIEW</div>
            </div>
            <div class="product-info">
                <span class="product-brand">${brandLabel}</span>
                <h3 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
                <div style="display: flex; justify-content: space-between; align-items: centre;">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn-quick-add" data-id="${product.id}">QUICK ADD +</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-attach listeners for new dynamic buttons
    document.querySelectorAll('.btn-quick-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering Quick View if parent has listener
            const id = btn.getAttribute('data-id');
            const product = db.getProduct(id);
            if(product) {
                db.addToCart({ ...product, qty: 1, size: 'M' });
                alert(`${product.name} added to cart!`);
            }
        });
    });

    // Attach listeners for Quick View Overlays
    document.querySelectorAll('.quick-view-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const card = overlay.closest('.product-card');
            const id = card.querySelector('.btn-quick-add').getAttribute('data-id');
            openQuickView(id);
        });
    });
}

function openQuickView(id) {
    const product = db.getProduct(id);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const qvImage = document.getElementById('qvImage');
    const qvName = document.getElementById('qvName');
    const qvPrice = document.getElementById('qvPrice');
    const qvCategory = document.getElementById('qvCategory');
    const qvRating = document.getElementById('qvRating');
    const qvDescription = document.getElementById('qvDescription');
    const qvAddToCart = document.getElementById('qvAddToCart');
    const qvQty = document.getElementById('qvQty');

    // Populate Basic Info
    qvImage.src = product.image;
    qvName.innerText = product.name;
    qvPrice.innerText = `$${product.price.toFixed(2)}`;
    qvCategory.innerText = product.category;
    qvDescription.innerText = product.description || "Premium apparel meticulously crafted for the modern gentleman.";
    
    // Populate Rating
    let starsHtml = '';
    const rating = product.rating || 4.5;
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) starsHtml += '<i class="fas fa-star"></i>';
        else if (i === Math.ceil(rating)) starsHtml += '<i class="fas fa-star-half-alt"></i>';
        else starsHtml += '<i class="far fa-star"></i>';
    }
    starsHtml += `<span>(${product.reviews || 0} Reviews)</span>`;
    qvRating.innerHTML = starsHtml;

    // Reset Options
    qvQty.value = 1;
    let selectedSize = 'M';
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-size') === 'M') btn.classList.add('active');
        
        btn.onclick = () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
        };
    });
    
    // Set up Add to Cart button in modal
    qvAddToCart.onclick = () => {
        const qty = parseInt(qvQty.value) || 1;
        db.addToCart({ ...product, qty: qty, size: selectedSize });
        alert(`${product.name} Added to Cart!`);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function initEventListeners() {
    // Close Modal Logic
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    // Filter Links (Categories, etc.)
    const filterLinks = document.querySelectorAll('.filter-link');
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Single Select Logic: Remove active from all siblings in this list
            const siblings = link.closest('ul').querySelectorAll('.filter-link');
            siblings.forEach(sib => sib.classList.remove('active'));
            
            // Set active on clicked
            link.classList.add('active');

            // Trigger Filter
            filterProducts();
        });
    });

    // Search Input
    const searchInput = document.querySelector('input[placeholder="Search products..."]');
    if(searchInput) {
        searchInput.addEventListener('input', () => filterProducts());
    }

    // Sort Select
    const sortSelect = document.querySelector('.sort-select');
    if(sortSelect) {
        sortSelect.addEventListener('change', () => filterProducts());
    }
}

function filterProducts() {
    let products = db.getProducts() || [];

    // 1. Search Filter
    const searchInput = document.querySelector('input[placeholder="Search products..."]');
    if (searchInput && searchInput.value.trim() !== '') {
        const term = searchInput.value.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(term));
    }

    // 2. Category Filter
    // Find the active link in the Categories group
    // We assume the first filter-group with title "CATEGORIES" is the one
    const categoryGroup = Array.from(document.querySelectorAll('.filter-group')).find(g => g.querySelector('.filter-title').innerText.includes('CATEGORIES'));
    if (categoryGroup) {
        const activeCatLink = categoryGroup.querySelector('.filter-link.active');
        if (activeCatLink) {
            const catName = activeCatLink.innerText.trim();
            if (catName !== 'All Products' && catName !== 'All Sneakers') { // Handle legacy name
                 products = products.filter(p => p.category === catName || (catName === 'Jackets' && p.category === 'Hoodies')); // Map rough categories if needed or just exact match
                 // Exact match for now based on data.js categories (T-Shirts, Jackets, Shirts, Pants)
                 // Map UI names to DB names if slightly different
            }
        }
    }

    // 3. Sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        const value = sortSelect.value;
        if (value === 'Price: Low to High') products.sort((a, b) => a.price - b.price);
        else if (value === 'Price: High to Low') products.sort((a, b) => b.price - a.price);
        else if (value === 'Newest First') products.reverse(); // Assuming default is oldest first or random
    }

    renderProducts(products);
}
