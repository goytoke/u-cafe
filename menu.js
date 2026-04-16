// Cart functionality
let cart = [];
let cartTotal = 0;

// User session management
let currentUser = null;

// DOM Elements
const cartToggle = document.querySelector('.cart-toggle');
const cartSidebar = document.querySelector('.cart-sidebar');
const overlay = document.querySelector('.overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const headerLoginIcon = document.getElementById('header-login-icon');

// Check if user is logged in
function checkUserLogin() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        return true;
    }
    return false;
}

// Save user login data
function saveUserLogin(userData) {
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

// Update login icon in header - UPDATED for superscript check
function updateHeaderLoginIcon() {
    if (!headerLoginIcon) return;
    
    if (currentUser) {
        // User is logged in - add check mark in superscript
        headerLoginIcon.classList.add('logged-in');
        headerLoginIcon.title = `Logged in as ${currentUser.email || currentUser.name}`;
        
        // Create dropdown menu
        createLoginDropdown();
    } else {
        // User is not logged in
        headerLoginIcon.classList.remove('logged-in');
        headerLoginIcon.title = 'Login to order';
        
        // Remove dropdown menu
        removeLoginDropdown();
    }
}

// Create login dropdown menu
function createLoginDropdown() {
    // Remove existing dropdown if any
    removeLoginDropdown();
    
    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'login-dropdown';
    dropdown.innerHTML = `
        <div class="login-dropdown-header">
            <h4>${currentUser.email || currentUser.name}</h4>
            <p>Logged in as ${currentUser.type || 'User'}</p>
        </div>
        <ul class="login-dropdown-menu">
            <li><a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="#"><i class="fas fa-history"></i> Order History</a></li>
            <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
            <li><a href="#" class="logout-btn" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    `;
    
    // Add to DOM
    headerLoginIcon.parentNode.appendChild(dropdown);
    
    // Add click event to logout button
    document.getElementById('logout-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
    });
}

// Remove login dropdown
function removeLoginDropdown() {
    const dropdown = document.querySelector('.login-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

// Toggle dropdown on icon click
function setupHeaderLoginIcon() {
    if (!headerLoginIcon) return;
    
    headerLoginIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (currentUser) {
            // Toggle dropdown
            const dropdown = document.querySelector('.login-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        } else {
            // Redirect to login page
            redirectToLogin(false);
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        const dropdown = document.querySelector('.login-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    });
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    updateHeaderLoginIcon();
    setupHeaderLoginIcon();
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Check if we're returning from login with checkout intent
    checkReturnFromLogin();
    
    // Check for pending cart restoration
    checkPendingCart();
    
    // Initialize cart image styles
    addCartImageStyles();
});

// Check if returning from login with checkout intent
function checkReturnFromLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutIntent = urlParams.get('checkout');
    const loginSuccess = urlParams.get('login_success');
    
    if (checkoutIntent === 'true' && loginSuccess === 'true' && currentUser) {
        // User just logged in and wants to checkout
        showNotification('Welcome back! Proceeding to checkout...');
        
        // Auto-open checkout after short delay
        setTimeout(() => {
            if (cart.length > 0) {
                proceedToCheckout();
            } else {
                // If cart is empty, open cart sidebar
                cartSidebar.classList.add('open');
                overlay.classList.add('active');
                showNotification('Please add items to your cart first');
            }
        }, 1000);
        
        // Clean URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Check for pending cart restoration
function checkPendingCart() {
    const pendingCart = localStorage.getItem('pendingCheckoutCart');
    if (pendingCart && currentUser) {
        cart = JSON.parse(pendingCart);
        updateCart();
        localStorage.removeItem('pendingCheckoutCart');
        showNotification('Your cart has been restored!');
        
        // Auto-open cart sidebar
        setTimeout(() => {
            cartSidebar.classList.add('open');
            overlay.classList.add('active');
        }, 500);
    }
}

// Redirect to login page with checkout intent
function redirectToLogin(checkoutIntent = false) {
    let loginUrl = 'login.html?return=' + encodeURIComponent(window.location.href);
    
    if (checkoutIntent) {
        loginUrl += '&checkout=true';
        // Save current cart to restore after login
        localStorage.setItem('pendingCheckoutCart', JSON.stringify(cart));
    }
    
    window.location.href = loginUrl;
}

// Logout function
function logoutUser() {
    // Clear user data
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Clear cart
    cart = [];
    updateCart();
    
    // Show notification
    showNotification('You have been logged out successfully');
    
    // Update header login icon
    updateHeaderLoginIcon();
    
    // Close any open dropdowns
    const dropdown = document.querySelector('.login-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    
    // Reset checkout form if open
    document.getElementById('checkout-page').classList.remove('active');
    document.querySelector('.checkout-form').reset();
}

// Toggle Cart
cartToggle.addEventListener('click', () => {
    // Check if user is logged in before opening cart
    if (!currentUser) {
        showNotification('Please login first to view your cart');
        
        // Pulse the login icon to draw attention
        if (headerLoginIcon) {
            headerLoginIcon.style.animation = 'pulse 1s infinite';
            setTimeout(() => {
                headerLoginIcon.style.animation = '';
            }, 3000);
        }
        
        redirectToLogin(false);
        return;
    }
    
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
});

// Close Cart
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// Close Cart when clicking overlay
overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// Add to Cart Functionality
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Check if user is logged in before allowing add to cart
        if (!currentUser) {
            showNotification('Please login first to add items to cart');
            
            // Pulse the login icon to draw attention
            if (headerLoginIcon) {
                headerLoginIcon.style.animation = 'pulse 1s infinite';
                setTimeout(() => {
                    headerLoginIcon.style.animation = '';
                }, 3000);
            }
            
            redirectToLogin(false);
            return;
        }
        
        const menuItem = this.closest('.menu-item');
        const itemId = menuItem.dataset.id;
        const itemName = menuItem.dataset.name;
        const itemPrice = parseFloat(menuItem.dataset.price);
        const quantity = parseInt(menuItem.querySelector('.quantity-input').value);
        const category = menuItem.dataset.category;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: quantity,
                category: category
            });
        }
        
        updateCart();
        showNotification(`${quantity} ${itemName} added to cart!`);
        menuItem.querySelector('.quantity-input').value = 1;
    });
});

