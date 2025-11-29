// ============================================
// HEALTH CAMPAIGNS MODULE
// ============================================

// API Configuration
const USE_API = false; // Set to false - only using MongoDB for login/signup

// Data Storage
let campaigns = JSON.parse(localStorage.getItem('clinikabayan_campaigns') || '[]');

// Load data from API
async function loadCampaignDataFromAPI() {
    if (!USE_API || typeof api === 'undefined') return;
    
    try {
        console.log('Loading Campaign data from API...');
        
        // Load campaigns from API
        const apiCampaigns = await api.getCampaigns();
        if (apiCampaigns && apiCampaigns.length > 0) {
            campaigns = apiCampaigns;
            console.log('Loaded', campaigns.length, 'campaigns from API');
            renderCampaigns();
        }
        
    } catch (error) {
        console.error('Error loading campaign data from API:', error);
        // Fall back to localStorage
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePage();
    
    // Load data from API
    if (USE_API && typeof api !== 'undefined') {
        loadCampaignDataFromAPI();
    }
});

// Initialize page functionality
function initializePage() {
    setupTabs();
    setupParticipantForm();
    setupNewCampaignModal();
    loadUserInfo();
}

// Render campaigns from API data
function renderCampaigns() {
    // Find the campaigns container
    const campaignsGrid = document.querySelector('.campaigns-grid');
    if (!campaignsGrid || campaigns.length === 0) return;
    
    // Update existing campaign cards with API data
    console.log('Campaigns loaded:', campaigns.length);
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

function setupNewCampaignModal() {
    const btnNewCampaign = document.getElementById('btnNewCampaign');
    if (btnNewCampaign) {
        btnNewCampaign.addEventListener('click', function() {
            openNewCampaignModal();
        });
    }
}

function openNewCampaignModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('newCampaignModal');
    if (!modal) {
        const modalHTML = `
            <div id="newCampaignModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
                <div class="modal-content" style="background: white; border-radius: 16px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; color: #1B5E20;"><i class="fas fa-bullhorn"></i> Create New Campaign</h2>
                        <button onclick="closeNewCampaignModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                    </div>
                    <form id="newCampaignForm" onsubmit="submitNewCampaign(event)">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Campaign Name *</label>
                            <input type="text" name="name" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Campaign Type *</label>
                            <select name="type" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                                <option value="">Select Type</option>
                                <option value="vaccination">Vaccination Drive</option>
                                <option value="screening">Health Screening</option>
                                <option value="awareness">Awareness Campaign</option>
                                <option value="outreach">Community Outreach</option>
                            </select>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Start Date *</label>
                                <input type="date" name="startDate" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600;">End Date *</label>
                                <input type="date" name="endDate" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Location *</label>
                            <input type="text" name="location" required placeholder="Barangay, City" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Target Participants</label>
                            <input type="number" name="targetParticipants" value="100" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Description</label>
                            <textarea name="description" rows="3" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;"></textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 12px;">
                            <button type="button" onclick="closeNewCampaignModal()" style="padding: 12px 24px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">Cancel</button>
                            <button type="submit" style="padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; cursor: pointer;"><i class="fas fa-save"></i> Create Campaign</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('newCampaignModal');
    }
    
    modal.style.display = 'flex';
}

function closeNewCampaignModal() {
    const modal = document.getElementById('newCampaignModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function submitNewCampaign(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const campaignData = {
        name: formData.get('name'),
        type: formData.get('type'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        location: formData.get('location'),
        targetParticipants: parseInt(formData.get('targetParticipants')) || 100,
        currentParticipants: 0,
        description: formData.get('description'),
        status: 'upcoming'
    };
    
    // Save to API
    if (USE_API && typeof api !== 'undefined') {
        try {
            const result = await api.createCampaign(campaignData);
            console.log('Campaign saved to API:', result);
            showNotification('Campaign created successfully!', 'success');
        } catch (error) {
            console.error('Error saving campaign to API:', error);
            showNotification('Error saving campaign. Please try again.', 'danger');
        }
    } else {
        showNotification('Campaign created successfully!', 'success');
    }
    
    // Save to localStorage as backup
    campaigns.push(campaignData);
    localStorage.setItem('clinikabayan_campaigns', JSON.stringify(campaigns));
    
    closeNewCampaignModal();
    form.reset();
    
    // Reload campaign data
    if (USE_API && typeof api !== 'undefined') {
        loadCampaignDataFromAPI();
    }
}

// Export new functions
window.openNewCampaignModal = openNewCampaignModal;
window.closeNewCampaignModal = closeNewCampaignModal;
window.submitNewCampaign = submitNewCampaign;

document.getElementById('btnNewCampaign')?.addEventListener('click', function() {
    openNewCampaignModal();
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

// Export functions for use in HTML onclick handlers
window.logout = logout;
window.editCampaign = editCampaign;
window.viewCampaign = viewCampaign;
window.manageCampaign = manageCampaign;
window.viewReport = viewReport;
window.downloadReport = downloadReport;
window.addResource = addResource;
window.editResource = editResource;
window.showNotification = showNotification;
