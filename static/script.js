document.addEventListener('DOMContentLoaded', function() {
    // Cart Functionality
    const cartBtn = document.getElementById('cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const emptyCartMsg = document.querySelector('.empty-cart');
    const cartTotal = document.querySelector('.cart-footer p');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    let cart = [];
    
    // Open cart popup
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when cart is open
    });
    
    // Close cart popup
    closeCartBtn.addEventListener('click', function() {
        cartPopup.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Close cart when clicking outside
    cartPopup.addEventListener('click', function(e) {
        if (e.target === cartPopup) {
            cartPopup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const product = {
                name: this.getAttribute('data-product'),
                price: parseInt(this.getAttribute('data-price')),
                quantity: 1
            };
            
            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.name === product.name);
            
            if (existingProductIndex > -1) {
                // Increase quantity if product already in cart
                cart[existingProductIndex].quantity++;
            } else {
                // Add new product to cart
                cart.push(product);
            }
            
            updateCart();
            
            // Show notification
            showNotification(`${product.name} added to cart!`);
            
            // Open cart after adding item (optional)
            cartPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Update cart display
    function updateCart() {
        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            cartItems.innerHTML = '';
            cartTotal.textContent = 'Total: Rs.0';
        } else {
            emptyCartMsg.style.display = 'none';
            
            let totalPrice = 0;
            let cartHTML = '';
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                cartHTML += `
                    <div class="cart-item">
                        <img src="https://via.placeholder.com/60x60" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>Rs.${item.price} × ${item.quantity}</p>
                            <p>Rs.${itemTotal}</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn" data-action="decrease" data-product="${item.name}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase" data-product="${item.name}">+</button>
                            <button class="remove-btn" data-product="${item.name}">×</button>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
            cartTotal.textContent = `Total: Rs.${totalPrice}`;
            
            // Add event listeners to cart item buttons
            const quantityBtns = document.querySelectorAll('.quantity-btn');
            const removeBtns = document.querySelectorAll('.remove-btn');
            
            quantityBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const action = this.getAttribute('data-action');
                    const product = this.getAttribute('data-product');
                    updateQuantity(product, action);
                });
            });
            
            removeBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const product = this.getAttribute('data-product');
                    removeFromCart(product);
                });
            });
        }
    }
    
    // Update quantity of cart items
    function updateQuantity(productName, action) {
        const productIndex = cart.findIndex(item => item.name === productName);
        
        if (productIndex > -1) {
            if (action === 'increase') {
                cart[productIndex].quantity++;
            } else if (action === 'decrease') {
                cart[productIndex].quantity--;
                
                if (cart[productIndex].quantity === 0) {
                    cart.splice(productIndex, 1);
                }
            }
            
            updateCart();
        }
    }
    
    // Remove item from cart
    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCart();
    }
    
    // Display notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            
            if (searchTerm) {
                showNotification(`Searching for: ${searchTerm}`);
                // Here you would typically handle search functionality
                // This is just a placeholder
            }
        }
    });
    
    // Initialize cart
    updateCart();
    
    // Add the "Created by Intention" tag
    const intentionTag = document.createElement('div');
    intentionTag.className = 'creation-by-intention';
    intentionTag.innerHTML = '<span></span>GREENER BY INTENTION';
    document.body.appendChild(intentionTag);
});