// Cart management using LocalStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

document.addEventListener('DOMContentLoaded', function () {
    
    // Core Initializations
    initNavbarScroll();
    initAuthNavbar();
    updateCartCountBadge();
    loadProductsCatalog();
    initFeedbackForm();
});

// 1. Navbar scroll aesthetic update
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-custom');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 2. Custom Toast System (Replaces browser alert())
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-alerts-box');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    
    let iconClass = 'fa-check-circle';
    if (type === 'error') {
        iconClass = 'fa-exclamation-circle';
        toast.style.borderLeftColor = 'var(--accent-danger)';
    } else if (type === 'info') {
        iconClass = 'fa-info-circle';
        toast.style.borderLeftColor = '#3b82f6';
    }

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} custom-toast-icon" style="color: ${type === 'error' ? 'var(--accent-danger)' : (type === 'info' ? '#3b82f6' : 'var(--accent-cyan)')}"></i>
        <div class="custom-toast-body">${message}</div>
    `;

    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Remove toast after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}

// 3. Setup Authenticated Navbar (Displays current user)
function initAuthNavbar() {
    const authSection = document.getElementById('nav-auth-section');
    if (!authSection) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser) {
        authSection.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <span class="nav-link nav-link-custom active text-nowrap" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.25);">
                    <i class="fa-solid fa-circle-user text-emerald me-1"></i> Hi, ${currentUser.name.split(' ')[0]}
                </span>
                <a href="#" class="nav-link nav-link-custom text-danger" id="logout-btn-link" title="Logout">
                    <i class="fa-solid fa-sign-out-alt"></i>
                </a>
            </div>
        `;

        document.getElementById('logout-btn-link').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            showToast('You have successfully logged out.', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    } else {
        authSection.innerHTML = `
            <a class="nav-link nav-link-custom" href="login.html">
                <i class="fa-solid fa-user me-1"></i> Login
            </a>
        `;
    }
}

// 4. Update Navbar Cart Count Badge
function updateCartCountBadge() {
    const badge = document.getElementById('cart-badge-count');
    if (!badge) return;
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    badge.innerText = count;
    
    // Small pop animation on update
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);
}

// 5. Quantity Selectors Plus / Minus Functionality
function initQuantityAdjusters() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const minusBtn = card.querySelector('.minus-btn');
        const plusBtn = card.querySelector('.plus-btn');
        const qtyVal = card.querySelector('.qty-val');

        if (minusBtn && plusBtn && qtyVal) {
            minusBtn.addEventListener('click', function() {
                let current = parseInt(qtyVal.value);
                if (current > 1) {
                    qtyVal.value = current - 1;
                }
            });

            plusBtn.addEventListener('click', function() {
                let current = parseInt(qtyVal.value);
                qtyVal.value = current + 1;
            });
        }
    });
}

// 6. Add To Cart functionality
function initAddToCart() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const addBtn = card.querySelector('.btn-add-cart');
        if (!addBtn) return;

        addBtn.addEventListener('click', function () {
            const title = card.querySelector('.product-title').innerText;
            const priceText = card.querySelector('.product-price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            const qtyVal = card.querySelector('.qty-val');
            const quantity = parseInt(qtyVal.value);
            const imgSrc = card.querySelector('.product-card-img').src;

            // Push to local storage structure
            const existingIndex = cart.findIndex(item => item.title === title);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({ title, price, quantity, img: imgSrc });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCountBadge();
            
            showToast(`${quantity} x ${title} added to cart!`, 'success');
            
            // Reset quantity display to 1 after adding
            qtyVal.value = 1;
        });
    });
}

// 7. Search & Category Filtering logic
function initSearchAndFiltering() {
    const searchInput = document.getElementById('catalog-search');
    const tabButtons = document.querySelectorAll('.filter-tab');
    const productItems = document.querySelectorAll('.product-card-item');

    let currentSearch = '';
    let currentCategory = 'all';

    function applyFilter() {
        productItems.forEach(item => {
            const title = item.querySelector('.product-title').innerText.toLowerCase();
            const category = item.getAttribute('data-category');

            const matchesSearch = title.includes(currentSearch);
            const matchesCategory = (currentCategory === 'all' || category === currentCategory);

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                // Add soft fade-in animation
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Keyword search trigger
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.toLowerCase().trim();
            applyFilter();
        });
    }

    // Category button trigger
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            currentCategory = this.getAttribute('data-category');
            applyFilter();
        });
    });
}

