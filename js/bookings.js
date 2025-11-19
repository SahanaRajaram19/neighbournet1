// Bookings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        window.location.href = 'auth.html';
        return;
    }

    loadBookings();
    setupFilters();
});

function loadBookings() {
    fetch('fetch-bookings.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayBookings(data.bookings || []);
            } else {
                showError(data.error || 'Failed to load bookings');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showError('Failed to load bookings');
        });
}

function displayBookings(bookings) {
    const tbody = document.querySelector('.bookings-table tbody');
    if (!tbody) {
        // Try alternative structure
        const grid = document.getElementById('bookingsGrid');
        if (grid) {
            grid.innerHTML = '';
            if (bookings.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No bookings yet</p>';
                return;
            }

            bookings.forEach(booking => {
                const card = document.createElement('div');
                card.className = 'booking-card';
                card.innerHTML = `
                    <div class="booking-header">
                        <h3>${booking.title}</h3>
                        <span class="status ${booking.status}">${booking.status.toUpperCase()}</span>
                    </div>
                    <div class="booking-details">
                        <p><strong>From:</strong> ${booking.start_date}</p>
                        <p><strong>To:</strong> ${booking.end_date}</p>
                        <p><strong>Price:</strong> ₹${booking.total_price}</p>
                    </div>
                    <button class="btn btn-small btn-coral" onclick="viewBookingDetails(${booking.id})">View Details</button>
                `;
                grid.appendChild(card);
            });
        }
        return;
    }

    tbody.innerHTML = '';
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No bookings yet</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.title}</td>
            <td>${booking.start_date}</td>
            <td>${booking.end_date}</td>
            <td>₹${booking.total_price}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            if (status) {
                fetch(`fetch-bookings.php?status=${status}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            displayBookings(data.bookings || []);
                        }
                    })
                    .catch(err => console.error('Error:', err));
            } else {
                loadBookings();
            }
        });
    }
}

function viewBookingDetails(bookingId) {
    window.location.href = `booking-details.html?id=${bookingId}`;
}

function showError(message) {
    alert(message);
}
