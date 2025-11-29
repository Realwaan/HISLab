// ============================================
// DASHBOARD JAVASCRIPT
// ============================================

// API Configuration
const API_URL = 'http://localhost:3000/api';
const USE_API = false; // Set to false - only using MongoDB for login/signup

// Data Storage
let dashboardData = {
    patients: [],
    appointments: [],
    labRequests: [],
    tasks: [],
    activities: [],
    stats: {}
};

// Load data from API or localStorage
async function loadDataFromAPI() {
    if (!USE_API) {
        // Fallback to localStorage
        dashboardData.patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
        dashboardData.appointments = JSON.parse(localStorage.getItem('dashboard_appointments')) || [];
        dashboardData.tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
        return;
    }
    
    try {
        console.log('Loading data from MongoDB...');
        
        // Load all data in parallel
        const [patients, appointments, tasks, stats] = await Promise.all([
            api.getPatients().catch(() => []),
            api.getAppointments().catch(() => []),
            api.getTasks().catch(() => []),
            api.getStats().catch(() => ({}))
        ]);
        
        dashboardData.patients = patients;
        dashboardData.appointments = appointments;
        dashboardData.tasks = tasks;
        dashboardData.stats = stats;
        
        console.log('✅ Data loaded from MongoDB:', {
            patients: patients.length,
            appointments: appointments.length,
            tasks: tasks.length
        });
        
        // Also cache in localStorage as backup
        localStorage.setItem('clinikabayan_patients', JSON.stringify(patients));
        localStorage.setItem('dashboard_appointments', JSON.stringify(appointments));
        localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
        
    } catch (error) {
        console.error('Failed to load from API, using localStorage:', error);
        dashboardData.patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
        dashboardData.appointments = JSON.parse(localStorage.getItem('dashboard_appointments')) || [];
        dashboardData.tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
    }
}

