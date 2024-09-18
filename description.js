
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    if (productId) {
      fetchProductDetails(productId);
    } else {
      console.error('No product ID provided.');
    }
  
    // Handle form submission
    const reviewForm = document.querySelector('.review-form');
    reviewForm.addEventListener('submit', handleReviewSubmit);
  
    initializeStarRating();
  
    window.addEventListener("load", () => {
      const loader = document.getElementById("preloader");
      if (loader) {
        loader.style.display = "none";
      }
    });
  });
  
  function fetchProductDetails(id) {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(response => response.json())
      .then(product => {
        displayProductDetails(product);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }
  
  function displayProductDetails(product) {
    const container = document.querySelector('.container');
    container.innerHTML = `
      <div class="image">
        <img src="${product.images[0]}" alt="Product Image"/>
      </div>
      <div class="describe">
        <h1 id="title">${product.title}</h1>
        <p>${product.description}</p>
        <h3>Price: $${product.price}</h3>
        <h3>Stock: ${product.stock}</h3>
        <h3>Rating</h3>
        ${getStarRating(product.rating)}
        <div class="button-group">
          <button class="buy-now">Buy Now</button>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      </div>
    `;
  
    const reviewsContainer = document.getElementById('reviews');
    if (product.reviews) {
      reviewsContainer.innerHTML = getReviews(product.reviews);
    } else {
      reviewsContainer.innerHTML = '<p>No reviews available.</p>';
    }
  
    // Initialize slider after content is loaded
    initializeSlider();
  }
  
  function handleReviewSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('fname').value;
    const reviewText = document.getElementById('review').value;
    const stars = document.querySelectorAll('.stars .fa-star.checked').length;
  
    const newReview = {
      reviewerName: name,
      comment: reviewText,
      rating: stars
    };
  
    // Optionally, send this data to your server here
  
    addReviewToSlider(newReview);
  
    // Clear form
    event.target.reset();
    updateStars(0); // Reset star rating
  }
  
  function addReviewToSlider(review) {
    const reviewsContainer = document.getElementById('reviews');
    const newReviewHtml = `
      <div class="review">
        <p><strong>${review.reviewerName}</strong><br>${review.comment}<br>Rating: ${getStarRating(review.rating)}</p>
      </div>
    `;
    reviewsContainer.innerHTML += newReviewHtml;
  
    initializeSlider();
  }
  
  function getStarRating(rating) {
    const totalStars = 5;
    let starsHtml = '';
    for (let i = 0; i < totalStars; i++) {
      starsHtml += `<span class="fa fa-star${i < rating ? ' checked bxs-star' : ' bxs-star'}" data-index="${i}"></span>`;
    }
    return starsHtml;
  }
  
  function getReviews(reviews) {
    let reviewsHtml = '';
    reviews.forEach(review => {
      reviewsHtml += `
        <div class="review">
          <p><strong>${review.reviewerName}</strong><br>${review.comment}<br>Rating: ${getStarRating(review.rating)}</p>
        </div>
      `;
    });
    return reviewsHtml;
  }
  
  function initializeSlider() {
    let slideIndex = 1;
    const slides = document.querySelectorAll('.review');
    const dots = document.querySelectorAll('.dot');
  
    if (slides.length === 0) return;
  
    function plusSlides(n) {
      showSlides(slideIndex += n);
    }
  
    function currentSlide(n) {
      showSlides(slideIndex = n);
    }
  
    function showSlides(n) {
      if (slides.length === 0) return;
  
      if (n > slides.length) { slideIndex = 1; }
      if (n < 1) { slideIndex = slides.length; }
  
      slides.forEach(slide => slide.style.display = 'none');
      dots.forEach(dot => dot.className = dot.className.replace(' active', ''));
  
      let displayIndex = slideIndex - 1;
      for (let i = 0; i < 3; i++) {
        if (slides[displayIndex + i]) {
          slides[displayIndex + i].style.display = 'block';
        }
      }
  
      if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += ' active';
      }
    }
  
    document.querySelector('.prev').addEventListener('click', () => plusSlides(-3));
    document.querySelector('.next').addEventListener('click', () => plusSlides(3));
  
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.addEventListener('click', () => currentSlide(index + 1));
    });
  
    showSlides(slideIndex);
  }
  
  function initializeStarRating() {
    const stars = document.querySelectorAll('.stars .fa-star');
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const rating = parseInt(this.dataset.index) + 1;
        updateStars(rating);
      });
    });
  }
  
  function updateStars(rating) {
    const stars = document.querySelectorAll('.stars .fa-star');
    stars.forEach((star, index) => {
      star.classList.toggle('checked', index < rating);
    });
  }

  


  // Mobile side bar
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('menu-open');
}
