// ============================================
// TRANSPORT & REFERRAL MODULE
// ============================================

// Data Storage
let transportRequests = JSON.parse(localStorage.getItem('transportRequests') || '[]');
let referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
let vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');

// Initialize default data if empty
if (transportRequests.length === 0) {
    transportRequests = [
        {
            id: 'TR-2025-001',
            patientName: 'Maria Santos',
            age: 67,
            gender: 'Female',
            from: 'Barangay San Isidro Health Center',
            to: 'Cebu Provincial Hospital',
            reason: 'Severe chest pain, possible cardiac event',
            priority: 'HIGH',
            status: 'pending',
            requested: '2025-11-25T14:30:00',
            driver: null,
            vehicle: null
        },
        {
            id: 'TR-2025-002',
            patientName: 'Juan Dela Cruz',
            age: 45,
            gender: 'Male',
            from: 'Clinikabayan Mobile Unit - Talisay',
            to: 'Vicente Sotto Memorial Medical Center',
            reason: 'Diabetes management, require specialist consultation',
            priority: 'MEDIUM',
            status: 'assigned',
            requested: '2025-11-25T16:00:00',
            driver: 'Pedro Garcia',
            vehicle: 'MB-2301'
        },
        {
            id: 'TR-2025-003',
            patientName: 'Ana Reyes',
            age: 32,
            gender: 'Female',
            from: 'Barangay Pardo Health Center',
            to: 'Cebu City Medical Center',
            reason: 'Prenatal emergency',
            priority: 'HIGH',
            status: 'in-transit',
            requested: '2025-11-25T17:15:00',
            driver: 'Jose Ramirez',
            vehicle: 'MB-2302',
            eta: '15 mins'
        }
    ];
    localStorage.setItem('transportRequests', JSON.stringify(transportRequests));
}

if (vehicles.length === 0) {
    vehicles = [
        {
            plate: 'MB-2301',
            name: 'Ambulance Unit 1',
            type: 'ambulance',
            driver: 'Pedro Garcia',
            phone: '+63 912 345 6789',
            fuel: 85,
            status: 'available',
            location: 'Cebu City'
        },
        {
            plate: 'MB-2302',
            name: 'Ambulance Unit 2',
            type: 'ambulance',
            driver: 'Jose Ramirez',
            phone: '+63 917 654 3210',
            fuel: 62,
            status: 'in-use',
            assignedTo: 'TR-2025-003'
        },
        {
            plate: 'MB-2303',
            name: 'Mobile Unit Van',
            type: 'van',
            driver: 'Maria Torres',
            phone: '+63 919 876 5432',
            fuel: 45,
            status: 'maintenance',
            returnDate: '2025-11-27'
        }
    ];
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePage();
    setupNewRequestButton();
});

// Initialize page functionality
function initializePage() {
    console.log('Initializing Transport & Referral page...');
    setupTabs();
    setupFilters();
    setupSearch();
    loadUserInfo();
    createModals();
    renderRequests();
    renderVehicles();
    console.log('Page initialized successfully');
}

// Setup New Request Button
function setupNewRequestButton() {
    const btnNewRequest = document.getElementById('btnNewRequest');
    if (btnNewRequest) {
        btnNewRequest.addEventListener('click', function() {
            console.log('New Request button clicked');
            openModal('newRequestModal');
        });
        console.log('New Request button handler attached');
    } else {
        console.error('btnNewRequest not found!');
    }
}

// ============================================
// TAB FUNCTIONALITY
// ============================================

