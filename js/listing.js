// Item Listing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load items for browsing
    loadItemsForBrowsing();
    
    // Setup filters
    setupFilters();
    
    // Initialize listing form if on listing page
    if (document.getElementById('listingForm')) {
        initializeListingForm();
        initializeImageUploads();
        initializeAvailabilityOptions();
    }
});

// Load items for browsing
function loadItemsForBrowsing() {
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) return;

    fetch('fetch-items.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.items) {
                displayItems(data.items);
            }
        })
        .catch(err => console.log('Error loading items:', err));
}

function displayItems(items) {
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    
    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No items available</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        const imageUrl = item.image_url || `placeholder-image.php?category=${item.category.toLowerCase()}&w=300&h=200&text=${encodeURIComponent(item.title)}`;
        card.innerHTML = `
            <div class="item-image">
                <img src="${imageUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">
                <span class="item-status ${item.status}">${item.status}</span>
            </div>
            <div class="item-content">
                <h3>${item.title}</h3>
                <p class="item-category">${item.category}</p>
                <p class="item-desc">${item.description ? item.description.substring(0, 60) + '...' : ''}</p>
                <div class="item-footer">
                    <span class="price">₹${item.price}/day</span>
                    <span class="condition">${item.condition}</span>
                </div>
                <button class="btn btn-coral btn-small" onclick="viewItem(${item.id})">View Details</button>
                <button class="btn btn-outline btn-small" onclick="bookItem(${item.id})">Book Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const conditionFilter = document.getElementById('conditionFilter');

    [categoryFilter, statusFilter, conditionFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const condition = document.getElementById('conditionFilter')?.value || '';

    let url = 'fetch-items.php?';
    if (category) url += `category=${category}&`;
    if (status) url += `status=${status}&`;
    if (condition) url += `condition=${condition}&`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayItems(data.items || []);
            }
        })
        .catch(err => console.log('Error:', err));
}

function viewItem(itemId) {
    window.location.href = `item-detail.html?id=${itemId}`;
}

function bookItem(itemId) {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        window.location.href = 'auth.html';
        return;
    }
    window.location.href = `book-now.html?item_id=${itemId}`;
}

let currentStep = 1;
const totalSteps = 4;

// Initialize listing form
function initializeListingForm() {
    const form = document.getElementById('listingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitListing();
        });
    }

    // Set minimum date for availability
    const availableFrom = document.getElementById('availableFrom');
    if (availableFrom) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        availableFrom.min = tomorrow.toISOString().split('T')[0];
    }
}

// Step navigation
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepDiv => {
        stepDiv.classList.remove('active');
    });

    // Show target step
    const targetStep = document.querySelector(`[data-step="${step}"]`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Update progress steps
    document.querySelectorAll('.step').forEach(stepDiv => {
        stepDiv.classList.remove('active');
    });

    const activeProgressStep = document.querySelector(`[data-step="${step}"]`);
    if (activeProgressStep) {
        activeProgressStep.classList.add('active');
    }

    currentStep = step;
}

// Form validation
function validateCurrentStep() {
    const currentStepDiv = document.querySelector('.form-step.active');
    const requiredFields = currentStepDiv.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }

    return isValid;
}

// Initialize image uploads
function initializeImageUploads() {
    const imageInputs = ['mainImage', 'image2', 'image3', 'image4', 'image5'];

    imageInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', function(e) {
                handleImageUpload(e.target, inputId);
            });
        }
    });
}

function handleImageUpload(input, inputId) {
    const file = input.files[0];
    if (file) {
        // Validate file size (100MB limit)
        const maxSize = 100 * 1024 * 1024; // 100MB in bytes
        if (file.size > maxSize) {
            alert('File size must be under 100MB. Please choose a smaller file.');
            input.value = '';
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload only image files.');
            input.value = '';
            return;
        }

        // Preview the image
        const reader = new FileReader();
        reader.onload = function(e) {
            const slot = input.closest('.upload-slot');
            slot.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                <button class="remove-image" onclick="removeImage('${inputId}')">&times;</button>
            `;
            slot.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
}

function removeImage(inputId) {
    const input = document.getElementById(inputId);
    const slot = input.closest('.upload-slot');

    if (inputId === 'mainImage') {
        slot.innerHTML = `
            <i class="fas fa-camera"></i>
            <p>Main Photo</p>
        `;
    } else {
        slot.innerHTML = `<i class="fas fa-plus"></i>`;
    }

    slot.classList.remove('has-image');
    input.value = '';
}

// Initialize availability options
function initializeAvailabilityOptions() {
    const availabilityRadios = document.querySelectorAll('input[name="availabilityType"]');

    availabilityRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const detailsDiv = document.getElementById('availabilityDetails');
            if (this.value === 'unavailable') {
                detailsDiv.style.display = 'block';
            } else {
                detailsDiv.style.display = 'none';
            }
        });
    });
}

// Submit listing
function submitListing() {
    if (!document.getElementById('listingTerms').checked) {
        alert('Please agree to the listing terms.');
        return;
    }

    // Collect form data
    const formData = new FormData(document.getElementById('listingForm'));

    // Simulate listing submission
    alert('Your item has been listed successfully! It will be reviewed by our team and published within 24 hours.');

    // Redirect to profile or home
    window.location.href = 'profile.html';
}

// Update review section
function updateReviewSection() {
    // Update basic information
    document.getElementById('reviewTitle').textContent = document.getElementById('itemTitle').value;
    document.getElementById('reviewCategory').textContent = document.getElementById('category').options[document.getElementById('category').selectedIndex].text;
    document.getElementById('reviewRate').textContent = '₹' + document.getElementById('dailyRate').value + '/day';
    document.getElementById('reviewCondition').textContent = document.getElementById('condition').options[document.getElementById('condition').selectedIndex].text;

    // Update photos
    const photoSlots = document.querySelectorAll('.upload-slot.has-image');
    const reviewPhotos = document.getElementById('reviewPhotos');

    if (photoSlots.length > 0) {
        reviewPhotos.innerHTML = `<p>${photoSlots.length} photo(s) uploaded</p>`;
    } else {
        reviewPhotos.innerHTML = `<p>No photos uploaded yet</p>`;
    }

    // Update availability
    const availabilityType = document.querySelector('input[name="availabilityType"]:checked').value;
    const reviewAvailability = document.getElementById('reviewAvailability');

    if (availabilityType === 'unavailable') {
        const availableFrom = document.getElementById('availableFrom').value;
        reviewAvailability.innerHTML = `<p>Available from: ${availableFrom || 'Not specified'}</p>`;
    } else {
        reviewAvailability.innerHTML = `<p>Available anytime</p>`;
    }
}

// Override nextStep to update review
const originalNextStep = nextStep;
function nextStep() {
    if (currentStep === 3) {
        updateReviewSection();
    }
    originalNextStep();
}