// Initialize sample data (only if no data exists)
async function initializeSampleData() {
    // Check if we have data from API
    if (dashboardData.appointments.length === 0 && dashboardData.tasks.length === 0) {
        console.log('No data found, initializing sample data...');
        
        // Sample appointments
        const sampleAppointments = [
            { patientName: 'Maria Santos', time: '09:00 AM', type: 'Prenatal', date: new Date().toISOString().split('T')[0], status: 'Scheduled' },
            { patientName: 'Juan Reyes', time: '10:30 AM', type: 'Follow-up', date: new Date().toISOString().split('T')[0], status: 'Confirmed' },
            { patientName: 'Ana Lopez', time: '02:00 PM', type: 'Vaccination', date: new Date().toISOString().split('T')[0], status: 'Scheduled' }
        ];
        
        // Sample tasks
        const sampleTasks = [
            { title: 'Review patient records', priority: 'High', status: 'Pending', dueDate: new Date().toISOString() },
            { title: 'Update inventory list', priority: 'Medium', status: 'Pending', dueDate: new Date().toISOString() },
            { title: 'Submit monthly report', priority: 'Low', status: 'Completed', dueDate: new Date().toISOString() }
        ];
        
        if (USE_API) {
            try {
                // Save to MongoDB
                for (const apt of sampleAppointments) {
                    const saved = await api.createAppointment(apt);
                    dashboardData.appointments.push(saved);
                }
                for (const task of sampleTasks) {
                    const saved = await api.createTask(task);
                    dashboardData.tasks.push(saved);
                }
                console.log('✅ Sample data saved to MongoDB');
            } catch (error) {
                console.error('Failed to save sample data:', error);
            }
        } else {
            dashboardData.appointments = sampleAppointments;
            dashboardData.tasks = sampleTasks;
            localStorage.setItem('dashboard_appointments', JSON.stringify(dashboardData.appointments));
            localStorage.setItem('dashboard_tasks', JSON.stringify(dashboardData.tasks));
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Dashboard initializing...');
    checkAuth();
    await loadDataFromAPI();
    await initializeSampleData();
    initDashboard();
    setupEventListeners();
    createModals();
    updateDashboardStats();
    renderAppointments();
    renderTasks();
    console.log('Dashboard initialized successfully');
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

// Initialize dashboard
function initDashboard() {
    setCurrentDate();
    loadDashboardData();
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clockElement = document.querySelector('.ph-time');
    if (clockElement) {
        const now = new Date();
        const options = { 
            timeZone: 'Asia/Manila',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        };
        clockElement.textContent = now.toLocaleTimeString('en-US', options);
    }
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

// ============================================
// RENDER FUNCTIONS
// ============================================

function updateDashboardStats() {
    // Update KPI cards
    const totalPatients = dashboardData.patients.length;
    const todayAppointments = dashboardData.appointments.filter(a => a.status !== 'completed').length;
    const pendingLabs = dashboardData.labRequests.filter(l => l.status === 'pending').length;
    const completedToday = dashboardData.appointments.filter(a => a.status === 'completed').length;
    
    // Update stat values if elements exist
    document.querySelectorAll('.kpi-value').forEach((el, index) => {
        const values = [totalPatients, todayAppointments, pendingLabs, completedToday];
        if (values[index]) el.textContent = values[index];
    });
}

function renderAppointments() {
    const appointmentsList = document.querySelector('.appointments-list');
    if (!appointmentsList) return;
    
    if (dashboardData.appointments.length === 0) {
        appointmentsList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No appointments scheduled</p>';
        return;
    }
    
    appointmentsList.innerHTML = dashboardData.appointments.map(apt => {
        // Find patient ID by name
        const patient = dashboardData.patients.find(p => 
            `${p.firstName} ${p.lastName}` === apt.patient
        );
        const patientId = patient ? patient.id : null;
        
        return `
            <div class="appointment-item ${apt.status}">
                <div class="appointment-time">
                    <i class="fas fa-clock"></i>
                    <span>${apt.time}</span>
                </div>
                <div class="appointment-details">
                    <h5 class="${patientId ? 'clickable-patient' : ''}" ${patientId ? `onclick="viewPatientDetails('${patientId}')" style="cursor: pointer; color: var(--primary-color);"` : ''}>
                        ${apt.patient}
                        ${patientId ? '<i class="fas fa-external-link-alt" style="font-size: 11px; margin-left: 4px;"></i>' : ''}
                    </h5>
                    <p>${apt.type}</p>
                </div>
                <span class="appointment-status status-${apt.status}">${apt.status}</span>
            </div>
        `;
    }).join('');
}

function renderTasks() {
    const tasksList = document.querySelector('.tasks-list');
    if (!tasksList) return;
    
    tasksList.innerHTML = dashboardData.tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
            <div class="task-checkbox">
                <input type="checkbox" id="task${task.id}" ${task.completed ? 'checked' : ''} 
                    onclick="toggleTaskCompletion(${task.id})">
                <label for="task${task.id}"></label>
            </div>
            <div class="task-content">
                <p class="task-title">${task.title}</p>
                <p class="task-time"><i class="fas fa-clock"></i> ${formatTaskDate(task.dueDate)}</p>
            </div>
        </div>
    `).join('');
}

function formatTaskDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toggleTaskCompletion(taskId) {
    const task = dashboardData.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('dashboard_tasks', JSON.stringify(dashboardData.tasks));
        renderTasks();
        showNotification(task.completed ? 'Task completed!' : 'Task reopened', 'success');
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function createModals() {
    const modalsHTML = `
        <!-- Quick Patient Registration Modal -->
        <div id="quickPatientModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-user-plus"></i> Quick Patient Registration</h2>
                    <button class="btn-close" onclick="closeModal('quickPatientModal')">&times;</button>
                </div>
                <form id="quickPatientForm" onsubmit="saveQuickPatient(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Age *</label>
                                <input type="number" name="age" required min="0" max="150">
                            </div>
                            <div class="form-group">
                                <label>Gender *</label>
                                <select name="gender" required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Contact Number</label>
                            <input type="tel" name="phone" placeholder="+63">
                        </div>
                        <div class="form-group">
                            <label>Address *</label>
                            <input type="text" name="address" required placeholder="Barangay, City">
                        </div>
                        <div class="form-group">
                            <label>Reason for Visit *</label>
                            <textarea name="reason" required rows="3" placeholder="Brief description of symptoms or reason"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('quickPatientModal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Register Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- New Appointment Modal -->
        <div id="newAppointmentModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-calendar-plus"></i> Schedule Medical Appointment</h2>
                    <button class="btn-close" onclick="closeModal('newAppointmentModal')">&times;</button>
                </div>
                <form id="appointmentForm" onsubmit="saveAppointment(event)">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Patient Name <span class="required">*</span></label>
                            <input type="text" name="patient" required list="patientList" placeholder="Select or type patient name">
                            <datalist id="patientList">
                                ${dashboardData.patients.map(p => `<option value="${p.firstName} ${p.lastName}">`).join('')}
                            </datalist>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Date <span class="required">*</span></label>
                                <input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-group">
                                <label>Time <span class="required">*</span></label>
                                <input type="time" name="time" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Appointment Type <span class="required">*</span></label>
                            <select name="type" required>
                                <option value="">Select appointment type...</option>
                                <option value="General Checkup">🩺 General Checkup</option>
                                <option value="Follow-up">📋 Follow-up Visit</option>
                                <option value="Prenatal Care">🤰 Prenatal Care</option>
                                <option value="Vaccination">💉 Vaccination</option>
                                <option value="Consultation">💬 Consultation</option>
                                <option value="Laboratory">🔬 Laboratory Tests</option>
                                <option value="Emergency">🚨 Emergency Care</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Additional Notes <span class="required">*</span></label>
                            <textarea name="notes" rows="3" placeholder="Enter any special instructions, symptoms, or additional information..."></textarea>
                        </div>
                        <div class="info-badge">
                            <i class="fas fa-info-circle"></i>
                            <span>Please arrive 15 minutes before your scheduled appointment time.</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('newAppointmentModal')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-calendar-check"></i> Schedule Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Patients List Modal -->
        <div id="patientsListModal" class="modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-users"></i> All Registered Patients</h2>
                    <button class="btn-close" onclick="closeModal('patientsListModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="search-filter-bar">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="patientSearch" placeholder="Search by name, ID, or address..." onkeyup="filterPatientsList()">
                        </div>
                        <button class="btn btn-primary" onclick="closeModal('patientsListModal'); quickRegisterPatient();">
                            <i class="fas fa-user-plus"></i> Add New Patient
                        </button>
                    </div>
                    <div id="patientsListContainer" class="patients-grid">
                        <!-- Patients will be rendered here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('patientsListModal')">Close</button>
                </div>
            </div>
        </div>

        <!-- Patient Details Modal with Tabs -->
        <div id="patientDetailsModal" class="modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-user-circle"></i> Patient Information</h2>
                    <button class="btn-close" onclick="closeModal('patientDetailsModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="patient-tabs">
                        <button class="patient-tab-btn active" onclick="switchPatientTab('demographics')">
                            <i class="fas fa-id-card"></i> Demographics
                        </button>
                        <button class="patient-tab-btn" onclick="switchPatientTab('medical')">
                            <i class="fas fa-heartbeat"></i> Medical History
                        </button>
                        <button class="patient-tab-btn" onclick="switchPatientTab('appointments')">
                            <i class="fas fa-calendar-check"></i> Appointments
                        </button>
                        <button class="patient-tab-btn" onclick="switchPatientTab('vitals')">
                            <i class="fas fa-stethoscope"></i> Vital Signs
                        </button>
                        <button class="patient-tab-btn" onclick="switchPatientTab('billing')">
                            <i class="fas fa-file-invoice-dollar"></i> Billing
                        </button>
                    </div>
                    
                    <!-- Demographics Tab -->
                    <div id="demographics-tab" class="patient-tab-content active">
                        <div class="patient-info-grid">
                            <div class="info-card">
                                <label>Patient ID</label>
                                <p id="modal-patient-id">-</p>
                            </div>
                            <div class="info-card">
                                <label>Full Name</label>
                                <p id="modal-patient-name">-</p>
                            </div>
                            <div class="info-card">
                                <label>Age</label>
                                <p id="modal-patient-age">-</p>
                            </div>
                            <div class="info-card">
                                <label>Gender</label>
                                <p id="modal-patient-gender">-</p>
                            </div>
                            <div class="info-card">
                                <label>Date of Birth</label>
                                <p id="modal-patient-dob">-</p>
                            </div>
                            <div class="info-card">
                                <label>Blood Type</label>
                                <p id="modal-patient-blood">Not specified</p>
                            </div>
                            <div class="info-card full-width">
                                <label>Address</label>
                                <p id="modal-patient-address">-</p>
                            </div>
                            <div class="info-card">
                                <label>Contact Number</label>
                                <p id="modal-patient-phone">-</p>
                            </div>
                            <div class="info-card">
                                <label>Emergency Contact</label>
                                <p id="modal-patient-emergency">Not specified</p>
                            </div>
                            <div class="info-card full-width">
                                <label>Registration Date</label>
                                <p id="modal-patient-registered">-</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Medical History Tab -->
                    <div id="medical-tab" class="patient-tab-content">
                        <div class="medical-records">
                            <h4><i class="fas fa-clipboard-list"></i> Medical Conditions</h4>
                            <div id="medical-conditions" class="records-list">
                                <p class="no-data">No medical conditions recorded</p>
                            </div>
                            
                            <h4><i class="fas fa-pills"></i> Current Medications</h4>
                            <div id="current-medications" class="records-list">
                                <p class="no-data">No current medications</p>
                            </div>
                            
                            <h4><i class="fas fa-allergies"></i> Allergies</h4>
                            <div id="patient-allergies" class="records-list">
                                <p class="no-data">No known allergies</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Appointments Tab -->
                    <div id="appointments-tab" class="patient-tab-content">
                        <div class="appointments-history">
                            <h4><i class="fas fa-calendar-alt"></i> Appointment History</h4>
                            <div id="patient-appointments-list" class="records-list">
                                <p class="no-data">No appointments scheduled</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Vital Signs Tab -->
                    <div id="vitals-tab" class="patient-tab-content">
                        <div class="vitals-records">
                            <h4><i class="fas fa-heartbeat"></i> Recent Vital Signs</h4>
                            <div id="patient-vitals" class="vitals-grid">
                                <div class="vital-card">
                                    <i class="fas fa-thermometer-half"></i>
                                    <label>Temperature</label>
                                    <p class="vital-value">36.5°C</p>
                                    <span class="vital-status normal">Normal</span>
                                </div>
                                <div class="vital-card">
                                    <i class="fas fa-heartbeat"></i>
                                    <label>Blood Pressure</label>
                                    <p class="vital-value">120/80</p>
                                    <span class="vital-status normal">Normal</span>
                                </div>
                                <div class="vital-card">
                                    <i class="fas fa-heart"></i>
                                    <label>Heart Rate</label>
                                    <p class="vital-value">72 bpm</p>
                                    <span class="vital-status normal">Normal</span>
                                </div>
                                <div class="vital-card">
                                    <i class="fas fa-weight"></i>
                                    <label>Weight</label>
                                    <p class="vital-value">65 kg</p>
                                    <span class="vital-status normal">Normal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Billing Tab -->
                    <div id="billing-tab" class="patient-tab-content">
                        <div class="billing-records">
                            <h4><i class="fas fa-file-invoice"></i> Billing Summary</h4>
                            <div class="billing-stats">
                                <div class="billing-stat">
                                    <label>Total Charges</label>
                                    <p class="amount">₱0.00</p>
                                </div>
                                <div class="billing-stat">
                                    <label>Payments Made</label>
                                    <p class="amount paid">₱0.00</p>
                                </div>
                                <div class="billing-stat">
                                    <label>Outstanding Balance</label>
                                    <p class="amount outstanding">₱0.00</p>
                                </div>
                            </div>
                            <h4><i class="fas fa-history"></i> Transaction History</h4>
                            <div id="billing-history" class="records-list">
                                <p class="no-data">No billing records</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('patientDetailsModal')">Close</button>
                    <button type="button" class="btn btn-primary" onclick="editPatientInfo()">
                        <i class="fas fa-edit"></i> Edit Information
                    </button>
                </div>
            </div>
        </div>

        <!-- New Task Modal -->
        <div id="newTaskModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-clipboard-list"></i> Add Medical Task</h2>
                    <button class="btn-close" onclick="closeModal('newTaskModal')">&times;</button>
                </div>
                <form id="taskForm" onsubmit="saveTask(event)">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Task Description <span class="required">*</span></label>
                            <input type="text" name="title" required placeholder="Enter task description...">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Priority Level <span class="required">*</span></label>
                                <select name="priority" required>
                                    <option value="high">🔴 High Priority</option>
                                    <option value="medium" selected>🟡 Medium Priority</option>
                                    <option value="low">🟢 Low Priority</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Due Date <span class="required">*</span></label>
                                <input type="date" name="dueDate" required>
                            </div>
                        </div>
                        <div class="info-badge">
                            <i class="fas fa-info-circle"></i>
                            <span>Tasks help you track important activities and reminders.</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('newTaskModal')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-check"></i> Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Render patients list when opening patients modal
        if (modalId === 'patientsListModal') {
            renderPatientsList();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.add('closing');
        }
        modal.classList.add('closing');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            if (modalContent) {
                modalContent.classList.remove('closing');
            }
        }, 300);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalContent = event.target.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.add('closing');
        }
        event.target.classList.add('closing');
        event.target.classList.remove('show');
        setTimeout(() => {
            event.target.style.display = 'none';
            event.target.classList.remove('closing');
            if (modalContent) {
                modalContent.classList.remove('closing');
            }
        }, 300);
    }
});

