// Item Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal functionality
    initializeModals();

    // Initialize image gallery
    initializeImageGallery();

    // Initialize quantity and pricing
    initializeQuantityControls();

    // Initialize image upload
    initializeImageUpload();
});

// Modal Management
function initializeModals() {
    // Booking modal
    const bookingModal = document.getElementById('bookingModal');
    const galleryModal = document.getElementById('galleryModal');

    // Close modal when clicking close button
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Image Gallery Functions
function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
        });
    });
}

function changeMainImage(src) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = src;
}

function openImageGallery() {
    const galleryModal = document.getElementById('galleryModal');
    galleryModal.style.display = 'flex';
}

// Quantity and Pricing Controls
function initializeQuantityControls() {
    const quantityInput = document.getElementById('rentalDuration');
    const totalPrice = document.getElementById('totalPrice');

    if (quantityInput) {
        quantityInput.addEventListener('input', updateTotalPrice);
    }
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('rentalDuration');
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, Math.min(7, currentValue + delta)); // Min 1, Max 7 days
    quantityInput.value = newValue;
    updateTotalPrice();
}

function updateTotalPrice() {
    const quantityInput = document.getElementById('rentalDuration');
    const totalPrice = document.getElementById('totalPrice');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryTotal = document.getElementById('summaryTotal');

    if (quantityInput && totalPrice) {
        const quantity = parseInt(quantityInput.value);
        const basePrice = 50; // Base price per day
        const total = quantity * basePrice;

        totalPrice.textContent = total;

        // Update summary if modal is open
        if (summaryDuration && summaryTotal) {
            summaryDuration.textContent = `${quantity} day(s)`;
            summaryTotal.textContent = `₹${total}`;
        }
    }
}

// Booking Functions
function initiateBooking() {
    updateTotalPrice(); // Ensure price is updated
    const bookingModal = document.getElementById('bookingModal');
    bookingModal.style.display = 'flex';
}

function closeBookingModal() {
    const bookingModal = document.getElementById('bookingModal');
    bookingModal.style.display = 'none';
}

function confirmBooking() {
    const termsCheck = document.getElementById('termsCheck');
    const uploadPreview = document.getElementById('uploadPreview');

    if (!termsCheck.checked) {
        alert('Please agree to the Terms of Service and Rental Agreement.');
        return;
    }

    if (uploadPreview.style.display === 'none') {
        alert('Please upload your payment receipt.');
        return;
    }

    // Simulate booking confirmation
    alert('Booking confirmed! You will receive a confirmation email shortly.');

    // Close modal and redirect
    closeBookingModal();
    window.location.href = 'profile.html';
}

// Image Upload Functionality
function initializeImageUpload() {
    const fileInput = document.getElementById('receiptUpload');
    const uploadArea = document.querySelector('.upload-area');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file size (100MB limit)
                const maxSize = 100 * 1024 * 1024; // 100MB in bytes
                if (file.size > maxSize) {
                    alert('File size must be under 100MB. Please choose a smaller file.');
                    return;
                }

                // Preview the image
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    uploadArea.style.display = 'none';
                    uploadPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Drag and drop functionality
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
}

function removeImage() {
    const uploadArea = document.querySelector('.upload-area');
    const uploadPreview = document.getElementById('uploadPreview');
    const fileInput = document.getElementById('receiptUpload');

    uploadArea.style.display = 'flex';
    uploadPreview.style.display = 'none';
    fileInput.value = '';
}

// Calendar functionality for availability
function selectDate(date) {
    // Remove selected class from all dates
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });

    // Add selected class to clicked date
    const selectedDay = document.querySelector(`[data-date="${date}"]`);
    if (selectedDay && selectedDay.classList.contains('available')) {
        selectedDay.classList.add('selected');
    }
}

// Add CSS for drag and drop
const uploadStyles = `
.upload-area {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafbfc;
}

.upload-area:hover {
    border-color: #096C6C;
    background: #f0f8f8;
}

.upload-area.drag-over {
    border-color: #FF6F61;
    background: #fff5f5;
}

.upload-preview {
    position: relative;
    text-align: center;
}

.upload-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.remove-image {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar-day {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    margin: 2px;
    transition: all 0.3s ease;
}

.calendar-day.available {
    background: #e8f5e8;
    color: #2e7d32;
}

.calendar-day.available:hover {
    background: #096C6C;
    color: white;
}

.calendar-day.booked {
    background: #ffebee;
    color: #c62828;
    cursor: not-allowed;
}

.calendar-day.selected {
    background: #FF6F61 !important;
    color: white !important;
}

.calendar-legend {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    justify-content: center;
}

.calendar-legend span {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.calendar-legend span::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.available-date::before { background: #e8f5e8; }
.booked-date::before { background: #ffebee; }
.unavailable-date::before { background: #f5f5f5; }

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.quantity-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.3s ease;
}

.quantity-btn:hover {
    border-color: #096C6C;
    background: #f0f8f8;
}

.quantity-input {
    width: 60px;
    text-align: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
}

.breadcrumb-link {
    color: #096C6C;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.3s ease;
}

.breadcrumb-link:hover {
    color: #FF6F61;
}

.breadcrumb-separator {
    color: #999;
    font-weight: bold;
}

.breadcrumb-current {
    color: #666;
    font-weight: 500;
}
`;

// Inject styles
const style = document.createElement('style');
style.textContent = uploadStyles;
document.head.appendChild(style);