// Update Cart Display
function updateCart() {
    cartItemsContainer.innerHTML = '';
    cartTotal = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some delicious items!</p>
            </div>
        `;
        cartTotalElement.textContent = '$0.00';
        cartCount.textContent = '0';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        // Find the original menu item to get its image
        const originalItem = document.querySelector(`.menu-item[data-id="${item.id}"]`);
        const itemImage = originalItem ? originalItem.querySelector('img').src : '';
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${itemImage}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="cart-qty-btn minus" data-id="${item.id}">-</button>
                    <span class="cart-qty-value">${item.quantity}</span>
                    <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Add event listeners to cart item buttons
    addCartItemListeners();
}

// Add event listeners to cart items
function addCartItemListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.id;
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
            showNotification('Item removed from cart');
        });
    });
    
    document.querySelectorAll('.cart-qty-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.id;
            const item = cart.find(item => item.id === itemId);
            
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(item => item.id !== itemId);
            }
            
            updateCart();
        });
    });
    
    document.querySelectorAll('.cart-qty-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.id;
            const item = cart.find(item => item.id === itemId);
            item.quantity++;
            updateCart();
        });
    });
}

// Checkout button with login requirement
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Check if user is logged in
    if (!currentUser) {
        showNotification('Please login first to proceed with checkout');
        
        // Highlight the login icon
        if (headerLoginIcon) {
            headerLoginIcon.style.animation = 'pulse 1s infinite';
            setTimeout(() => {
                headerLoginIcon.style.animation = '';
            }, 3000);
        }
        
        // Save cart and redirect to login with checkout intent
        localStorage.setItem('pendingCheckoutCart', JSON.stringify(cart));
        
        // Redirect to login page with checkout intent
        setTimeout(() => {
            redirectToLogin(true);
        }, 1500);
        return;
    }
    
    // User is logged in, proceed to checkout
    proceedToCheckout();
});

// Proceed to checkout (after login verification)
function proceedToCheckout() {
    // Hide cart and show checkout
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.getElementById('checkout-page').classList.add('active');
    
    // Populate order summary
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // Find the original menu item to get its image
        const originalItem = document.querySelector(`.menu-item[data-id="${item.id}"]`);
        const itemImage = originalItem ? originalItem.querySelector('img').src : '';
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="${itemImage}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.quantity}x ${item.name}</div>
                <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    // Calculate totals
    const serviceFee = 1.50;
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + serviceFee + tax;
    
    // Update all elements in the order summary
    document.querySelector('.order-summary .subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.order-summary .tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.order-summary .total-price').textContent = `$${total.toFixed(2)}`;
    
    // Also update the service fee display
    document.querySelector('.order-summary .order-row:nth-child(2) span:last-child').textContent = `$${serviceFee.toFixed(2)}`;
    
    // Pre-fill user information if available
    if (currentUser) {
        document.getElementById('email').value = currentUser.email || '';
        document.getElementById('phone').value = currentUser.phone || '';
        document.getElementById('full-name').value = currentUser.fullName || '';
    }
}

// Back to cart button
document.querySelector('.back-to-cart').addEventListener('click', () => {
    document.getElementById('checkout-page').classList.remove('active');
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
});

// Payment method selection
document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
        document.querySelectorAll('.payment-method').forEach(m => {
            m.classList.remove('active');
        });
        method.classList.add('active');
        
        // Show/hide card info based on selection
        if (method.dataset.method === 'card') {
            document.getElementById('card-info').style.display = 'block';
        } else {
            document.getElementById('card-info').style.display = 'none';
        }
    });
});

// Form submission - UPDATED TO REDIRECT TO DASHBOARD
document.querySelector('.checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const fullName = document.getElementById('full-name').value;
    const address1 = document.getElementById('address1').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;
    const terms = document.getElementById('terms').checked;
    
    if (!email || !phone || !fullName || !address1 || !city || !zip || !country || !terms) {
        showNotification('Please fill in all required fields');
        return;
    }
    
    // Here you would typically send the order to your server
    // For demo purposes, we'll just show a success message
    
    const orderData = {
        user: currentUser,
        items: cart,
        shipping: {
            email: email,
            phone: phone,
            fullName: fullName,
            address1: address1,
            address2: document.getElementById('address2').value,
            city: city,
            zip: zip,
            country: country
        },
        total: cartTotal,
        timestamp: new Date().toISOString()
    };
    
    // Save order to localStorage (in real app, send to server)
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(orders));
    
    showNotification('Order placed successfully! Redirecting to dashboard...');
    
    // Clear cart and reset
    cart = [];
    updateCart();
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
    
    // Reset form
    document.querySelector('.checkout-form').reset();
});

// Show notification
function showNotification(message) {
    const notification = document.querySelector('.cart-notification');
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Quantity Control in Menu Items
document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (this.classList.contains('plus')) {
            value++;
        } else if (this.classList.contains('minus') && value > 1) {
            value--;
        }
        
        input.value = value;
    });
});

// Menu Tab Filtering
const menuTabs = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.menu-item');
const categorySections = document.querySelectorAll('.category-section');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        menuTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const category = tab.dataset.category;
        
        // Show all items if "All" is selected
        if (category === 'all') {
            categorySections.forEach(section => {
                section.style.display = 'block';
            });
            return;
        }
        
        // Hide all category sections first
        categorySections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the selected category section
        document.getElementById(category).style.display = 'block';
    });
});

// Custom Select Functionality
const customSelects = document.querySelectorAll('.custom-select');

customSelects.forEach(select => {
    const selectedOption = select.querySelector('.selected-option');
    const optionsContainer = select.querySelector('.options');
    const selectElement = select.querySelector('select');
    const flagImg = select.querySelector('.flag-img');
    const countryName = select.querySelector('.country-name');
    
    // Populate options
    selectElement.querySelectorAll('option').forEach(option => {
        if (option.value) {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.value = option.value;
            
            optionElement.innerHTML = `
                <span class="flag-icon">
                    <img src="https://flagcdn.com/16x12/${option.dataset.flag}.png" alt="${option.textContent}" width="16">
                </span>
                <span>${option.textContent}</span>
            `;
            
            optionElement.addEventListener('click', () => {
                selectElement.value = option.value;
                flagImg.src = `https://flagcdn.com/16x12/${option.dataset.flag}.png`;
                flagImg.alt = option.textContent;
                countryName.textContent = option.textContent;
                select.classList.remove('active');
            });
            
            optionsContainer.appendChild(optionElement);
        }
    });
    
    // Toggle dropdown
    selectedOption.addEventListener('click', (e) => {
        e.stopPropagation();
        select.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', () => {
        select.classList.remove('active');
    });
});