// ============================================
// FORM SUBMISSION HANDLERS
// ============================================

async function saveQuickPatient(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newPatient = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        condition: formData.get('reason'),
        status: 'active'
    };
    
    try {
        if (USE_API) {
            showNotification('Registering patient...', 'info');
            const saved = await api.createPatient(newPatient);
            dashboardData.patients.push(saved);
            console.log('✅ Patient saved to MongoDB:', saved);
            
            // Add activity
            addActivity(`New patient registered: ${saved.firstName} ${saved.lastName}`, 'user-plus', 'success');
            
            form.reset();
            closeModal('quickPatientModal');
            updateDashboardStats();
            showNotification(`Patient ${saved.firstName} ${saved.lastName} registered successfully! ID: ${saved.patientId}`, 'success');
        } else {
            // Fallback to localStorage
            const currentPatients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
            let lastId = parseInt(localStorage.getItem('clinikabayan_lastPatientId') || '0');
            lastId++;
            
            newPatient.id = `CK-${new Date().getFullYear()}-${String(lastId).padStart(3, '0')}`;
            newPatient.lastVisit = new Date().toISOString().split('T')[0];
            newPatient.registeredDate = new Date().toISOString();
            
            currentPatients.push(newPatient);
            dashboardData.patients = currentPatients;
            localStorage.setItem('clinikabayan_patients', JSON.stringify(currentPatients));
            localStorage.setItem('clinikabayan_lastPatientId', lastId);
            
            // Add activity
            addActivity(`New patient registered: ${newPatient.firstName} ${newPatient.lastName}`, 'user-plus', 'success');
            
            form.reset();
            closeModal('quickPatientModal');
            updateDashboardStats();
            showNotification(`Patient ${newPatient.firstName} ${newPatient.lastName} registered successfully! ID: ${newPatient.id}`, 'success');
        }
    } catch (error) {
        console.error('Failed to register patient:', error);
        showNotification('Failed to register patient: ' + error.message, 'error');
    }
}