// Global function for switching tabs - called by onclick
function switchTransportTab(tabName) {
    // Remove active from all buttons
    var buttons = document.querySelectorAll('.transport-tab-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // Remove active from all tab contents
    var contents = document.querySelectorAll('.transport-tab-content');
    for (var j = 0; j < contents.length; j++) {
        contents[j].classList.remove('active');
    }
    
    // Activate the clicked button based on tabName
    for (var k = 0; k < buttons.length; k++) {
        var btn = buttons[k];
        var onclickStr = btn.getAttribute('onclick') || '';
        if (onclickStr.indexOf(tabName) !== -1) {
            btn.classList.add('active');
        }
    }
    
    // Show corresponding tab content
    var tabContent = document.getElementById(tabName + '-tab');
    if (tabContent) {
        tabContent.classList.add('active');
        
        // Trigger rendering for specific tabs
        if (tabName === 'referrals' && typeof renderReferrals === 'function') {
            renderReferrals();
        } else if (tabName === 'vehicles' && typeof renderVehicles === 'function') {
            renderVehicles();
        } else if (tabName === 'history' && typeof renderHistory === 'function') {
            renderHistory();
        }
    }
}

// Make function globally accessible
window.switchTransportTab = switchTransportTab;

// Setup Tabs (keeping for backward compatibility)
function setupTabs() {
    console.log('Transport tabs initialized');
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
            renderRequests(status);
        });
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
            
            if (!searchTerm) {
                renderRequests();
                return;
            }
            
            const filtered = transportRequests.filter(request => {
                return request.patientName.toLowerCase().includes(searchTerm) ||
                       request.id.toLowerCase().includes(searchTerm) ||
                       request.from.toLowerCase().includes(searchTerm) ||
                       request.to.toLowerCase().includes(searchTerm) ||
                       request.reason.toLowerCase().includes(searchTerm);
            });
            
            const grid = document.querySelector('.requests-grid');
            if (!grid) return;
            
            if (filtered.length === 0) {
                grid.innerHTML = '<p class="text-secondary">No requests found matching your search.</p>';
                return;
            }
            
            // Temporarily override transportRequests for rendering
            const original = transportRequests;
            transportRequests = filtered;
            renderRequests();
            transportRequests = original;
        });
    }
}

// ============================================
// TRANSPORT REQUEST ACTIONS
// ============================================

function openAssignDriverModal(requestId) {
    console.log('Opening assign driver modal for:', requestId);
    const request = transportRequests.find(r => r.id === requestId);
    if (!request) {
        console.error('Request not found:', requestId);
        showNotification('Request not found!', 'danger');
        return;
    }
    
    const availableVehicles = vehicles.filter(v => v.status === 'available');
    console.log('Available vehicles:', availableVehicles.length);
    
    const content = document.getElementById('assignDriverContent');
    if (!content) {
        console.error('assignDriverContent element not found!');
        showNotification('Modal content not found!', 'danger');
        return;
    }
    
    content.innerHTML = `
        <div class="assign-info">
            <h4>Request: #${requestId}</h4>
            <p><strong>Patient:</strong> ${request.patientName}</p>
            <p><strong>From:</strong> ${request.from}</p>
            <p><strong>To:</strong> ${request.to}</p>
            <p><strong>Priority:</strong> <span class="priority-${request.priority.toLowerCase()}">${request.priority}</span></p>
        </div>
        <hr>
        <h4>Available Vehicles:</h4>
        ${availableVehicles.length === 0 ? '<p class="text-secondary">No vehicles currently available</p>' : ''}
        <div class="vehicle-selection">
            ${availableVehicles.map(vehicle => `
                <div class="vehicle-option" onclick="confirmAssignment('${requestId}', '${vehicle.plate}', '${vehicle.driver}')">
                    <div class="vehicle-option-icon">
                        <i class="fas fa-${vehicle.type === 'ambulance' ? 'ambulance' : 'van-shuttle'}"></i>
                    </div>
                    <div class="vehicle-option-info">
                        <h5>${vehicle.name} - ${vehicle.plate}</h5>
                        <p><i class="fas fa-user"></i> ${vehicle.driver}</p>
                        <p><i class="fas fa-phone"></i> ${vehicle.phone}</p>
                        <p><i class="fas fa-gas-pump"></i> Fuel: ${vehicle.fuel}%</p>
                    </div>
                    <div class="vehicle-option-action">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    openModal('assignDriverModal');
}

