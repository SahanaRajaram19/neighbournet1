// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        window.location.href = 'auth.html';
        return;
    }

    // Get item ID from URL
    const params = new URLSearchParams(window.location.search);
    const item_id = params.get('item_id');

    if (!item_id) {
        alert('Invalid item');
        window.location.href = 'borrow.html';
        return;
    }

    // Load item details
    loadBookingItemDetails(item_id);

    // Setup booking form
    setupBookingForm(item_id, user_id);
});

function loadBookingItemDetails(item_id) {
    fetch(`fetch-items.php?id=${item_id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.items && data.items.length > 0) {
                const item = data.items[0];
                displayBookingItem(item);
                window.currentItem = item;
            } else {
                alert('Item not found');
                window.location.href = 'borrow.html';
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to load item');
            window.location.href = 'borrow.html';
        });
}

function displayBookingItem(item) {
    // Update page with item details
    document.getElementById('bookingItemTitle').textContent = item.title;
    document.getElementById('bookingItemPrice').textContent = `₹${item.price}`;
    document.getElementById('bookingItemDescription').textContent = item.description || 'No description available';
    document.getElementById('bookingItemCategory').textContent = item.category;
    document.getElementById('bookingItemCondition').textContent = item.condition;

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) startDateInput.min = today;
    if (endDateInput) endDateInput.min = today;

    // Calculate price on date change
    if (startDateInput) {
        startDateInput.addEventListener('change', calculateTotal);
    }
    if (endDateInput) {
        endDateInput.addEventListener('change', calculateTotal);
    }
}

function setupBookingForm(item_id, user_id) {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBooking(item_id, user_id);
        });
    }

    // Also handle the button if form doesn't exist
    const submitBtn = document.getElementById('submitBookingBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitBooking(item_id, user_id);
        });
    }
}

function calculateTotal() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days < 1) {
        alert('End date must be after start date');
        return;
    }

    const price = window.currentItem?.price || 0;
    const total = price * days;

    const totalDiv = document.getElementById('totalPrice');
    if (totalDiv) {
        totalDiv.textContent = `₹${total}`;
    }

    const daysDiv = document.getElementById('numberOfDays');
    if (daysDiv) {
        daysDiv.textContent = `${days} days`;
    }
}

function submitBooking(item_id, user_id) {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const notes = document.getElementById('bookingNotes')?.value || '';

    if (!startDate || !endDate) {
        showError('Please select both start and end dates');
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
        showError('End date must be after start date');
        return;
    }

    const formData = {
        item_id: item_id,
        start_date: startDate,
        end_date: endDate,
        notes: notes
    };

    fetch('create-booking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('Booking created successfully!');
            setTimeout(() => {
                window.location.href = 'bookings.html';
            }, 2000);
        } else {
            showError(data.error || 'Failed to create booking');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showError('Failed to create booking');
    });
}

function changeQuantity(delta) {
    // Not needed for simple booking
}

function initiateBooking() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background-color: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #fcc; position: fixed; top: 100px; right: 20px; z-index: 9999; max-width: 300px;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = 'background-color: #efe; color: #0a0; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #cfc; position: fixed; top: 100px; right: 20px; z-index: 9999; max-width: 300px; font-weight: 500;';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}
