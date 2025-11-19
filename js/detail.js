// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load item details from URL
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    
    if (itemId) {
        loadItemDetails(itemId);
    }
    
    // Setup booking button
    const bookButton = document.getElementById('bookButton');
    if (bookButton) {
        bookButton.addEventListener('click', function() {
            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                window.location.href = 'auth.html';
                return;
            }
            window.location.href = `book-now.html?item_id=${itemId}`;
        });
    }
});

function loadItemDetails(itemId) {
    fetch(`fetch-items.php?id=${itemId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.items && data.items.length > 0) {
                displayItemDetails(data.items[0]);
            } else {
                showError('Item not found');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showError('Failed to load item details');
        });
}

function displayItemDetails(item) {
    // Update title and main info
    document.getElementById('itemTitle').textContent = item.title;
    document.getElementById('itemPrice').textContent = `₹${item.price}`;
    document.getElementById('itemCategory').textContent = item.category;
    document.getElementById('itemCondition').textContent = item.condition;
    document.getElementById('itemStatus').textContent = item.status;
    document.getElementById('itemDescription').textContent = item.description || 'No description available';
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = item.image_url || 'https://via.placeholder.com/500x400?text=' + encodeURIComponent(item.title);
    }
}

function showError(message) {
    alert(message);
}

    // Image Gallery Functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    
    let currentImageIndex = 0;
    const imageSources = [
        'https://via.placeholder.com/500x400/096C6C/ffffff?text=Power+Drill+Main',
        'https://via.placeholder.com/500x400/FF6F61/ffffff?text=Power+Drill+Side',
        'https://via.placeholder.com/500x400/096C6C/ffffff?text=Power+Drill+Detail',
        'https://via.placeholder.com/500x400/FF6F61/ffffff?text=Power+Drill+Box'
    ];

    // Thumbnail click handler
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            currentImageIndex = index;
            updateMainImage();
            updateActiveThumbnail();
        });
    });

    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : imageSources.length - 1;
            updateMainImage();
            updateActiveThumbnail();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentImageIndex = currentImageIndex < imageSources.length - 1 ? currentImageIndex + 1 : 0;
            updateMainImage();
            updateActiveThumbnail();
        });
    }

    function updateMainImage() {
        if (mainImage) {
            mainImage.src = imageSources[currentImageIndex];
        }
    }

    function updateActiveThumbnail() {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[currentImageIndex].classList.add('active');
    }

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Wishlist functionality
    const wishlistBtn = document.querySelector('.btn-outline.btn-half');
    if (wishlistBtn && wishlistBtn.textContent.includes('Wishlist')) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const heartIcon = this.querySelector('i');
            const isWishlisted = heartIcon.classList.contains('fas');
            
            if (isWishlisted) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
                this.style.color = '#666';
            } else {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                this.innerHTML = '<i class="fas fa-heart"></i> Wishlisted';
                this.style.color = '#FF6F61';
            }
        });
    }

    // Action button interactions
    const chatButton = document.querySelector('.btn-coral');
    const requestButton = document.querySelector('.btn-peacock');
    
    if (chatButton) {
        chatButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Chat functionality would open here!');
        });
    }
    
    if (requestButton) {
        requestButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Request to borrow functionality would process here!');
        });
    }

    // Share functionality
    const shareButton = document.querySelector('.btn-outline .fa-share-alt').parentElement;
    if (shareButton) {
        shareButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: 'Check out this item on NeighbourNet',
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
        });
    }

    // Review stars interaction (if needed for new reviews)
    const reviewStars = document.querySelectorAll('.review-rating .fas');
    reviewStars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            // Highlight stars up to the hovered one
            for (let i = 0; i <= index; i++) {
                reviewStars[i].style.color = '#ff6b35';
            }
        });
        
        star.addEventListener('mouseleave', function() {
            // Reset all stars to golden color
            reviewStars.forEach(s => {
                s.style.color = '#ffd700';
            });
        });
    });

    // Image zoom on hover (optional enhancement)
    if (mainImage) {
        mainImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        mainImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Auto-rotate gallery images (optional)
    let autoRotateInterval = setInterval(() => {
        if (currentImageIndex < imageSources.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0;
        }
        updateMainImage();
        updateActiveThumbnail();
    }, 5000); // Change image every 5 seconds

    // Pause auto-rotation when user interacts with gallery
    const gallery = document.querySelector('.product-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        gallery.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(() => {
                if (currentImageIndex < imageSources.length - 1) {
                    currentImageIndex++;
                } else {
                    currentImageIndex = 0;
                }
                updateMainImage();
                updateActiveThumbnail();
            }, 5000);
        });
    }

    console.log('Product detail page JavaScript loaded successfully!');
});
