// ============================================
// HEALTH CAMPAIGNS MODULE
// ============================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePage();
});

// Initialize page functionality
function initializePage() {
    setupTabs();
    setupParticipantForm();
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
// CAMPAIGN ACTIONS
// ============================================

function editCampaign(campaignId) {
    showNotification('Opening campaign ' + campaignId + ' for editing', 'info');
    // In a real application, this would open a form with campaign data
}

function viewCampaign(campaignId) {
    showNotification('Loading campaign details for ' + campaignId, 'info');
    // In a real application, this would open a modal with full campaign details
}

function manageCampaign(campaignId) {
    showNotification('Opening campaign management for ' + campaignId, 'info');
    // In a real application, this would open campaign management interface
}

function viewReport(campaignId) {
    showNotification('Loading report for ' + campaignId, 'info');
    // In a real application, this would open a detailed campaign report
}

function downloadReport(campaignId) {
    showNotification('Downloading report for ' + campaignId, 'success');
    // In a real application, this would generate and download PDF report
}

// ============================================
// RESOURCE ACTIONS
// ============================================

function addResource(type) {
    const typeLabels = {
        'medical': 'Medical Supply',
        'personnel': 'Personnel',
        'equipment': 'Equipment'
    };
    
    showNotification('Opening form to add ' + typeLabels[type], 'info');
    // In a real application, this would open a form to add resources
}

// ============================================
// PARTICIPANT REGISTRATION
// ============================================

function setupParticipantForm() {
    const form = document.getElementById('participantForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            
            // Simulate registration
            showNotification('Registering participant...', 'info');
            
            setTimeout(() => {
                showNotification('Participant registered successfully!', 'success');
                form.reset();
                
                // Update participant count (simulate)
                updateParticipantCount();
            }, 1000);
        });
    }
}

function updateParticipantCount() {
    // Simulate updating participant count
    const countElement = document.querySelector('.stat-value');
    if (countElement) {
        const currentText = countElement.textContent;
        const match = currentText.match(/(\d+) \/ (\d+)/);
        if (match) {
            const current = parseInt(match[1]);
            const target = parseInt(match[2]);
            const newCount = current + 1;
            countElement.textContent = newCount + ' / ' + target;
            
            // Update progress bar
            const percentage = (newCount / target) * 100;
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = percentage + '%';
            }
            
            // Update percentage label
            const statLabel = document.querySelector('.stat-label');
            if (statLabel) {
                statLabel.textContent = Math.round(percentage) + '% of target reached';
            }
        }
    }
}

// ============================================
// NEW CAMPAIGN
// ============================================

document.getElementById('btnNewCampaign')?.addEventListener('click', function() {
    showNotification('Opening new campaign form', 'info');
    // In a real application, this would open a comprehensive form to create a new campaign
    // including: name, type, date, location, target participants, required resources, etc.
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
    if (!isAuthenticated) {
        window.location.href = '../index.html';
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
