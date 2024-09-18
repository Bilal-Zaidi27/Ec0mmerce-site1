let objectData = [];
let filteredData = [];
let itemsPerPage = 20;
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';

// Fetch product data based on current page, search, and category
function fetchProductData(page = 1, search = '', category = 'all') {
    const skip = (page - 1) * itemsPerPage;
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${skip}`;

    if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${itemsPerPage}&skip=${skip}`;
    } else if (category !== 'all') {
        url = `https://dummyjson.com/products/category/${category}?limit=${itemsPerPage}&skip=${skip}`;
    }

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            objectData = data.products;
            filteredData = objectData;
            renderGrid(filteredData);
            renderPagination(data.total);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Render the product grid
function renderGrid(data) {
    let gridData = "";
    data.forEach((product) => {
        gridData += `
          <div class="product-item">
            <a href="/description.html?id=${product.id}" class="product-link">
              <img src="${product.thumbnail}" alt="${product.title}" class="product-img" />
              <h3 class="product-title">${product.title}</h3>
              <p><a href="../categories/categories.html?category=${product.category}" target="_blank">${product.category}</a></p>
              <p class="product-price">$${product.price}</p>
              <p class="product-rating">${getStarRating(product.rating)}</p>
            </a>
            <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-thumbnail="${product.thumbnail}">
              Add To Cart
            </button>
          </div>`;
    });

    document.getElementById("product-grid").innerHTML = gridData;

    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const product = {
                id: button.getAttribute("data-id"),
                title: button.getAttribute("data-title"),
                price: button.getAttribute("data-price"),
                image: button.getAttribute("data-thumbnail"),
                quantity: 1
            };
            addToCart(product);
        });
    });
}

// Add product to cart
function addToCart({ id, title, price, image, quantity }) {
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

// Render pagination
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHtml = `<a href="#" data-page="1">&laquo;</a>`;

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<a href="#" data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
    }

    paginationHtml += `<a href="#" data-page="${totalPages}">&raquo;</a>`;
    document.querySelector(".pagination").innerHTML = paginationHtml;

    document.querySelectorAll('.pagination a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = parseInt(link.getAttribute('data-page'));
            currentPage = page;
            fetchProductData(currentPage, currentSearch, currentCategory);
        });
    });
}

// Search function to filter products based on input
function search(event) {
    currentSearch = event.target.value;
    currentPage = 1; // Reset to the first page
    fetchProductData(currentPage, currentSearch, currentCategory);
}

document.getElementById("search-input").addEventListener("input", search);

// Fetch and populate product categories in the dropdown
fetch('https://dummyjson.com/products/categories')
    .then((response) => response.json())
    .then((categories) => {
        const categorySelect = document.getElementById("Category");
        categorySelect.innerHTML = `<option value="all">All Categories</option>`;
        categories.forEach((category) => {
            categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
        });
        categorySelect.addEventListener('change', (event) => {
            currentCategory = event.target.value;
            currentPage = 1; // Reset to the first page
            fetchProductData(currentPage, currentSearch, currentCategory);
        });
    })
    .catch((error) => {
        console.error('Error fetching categories:', error);
    });

fetchProductData(currentPage);

// Display Cart Items
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

// Get star rating
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '★';
    }
    return stars;
}

// Mobile sidebar toggle
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('menu-open');
}