function confirmAssignment(requestId, vehiclePlate, driverName) {
    // Update request
    const request = transportRequests.find(r => r.id === requestId);
    request.status = 'assigned';
    request.driver = driverName;
    request.vehicle = vehiclePlate;
    
    // Update vehicle
    const vehicle = vehicles.find(v => v.plate === vehiclePlate);
    vehicle.status = 'assigned';
    vehicle.assignedTo = requestId;
    
    // Save changes
    localStorage.setItem('transportRequests', JSON.stringify(transportRequests));
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    
    // Update UI
    renderRequests();
    renderVehicles();
    closeModal('assignDriverModal');
    showNotification(`Driver ${driverName} assigned successfully!`, 'success');
}

function viewDetails(requestId) {
    console.log('Viewing details for:', requestId);
    const request = transportRequests.find(r => r.id === requestId);
    if (!request) {
        console.error('Request not found:', requestId);
        showNotification('Request not found!', 'danger');
        return;
    }
    
    const content = document.getElementById('detailsContent');
    if (!content) {
        console.error('detailsContent element not found!');
        showNotification('Modal content not found!', 'danger');
        return;
    }
    
    content.innerHTML = `
        <div class="details-grid">
            <div class="details-section">
                <h3><i class="fas fa-info-circle"></i> Request Information</h3>
                <div class="details-table">
                    <div class="detail-row">
                        <span class="detail-label">Request ID:</span>
                        <span class="detail-value"><strong>#${request.id}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value"><span class="status-badge status-${request.status}">${formatStatus(request.status)}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Priority:</span>
                        <span class="detail-value"><span class="priority-${request.priority.toLowerCase()}">${request.priority}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Requested:</span>
                        <span class="detail-value">${formatDateTime(request.requested)}</span>
                    </div>
                </div>
            </div>
            
            <div class="details-section">
                <h3><i class="fas fa-user-injured"></i> Patient Information</h3>
                <div class="details-table">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${request.patientName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${request.age} years old</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${request.gender}</span>
                    </div>
                </div>
            </div>
            
            <div class="details-section">
                <h3><i class="fas fa-route"></i> Transport Details</h3>
                <div class="details-table">
                    <div class="detail-row">
                        <span class="detail-label">Pick-up:</span>
                        <span class="detail-value">${request.from}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Destination:</span>
                        <span class="detail-value">${request.to}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Reason:</span>
                        <span class="detail-value">${request.reason}</span>
                    </div>
                    ${request.driver ? `
                        <div class="detail-row">
                            <span class="detail-label">Driver:</span>
                            <span class="detail-value">${request.driver}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Vehicle:</span>
                            <span class="detail-value">${request.vehicle}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    openModal('detailsModal');
}

function startTransport(requestId) {
    if (confirm('Start transport for request #' + requestId + '?\n\nThe vehicle will begin transporting the patient.')) {
        const request = transportRequests.find(r => r.id === requestId);
        request.status = 'in-transit';
        request.startedAt = new Date().toISOString();
        request.eta = '25 mins';
        
        const vehicle = vehicles.find(v => v.plate === request.vehicle);
        vehicle.status = 'in-use';
        
        localStorage.setItem('transportRequests', JSON.stringify(transportRequests));
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        
        renderRequests();
        renderVehicles();
        showNotification('Transport started successfully! ETA: 25 mins', 'success');
    }
}

function trackTransport(requestId) {
    showNotification('Opening GPS tracking...', 'info');
    setTimeout(() => {
        alert(`Live GPS Tracking - Request #${requestId}\n\nCurrent Location: En route to destination\nETA: 15 minutes\nSpeed: 45 km/h\n\nIn a production system, this would show a real-time map with GPS coordinates.`);
    }, 500);
}

