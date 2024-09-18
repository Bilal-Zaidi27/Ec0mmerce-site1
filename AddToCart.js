function addToCart(id, title, price, image, quantity) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
    const existingProduct = cartItems.find((item) => item.id === id);
    if (existingProduct) {
      alert("Product already exists in cart");
    } else {
      cartItems.push({ id, title, price, image, quantity });
      alert("Product added to cart successfully");
    }
  
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  
    displayCartItems();
  }



// Add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
  
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
  
    // Save updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Show cart sidebar instead of redirecting to cart.html
    const cartSidebar = document.getElementById("cart-sidebar");
    if (cartSidebar) {
      cartSidebar.classList.add("open");
      renderCartItems();
    }
  }
  
  // Render Cart Items
  function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('cart-total-price');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    let cartHtml = '';
  
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      cartHtml += `
        <div class="cart-item">
          <img src="${item.thumbnail}" alt="${item.title}">
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
  
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.dataset.id;
        removeFromCart(itemId);
      });
    });
  }
  
  // Remove item from cart
  function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
  }