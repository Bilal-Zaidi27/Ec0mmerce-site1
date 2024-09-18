// Fetch URL parameters and set default category
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || 'all';
let itemsPerPage1 = 20;
let currentPage1 = 1;

// Fetch and display products for the selected category
function fetchCategoryProducts(page = 1) {
  const skip = (page - 1) * itemsPerPage1;
  const url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${itemsPerPage1}&skip=${skip}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      renderGrid(data.products);
      renderPagination(data.total);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}

// Render products in a grid
function renderGrid(data) {
  let gridData = "";
  data.forEach(product => {
    gridData += `
      <div class="product-item">
        <a href="description.html?id=${product.id}" class="product-link">
          <img src="${product.thumbnail}" alt="${product.title}" class="product-img" />
          <h3 class="product-title">${product.title}</h3>
          <p class="product-price">$${product.price}</p>
           <p class="product-rating">${getStarRating(product.rating)}
        </a>
        <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-thumbnail="${product.thumbnail}">Add To Cart</button>
      </div>`;
  });

  document.getElementById("product-grid").innerHTML = gridData;

  // Add event listeners to "Add To Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      const product = {
        id: button.getAttribute('data-id'),
        title: button.getAttribute('data-title'),
        price: parseFloat(button.getAttribute('data-price')),
        thumbnail: button.getAttribute('data-thumbnail')
      };
      addToCart(product);
    });
  });
}

// Handle pagination
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage1);
  let paginationHtml = `<a href="#" data-page="1">&laquo;</a>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<a href="#" data-page="${i}" class="${i === currentPage1 ? 'active' : ''}">${i}</a>`;
  }

  paginationHtml += `<a href="#" data-page="${totalPages}">&raquo;</a>`;
  document.querySelector(".pagination").innerHTML = paginationHtml;

  document.querySelectorAll('.pagination a').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const page = parseInt(link.getAttribute('data-page'));
      currentPage1 = page;
      fetchCategoryProducts(currentPage1);
    });
  });
}

// Star rating helper function (example)
function getStarRating(rating) {
  const stars = Math.round(rating);
  return '<div class="star-rating">' + '★'.repeat(stars) + '☆'.repeat(5 - stars) + '</div>';
}

// Fetch initial products
fetchCategoryProducts(currentPage1);

// Add to cart functionality
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));

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
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const updatedCart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  renderCartItems();
}

// Load categories and update navigation
async function loadCategories() {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    const categories = await response.json();
    const categorySelect = document.getElementById("Category");

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.slug || category.name; // Category is a string, so use it directly
        option.textContent = category.name; // Use the string as the display text
        categorySelect.appendChild(option);
      });

  


    categorySelect.addEventListener('change', (event) => {
      const selectedCategory = event.target.value;
      if (selectedCategory) {
        window.location.href = `category.html?category=${encodeURIComponent(selectedCategory)}`;
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Initialize categories on page load
loadCategories();

// Mobile sidebar toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('menu-open');
}



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


  function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    let cartHtml = '';
    cartItems.forEach(item => {
        cartHtml += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
              <h2>${item.title}</h2>
              <p>Price: $${item.price}</p>
              <p>Quantity: ${item.quantity}</p>
            </div>
          </div>`;
    });
    cartItemsContainer.innerHTML = cartHtml;
}