function completeTransport(requestId) {
    if (confirm('Mark transport #' + requestId + ' as completed?\n\nThis will update the request status and free up the vehicle.')) {
        const request = transportRequests.find(r => r.id === requestId);
        request.status = 'completed';
        request.completedAt = new Date().toISOString();
        
        const vehicle = vehicles.find(v => v.plate === request.vehicle);
        vehicle.status = 'available';
        delete vehicle.assignedTo;
        
        localStorage.setItem('transportRequests', JSON.stringify(transportRequests));
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        
        renderRequests();
        renderVehicles();
        showNotification('Transport completed successfully!', 'success');
    }
}

// ============================================
// REFERRAL ACTIONS
// ============================================

function createReferral() {
    openModal('newReferralModal');
}

function editReferral(referralId) {
    showNotification('Opening referral ' + referralId + ' for editing', 'info');
    openModal('newReferralModal');
}

function viewReferral(referralId) {
    alert(`Referral Details - #${referralId}\n\nThis would show complete referral information including:\n- Patient details\n- Referring facility\n- Destination hospital\n- Specialty required\n- Clinical summary\n- Referral status\n- Acceptance confirmation`);
}

function printReferral(referralId) {
    showNotification('Generating referral letter...', 'info');
    setTimeout(() => {
        alert(`Printing Referral #${referralId}\n\nIn production, this would generate a PDF with:\n- Official referral letter header\n- Patient information\n- Clinical history\n- Reason for referral\n- Physician signature\n- Facility stamps`);
        window.print();
    }, 500);
}

// ============================================
// VEHICLE ACTIONS
// ============================================

function addVehicle() {
    openModal('newVehicleModal');
}

function openAssignVehicleModal(vehiclePlate) {
    const vehicle = vehicles.find(v => v.plate === vehiclePlate);
    const pendingRequests = transportRequests.filter(r => r.status === 'pending');
    
    if (pendingRequests.length === 0) {
        showNotification('No pending requests to assign', 'info');
        return;
    }
    
    const content = document.getElementById('assignDriverContent');
    content.innerHTML = `
        <div class="assign-info">
            <h4>Vehicle: ${vehicle.name} (${vehicle.plate})</h4>
            <p><strong>Driver:</strong> ${vehicle.driver}</p>
            <p><strong>Fuel:</strong> ${vehicle.fuel}%</p>
        </div>
        <hr>
        <h4>Pending Requests:</h4>
        <div class="request-selection">
            ${pendingRequests.map(request => `
                <div class="request-option" onclick="confirmAssignment('${request.id}', '${vehicle.plate}', '${vehicle.driver}')">
                    <div class="request-option-info">
                        <h5>#${request.id} - ${request.patientName}</h5>
                        <p><i class="fas fa-map-marker-alt"></i> ${request.from} → ${request.to}</p>
                        <p><i class="fas fa-exclamation-triangle"></i> Priority: <span class="priority-${request.priority.toLowerCase()}">${request.priority}</span></p>
                    </div>
                    <div class="request-option-action">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    openModal('assignDriverModal');
}

function viewVehicle(vehiclePlate) {
    const vehicle = vehicles.find(v => v.plate === vehiclePlate);
    alert(`Vehicle Details - ${vehicle.plate}\n\nName: ${vehicle.name}\nType: ${vehicle.type.toUpperCase()}\nDriver: ${vehicle.driver}\nPhone: ${vehicle.phone}\nFuel: ${vehicle.fuel}%\nStatus: ${formatStatus(vehicle.status)}\n${vehicle.location ? 'Location: ' + vehicle.location : ''}\n${vehicle.assignedTo ? 'Assigned to: #' + vehicle.assignedTo : ''}`);
}