async function saveAppointment(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newAppointment = {
        patientName: formData.get('patient'),
        date: formData.get('date'),
        time: formData.get('time'),
        type: formData.get('type'),
        notes: formData.get('notes'),
        status: 'Scheduled'
    };
    
    try {
        if (USE_API) {
            showNotification('Saving appointment...', 'info');
            const saved = await api.createAppointment(newAppointment);
            dashboardData.appointments.push(saved);
            console.log('✅ Appointment saved to MongoDB:', saved);
        } else {
            newAppointment.id = dashboardData.appointments.length + 1;
            newAppointment.created = new Date().toISOString();
            dashboardData.appointments.push(newAppointment);
            localStorage.setItem('dashboard_appointments', JSON.stringify(dashboardData.appointments));
        }
        
        // Add activity
        addActivity(`Appointment scheduled for ${newAppointment.patientName}`, 'calendar-check', 'primary');
        
        form.reset();
        closeModal('newAppointmentModal');
        renderAppointments();
        updateDashboardStats();
        showNotification('Appointment scheduled successfully!', 'success');
    } catch (error) {
        console.error('Failed to save appointment:', error);
        showNotification('Failed to save appointment: ' + error.message, 'error');
    }
}

async function saveTask(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newTask = {
        title: formData.get('title'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate'),
        status: 'Pending',
        description: formData.get('description') || ''
    };
    
    try {
        if (USE_API) {
            showNotification('Saving task...', 'info');
            const saved = await api.createTask(newTask);
            dashboardData.tasks.push(saved);
            console.log('✅ Task saved to MongoDB:', saved);
        } else {
            newTask.id = dashboardData.tasks.length + 1;
            newTask.completed = false;
            newTask.created = new Date().toISOString();
            dashboardData.tasks.push(newTask);
            localStorage.setItem('dashboard_tasks', JSON.stringify(dashboardData.tasks));
        }
        
        form.reset();
        closeModal('newTaskModal');
        renderTasks();
        showNotification('Task added successfully!', 'success');
    } catch (error) {
        console.error('Failed to save task:', error);
        showNotification('Failed to save task: ' + error.message, 'error');
    }
}

function addActivity(description, icon, color) {
    const activities = JSON.parse(localStorage.getItem('dashboard_activities')) || [];
    activities.unshift({
        id: activities.length + 1,
        description,
        icon,
        color,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 activities
    if (activities.length > 50) activities.pop();
    
    localStorage.setItem('dashboard_activities', JSON.stringify(activities));
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// QUICK ACTIONS
// ============================================

function quickRegisterPatient() {
    openModal('quickPatientModal');
}

function scheduleAppointment() {
    openModal('newAppointmentModal');
}

function addTask() {
    openModal('newTaskModal');
}

function viewPatientDetails(patientId) {
    const patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }
    
    // Populate demographics tab
    document.getElementById('modal-patient-id').textContent = patient.id;
    document.getElementById('modal-patient-name').textContent = `${patient.firstName} ${patient.lastName}`;
    document.getElementById('modal-patient-age').textContent = `${patient.age} years old`;
    document.getElementById('modal-patient-gender').textContent = patient.gender;
    document.getElementById('modal-patient-address').textContent = patient.address || 'Not specified';
    document.getElementById('modal-patient-phone').textContent = patient.phone || 'Not specified';
    
    // Calculate DOB from age (approximate)
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - patient.age;
    document.getElementById('modal-patient-dob').textContent = `Approx. ${birthYear}`;
    
    // Registration date
    if (patient.registeredDate) {
        const regDate = new Date(patient.registeredDate);
        document.getElementById('modal-patient-registered').textContent = regDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }
    
    // Load patient appointments
    const appointments = dashboardData.appointments.filter(apt => 
        apt.patient.includes(patient.firstName) || apt.patient.includes(patient.lastName)
    );
    
    const appointmentsList = document.getElementById('patient-appointments-list');
    if (appointments.length > 0) {
        appointmentsList.innerHTML = appointments.map(apt => `
            <div class="record-item">
                <div class="record-icon ${apt.status}">
                    <i class="fas fa-calendar"></i>
                </div>
                <div class="record-content">
                    <h5>${apt.type}</h5>
                    <p>${apt.date} at ${apt.time}</p>
                    <span class="status-badge status-${apt.status}">${apt.status}</span>
                </div>
            </div>
        `).join('');
    } else {
        appointmentsList.innerHTML = '<p class="no-data">No appointments scheduled</p>';
    }
    
    // Medical history
    if (patient.condition) {
        document.getElementById('medical-conditions').innerHTML = `
            <div class="record-item">
                <div class="record-icon">
                    <i class="fas fa-notes-medical"></i>
                </div>
                <div class="record-content">
                    <h5>Current Condition</h5>
                    <p>${patient.condition}</p>
                </div>
            </div>
        `;
    }
    
    openModal('patientDetailsModal');
}

function switchPatientTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.patient-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.patient-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function editPatientInfo() {
    showNotification('Edit functionality coming soon!', 'info');
    // This would open an edit form modal in a full implementation
}

function renderPatientsList() {
    const patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
    const container = document.getElementById('patientsListContainer');
    
    if (!container) return;
    
    if (patients.length === 0) {
        container.innerHTML = `
            <div class="no-patients">
                <i class="fas fa-user-slash"></i>
                <h4>No Patients Registered</h4>
                <p>Click "Add New Patient" to register your first patient</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = patients.map(patient => `
        <div class="patient-card" onclick="closeModal('patientsListModal'); viewPatientDetails('${patient.id}');">
            <div class="patient-card-header">
                <div class="patient-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-card-info">
                    <h4>${patient.firstName} ${patient.lastName}</h4>
                    <p class="patient-id">${patient.id}</p>
                </div>
            </div>
            <div class="patient-card-details">
                <div class="detail-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${patient.age} years old</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-venus-mars"></i>
                    <span>${patient.gender}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${patient.address || 'No address'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${patient.phone || 'No phone'}</span>
                </div>
            </div>
            <div class="patient-card-footer">
                <span class="status-badge status-${patient.status || 'active'}">${patient.status || 'Active'}</span>
                <span class="last-visit">Last: ${patient.lastVisit || 'Never'}</span>
            </div>
        </div>
    `).join('');
}

function filterPatientsList() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
    const container = document.getElementById('patientsListContainer');
    
    if (!container) return;
    
    const filtered = patients.filter(patient => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const id = (patient.id || '').toLowerCase();
        const address = (patient.address || '').toLowerCase();
        
        return fullName.includes(searchTerm) || id.includes(searchTerm) || address.includes(searchTerm);
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-patients">
                <i class="fas fa-search"></i>
                <h4>No Patients Found</h4>
                <p>Try different search terms</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(patient => `
        <div class="patient-card" onclick="closeModal('patientsListModal'); viewPatientDetails('${patient.id}');">
            <div class="patient-card-header">
                <div class="patient-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-card-info">
                    <h4>${patient.firstName} ${patient.lastName}</h4>
                    <p class="patient-id">${patient.id}</p>
                </div>
            </div>
            <div class="patient-card-details">
                <div class="detail-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${patient.age} years old</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-venus-mars"></i>
                    <span>${patient.gender}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${patient.address || 'No address'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${patient.phone || 'No phone'}</span>
                </div>
            </div>
            <div class="patient-card-footer">
                <span class="status-badge status-${patient.status || 'active'}">${patient.status || 'Active'}</span>
                <span class="last-visit">Last: ${patient.lastVisit || 'Never'}</span>
            </div>
        </div>
    `).join('');
}

// Export functions for use in HTML onclick handlers
window.logout = logout;
window.DashboardUtils = DashboardUtils;
window.toggleTask = toggleTask;
window.addNewTask = addNewTask;
window.toggleTaskCompletion = toggleTaskCompletion;
window.quickRegisterPatient = quickRegisterPatient;
window.scheduleAppointment = scheduleAppointment;
window.addTask = addTask;
window.openModal = openModal;
window.closeModal = closeModal;
window.saveQuickPatient = saveQuickPatient;
window.saveAppointment = saveAppointment;
window.saveTask = saveTask;
window.toggleNotifications = toggleNotifications;
window.markAllAsRead = markAllAsRead;
window.viewPatientDetails = viewPatientDetails;
window.switchPatientTab = switchPatientTab;
window.editPatientInfo = editPatientInfo;
window.renderPatientsList = renderPatientsList;
window.filterPatientsList = filterPatientsList;

// Additional modal functions
window.closePendingRequests = closePendingRequests;
window.selectRequest = selectRequest;
window.processPendingRequest = processPendingRequest;
window.closeLabRequest = closeLabRequest;
window.addLabTest = addLabTest;
window.removeLabTest = removeLabTest;

// Lab Request action functions
window.saveLabRequestLater = saveLabRequestLater;
window.itemNotAvailable = itemNotAvailable;
window.requestPayment = requestPayment;
window.revokeTag = revokeTag;
window.proceedToTransactions = proceedToTransactions;
window.printLabRequest = printLabRequest;
window.openLabRequest = openLabRequest;

// Reset function to clear all patient data
window.resetAllPatients = function() {
    if (confirm('⚠️ This will DELETE all registered patients. Are you sure?')) {
        localStorage.removeItem('clinikabayan_patients');
        localStorage.removeItem('clinikabayan_lastPatientId');
        alert('✅ All patients have been reset. Page will reload.');
        location.reload();
    }
};

// Reset all dashboard data
window.resetAllData = function() {
    if (confirm('⚠️ This will DELETE ALL data (patients, appointments, tasks). Are you sure?')) {
        localStorage.removeItem('clinikabayan_patients');
        localStorage.removeItem('clinikabayan_lastPatientId');
        localStorage.removeItem('clinikabayan_appointments');
        localStorage.removeItem('clinikabayan_tasks');
        localStorage.removeItem('clinikabayan_supplies');
        localStorage.removeItem('clinikabayan_volunteers');
        alert('✅ All data has been reset. Page will reload.');
        location.reload();
    }
};

console.log('Dashboard functions exposed globally');
console.log('💡 To reset patients, run: resetAllPatients()');
console.log('💡 To reset all data, run: resetAllData()');