// Set initial flag for selected country (if any)
const initialSelect = document.querySelector('.custom-select select');
if (initialSelect) {
    const initialOption = initialSelect.querySelector('option[selected]');
    if (initialOption) {
        const flagImg = document.querySelector('.flag-img');
        const countryName = document.querySelector('.country-name');
        flagImg.src = `https://flagcdn.com/16x12/${initialOption.dataset.flag}.png`;
        flagImg.alt = initialOption.textContent;
        countryName.textContent = initialOption.textContent;
    }
}

function loadCategory(file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById("menu-content").innerHTML = data;
    })
    .catch(err => {
      document.getElementById("menu-content").innerHTML = "<p>Error loading menu.</p>";
    });
}

// Add CSS for cart images
function addCartImageStyles() {
    // Styles are already in the CSS file
}

// Initialize the cart image styles
addCartImageStyles();
// Hamburger sidebar toggle (from gal2.html)
const hamburger = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebarNav');
const overlaySide = document.getElementById('sidebarOverlay');
const closeSide = document.getElementById('closeSidebarBtn');

function openSidebar() {
    sidebar.classList.add('active');
    overlaySide.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.classList.add('active');
}
function closeSidebar() {
    sidebar.classList.remove('active');
    overlaySide.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.classList.remove('active');
}
if (hamburger) hamburger.addEventListener('click', openSidebar);
if (closeSide) closeSide.addEventListener('click', closeSidebar);
if (overlaySide) overlaySide.addEventListener('click', closeSidebar);

// Close sidebar when a nav link is clicked
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => { setTimeout(closeSidebar, 150); });
});