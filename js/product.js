// Product.js - Single Product Logic

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        loadProduct(productId);
    } else {
        // Fallback or Redirect if no ID
        const container = document.querySelector('.product-detail-container');
        if (container) {
            container.innerHTML = '<div style="padding: 100px; text-align: center;"><h1>Product not found.</h1><a href="shop.html" class="btn btn-primary" style="margin-top: 2rem;">Back to Shop</a></div>';
        }
    }
});

function loadProduct(id) {
    const product = db.getProduct(id);
    if (!product) return;

    // Update Meta & Title
    document.title = `${product.name} | Deshark`;

    // Elements
    const mainImg = document.getElementById('mainImg');
    const qvName = document.getElementById('qvName');
    const qvPrice = document.getElementById('qvPrice');
    const qvCategory = document.getElementById('qvCategory');
    const qvRating = document.getElementById('qvRating');
    const qvDescription = document.getElementById('qvDescription');
    const qvAddToCart = document.getElementById('qvAddToCart');
    const qvQty = document.getElementById('qvQty');

    // Populate Content
    if (mainImg) mainImg.src = product.image;
    if (qvName) qvName.innerText = product.name;
    if (qvPrice) qvPrice.innerText = `$${product.price.toFixed(2)}`;
    if (qvCategory) qvCategory.innerText = product.category || 'Premium Collection';
    if (qvDescription) qvDescription.innerText = product.description || "Designed for the modern gentleman, this piece combines timeless elegance with contemporary craftsmanship.";

    // Render Stars
    if (qvRating) {
        let starsHtml = '';
        const rating = product.rating || 4.8;
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) starsHtml += '<i class="fas fa-star"></i>';
            else if (i === Math.ceil(rating)) starsHtml += '<i class="fas fa-star-half-alt"></i>';
            else starsHtml += '<i class="far fa-star"></i>';
        }
        starsHtml += `<span>(${product.reviews || 120} Reviews)</span>`;
        qvRating.innerHTML = starsHtml;
    }

    // Size Selection Logic
    let selectedSize = 'M';
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
        });
    });

    // Add to Cart Logic
    if (qvAddToCart) {
        qvAddToCart.onclick = () => {
            const qty = parseInt(qvQty.value) || 1;
            db.addToCart({ ...product, qty, size: selectedSize });
            showToast(`${product.name} (Size: ${selectedSize}) added to cart!`, 'success');
        };
    }

    // Related Products or Tabs could be re-initialized if needed
    renderRelatedProducts(product.category, id);
    initTabs(product);
}

function initTabs(product) {
    const btns = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    btns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.style.display = 'none');

            btn.classList.add('active');

            if (index === 0) document.getElementById('tab-description').style.display = 'block';
            if (index === 1) {
                document.getElementById('tab-reviews').style.display = 'block';
                renderReviews(product);
            }
        });
    });
}

function renderReviews(product) {
    const list = document.querySelector('#reviews-list');
    if (!list) return;
    
    if (!product.reviewsList || product.reviewsList.length === 0) {
        list.innerHTML = '<p>No reviews yet. Be the first to share your experience!</p>';
        return;
    }

    list.innerHTML = '';
    product.reviewsList.forEach(r => {
        list.innerHTML += `
            <div class="review-item" style="margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${r.user}</strong>
                    <span style="color: #999; font-size: 0.8rem;">${r.date}</span>
                </div>
                <div style="color: #fbbc05; margin-bottom: 0.5rem;">${'<i class="fas fa-star"></i>'.repeat(r.rating)}</div>
                <p>${r.text}</p>
            </div>
        `;
    });
}

function renderRelatedProducts(category, currentId) {
    // This could optionally fetch from DB and populate the "You May Also Like" section
    // For now we'll keep the static ones or implement a simple fetch
}
