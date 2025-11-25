// ============================================
// DASHBOARD JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Initialize dashboard
    initDashboard();
    
    // Setup event listeners
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = '../index.html';
        return;
    }
    
    // Set user info
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.name) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('welcomeName').textContent = userData.name;
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

// Toggle notifications dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close notifications when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationsDropdown');
    const btn = document.querySelector('.btn-notifications');
    
    if (dropdown && !dropdown.contains(event.target) && !btn.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Mark all notifications as read
function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // Update badge count
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
    
    showNotification('All notifications marked as read', 'success');
}

// Logout function
function initDashboard() {
    // Set current date
    setCurrentDate();
    
    // Load dashboard data (in real app, this would be from API)
    loadDashboardData();
}

// Set current date
function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    dateElement.textContent = currentDate;
}

// Load dashboard data
function loadDashboardData() {
    // In a real application, this would fetch data from an API
    console.log('Dashboard data loaded');
    
    // Simulate real-time updates
    simulateRealTimeUpdates();
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Update KPI values periodically (for demo purposes)
    setInterval(() => {
        updateKPIValues();
    }, 30000); // Update every 30 seconds
}

// Update KPI values
function updateKPIValues() {
    // This would normally fetch new data from the server
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(kpi => {
        // Add a subtle animation to show update
        kpi.style.transform = 'scale(1.05)';
        setTimeout(() => {
            kpi.style.transform = 'scale(1)';
        }, 200);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            handleSearch(e.target.value);
        });
    }
    
    // Notifications button
    const notificationsBtn = document.querySelector('.btn-notifications');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showNotificationsModal();
        });
    }
    
    // View all notifications button
    const viewAllBtn = document.querySelector('.btn-view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showAllNotifications();
        });
    }
}

// Handle search
function handleSearch(query) {
    if (query.length < 3) return;
    
    console.log('Searching for:', query);
    // In real app, this would search the database
    // and display results in a dropdown
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        window.location.href = '../index.html';
    }
}

// Show notifications modal
function showNotificationsModal() {
    // In real app, this would open a modal with all notifications
    console.log('Show notifications modal');
}

// Show all notifications page
function showAllNotifications() {
    // Navigate to notifications page
    console.log('Navigate to all notifications');
}

// Utility functions for dashboard updates
const DashboardUtils = {
    // Format numbers with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Calculate percentage change
    calculateChange: function(current, previous) {
        return ((current - previous) / previous * 100).toFixed(1);
    },
    
    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },
    
    // Format time ago
    timeAgo: function(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        
        return Math.floor(seconds) + " seconds ago";
    }
};

// ============================================
// PENDING REQUESTS MODAL
// ============================================

// Show pending requests modal (randomly appears for medical staff)
function showPendingRequests() {
    const modal = document.getElementById('pendingRequestsModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
    }
}

