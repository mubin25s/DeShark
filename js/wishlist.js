
// Wishlist.js - Wishlist Logic

const wishlistDb = {
    getWishlist: () => JSON.parse(localStorage.getItem('wishlist')) || [],

    addToWishlist: (product) => {
        let list = wishlistDb.getWishlist();
        if (!list.find(i => i.id === product.id)) {
            list.push(product);
            localStorage.setItem('wishlist', JSON.stringify(list));
            showToast(`${product.name} added to wishlist!`, 'success');
            updateWishlistUI();
        } else {
            showToast(`${product.name} is already in your wishlist.`, 'info');
        }
    },

    removeFromWishlist: (id) => {
        let list = wishlistDb.getWishlist();
        list = list.filter(i => i.id !== id);
        localStorage.setItem('wishlist', JSON.stringify(list));
        updateWishlistUI();
    },

    isInWishlist: (id) => {
        const list = wishlistDb.getWishlist();
        return list.some(i => i.id === id);
    }
};

function updateWishlistUI() {
    // Update heart icons if present
    const products = wishlistDb.getWishlist();
    document.querySelectorAll('.product-card').forEach(card => {
        const id = card.getAttribute('data-id'); // Assuming we add data-id to cards
        // Alternatively, use button onclick to pass ID
    });
}

function toggleWishlist(id) {
    const product = db.getProduct(id);
    if (!product) return;

    if (wishlistDb.isInWishlist(id)) {
        wishlistDb.removeFromWishlist(id);
    } else {
        wishlistDb.addToWishlist(product);
    }
}