function trackVehicle(vehiclePlate) {
    const vehicle = vehicles.find(v => v.plate === vehiclePlate);
    showNotification('Opening GPS tracking...', 'info');
    setTimeout(() => {
        alert(`Live GPS Tracking - ${vehicle.name} (${vehiclePlate})\n\nDriver: ${vehicle.driver}\nStatus: ${formatStatus(vehicle.status)}\n${vehicle.assignedTo ? 'Request: #' + vehicle.assignedTo : ''}\n\nCurrent Location: En route\nSpeed: 45 km/h\nETA: 15 minutes\n\nIn production, this would show a real-time map.`);
    }, 500);
}

// ============================================
// HISTORY ACTIONS
// ============================================

function filterHistory() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    showNotification(`Filtering history from ${dateFrom} to ${dateTo}`, 'success');
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderRequests(filter = 'all') {
    const grid = document.querySelector('.requests-grid');
    if (!grid) {
        console.error('Requests grid not found!');
        return;
    }
    
    const filtered = filter === 'all' ? transportRequests : transportRequests.filter(r => r.status === filter);
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="text-secondary" style="padding: 20px; text-align: center;">No transport requests found.</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(request => `
        <div class="request-card" data-status="${request.status}">
            <div class="request-header">
                <div class="request-id">
                    <span class="label">Request ID:</span>
                    <span class="value">#${request.id}</span>
                </div>
                <span class="status-badge status-${request.status}">${formatStatus(request.status)}</span>
            </div>
            <div class="request-body">
                <div class="patient-info">
                    <h4><i class="fas fa-user-injured"></i> ${request.patientName}</h4>
                    <p class="text-secondary">Age: ${request.age} | ${request.gender}</p>
                </div>
                <div class="transport-details">
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <div><strong>From:</strong> ${request.from}</div>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-hospital"></i>
                        <div><strong>To:</strong> ${request.to}</div>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-notes-medical"></i>
                        <div><strong>Reason:</strong> ${request.reason}</div>
                    </div>
                    ${request.driver ? `
                        <div class="detail-row">
                            <i class="fas fa-user-md"></i>
                            <div><strong>Driver:</strong> ${request.driver} - Vehicle: ${request.vehicle}</div>
                        </div>
                    ` : ''}
                    ${request.eta ? `
                        <div class="detail-row">
                            <i class="fas fa-route"></i>
                            <div><strong>Status:</strong> En route - ETA ${request.eta}</div>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <i class="fas fa-clock"></i>
                        <div><strong>Requested:</strong> ${formatDateTime(request.requested)}</div>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div><strong>Priority:</strong> <span class="priority-${request.priority.toLowerCase()}">${request.priority} ${request.priority === 'HIGH' ? '- Emergency' : ''}</span></div>
                    </div>
                </div>
            </div>
            <div class="request-footer">
                ${getRequestActions(request)}
            </div>
        </div>
    `).join('');
}

function getRequestActions(request) {
    switch(request.status) {
        case 'pending':
            return `
                <button class="btn btn-primary btn-sm" onclick="openAssignDriverModal('${request.id}')">
                    <i class="fas fa-user-check"></i> Assign Driver
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `;
        case 'assigned':
            return `
                <button class="btn btn-success btn-sm" onclick="startTransport('${request.id}')">
                    <i class="fas fa-play"></i> Start Transport
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `;
        case 'in-transit':
            return `
                <button class="btn btn-info btn-sm" onclick="trackTransport('${request.id}')">
                    <i class="fas fa-map-marked-alt"></i> Track Location
                </button>
                <button class="btn btn-success btn-sm" onclick="completeTransport('${request.id}')">
                    <i class="fas fa-check"></i> Complete
                </button>
            `;
        default:
            return `
                <button class="btn btn-secondary btn-sm" onclick="viewDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `;
    }
}

