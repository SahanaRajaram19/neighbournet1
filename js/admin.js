// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadAllData();
});

// Load Dashboard Statistics
function loadDashboardStats() {
    fetch('get-stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayStats(data.stats);
            }
        })
        .catch(err => console.error('Error loading stats:', err));
}

function displayStats(stats) {
    // Update stat cards
    document.getElementById('totalUsers').textContent = stats.total_users || 0;
    document.getElementById('totalItems').textContent = stats.total_items || 0;
    document.getElementById('availableItems').textContent = stats.available_items || 0;
    document.getElementById('totalBookings').textContent = stats.total_bookings || 0;
    document.getElementById('pendingBookings').textContent = stats.pending_bookings || 0;
    document.getElementById('openTickets').textContent = stats.open_tickets || 0;
}

// Load All Users
function loadAllUsers() {
    fetch('fetch-users.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayUsers(data.users || []);
            }
        })
        .catch(err => console.error('Error:', err));
}

function displayUsers(users) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.full_name}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Load All Items
function loadAllItems() {
    fetch('fetch-items.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAdminItems(data.items || []);
            }
        })
        .catch(err => console.error('Error:', err));
}

function displayAdminItems(items) {
    const tbody = document.querySelector('#itemsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No items found</td></tr>';
        return;
    }

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>₹${item.price}</td>
            <td><span class="status-badge status-${item.status}">${item.status}</span></td>
            <td>${item.condition}</td>
            <td>
                <button class="btn-small" onclick="editItem(${item.id})">Edit</button>
                <button class="btn-small" onclick="deleteItemAdmin(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load All Transactions
function loadAllTransactions() {
    fetch('fetch-transactions.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTransactions(data.transactions || []);
            }
        })
        .catch(err => console.error('Error:', err));
}

function displayTransactions(transactions) {
    const tbody = document.querySelector('#transactionsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No transactions found</td></tr>';
        return;
    }

    transactions.forEach(txn => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${txn.title}</td>
            <td>${txn.full_name}</td>
            <td>${txn.start_date} to ${txn.end_date}</td>
            <td>₹${txn.total_price}</td>
            <td><span class="status-badge status-${txn.status}">${txn.status}</span></td>
            <td>
                <button class="btn-small" onclick="updateTransactionStatus(${txn.id})">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load Support Tickets
function loadAllSupportTickets() {
    fetch('fetch-support.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displaySupportTickets(data.tickets || []);
            }
        })
        .catch(err => console.error('Error:', err));
}

function displaySupportTickets(tickets) {
    const tbody = document.querySelector('#supportTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (tickets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No tickets found</td></tr>';
        return;
    }

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.subject}</td>
            <td>${ticket.message.substring(0, 50)}...</td>
            <td><span class="status-badge status-${ticket.status}">${ticket.status}</span></td>
            <td>${ticket.priority}</td>
            <td>
                <button class="btn-small" onclick="viewTicket(${ticket.id})">View</button>
                <button class="btn-small" onclick="updateTicketStatus(${ticket.id})">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected tab
    const activeTab = document.getElementById(tabName + '-tab');
    if (activeTab) {
        activeTab.style.display = 'block';
    }

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Load data
    if (tabName === 'users') loadAllUsers();
    if (tabName === 'items') loadAllItems();
    if (tabName === 'transactions') loadAllTransactions();
    if (tabName === 'support') loadAllSupportTickets();
}

// Helper functions
function editItem(itemId) {
    window.location.href = `update-item.php?id=${itemId}`;
}

function deleteItemAdmin(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`delete-item.php?id=${itemId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Item deleted successfully');
                    loadAllItems();
                } else {
                    alert('Error deleting item');
                }
            })
            .catch(err => alert('Error: ' + err));
    }
}

function updateTransactionStatus(txnId) {
    const newStatus = prompt('Enter new status (pending/confirmed/in_progress/completed/cancelled)');
    if (newStatus) {
        // Update status
        alert('Status updated (this would call an API)');
        loadAllTransactions();
    }
}

function updateTicketStatus(ticketId) {
    const newStatus = prompt('Enter new status (open/in_progress/resolved/closed)');
    if (newStatus) {
        // Update status
        alert('Status updated (this would call an API)');
        loadAllSupportTickets();
    }
}

function viewTicket(ticketId) {
    alert('View ticket functionality');
}

function loadAllData() {
    loadAllUsers();
}
