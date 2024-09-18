
// Display cart items on cart page
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('cart-total-price');
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    let total = 0;
    let cartHtml = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartHtml += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h2>${item.title}</h2>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>`;
    });

    cartItemsContainer.innerHTML = cartHtml;
    totalPriceElement.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to "Remove" buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;
            removeFromCart(itemId);
        });
    });
}

// Remove item from cart
function removeFromCart(itemId) {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    renderCartItems();
}

// Initialize cart on page load
window.onload = renderCartItems;
