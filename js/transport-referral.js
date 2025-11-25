// ============================================
// TRANSPORT & REFERRAL MODULE
// ============================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePage();
});

// Initialize page functionality
function initializePage() {
    setupTabs();
    setupFilters();
    setupSearch();
    loadUserInfo();
}

// ============================================
// TAB FUNCTIONALITY
// ============================================

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab content
            const tabName = button.getAttribute('data-tab');
            const tabContent = document.getElementById(tabName + 'Tab');
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================

function setupFilters() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter requests
            const status = button.getAttribute('data-status');
            filterRequests(status);
        });
    });
}

function filterRequests(status) {
    const requestCards = document.querySelectorAll('.request-card');
    
    requestCards.forEach(card => {
        if (status === 'all') {
            card.style.display = 'block';
        } else {
            const cardStatus = card.getAttribute('data-status');
            card.style.display = cardStatus === status ? 'block' : 'none';
        }
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function setupSearch() {
    const searchInput = document.getElementById('searchRequests');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const requestCards = document.querySelectorAll('.request-card');
            
            requestCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

// ============================================
// TRANSPORT REQUEST ACTIONS
// ============================================

function assignDriver(requestId) {
    // Show modal for driver assignment
    showNotification('Opening driver assignment for ' + requestId, 'info');
    
    // In a real application, this would open a modal with available drivers
    const drivers = [
        { id: 1, name: 'Pedro Garcia', vehicle: 'MB-2301', status: 'Available' },
        { id: 2, name: 'Jose Ramirez', vehicle: 'MB-2302', status: 'Available' },
        { id: 3, name: 'Maria Torres', vehicle: 'MB-2303', status: 'Available' }
    ];
    
    // Simulate assignment
    setTimeout(() => {
        showNotification('Driver successfully assigned to ' + requestId, 'success');
        // Update UI to reflect assignment
    }, 1000);
}

function viewDetails(requestId) {
    showNotification('Loading details for ' + requestId, 'info');
    // In a real application, this would open a modal with full request details
}

function startTransport(requestId) {
    if (confirm('Start transport for ' + requestId + '?')) {
        showNotification('Transport started for ' + requestId, 'success');
        // Update request status to "in-transit"
    }
}

function trackTransport(requestId) {
    showNotification('Opening live tracking for ' + requestId, 'info');
    // In a real application, this would open a map with GPS tracking
}

function completeTransport(requestId) {
    if (confirm('Mark transport ' + requestId + ' as completed?')) {
        showNotification('Transport completed successfully', 'success');
        // Update request status to "completed"
    }
}

// ============================================
// REFERRAL ACTIONS
// ============================================

function createReferral() {
    showNotification('Opening referral form', 'info');
    // In a real application, this would open a form to create a new referral
}

function editReferral(referralId) {
    showNotification('Opening referral ' + referralId + ' for editing', 'info');
    // In a real application, this would open the referral form with existing data
}

function viewReferral(referralId) {
    showNotification('Viewing referral ' + referralId, 'info');
    // In a real application, this would open a modal with referral details
}

function printReferral(referralId) {
    showNotification('Printing referral ' + referralId, 'info');
    // In a real application, this would generate a PDF and open print dialog
    window.print();
}

// ============================================
// VEHICLE ACTIONS
// ============================================

function addVehicle() {
    showNotification('Opening vehicle registration form', 'info');
    // In a real application, this would open a form to add a new vehicle
}

function assignToRequest(vehiclePlate) {
    showNotification('Assigning vehicle ' + vehiclePlate + ' to request', 'info');
    // In a real application, this would show available requests
}

function viewVehicle(vehiclePlate) {
    showNotification('Loading details for vehicle ' + vehiclePlate, 'info');
    // In a real application, this would open a modal with vehicle details
}

function trackVehicle(vehiclePlate) {
    showNotification('Opening live tracking for ' + vehiclePlate, 'info');
    // In a real application, this would open a map with GPS tracking
}

// ============================================
// HISTORY ACTIONS
// ============================================

function filterHistory() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    showNotification('Filtering history from ' + dateFrom + ' to ' + dateTo, 'info');
    // In a real application, this would fetch and display filtered data
}

// ============================================
// NEW REQUEST
// ============================================

document.getElementById('btnNewRequest')?.addEventListener('click', function() {
    showNotification('Opening new transport request form', 'info');
    // In a real application, this would open a form to create a new transport request
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'danger' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function loadUserInfo() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userData.name) {
        userNameElement.textContent = userData.name;
    }
}

function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log('Transport checkAuth - isAuthenticated:', isAuthenticated);
    console.log('All localStorage:', localStorage);
    if (!isAuthenticated) {
        console.log('NOT AUTHENTICATED - Redirecting to login');
        window.location.href = '../index.html';
    } else {
        console.log('AUTHENTICATED - Staying on page');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        window.location.href = '../index.html';
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