function renderVehicles() {
    const grid = document.querySelector('.vehicles-grid');
    if (!grid) return;
    
    grid.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card ${vehicle.status}">
            <div class="vehicle-header">
                <div class="vehicle-icon">
                    <i class="fas fa-${vehicle.type === 'ambulance' ? 'ambulance' : 'van-shuttle'}"></i>
                </div>
                <span class="vehicle-status status-${vehicle.status}">${formatStatus(vehicle.status)}</span>
            </div>
            <div class="vehicle-body">
                <h4>${vehicle.name}</h4>
                <p class="vehicle-plate">${vehicle.plate}</p>
                <div class="vehicle-details">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${vehicle.driver}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${vehicle.phone}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-gas-pump"></i>
                        <span>Fuel: ${vehicle.fuel}%</span>
                    </div>
                    ${vehicle.location ? `
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Location: ${vehicle.location}</span>
                        </div>
                    ` : ''}
                    ${vehicle.assignedTo ? `
                        <div class="detail-item">
                            <i class="fas fa-route"></i>
                            <span>Request: #${vehicle.assignedTo}</span>
                        </div>
                    ` : ''}
                    ${vehicle.returnDate ? `
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>Return: ${formatDate(vehicle.returnDate)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="vehicle-footer">
                ${getVehicleActions(vehicle)}
            </div>
        </div>
    `).join('');
}

function getVehicleActions(vehicle) {
    if (vehicle.status === 'available') {
        return `
            <button class="btn btn-sm btn-secondary" onclick="openAssignVehicleModal('${vehicle.plate}')">
                <i class="fas fa-tasks"></i> Assign
            </button>
            <button class="btn btn-sm btn-info" onclick="viewVehicle('${vehicle.plate}')">
                <i class="fas fa-info-circle"></i> Details
            </button>
        `;
    } else if (vehicle.status === 'in-use') {
        return `
            <button class="btn btn-sm btn-info" onclick="trackVehicle('${vehicle.plate}')">
                <i class="fas fa-map-marked-alt"></i> Track
            </button>
            <button class="btn btn-sm btn-secondary" onclick="viewVehicle('${vehicle.plate}')">
                <i class="fas fa-info-circle"></i> Details
            </button>
        `;
    } else {
        return `
            <button class="btn btn-sm btn-secondary" onclick="viewVehicle('${vehicle.plate}')">
                <i class="fas fa-info-circle"></i> Details
            </button>
        `;
    }
}