// Close pending requests modal
function closePendingRequests() {
    const modal = document.getElementById('pendingRequestsModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Select a request row
function selectRequest(row) {
    // Remove previous selection
    const allRows = document.querySelectorAll('.pending-table tbody tr');
    allRows.forEach(r => r.classList.remove('selected'));
    
    // Add selection to clicked row
    row.classList.add('selected');
}

// Process pending request - Opens Lab Request Modal
function processPendingRequest() {
    const selectedRow = document.querySelector('.pending-table tbody tr.selected');
    
    if (!selectedRow) {
        showNotification('Please select a request from the table', 'error');
        return;
    }
    
    const patientName = selectedRow.cells[0].textContent;
    const typeReqDT = selectedRow.cells[1].textContent;
    const reqNo = selectedRow.cells[2].textContent;
    const acctNo = selectedRow.cells[3].textContent;
    
    // Populate Lab Request Modal with selected patient data
    document.getElementById('labPatientName').textContent = patientName;
    document.getElementById('labReqCode').textContent = reqNo;
    
    // Close pending requests modal
    closePendingRequests();
    
    // Open Lab Request Items/Services modal
    openLabRequest();
}

// Open Laboratory Request Modal
function openLabRequest() {
    const modal = document.getElementById('labRequestModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
    }
}

// Close Laboratory Request Modal
function closeLabRequest() {
    const modal = document.getElementById('labRequestModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Laboratory Request Functions
function addLabTest() {
    showNotification('Add test functionality - would open test catalog', 'info');
}

function removeLabTest(button) {
    if (confirm('Remove this test from the request?')) {
        const row = button.closest('tr');
        row.remove();
        showNotification('Test removed from request', 'success');
    }
}

function saveLabRequestLater() {
    showNotification('Laboratory request saved for later', 'success');
    closeLabRequest();
}

function itemNotAvailable() {
    if (confirm('Mark selected items as not available?')) {
        showNotification('Items marked as not available', 'warning');
    }
}

function requestPayment() {
    showNotification('Payment request sent to billing department', 'success');
}

function revokeTag() {
    if (confirm('Revoke tag from selected items?')) {
        showNotification('Tag revoked successfully', 'success');
    }
}

function proceedToTransactions() {
    if (confirm('Proceed to transactions? This will finalize the laboratory request.')) {
        showNotification('Processing laboratory request...', 'info');
        setTimeout(() => {
            showNotification('Laboratory request processed successfully!', 'success');
            closeLabRequest();
            
            // Remove the processed request from pending list
            const selectedRow = document.querySelector('.pending-table tbody tr.selected');
            if (selectedRow) {
                selectedRow.remove();
                const remainingCount = document.querySelectorAll('.pending-table tbody tr').length;
                document.getElementById('pendingCount').textContent = remainingCount;
            }
        }, 1500);
    }
}

function printLabRequest() {
    showNotification('Preparing laboratory request for printing...', 'info');
    setTimeout(() => {
        window.print();
    }, 500);
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 11000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// TASK MANAGEMENT
// ============================================

// Toggle task completion
function toggleTask(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    if (checkbox.checked) {
        taskItem.classList.add('completed');
        showNotificationToast('Task completed!', 'success');
    } else {
        taskItem.classList.remove('completed');
    }
}

// Add new task
function addNewTask() {
    const taskTitle = prompt('Enter task description:');
    if (!taskTitle) return;
    
    const priority = prompt('Enter priority (high/medium/low):', 'medium');
    const dueDate = prompt('Enter due date/time:', 'This week');
    
    if (taskTitle) {
        const tasksList = document.querySelector('.tasks-list');
        const taskCount = tasksList.children.length + 1;
        
        const newTask = document.createElement('div');
        newTask.className = `task-item priority-${priority || 'medium'}`;
        newTask.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="task${taskCount}" onclick="toggleTask(this)">
                <label for="task${taskCount}"></label>
            </div>
            <div class="task-content">
                <p class="task-title">${taskTitle}</p>
                <p class="task-time"><i class="fas fa-clock"></i> ${dueDate || 'This week'}</p>
            </div>
        `;
        
        tasksList.appendChild(newTask);
        showNotificationToast('Task added successfully!', 'success');
    }
}

// ============================================
// WIDGET UPDATES
// ============================================

// Update quick stats periodically
function updateQuickStats() {
    // Simulate real-time data updates
    const stats = {
        patients: Math.floor(Math.random() * 10) + 25,
        appointments: Math.floor(Math.random() * 5) + 10,
        volunteers: Math.floor(Math.random() * 3) + 13
    };
    
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
        statValues[0].textContent = stats.patients;
        statValues[1].textContent = stats.appointments;
        statValues[2].textContent = stats.volunteers;
    }
}

// Update weather information
function updateWeather() {
    // Simulate weather updates
    const temps = [27, 28, 29, 30, 31];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear'];
    const humidity = [70, 72, 75, 78, 80];
    
    const temp = temps[Math.floor(Math.random() * temps.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const hum = humidity[Math.floor(Math.random() * humidity.length)];
    
    const tempValue = document.querySelector('.temp-value');
    const weatherCondition = document.querySelector('.weather-condition');
    const weatherInfo = document.querySelector('.weather-info-row');
    
    if (tempValue) tempValue.textContent = temp + '°';
    if (weatherCondition) weatherCondition.textContent = condition;
    if (weatherInfo) {
        weatherInfo.innerHTML = `
            <span><i class="fas fa-tint"></i> Humidity: ${hum}%</span>
            <span><i class="fas fa-wind"></i> Wind: ${Math.floor(Math.random() * 5) + 10} km/h</span>
        `;
    }
}

// Refresh widgets periodically
setInterval(updateQuickStats, 30000); // Update every 30 seconds
setInterval(updateWeather, 60000); // Update every minute

// Export functions for use in other modules
window.logout = logout;
window.DashboardUtils = DashboardUtils;
window.toggleTask = toggleTask;
window.addNewTask = addNewTask;
