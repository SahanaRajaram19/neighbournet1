document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('itemSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const conditionFilter = document.getElementById('conditionFilter');
    const itemsTableBody = document.querySelector('.item-table tbody');

    // Fetch items from the backend
    async function fetchItems() {
        try {
            const response = await fetch('/api/items');
            const items = await response.json();
            renderItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    // Render items in the table
    function renderItems(items) {
        itemsTableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="item-info">
                        <img src="${item.imageUrl}" alt="${item.title}" class="item-image">
                        <div class="item-details">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${item.ownerName}</strong>
                        <p>ID: #${item.id}</p>
                    </div>
                </td>
                <td>
                    <span class="category-badge">${item.category}</span>
                </td>
                <td>
                    <div class="price-highlight">
                        ₹${item.price} <span style="font-size: 0.8em; color: #666;">/ day</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span>
                </td>
                <td>
                    <span class="status-badge status-${item.condition.toLowerCase()}">${item.condition}</span>
                </td>
                <td>
                    <div>
                        <p><strong>${item.totalBookings}</strong> Total</p>
                        <p><strong>${item.rating}★</strong> Rating</p>
                    </div>
                </td>
                <td>
                    <div>
                        <p>${new Date(item.dateAdded).toLocaleDateString()}</p>
                        <small>${item.daysAgo} days ago</small>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" title="Edit Item" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon approve" title="Approve Item" data-id="${item.id}"><i class="fas fa-check"></i></button>
                        <button class="btn-icon delete" title="Delete Item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            itemsTableBody.appendChild(row);
        });
    }

    // Search and filter functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterItems(searchTerm, categoryFilter.value, statusFilter.value, conditionFilter.value);
    });

    categoryFilter.addEventListener('change', function() {
        filterItems(searchInput.value.toLowerCase(), this.value, statusFilter.value, conditionFilter.value);
    });

    statusFilter.addEventListener('change', function() {
        filterItems(searchInput.value.toLowerCase(), categoryFilter.value, this.value, conditionFilter.value);
    });

    conditionFilter.addEventListener('change', function() {
        filterItems(searchInput.value.toLowerCase(), categoryFilter.value, statusFilter.value, this.value);
    });

    function filterItems(searchTerm, categoryFilter, statusFilter, conditionFilter) {
        const rows = itemsTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const itemName = row.querySelector('.item-details h4').textContent.toLowerCase();
            const itemDesc = row.querySelector('.item-details p').textContent.toLowerCase();
            const category = row.querySelector('.category-badge').textContent.toLowerCase();
            const status = row.querySelector('.status-badge').textContent.toLowerCase();
            const condition = row.querySelector('.status-badge:last-child').textContent.toLowerCase();

            const shouldShow =
                (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) &&
                (categoryFilter === '' || category.includes(categoryFilter)) &&
                (statusFilter === '' || status.includes(statusFilter)) &&
                (conditionFilter === '' || condition.includes(conditionFilter));

            row.style.display = shouldShow ? '' : 'none';
        });
    }

    // Action button handlers
    itemsTableBody.addEventListener('click', function(event) {
        const button = event.target.closest('.btn-icon');
        if (!button) return;

        const itemId = button.getAttribute('data-id');
        if (button.classList.contains('edit')) {
            alert('Edit item: ' + itemId);
            // Implement edit item functionality
        } else if (button.classList.contains('approve')) {
            alert('Approve item: ' + itemId);
            // Implement approve item functionality
        } else if (button.classList.contains('delete')) {
            if (confirm(`Are you sure you want to delete item: ${itemId}?`)) {
                alert('Delete item: ' + itemId);
                // Implement delete functionality
            }
        }
    });

    // Initial fetch of items
    fetchItems();
});