// Fallback catalog data when database is offline
const FALLBACK_PRODUCTS = [
    {
        title: "Premium Wired headphones",
        price: 99.99,
        originalPrice: 124.99,
        category: "Audio",
        stockCount: 12,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800",
        badge: "20% Off"
    },
    {
        title: "Ultra Speed Pendrives (128GB)",
        price: 199.99,
        category: "Storage",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=800",
        badge: "New"
    },
    {
        title: "Bluetooth Wireless Earphone",
        price: 500.99,
        originalPrice: 625.99,
        category: "Audio",
        stockCount: 3,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "Wireless ANC Over-Ear Headphone",
        price: 1000.99,
        originalPrice: 1250.00,
        category: "Audio",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
        badge: "Offer"
    },
    {
        title: "AMOLED Display Smart Watch",
        price: 1200.99,
        category: "Wearables",
        stockCount: 4,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "Mechanical RGB Gaming Keyboard",
        price: 5000.99,
        category: "Computers & Gaming",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800",
        badge: "Offer"
    }
];

// Helper to render products list
function renderProductsList(productsList, isOffline = false) {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = ''; // Clear loader / previous items
    
    if (isOffline) {
        const offlineBanner = document.createElement('div');
        offlineBanner.className = 'col-12';
        offlineBanner.innerHTML = `
            <div class="alert-offline text-center p-3 mb-4 rounded-3 border border-warning" style="background: rgba(245, 158, 11, 0.05); color: #f59e0b; font-family: var(--font-heading); font-weight: 500; font-size: 0.95rem; backdrop-filter: blur(10px);">
                <i class="fa-solid fa-triangle-exclamation me-2 animate-pulse"></i>
                <span>Offline Mode Active: Database connection delay. Loaded premium offline catalog.</span>
            </div>
        `;
        catalogGrid.appendChild(offlineBanner);
    }
    
    productsList.forEach(prod => {
        const badgeHTML = prod.badge ? `<div class="card-badge ${prod.badge.toLowerCase().includes('offer') || prod.badge.toLowerCase().includes('off') ? 'badge-offer' : (prod.badge.toLowerCase() === 'new' ? 'badge-new' : 'badge-hot')}">${prod.badge}</div>` : '';
        const originalPriceHTML = prod.originalPrice ? `<span class="product-original-price">₹${prod.originalPrice.toFixed(2)}</span>` : '';
        const stockBadgeClass = prod.stockStatus === 'instock' ? 'stock-instock' : 'stock-low';
        const stockBadgeText = prod.stockStatus === 'instock' ? 'In Stock' : `Only ${prod.stockCount} Left!`;

        const col = document.createElement('div');
        col.className = 'col product-card-item';
        col.setAttribute('data-category', prod.category);
        col.innerHTML = `
            <div class="product-card">
                ${badgeHTML}
                <div class="product-img-wrapper">
                    <img src="${prod.image}" class="product-card-img" alt="${prod.title}">
                </div>
                <div class="product-details">
                    <span class="product-category">${prod.category}</span>
                    <h4 class="product-title">${prod.title}</h4>
                    <div class="product-price-row">
                        <span class="product-price">₹${prod.price.toFixed(2)}</span>
                        ${originalPriceHTML}
                    </div>
                    <div class="product-stock-badge ${stockBadgeClass}">
                        <span class="stock-dot"></span> ${stockBadgeText}
                    </div>

                    <div class="qty-container">
                        <button class="qty-btn minus-btn" type="button"><i class="fa-solid fa-minus"></i></button>
                        <input type="text" class="qty-val" value="1" readonly>
                        <button class="qty-btn plus-btn" type="button"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="btn-add-cart" type="button"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                </div>
            </div>
        `;
        catalogGrid.appendChild(col);
    });

    // Initialize interactive handlers on freshly loaded dynamic cards
    initQuantityAdjusters();
    initAddToCart();
    initSearchAndFiltering();
}

// 8. Dynamic Product Catalog Loader (Fetches from MongoDB and populates HTML cards)
function loadProductsCatalog() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;

    const apiUrl = typeof window.getApiUrl === 'function' ? window.getApiUrl('/api/products') : '/api/products';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.data.length > 0) {
                renderProductsList(data.data, false);
            } else {
                throw new Error("No products returned or API marked request unsuccessful.");
            }
        })
        .catch(err => {
            console.error("Error loading products from database, falling back: ", err);
            renderProductsList(FALLBACK_PRODUCTS, true);
        });
}

// 9. Complaints Feedback form trigger
function initFeedbackForm() {
    const form = document.getElementById('complaints-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('feedback-name').value.trim();
        const email = document.getElementById('feedback-email').value.trim();

        const apiUrl = typeof window.getApiUrl === 'function' ? window.getApiUrl('/api/feedback') : '/api/feedback';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            const data = await response.json();

            if (data.success) {
                showToast(`Thank you, ${name}! Your feedback has been logged to the database.`, 'success');
                form.reset();
            } else {
                showToast(data.message || 'Failed to submit feedback.', 'error');
            }
        } catch (error) {
            showToast('Server connection failed. Please try again later.', 'error');
        }
    });
}