// Render Referrals
function renderReferrals() {
    console.log('Rendering referrals...');
    const tbody = document.querySelector('#referralsTab tbody');
    if (!tbody) {
        console.error('Referrals table body not found');
        return;
    }
    
    if (referrals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No referrals found. Click "Create Referral" to add one.</td></tr>';
        return;
    }
    
    tbody.innerHTML = referrals.map(ref => `
        <tr>
            <td><strong>${ref.id}</strong></td>
            <td>${ref.patientName}</td>
            <td>${ref.fromFacility}</td>
            <td>${ref.toHospital}</td>
            <td>${ref.specialty}</td>
            <td><span class="priority-${ref.priority.toLowerCase()}">${ref.priority}</span></td>
            <td><span class="status-badge status-${ref.status}">${formatStatus(ref.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="editReferral('${ref.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="printReferral('${ref.id}')" title="Print">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log('Referrals rendered:', referrals.length);
}

// Render History
function renderHistory() {
    console.log('Rendering history...');
    const tbody = document.querySelector('#historyTab tbody');
    if (!tbody) {
        console.error('History table body not found');
        return;
    }
    
    // Get completed requests
    const completed = transportRequests.filter(req => req.status === 'completed');
    
    if (completed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No completed requests yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = completed.map(req => `
        <tr>
            <td><strong>${req.id}</strong></td>
            <td>${req.patientName}</td>
            <td>${req.from}</td>
            <td>${req.to}</td>
            <td>${req.driver || 'N/A'}</td>
            <td>${formatDate(req.completed || req.requested)}</td>
            <td>
                <button class="btn-icon" onclick="viewDetails('${req.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log('History rendered:', completed.length, 'completed requests');
}

// ============================================
// MODAL CREATION
// ============================================

function createModals() {
    console.log('Creating modals...');
    
    // Check if modals already exist
    if (document.getElementById('newRequestModal')) {
        console.log('Modals already exist, skipping creation');
        return;
    }
    
    const modalsHTML = `
        <!-- New Request Modal -->
        <div id="newRequestModal" class="modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-ambulance"></i> New Transport Request</h2>
                    <button class="btn-close" onclick="closeModal('newRequestModal')">&times;</button>
                </div>
                <form id="newRequestForm" onsubmit="submitNewRequest(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Patient Name *</label>
                                <input type="text" name="patientName" required>
                            </div>
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
                            <label>Pick-up Location *</label>
                            <input type="text" name="from" required placeholder="Barangay / Health Center">
                        </div>
                        <div class="form-group">
                            <label>Destination Hospital *</label>
                            <input type="text" name="to" required placeholder="Hospital name">
                        </div>
                        <div class="form-group">
                            <label>Reason for Transport *</label>
                            <textarea name="reason" required rows="3" placeholder="Medical condition or reason for referral"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Priority Level *</label>
                            <select name="priority" required>
                                <option value="">Select Priority</option>
                                <option value="LOW">Low - Routine</option>
                                <option value="MEDIUM">Medium - Scheduled</option>
                                <option value="HIGH">High - Emergency</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('newRequestModal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Create Request
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Assign Driver Modal -->
        <div id="assignDriverModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-user-check"></i> Assign Driver & Vehicle</h2>
                    <button class="btn-close" onclick="closeModal('assignDriverModal')">&times;</button>
                </div>
                <div class="modal-body" id="assignDriverContent">
                    <!-- Will be populated dynamically -->
                </div>
            </div>
        </div>

        <!-- Request Details Modal -->
        <div id="detailsModal" class="modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-file-medical-alt"></i> Transport Request Details</h2>
                    <button class="btn-close" onclick="closeModal('detailsModal')">&times;</button>
                </div>
                <div class="modal-body" id="detailsContent">
                    <!-- Will be populated dynamically -->
                </div>
            </div>
        </div>

        <!-- New Referral Modal -->
        <div id="newReferralModal" class="modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-file-medical"></i> Create Hospital Referral</h2>
                    <button class="btn-close" onclick="closeModal('newReferralModal')">&times;</button>
                </div>
                <form id="newReferralForm" onsubmit="submitNewReferral(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Patient Name *</label>
                                <input type="text" name="patientName" required>
                            </div>
                            <div class="form-group">
                                <label>Age *</label>
                                <input type="number" name="age" required min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Referring Facility *</label>
                            <input type="text" name="fromFacility" required>
                        </div>
                        <div class="form-group">
                            <label>Referral Hospital *</label>
                            <input type="text" name="toHospital" required>
                        </div>
                        <div class="form-group">
                            <label>Specialty Required *</label>
                            <select name="specialty" required>
                                <option value="">Select Specialty</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="OB-GYN">OB-GYN</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Surgery">Surgery</option>
                                <option value="Internal Medicine">Internal Medicine</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Clinical Summary *</label>
                            <textarea name="summary" required rows="4" placeholder="Patient's medical history, symptoms, and reason for referral"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Priority *</label>
                            <select name="priority" required>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('newReferralModal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Create Referral
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- New Vehicle Modal -->
        <div id="newVehicleModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> Add New Vehicle</h2>
                    <button class="btn-close" onclick="closeModal('newVehicleModal')">&times;</button>
                </div>
                <form id="newVehicleForm" onsubmit="submitNewVehicle(event)">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Vehicle Name *</label>
                            <input type="text" name="name" required placeholder="e.g., Ambulance Unit 4">
                        </div>
                        <div class="form-group">
                            <label>Plate Number *</label>
                            <input type="text" name="plate" required placeholder="e.g., MB-2304">
                        </div>
                        <div class="form-group">
                            <label>Vehicle Type *</label>
                            <select name="type" required>
                                <option value="">Select Type</option>
                                <option value="ambulance">Ambulance</option>
                                <option value="van">Van</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Driver Name *</label>
                            <input type="text" name="driver" required>
                        </div>
                        <div class="form-group">
                            <label>Driver Phone *</label>
                            <input type="tel" name="phone" required placeholder="+63">
                        </div>
                        <div class="form-group">
                            <label>Current Location</label>
                            <input type="text" name="location" placeholder="e.g., Cebu City">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('newVehicleModal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Add Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
    console.log('Modals created successfully');
    
    // Verify modals exist
    const modalIds = ['newRequestModal', 'assignDriverModal', 'detailsModal', 'newReferralModal', 'newVehicleModal'];
    modalIds.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            console.log(`✓ ${id} created`);
        } else {
            console.error(`✗ ${id} NOT found`);
        }
    });
}

// ============================================
// NEW REQUEST
// ============================================

function submitNewRequest(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newRequest = {
        id: `TR-2025-${String(transportRequests.length + 1).padStart(3, '0')}`,
        patientName: formData.get('patientName'),
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        from: formData.get('from'),
        to: formData.get('to'),
        reason: formData.get('reason'),
        priority: formData.get('priority'),
        status: 'pending',
        requested: new Date().toISOString(),
        driver: null,
        vehicle: null
    };
    
    transportRequests.push(newRequest);
    localStorage.setItem('transportRequests', JSON.stringify(transportRequests));
    
    renderRequests();
    closeModal('newRequestModal');
    form.reset();
    showNotification('Transport request created successfully!', 'success');
}

function submitNewReferral(event) {
    event.preventDefault();
    const form = event.target;
    showNotification('Referral created successfully!', 'success');
    closeModal('newReferralModal');
    form.reset();
}

function submitNewVehicle(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newVehicle = {
        plate: formData.get('plate'),
        name: formData.get('name'),
        type: formData.get('type'),
        driver: formData.get('driver'),
        phone: formData.get('phone'),
        fuel: 100,
        status: 'available',
        location: formData.get('location') || 'Base'
    };
    
    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    
    renderVehicles();
    closeModal('newVehicleModal');
    form.reset();
    showNotification('Vehicle added successfully!', 'success');
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal not found:', modalId);
        showNotification('Modal not found!', 'danger');
        return;
    }
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        setTimeout(() => event.target.style.display = 'none', 300);
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'assigned': 'Assigned',
        'in-transit': 'In Transit',
        'in-use': 'In Use',
        'completed': 'Completed',
        'available': 'Available',
        'maintenance': 'Maintenance'
    };
    return statusMap[status] || status;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showNotification(message, type = 'info') {
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

// Expose functions globally for onclick/onsubmit handlers
window.openAssignDriverModal = openAssignDriverModal;
window.viewDetails = viewDetails;
window.startTransport = startTransport;
window.trackTransport = trackTransport;
window.completeTransport = completeTransport;
window.createReferral = createReferral;
window.editReferral = editReferral;
window.viewReferral = viewReferral;
window.printReferral = printReferral;
window.addVehicle = addVehicle;
window.openAssignVehicleModal = openAssignVehicleModal;
window.viewVehicle = viewVehicle;
window.trackVehicle = trackVehicle;
window.filterHistory = filterHistory;
window.confirmAssignment = confirmAssignment;
window.submitNewRequest = submitNewRequest;
window.submitNewReferral = submitNewReferral;
window.submitNewVehicle = submitNewVehicle;
window.closeModal = closeModal;
window.openModal = openModal;
window.logout = logout;

console.log('All functions exposed globally');

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
