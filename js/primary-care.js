// ============================================
// PRIMARY CARE SERVICES JAVASCRIPT
// ============================================

// API Configuration
const USE_API = false; // Set to false - only using MongoDB for login/signup

// Data Storage - Start with empty, will be populated on load
let patients = [];
let supplies = [];
let volunteers = [];
let tests = [];
let currentPatientId = 0;

// Authentication check
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = '../index.html';
        return;
    }
    
    // Set user info if elements exist
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userNameEl = document.getElementById('userName');
    const welcomeNameEl = document.getElementById('welcomeName');
    
    if (userData.name && userNameEl) {
        userNameEl.textContent = userData.name;
    }
    if (userData.name && welcomeNameEl) {
        welcomeNameEl.textContent = userData.name;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}

// Tab switching function
function switchTab(tabId, btnElement) {
    console.log('Switching to tab:', tabId);
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Remove active class from all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (btnElement) {
        btnElement.classList.add('active');
    }
    
    // Add active class to target tab content
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
        console.log('Tab content activated:', tabId);
    } else {
        console.error('Tab content not found:', tabId);
    }
}
window.switchTab = switchTab;

// Initialize data on page load
function initializeData() {
    // Load from localStorage first
    const storedPatients = localStorage.getItem('clinikabayan_patients');
    const storedSupplies = localStorage.getItem('clinikabayan_supplies');
    const storedVolunteers = localStorage.getItem('clinikabayan_volunteers');
    
    if (storedPatients) {
        try {
            const parsed = JSON.parse(storedPatients);
            let idCounter = 1;
            
            // Normalize patient data - ensure each patient has required flat fields
            patients = parsed.map((p, index) => {
                // Generate ID if missing
                const generateId = () => {
                    const year = new Date().getFullYear();
                    return `CK-${year}-${String(idCounter++).padStart(3, '0')}`;
                };
                
                // Handle nested personalInfo structure
                if (p.personalInfo) {
                    const patientId = p.id || p._id || p.patientId || generateId();
                    return {
                        id: patientId,
                        firstName: p.personalInfo.firstName || '',
                        lastName: p.personalInfo.lastName || '',
                        age: parseInt(p.personalInfo.age) || 0,
                        gender: p.personalInfo.sex || p.personalInfo.gender || '',
                        address: p.contactInfo ? `${p.contactInfo.barangay || ''}, ${p.contactInfo.city || ''}`.replace(/^, |, $/g, '') : (p.address || ''),
                        lastVisit: p.lastVisit || new Date().toISOString().split('T')[0],
                        status: (p.status || 'active').toLowerCase(),
                        condition: p.condition || 'General Checkup',
                        phone: p.contactInfo?.contactNumber || p.phone || ''
                    };
                }
                
                // Already flat structure
                const patientId = p.id || p._id || p.patientId || generateId();
                return {
                    id: patientId,
                    firstName: p.firstName || '',
                    lastName: p.lastName || '',
                    age: parseInt(p.age) || 0,
                    gender: p.gender || p.sex || '',
                    address: p.address || '',
                    lastVisit: p.lastVisit || new Date().toISOString().split('T')[0],
                    status: (p.status || 'active').toLowerCase(),
                    condition: p.condition || 'General Checkup',
                    phone: p.phone || p.contactNumber || ''
                };
            });
            
            // Update currentPatientId based on existing IDs
            patients.forEach(p => {
                const match = p.id.match(/CK-\d+-(\d+)/);
                if (match) {
                    const num = parseInt(match[1]);
                    if (num >= currentPatientId) currentPatientId = num;
                }
            });
            
            // Save normalized data back
            localStorage.setItem('clinikabayan_patients', JSON.stringify(patients));
            console.log('Initialized', patients.length, 'patients from localStorage');
        } catch (e) {
            console.error('Error parsing patients:', e);
            patients = [];
        }
    }
    
    if (storedSupplies) {
        try {
            supplies = JSON.parse(storedSupplies);
        } catch (e) {
            supplies = [];
        }
    }
    
    if (storedVolunteers) {
        try {
            volunteers = JSON.parse(storedVolunteers);
        } catch (e) {
            volunteers = [];
        }
    }
    
    currentPatientId = parseInt(localStorage.getItem('clinikabayan_lastPatientId') || '0');
    
    // Initialize sample data if empty
    if (patients.length === 0) {
        patients = [
            {
                id: 'CK-2025-001',
                firstName: 'Maria',
                lastName: 'Santos',
                age: 34,
                gender: 'Female',
                address: 'Barangay San Jose, Cebu City',
                lastVisit: '2025-11-20',
                status: 'active',
                condition: 'Prenatal Care',
                phone: '+63 912 345 6789'
            },
            {
                id: 'CK-2025-002',
                firstName: 'Juan',
                lastName: 'Reyes',
                age: 56,
                gender: 'Male',
                address: 'Barangay Talamban, Cebu City',
                lastVisit: '2025-11-24',
                status: 'ongoing',
                condition: 'Hypertension Management',
                phone: '+63 917 654 3210'
            },
            {
                id: 'CK-2025-003',
                firstName: 'Ana',
                lastName: 'Lopez',
                age: 12,
                gender: 'Female',
                address: 'Barangay Lahug, Cebu City',
                lastVisit: '2025-11-22',
                status: 'active',
                condition: 'Regular Checkup',
                phone: '+63 919 876 5432'
            }
        ];
        currentPatientId = 3;
        localStorage.setItem('clinikabayan_patients', JSON.stringify(patients));
        localStorage.setItem('clinikabayan_lastPatientId', currentPatientId.toString());
    }

    if (supplies.length === 0) {
        supplies = [
            { id: 1, name: 'Paracetamol 500mg', quantity: 450, reorderLevel: 200, status: 'adequate', category: 'Medication' },
            { id: 2, name: 'Amoxicillin 500mg', quantity: 180, reorderLevel: 150, status: 'adequate', category: 'Antibiotics' },
            { id: 3, name: 'Blood Pressure Monitor', quantity: 8, reorderLevel: 5, status: 'adequate', category: 'Equipment' },
            { id: 4, name: 'Surgical Gloves', quantity: 85, reorderLevel: 100, status: 'low', category: 'Supplies' },
            { id: 5, name: 'Insulin', quantity: 25, reorderLevel: 50, status: 'critical', category: 'Medication' }
        ];
        localStorage.setItem('clinikabayan_supplies', JSON.stringify(supplies));
    }

    if (volunteers.length === 0) {
        volunteers = [
            { id: 1, name: 'Dr. Pedro Garcia', role: 'General Physician', license: 'MD-12345', status: 'available', schedule: 'Mon, Wed, Fri' },
            { id: 2, name: 'Nurse Rosa Martinez', role: 'Registered Nurse', license: 'RN-67890', status: 'available', schedule: 'Tue, Thu, Sat' },
            { id: 3, name: 'Dr. Elena Cruz', role: 'Pediatrician', license: 'MD-54321', status: 'busy', schedule: 'Mon, Thu' }
        ];
        localStorage.setItem('clinikabayan_volunteers', JSON.stringify(volunteers));
    }
    
    console.log('Data initialized. Patients:', patients.length, 'Supplies:', supplies.length);
}

// Load data from API
async function loadDataFromAPI() {
    if (!USE_API || typeof api === 'undefined') return;
    
    try {
        console.log('Loading Primary Care data from API...');
        
        // Load patients from API
        const apiPatients = await api.getPatients();
        if (apiPatients && apiPatients.length > 0) {
            patients = apiPatients.map(p => ({
                id: p.patientId || p._id,
                _id: p._id,
                firstName: p.firstName,
                lastName: p.lastName,
                age: p.age,
                gender: p.gender,
                address: p.address,
                lastVisit: p.lastVisit ? new Date(p.lastVisit).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: p.status || 'active',
                condition: p.condition || 'General Checkup',
                phone: p.phone || p.contactNumber
            }));
            console.log('Loaded', patients.length, 'patients from API');
        }
        
        // Load inventory/supplies from API
        const apiInventory = await api.getInventory();
        if (apiInventory && apiInventory.length > 0) {
            supplies = apiInventory.map(s => ({
                id: s._id,
                name: s.name,
                quantity: s.quantity,
                reorderLevel: s.reorderLevel,
                status: s.quantity > s.reorderLevel ? 'adequate' : (s.quantity > 0 ? 'low' : 'critical'),
                category: s.category
            }));
            console.log('Loaded', supplies.length, 'supplies from API');
        }
        
        // Update UI
        renderPatients();
        renderSupplies();
        
    } catch (error) {
        console.error('Error loading data from API:', error);
        // Fall back to localStorage
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Primary Care page loading...');
    checkAuth();
    
    // Initialize data first
    initializeData();
    
    initTabs();
    setupEventListeners();
    
    // Render with local data first
    renderPatients();
    renderSupplies();
    renderVolunteers();
    renderTests();
    
    // Then try to load from API (will update UI if successful)
    if (USE_API && typeof api !== 'undefined') {
        loadDataFromAPI();
    }
    
    console.log('Primary Care page loaded successfully');
});

// Initialize tabs functionality
function initTabs() {
    // Tab functionality is handled by inline onclick="switchTab()" in HTML
    // This function now just ensures the first tab is active on page load
    const tabContents = document.querySelectorAll('.tab-content');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Ensure at least one tab is active
    let hasActive = false;
    tabContents.forEach(content => {
        if (content.classList.contains('active')) {
            hasActive = true;
        }
    });
    
    // If no tab is active, activate the first one
    if (!hasActive && tabContents.length > 0) {
        tabContents[0].classList.add('active');
        if (tabBtns.length > 0) {
            tabBtns[0].classList.add('active');
        }
    }
    
    console.log('Tabs initialized');
}

// Setup event listeners
function setupEventListeners() {
    // New Patient button
    const btnNewPatient = document.getElementById('btnNewPatient');
    if (btnNewPatient) {
        btnNewPatient.addEventListener('click', openNewPatientForm);
    }
    
    // Patient search
    const patientSearch = document.getElementById('patientSearch');
    if (patientSearch) {
        patientSearch.addEventListener('input', function(e) {
            searchPatients(e.target.value);
        });
    }
    
    // Filter status
    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', function(e) {
            filterPatientsByStatus(e.target.value);
        });
    }
    
    // Add Supply button
    const btnAddSupply = document.getElementById('btnAddSupply');
    if (btnAddSupply) {
        btnAddSupply.addEventListener('click', openAddSupplyForm);
    }
    
    // Add Volunteer button
    const btnAddVolunteer = document.getElementById('btnAddVolunteer');
    if (btnAddVolunteer) {
        btnAddVolunteer.addEventListener('click', openAddVolunteerForm);
    }
    
    // Add Test button
    const btnAddTest = document.getElementById('btnAddTest');
    if (btnAddTest) {
        btnAddTest.addEventListener('click', openAddTestForm);
    }
}

// View patient details
function viewPatient(patientId) {
    console.log('Viewing patient:', patientId);
    // For demo static patients, show demo data
    const demoPatients = {
        1: {
            id: 'CK-2025-001',
            firstName: 'Maria',
            lastName: 'Santos',
            age: 34,
            gender: 'Female',
            address: 'Barangay San Jose, Cebu City',
            phone: '+63 917 123 4567',
            email: 'maria.santos@email.com',
            bloodType: 'O+',
            status: 'Active',
            lastVisit: '2025-11-20',
            condition: 'Prenatal Care',
            allergies: 'None known',
            medications: ['Folic Acid 400mcg daily', 'Iron Supplement'],
            vitalSigns: { bp: '110/70', hr: '78 bpm', temp: '36.5°C', weight: '58 kg' },
            history: ['Prenatal checkup - Nov 20, 2025', 'Blood test - Nov 15, 2025', 'Initial consultation - Oct 28, 2025']
        },
        2: {
            id: 'CK-2025-002',
            firstName: 'Juan',
            lastName: 'Reyes',
            age: 56,
            gender: 'Male',
            address: 'Barangay Talamban, Cebu City',
            phone: '+63 918 234 5678',
            email: 'juan.reyes@email.com',
            bloodType: 'A+',
            status: 'Ongoing',
            lastVisit: '2025-11-24',
            condition: 'Hypertension Management',
            allergies: 'Penicillin',
            medications: ['Losartan 50mg daily', 'Amlodipine 5mg daily'],
            vitalSigns: { bp: '140/90', hr: '82 bpm', temp: '36.8°C', weight: '75 kg' },
            history: ['BP monitoring - Nov 24, 2025', 'Medication adjustment - Nov 10, 2025', 'Lab work - Nov 5, 2025']
        },
        3: {
            id: 'CK-2025-003',
            firstName: 'Ana',
            lastName: 'Lopez',
            age: 12,
            gender: 'Female',
            address: 'Sitio Maharlika, Mandaue City',
            phone: '+63 919 345 6789',
            email: 'parent@email.com',
            bloodType: 'B+',
            status: 'Active',
            lastVisit: '2025-11-22',
            condition: 'Vaccination (MMR)',
            allergies: 'None known',
            medications: ['Multivitamins'],
            vitalSigns: { bp: '100/65', hr: '88 bpm', temp: '36.4°C', weight: '38 kg' },
            history: ['MMR Vaccination - Nov 22, 2025', 'Health screening - Oct 15, 2025', 'Dental checkup - Sep 20, 2025']
        }
    };
    
    const patient = demoPatients[patientId];
    if (patient) {
        showPatientDetailsModal(patient);
    } else {
        showNotification('Patient not found', 'warning');
    }
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderPatients(filter = 'all', searchQuery = '') {
    const grid = document.querySelector('.patients-grid');
    if (!grid) return;
    
    let filtered = patients;
    
    // Apply status filter
    if (filter !== 'all') {
        filtered = filtered.filter(p => p.status === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            (p.firstName || '').toLowerCase().includes(query) ||
            (p.lastName || '').toLowerCase().includes(query) ||
            (p.id || '').toString().toLowerCase().includes(query) ||
            (p.address || '').toLowerCase().includes(query)
        );
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No patients found.</p>';
        return;
    }
    
    // Make sure each patient has an id
    grid.innerHTML = filtered.map(patient => {
        const patientId = patient.id || patient._id || patient.patientId || 'unknown';
        return `
        <div class="patient-card" onclick="viewPatientDetails('${patientId}')">
            <div class="patient-header">
                <div class="patient-avatar ${patient.gender === 'Male' ? 'male' : ''}">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-basic-info">
                    <h4>${patient.firstName || ''} ${patient.lastName || ''}</h4>
                    <p class="patient-id">ID: ${patientId}</p>
                </div>
                <span class="badge badge-${patient.status === 'active' ? 'success' : patient.status === 'ongoing' ? 'warning' : 'primary'}">${patient.status || 'active'}</span>
            </div>
            <div class="patient-details">
                <div class="detail-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${patient.age || 'N/A'} years old, ${patient.gender || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${patient.address || 'No address'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Last Visit: ${formatDate(patient.lastVisit)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-notes-medical"></i>
                    <span>${patient.condition || 'General Checkup'}</span>
                </div>
            </div>
        </div>
    `}).join('');
}

function renderSupplies() {
    const tbody = document.querySelector('#suppliesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = supplies.map(supply => `
        <tr>
            <td><strong>${supply.name}</strong></td>
            <td>${supply.category}</td>
            <td>${supply.quantity}</td>
            <td>${supply.reorderLevel}</td>
            <td>
                <span class="badge badge-${supply.status === 'adequate' ? 'success' : supply.status === 'low' ? 'warning' : 'danger'}">
                    ${supply.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="editSupply(${supply.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderVolunteers() {
    const container = document.querySelector('.volunteers-grid');
    if (!container) return;
    
    container.innerHTML = volunteers.map(volunteer => `
        <div class="volunteer-card">
            <div class="volunteer-header">
                <div class="volunteer-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <span class="badge badge-${volunteer.status === 'available' ? 'success' : 'warning'}">${volunteer.status}</span>
            </div>
            <div class="volunteer-body">
                <h4>${volunteer.name}</h4>
                <p class="volunteer-role">${volunteer.role}</p>
                <p class="volunteer-license">License: ${volunteer.license}</p>
                <p class="volunteer-schedule"><i class="fas fa-calendar"></i> ${volunteer.schedule}</p>
            </div>
            <div class="volunteer-footer">
                <button class="btn btn-sm btn-secondary" onclick="contactVolunteer(${volunteer.id})">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="btn btn-sm btn-info" onclick="viewVolunteerDetails(${volunteer.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `).join('');
}

function renderTests() {
    // Tests are static, no need to render dynamically
    console.log('Tests displayed');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================
// PATIENT REGISTRATION FUNCTIONS
// ============================================

// Open new patient form
function openNewPatientForm() {
    console.log('openNewPatientForm called');
    const modal = document.getElementById('newPatientModal');
    console.log('Modal element:', modal);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        // Reset form
        const form = document.getElementById('patientRegistrationForm');
        if (form) form.reset();
        
        // Set current date for DOB field max
        const dobField = document.getElementById('dateOfBirth');
        if (dobField) {
            const today = new Date().toISOString().split('T')[0];
            dobField.setAttribute('max', today);
        }
    } else {
        console.error('New Patient Modal not found!');
        alert('Error: Modal not found. Please refresh the page.');
    }
}
// Make available immediately
window.openNewPatientForm = openNewPatientForm;

// Close new patient modal
function closeNewPatientModal() {
    const modal = document.getElementById('newPatientModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}
window.closeNewPatientModal = closeNewPatientModal;

// Calculate age from date of birth
function calculateAge() {
    const dob = document.getElementById('dateOfBirth').value;
    if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        document.getElementById('age').value = age;
    }
}

// Save new patient
async function saveNewPatient() {
    const form = document.getElementById('patientRegistrationForm');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Generate patient ID
    currentPatientId++;
    const patientId = `CK-${new Date().getFullYear()}-${String(currentPatientId).padStart(3, '0')}`;
    
    // Gather form data
    const patientData = {
        id: patientId,
        personalInfo: {
            lastName: document.getElementById('lastName').value,
            firstName: document.getElementById('firstName').value,
            middleName: document.getElementById('middleName').value,
            suffix: document.getElementById('suffix').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            age: document.getElementById('age').value,
            sex: document.getElementById('sex').value,
            civilStatus: document.getElementById('civilStatus').value,
            bloodType: document.getElementById('bloodType').value,
            religion: document.getElementById('religion').value,
            occupation: document.getElementById('occupation').value,
            education: document.getElementById('education').value
        },
        contactInfo: {
            address: document.getElementById('address').value,
            barangay: document.getElementById('barangay').value,
            city: document.getElementById('city').value,
            province: document.getElementById('province').value,
            zipCode: document.getElementById('zipCode').value,
            contactNumber: document.getElementById('contactNumber').value,
            email: document.getElementById('email').value
        },
        emergencyContact: {
            name: document.getElementById('emergencyName').value,
            relationship: document.getElementById('emergencyRelationship').value,
            contactNumber: document.getElementById('emergencyContact').value
        },
        healthInsurance: {
            philhealthNumber: document.getElementById('philhealthNumber').value,
            philhealthCategory: document.getElementById('philhealthCategory').value,
            fourPsId: document.getElementById('fourPsId').value,
            pwdId: document.getElementById('pwdId').value,
            seniorId: document.getElementById('seniorId').value
        },
        registrationDate: new Date().toISOString(),
        medicalRecords: [],
        status: 'Active'
    };
    
    // Create API-compatible patient data
    const apiPatientData = {
        patientId: patientId,
        firstName: patientData.personalInfo.firstName,
        lastName: patientData.personalInfo.lastName,
        dateOfBirth: patientData.personalInfo.dateOfBirth,
        age: parseInt(patientData.personalInfo.age),
        gender: patientData.personalInfo.sex,
        address: `${patientData.contactInfo.barangay}, ${patientData.contactInfo.city}`,
        phone: patientData.contactInfo.contactNumber,
        email: patientData.contactInfo.email,
        emergencyContact: patientData.emergencyContact,
        bloodType: patientData.personalInfo.bloodType,
        status: 'active',
        condition: 'New Patient - Pending Consultation',
        lastVisit: new Date().toISOString()
    };
    
    // Try to save to API
    if (USE_API && typeof api !== 'undefined') {
        try {
            const result = await api.createPatient(apiPatientData);
            console.log('Patient saved to API:', result);
            showNotification(`Patient registered successfully! ID: ${patientId}`, 'success');
        } catch (error) {
            console.error('Error saving patient to API:', error);
            showNotification('Error saving to database. Saved locally.', 'warning');
        }
    }
    
    // Also create simplified version for patient list
    const simplePatient = {
        id: patientId,
        firstName: patientData.personalInfo.firstName,
        lastName: patientData.personalInfo.lastName,
        age: parseInt(patientData.personalInfo.age),
        gender: patientData.personalInfo.sex,
        address: `${patientData.contactInfo.barangay}, ${patientData.contactInfo.city}`,
        lastVisit: new Date().toISOString().split('T')[0],
        status: 'active',
        condition: 'New Patient - Pending Consultation',
        phone: patientData.contactInfo.contactNumber
    };
    
    // Add to patients array (use simplePatient for consistency)
    patients.push(simplePatient);
    
    // Also save to localStorage
    localStorage.setItem('clinikabayan_patients', JSON.stringify(patients));
    localStorage.setItem('clinikabayan_lastPatientId', currentPatientId.toString());
    
    // Show success message
    if (!USE_API) {
        showNotification(`Patient registered successfully! ID: ${patientId}`, 'success');
    }
    
    // Close registration modal
    closeNewPatientModal();
    
    // Refresh patient list
    renderPatients();
    
    // Open medical record modal for first consultation
    setTimeout(() => {
        openPatientRecordModal(patientData);
    }, 500);
}
window.saveNewPatient = saveNewPatient;

// ============================================
// MEDICAL RECORD FUNCTIONS
// ============================================

let currentMedicalRecord = null;

// Open patient medical record modal
function openPatientRecordModal(patient) {
    const modal = document.getElementById('patientRecordModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
        
        // Populate patient info
        const fullName = `${patient.personalInfo.lastName}, ${patient.personalInfo.firstName} ${patient.personalInfo.middleName || ''}`.trim();
        document.getElementById('recordPatientId').textContent = patient.id;
        document.getElementById('recordPatientName').textContent = fullName;
        document.getElementById('recordAgeSex').textContent = `${patient.personalInfo.age}/${patient.personalInfo.sex}`;
        document.getElementById('recordBloodType').textContent = patient.personalInfo.bloodType || 'Unknown';
        document.getElementById('recordAddress').textContent = `${patient.contactInfo.barangay}, ${patient.contactInfo.city}`;
        
        // Reset medical record form
        document.getElementById('medicalRecordForm').reset();
        
        // Set current date/time
        const now = new Date();
        const datetime = now.toISOString().slice(0, 16);
        document.getElementById('visitDateTime').value = datetime;
        
        // Store reference to current patient
        currentMedicalRecord = { patient: patient, recordId: Date.now() };
    }
}

// Close patient record modal
function closePatientRecordModal() {
    const modal = document.getElementById('patientRecordModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        currentMedicalRecord = null;
    }
}

// Auto-calculate BMI
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to m
    
    if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(1);
        document.getElementById('bmi').value = bmi;
    }
}

// Save medical record
function saveMedicalRecord() {
    const form = document.getElementById('medicalRecordForm');
    
    // Validate required fields
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    if (!currentMedicalRecord) {
        showNotification('Error: No patient selected', 'error');
        return;
    }
    
    // Gather medical record data
    const recordData = {
        recordId: currentMedicalRecord.recordId,
        visitInfo: {
            dateTime: document.getElementById('visitDateTime').value,
            type: document.getElementById('visitType').value,
            attendingProvider: document.getElementById('attendingProvider').value
        },
        vitalSigns: {
            bloodPressure: `${document.getElementById('bpSystolic').value}/${document.getElementById('bpDiastolic').value}`,
            temperature: document.getElementById('temperature').value,
            pulseRate: document.getElementById('pulseRate').value,
            respiratoryRate: document.getElementById('respiratoryRate').value,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            bmi: document.getElementById('bmi').value,
            oxygenSat: document.getElementById('oxygenSat').value
        },
        clinicalInfo: {
            chiefComplaint: document.getElementById('chiefComplaint').value,
            hpi: document.getElementById('hpi').value,
            pastMedicalHistory: document.getElementById('pastMedicalHistory').value,
            allergies: document.getElementById('allergies').value,
            currentMedications: document.getElementById('currentMedications').value
        },
        physicalExam: {
            generalAppearance: document.getElementById('generalAppearance').value,
            heent: document.getElementById('heent').value,
            cardiovascular: document.getElementById('cardiovascular').value,
            respiratory: document.getElementById('respiratory').value,
            abdomen: document.getElementById('abdomen').value,
            otherFindings: document.getElementById('otherFindings').value
        },
        assessmentPlan: {
            diagnosis: document.getElementById('diagnosis').value,
            treatmentPlan: document.getElementById('treatmentPlan').value,
            labTests: document.getElementById('labTests').value,
            medicationsDispensed: document.getElementById('medicationsDispensed').value,
            patientEducation: document.getElementById('patientEducation').value,
            followUpDate: document.getElementById('followUpDate').value,
            referralTo: document.getElementById('referralTo').value
        },
        providerNotes: document.getElementById('providerNotes').value,
        recordDate: new Date().toISOString(),
        status: 'Completed'
    };
    
    // Find and update patient record
    const patient = patients.find(p => p.id === currentMedicalRecord.patient.id);
    if (patient) {
        patient.medicalRecords.push(recordData);
        patient.lastVisit = recordData.visitInfo.dateTime;
        
        // Save to localStorage
        localStorage.setItem('clinikabayan_patients', JSON.stringify(patients));
        
        showNotification('Medical record saved successfully!', 'success');
        closePatientRecordModal();
        
        // Refresh patient list
        refreshPatientList();
    }
}

// Save draft
function saveDraft() {
    showNotification('Medical record saved as draft', 'info');
}

// Add patient card to dashboard
function addPatientCard(patient) {
    const patientsGrid = document.querySelector('.patients-grid');
    if (!patientsGrid) return;
    
    const fullName = `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`;
    const ageSex = `${patient.personalInfo.age} years old, ${patient.personalInfo.sex}`;
    const location = `${patient.contactInfo.barangay}, ${patient.contactInfo.city}`;
    
    const cardHTML = `
        <div class="patient-card" onclick="viewPatientDetails('${patient.id}')">
            <div class="patient-header">
                <div class="patient-avatar ${patient.personalInfo.sex === 'Male' ? 'male' : ''}">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-basic-info">
                    <h4>${fullName}</h4>
                    <p class="patient-id">ID: ${patient.id}</p>
                </div>
                <span class="badge badge-success">New</span>
            </div>
            <div class="patient-details">
                <div class="detail-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${ageSex}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Registered: ${new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `;
    
    patientsGrid.insertAdjacentHTML('afterbegin', cardHTML);
}

// Refresh patient list
function refreshPatientList() {
    // Reload page or update patient cards
    location.reload();
}

// Setup weight/height listeners for BMI calculation
setTimeout(() => {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    
    if (weightInput) weightInput.addEventListener('input', calculateBMI);
    if (heightInput) heightInput.addEventListener('input', calculateBMI);
}, 1000);

// Export all functions to window for onclick handlers
window.openNewPatientForm = openNewPatientForm;
window.closeNewPatientModal = closeNewPatientModal;
window.calculateAge = calculateAge;
window.saveNewPatient = saveNewPatient;
window.closePatientRecordModal = closePatientRecordModal;
window.saveMedicalRecord = saveMedicalRecord;
window.saveDraft = saveDraft;
window.viewPatientDetails = viewPatientDetails;
window.viewPatient = viewPatient;
window.viewTestInfo = viewTestInfo;
window.searchPatients = searchPatients;
window.filterPatientsByStatus = filterPatientsByStatus;
window.editSupply = editSupply;
window.contactVolunteer = contactVolunteer;
window.viewVolunteerDetails = viewVolunteerDetails;
window.logout = logout;

// Debug helpers - can be called from browser console
window.debugPatients = function() {
    console.log('=== DEBUG: Current Patients ===');
    console.log('Total:', patients.length);
    patients.forEach((p, i) => {
        console.log(`[${i}] ID: ${p.id}, Name: ${p.firstName} ${p.lastName}`);
    });
    return patients;
};

window.resetPatientData = function() {
    if (confirm('This will clear all patient data and reload sample data. Continue?')) {
        localStorage.removeItem('clinikabayan_patients');
        localStorage.removeItem('clinikabayan_lastPatientId');
        window.location.reload();
    }
};

console.log('All Primary Care functions exposed globally');
console.log('Debug: Run debugPatients() or resetPatientData() in console if needed');

// Search patients
function searchPatients(query) {
    console.log('Searching patients:', query);
    const filterStatus = document.getElementById('filterStatus')?.value || 'all';
    renderPatients(filterStatus, query);
}

// Filter patients by status
function filterPatientsByStatus(status) {
    console.log('Filtering patients by status:', status);
    const searchQuery = document.getElementById('patientSearch')?.value || '';
    renderPatients(status, searchQuery);
}

// View patient details (full modal)
function viewPatientDetails(patientId) {
    console.log('=== viewPatientDetails called ===');
    console.log('Looking for patient ID:', patientId, 'Type:', typeof patientId);
    console.log('Current patients array length:', patients.length);
    
    // Debug: show all patient IDs
    console.log('All patient IDs:', patients.map(p => ({
        id: p.id,
        _id: p._id,
        patientId: p.patientId
    })));
    
    // Handle special case of 'unknown' ID
    if (patientId === 'unknown') {
        console.error('Patient has unknown ID - data issue');
        showNotification('This patient has no valid ID. Please re-register them.', 'warning');
        return;
    }
    
    // Search by id, _id, or patientId - be very flexible
    const patient = patients.find(p => {
        const pId = String(p.id || p._id || p.patientId || '');
        const searchId = String(patientId);
        const match = pId === searchId || pId.toLowerCase() === searchId.toLowerCase();
        if (match) console.log('Match found:', pId, '===', searchId);
        return match;
    });
    
    // If still not found, try matching by index
    if (!patient && !isNaN(patientId) && patients[parseInt(patientId)]) {
        console.log('Fallback: Using array index');
        const indexPatient = patients[parseInt(patientId)];
        if (indexPatient) {
            showPatientModal(indexPatient);
            return;
        }
    }
    
    if (!patient) {
        console.error('Patient not found for ID:', patientId);
        console.error('Available IDs:', patients.map(p => p.id || p._id || p.patientId || 'NO_ID'));
        showNotification('Patient not found! Please refresh the page and try again.', 'danger');
        return;
    }
    
    console.log('Found patient:', patient);
    showPatientModal(patient);
}

// Show patient details modal
function showPatientModal(patient) {
    showPatientDetailsModal(patient);
}

// Beautiful Patient Details Modal
function showPatientDetailsModal(patient) {
    const statusColor = patient.status === 'Active' || patient.status === 'active' ? '#4CAF50' : 
                        patient.status === 'Ongoing' || patient.status === 'ongoing' ? '#FF9800' : '#2196F3';
    
    const historyHTML = (patient.history || []).map(h => `
        <div style="display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
            <i class="fas fa-circle" style="color: #00897B; font-size: 8px; margin-top: 6px;"></i>
            <span style="color: #555; font-size: 13px;">${h}</span>
        </div>
    `).join('') || '<p style="color: #999; font-size: 13px;">No history available</p>';
    
    const medicationsHTML = (patient.medications || []).map(m => `
        <span style="display: inline-block; padding: 6px 12px; background: #E3F2FD; color: #1565C0; border-radius: 20px; font-size: 12px; margin: 4px 4px 4px 0;">
            <i class="fas fa-pills" style="margin-right: 6px;"></i>${m}
        </span>
    `).join('') || '<p style="color: #999; font-size: 13px;">No medications</p>';
    
    const modalContent = `
        <div class="modal-header" style="background: linear-gradient(135deg, #00695C 0%, #00897B 100%); padding: 28px 32px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50%; right: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; animation: floatGently 8s ease-in-out infinite;"></div>
            <div style="position: absolute; bottom: -60%; left: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%; animation: floatGently 6s ease-in-out infinite reverse;"></div>
            <div style="display: flex; align-items: center; gap: 18px; position: relative; z-index: 1;">
                <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); border: 3px solid rgba(255,255,255,0.3);">
                    <i class="fas fa-user" style="font-size: 32px; color: white;"></i>
                </div>
                <div>
                    <h2 style="margin: 0; color: white; font-size: 24px; font-weight: 600; animation: slideInFromLeft 0.5s ease-out;">${patient.firstName || ''} ${patient.lastName || ''}</h2>
                    <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                        <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; margin-right: 10px;">ID: ${patient.id || patient._id || 'N/A'}</span>
                        <span style="background: ${statusColor}; padding: 4px 10px; border-radius: 12px;">${patient.status || 'Active'}</span>
                    </p>
                </div>
            </div>
            <button onclick="closePatientDetailsModal()" style="position: absolute; top: 20px; right: 20px; width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 22px; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); backdrop-filter: blur(4px);" onmouseover="this.style.background='rgba(255,255,255,0.35)';this.style.transform='rotate(90deg) scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.2)';this.style.transform='rotate(0deg) scale(1)'">×</button>
        </div>
        
        <div class="modal-body" style="padding: 0; max-height: 60vh; overflow-y: auto; background: #f8f9fa;">
            <!-- Quick Info Bar -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; background: white; border-bottom: 1px solid #eee;">
                <div style="padding: 16px; text-align: center; border-right: 1px solid #eee; animation: fadeInUp 0.4s ease-out 0.1s both;">
                    <i class="fas fa-birthday-cake" style="color: #00897B; font-size: 20px; margin-bottom: 6px; display: block;"></i>
                    <p style="margin: 0; color: #333; font-weight: 600; font-size: 15px;">${patient.age || 'N/A'}</p>
                    <p style="margin: 2px 0 0; color: #888; font-size: 11px;">Years Old</p>
                </div>
                <div style="padding: 16px; text-align: center; border-right: 1px solid #eee; animation: fadeInUp 0.4s ease-out 0.2s both;">
                    <i class="fas fa-venus-mars" style="color: #E91E63; font-size: 20px; margin-bottom: 6px; display: block;"></i>
                    <p style="margin: 0; color: #333; font-weight: 600; font-size: 15px;">${patient.gender || 'N/A'}</p>
                    <p style="margin: 2px 0 0; color: #888; font-size: 11px;">Gender</p>
                </div>
                <div style="padding: 16px; text-align: center; border-right: 1px solid #eee; animation: fadeInUp 0.4s ease-out 0.3s both;">
                    <i class="fas fa-tint" style="color: #F44336; font-size: 20px; margin-bottom: 6px; display: block;"></i>
                    <p style="margin: 0; color: #333; font-weight: 600; font-size: 15px;">${patient.bloodType || 'N/A'}</p>
                    <p style="margin: 2px 0 0; color: #888; font-size: 11px;">Blood Type</p>
                </div>
                <div style="padding: 16px; text-align: center; animation: fadeInUp 0.4s ease-out 0.4s both;">
                    <i class="fas fa-calendar-check" style="color: #2196F3; font-size: 20px; margin-bottom: 6px; display: block;"></i>
                    <p style="margin: 0; color: #333; font-weight: 600; font-size: 15px;">${patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}</p>
                    <p style="margin: 2px 0 0; color: #888; font-size: 11px;">Last Visit</p>
                </div>
            </div>
            
            <div style="padding: 24px 28px;">
                <!-- Contact Information -->
                <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: formFieldSlide 0.4s ease-out 0.2s both;">
                    <h4 style="margin: 0 0 14px 0; color: #00695C; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-address-card"></i> Contact Information
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <i class="fas fa-phone" style="color: #00897B; width: 20px;"></i>
                            <span style="color: #555; font-size: 13px;">${patient.phone || 'N/A'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <i class="fas fa-envelope" style="color: #00897B; width: 20px;"></i>
                            <span style="color: #555; font-size: 13px;">${patient.email || 'N/A'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px; grid-column: 1 / -1;">
                            <i class="fas fa-map-marker-alt" style="color: #00897B; width: 20px;"></i>
                            <span style="color: #555; font-size: 13px;">${patient.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Vital Signs -->
                <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: formFieldSlide 0.4s ease-out 0.3s both;">
                    <h4 style="margin: 0 0 14px 0; color: #00695C; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-heartbeat"></i> Latest Vital Signs
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                        <div style="text-align: center; padding: 14px; background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border-radius: 10px;">
                            <i class="fas fa-heart" style="color: #43A047; font-size: 18px;"></i>
                            <p style="margin: 8px 0 2px; font-weight: 600; color: #2E7D32; font-size: 14px;">${patient.vitalSigns?.bp || 'N/A'}</p>
                            <p style="margin: 0; color: #66BB6A; font-size: 10px; text-transform: uppercase;">Blood Pressure</p>
                        </div>
                        <div style="text-align: center; padding: 14px; background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%); border-radius: 10px;">
                            <i class="fas fa-pulse" style="color: #D81B60; font-size: 18px;"></i>
                            <p style="margin: 8px 0 2px; font-weight: 600; color: #AD1457; font-size: 14px;">${patient.vitalSigns?.hr || 'N/A'}</p>
                            <p style="margin: 0; color: #EC407A; font-size: 10px; text-transform: uppercase;">Heart Rate</p>
                        </div>
                        <div style="text-align: center; padding: 14px; background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 10px;">
                            <i class="fas fa-thermometer-half" style="color: #1976D2; font-size: 18px;"></i>
                            <p style="margin: 8px 0 2px; font-weight: 600; color: #1565C0; font-size: 14px;">${patient.vitalSigns?.temp || 'N/A'}</p>
                            <p style="margin: 0; color: #42A5F5; font-size: 10px; text-transform: uppercase;">Temperature</p>
                        </div>
                        <div style="text-align: center; padding: 14px; background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border-radius: 10px;">
                            <i class="fas fa-weight" style="color: #EF6C00; font-size: 18px;"></i>
                            <p style="margin: 8px 0 2px; font-weight: 600; color: #E65100; font-size: 14px;">${patient.vitalSigns?.weight || 'N/A'}</p>
                            <p style="margin: 0; color: #FB8C00; font-size: 10px; text-transform: uppercase;">Weight</p>
                        </div>
                    </div>
                </div>
                
                <!-- Medical Info -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: formFieldSlide 0.4s ease-out 0.4s both;">
                        <h4 style="margin: 0 0 12px 0; color: #F44336; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-exclamation-triangle"></i> Allergies
                        </h4>
                        <p style="margin: 0; color: #555; font-size: 13px; padding: 10px; background: #FFF3F3; border-radius: 8px; border-left: 3px solid #F44336;">${patient.allergies || 'None known'}</p>
                    </div>
                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: formFieldSlide 0.4s ease-out 0.45s both;">
                        <h4 style="margin: 0 0 12px 0; color: #9C27B0; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-notes-medical"></i> Current Condition
                        </h4>
                        <p style="margin: 0; color: #555; font-size: 13px; padding: 10px; background: #F3E5F5; border-radius: 8px; border-left: 3px solid #9C27B0;">${patient.condition || 'General checkup'}</p>
                    </div>
                </div>
                
                <!-- Medications -->
                <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: formFieldSlide 0.4s ease-out 0.5s both;">
                    <h4 style="margin: 0 0 12px 0; color: #1565C0; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-prescription-bottle-alt"></i> Current Medications
                    </h4>
                    <div>${medicationsHTML}</div>
                </div>
                
                <!-- Visit History -->
                <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: formFieldSlide 0.4s ease-out 0.55s both;">
                    <h4 style="margin: 0 0 12px 0; color: #00695C; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-history"></i> Recent Visit History
                    </h4>
                    <div>${historyHTML}</div>
                </div>
            </div>
        </div>
        
        <div style="padding: 20px 28px; background: white; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 12px; animation: fadeInUp 0.5s ease-out 0.6s both;">
            <button onclick="closePatientDetailsModal()" style="padding: 12px 24px; border: 2px solid #e0e0e0; border-radius: 10px; background: white; color: #666; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.3s; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#f5f5f5';this.style.transform='translateY(-2px)'" onmouseout="this.style.background='white';this.style.transform='translateY(0)'">
                <i class="fas fa-times"></i> Close
            </button>
            <button onclick="closePatientDetailsModal(); openNewPatientForm();" style="padding: 12px 24px; border: none; border-radius: 10px; background: linear-gradient(135deg, #00897B 0%, #00695C 100%); color: white; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.3s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,137,123,0.3);" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,137,123,0.4)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 15px rgba(0,137,123,0.3)'">
                <i class="fas fa-edit"></i> Edit Record
            </button>
        </div>
    `;
    
    // Create or get modal
    let modal = document.getElementById('patientDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'patientDetailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closePatientDetailsModal()"></div>
            <div class="modal-content" id="patientDetailsContent" style="max-width: 700px; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 80px rgba(0,0,0,0.3);"></div>
        `;
        document.body.appendChild(modal);
    }
    
    const content = document.getElementById('patientDetailsContent');
    if (content) {
        content.innerHTML = modalContent;
    }
    
    modal.style.display = 'flex';
    modal.classList.add('active');
}

function closePatientDetailsModal() {
    const modal = document.getElementById('patientDetailsModal');
    if (modal) {
        const content = modal.querySelector('.modal-content');
        if (content) content.classList.add('closing');
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('active', 'closing');
            if (content) content.classList.remove('closing');
        }, 300);
    }
}
window.closePatientDetailsModal = closePatientDetailsModal;

// Edit supply
function editSupply(supplyId) {
    const supply = supplies.find(s => s.id === supplyId);
    if (!supply) return;
    
    const newQty = prompt(`Update quantity for ${supply.name}\n\nCurrent: ${supply.quantity}\nReorder Level: ${supply.reorderLevel}\n\nEnter new quantity:`, supply.quantity);
    
    if (newQty !== null) {
        const qty = parseInt(newQty);
        if (!isNaN(qty) && qty >= 0) {
            supply.quantity = qty;
            
            // Update status
            if (qty < supply.reorderLevel * 0.5) {
                supply.status = 'critical';
            } else if (qty < supply.reorderLevel) {
                supply.status = 'low';
            } else {
                supply.status = 'adequate';
            }
            
            localStorage.setItem('clinikabayan_supplies', JSON.stringify(supplies));
            renderSupplies();
            showNotification(`${supply.name} quantity updated to ${qty}`, 'success');
        }
    }
}

// Contact volunteer
function contactVolunteer(volunteerId) {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    alert(`Contact ${volunteer.name}\n\n${volunteer.role}\nLicense: ${volunteer.license}\nSchedule: ${volunteer.schedule}\n\nIn the full application, this would show:\n- Phone number\n- Email address\n- Send message option\n- Schedule appointment`);
}

// View volunteer details
function viewVolunteerDetails(volunteerId) {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    
    alert(`Volunteer Details\n\nName: ${volunteer.name}\nRole: ${volunteer.role}\nLicense: ${volunteer.license}\nStatus: ${volunteer.status}\nSchedule: ${volunteer.schedule}\n\nIn the full application, this would show:\n- Complete profile\n- Specializations\n- Patient reviews\n- Availability calendar\n- Performance metrics`);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
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
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// ADD SUPPLY MODAL FUNCTIONS
// ============================================

function openAddSupplyForm() {
    const modal = document.getElementById('addSupplyModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        const form = document.getElementById('addSupplyForm');
        if (form) form.reset();
    }
}
window.openAddSupplyForm = openAddSupplyForm;

function closeAddSupplyModal() {
    const modal = document.getElementById('addSupplyModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}
window.closeAddSupplyModal = closeAddSupplyModal;

async function saveNewSupply() {
    const name = document.getElementById('supplyName').value.trim();
    const category = document.getElementById('supplyCategory').value;
    const quantity = parseInt(document.getElementById('supplyQuantity').value) || 0;
    const reorderLevel = parseInt(document.getElementById('supplyReorderLevel').value) || 0;
    
    if (!name || !category) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newSupply = {
        id: supplies.length + 1,
        name: name,
        quantity: quantity,
        reorderLevel: reorderLevel,
        category: category,
        status: quantity > reorderLevel ? 'adequate' : (quantity > 0 ? 'low' : 'critical')
    };
    
    // Save to API
    if (USE_API && typeof api !== 'undefined') {
        try {
            const result = await api.createInventoryItem({
                name: name,
                category: category,
                quantity: quantity,
                reorderLevel: reorderLevel,
                unit: 'pcs',
                location: 'Primary Care Storage'
            });
            console.log('Supply saved to API:', result);
        } catch (error) {
            console.error('Error saving supply to API:', error);
        }
    }
    
    supplies.push(newSupply);
    localStorage.setItem('clinikabayan_supplies', JSON.stringify(supplies));
    renderSupplies();
    closeAddSupplyModal();
    showNotification(`${name} added successfully!`, 'success');
}
window.saveNewSupply = saveNewSupply;

// ============================================
// ADD VOLUNTEER MODAL FUNCTIONS
// ============================================

function openAddVolunteerForm() {
    const modal = document.getElementById('addVolunteerModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        const form = document.getElementById('addVolunteerForm');
        if (form) form.reset();
    }
}
window.openAddVolunteerForm = openAddVolunteerForm;

function closeAddVolunteerModal() {
    const modal = document.getElementById('addVolunteerModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}
window.closeAddVolunteerModal = closeAddVolunteerModal;

function saveNewVolunteer() {
    const name = document.getElementById('volunteerName').value.trim();
    const role = document.getElementById('volunteerRole').value;
    const license = document.getElementById('volunteerLicense').value.trim();
    const phone = document.getElementById('volunteerPhone').value.trim();
    const schedule = document.getElementById('volunteerSchedule').value.trim();
    
    if (!name || !role || !license || !schedule) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newVolunteer = {
        id: volunteers.length + 1,
        name: name,
        role: role,
        license: license,
        phone: phone,
        status: 'available',
        schedule: schedule
    };
    
    volunteers.push(newVolunteer);
    localStorage.setItem('clinikabayan_volunteers', JSON.stringify(volunteers));
    renderVolunteers();
    closeAddVolunteerModal();
    showNotification(`${name} added successfully!`, 'success');
}
window.saveNewVolunteer = saveNewVolunteer;

// ============================================
// ADD TEST MODAL FUNCTIONS
// ============================================

function openAddTestForm() {
    const modal = document.getElementById('addTestModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        const form = document.getElementById('addTestForm');
        if (form) form.reset();
    }
}
window.openAddTestForm = openAddTestForm;

function closeAddTestModal() {
    const modal = document.getElementById('addTestModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}
window.closeAddTestModal = closeAddTestModal;

function saveNewTest() {
    const name = document.getElementById('testName').value.trim();
    const category = document.getElementById('testCategory').value;
    const description = document.getElementById('testDescription').value.trim();
    const duration = parseInt(document.getElementById('testDuration').value) || 15;
    const cost = parseInt(document.getElementById('testCost').value) || 0;
    const normalRange = document.getElementById('testNormalRange').value.trim();
    
    if (!name || !category) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Add to tests display (you could store in localStorage if needed)
    const testsGrid = document.querySelector('#tab-tests .tests-grid');
    if (testsGrid) {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
            <div class="test-icon" style="background: linear-gradient(135deg, #FF5722, #E64A19);">
                <i class="fas fa-flask"></i>
            </div>
            <div class="test-info">
                <h4>${name}</h4>
                <p>${description || category}</p>
                <span class="test-duration"><i class="fas fa-clock"></i> ${duration} mins</span>
                ${cost > 0 ? `<span class="test-cost"><i class="fas fa-peso-sign"></i> ₱${cost}</span>` : '<span class="test-cost free">Free</span>'}
            </div>
            <button class="btn-info" onclick="alert('Test: ${name}\\nCategory: ${category}\\nDuration: ${duration} mins\\nCost: ${cost > 0 ? '₱' + cost : 'Free'}\\nNormal Range: ${normalRange || 'N/A'}')">
                <i class="fas fa-info-circle"></i>
            </button>
        `;
        testsGrid.appendChild(testCard);
    }
    
    closeAddTestModal();
    showNotification(`${name} test added successfully!`, 'success');
}
window.saveNewTest = saveNewTest;

// All modal functions are now exported immediately after their definitions above

// Comprehensive Medical Test Information (Sources: WHO, AHA, CDC, NIH)
const medicalTestData = {
    'blood-sugar': {
        title: 'Blood Sugar (Glucose) Test',
        icon: 'fa-tint',
        color: '#2196F3',
        description: 'Blood glucose testing measures the amount of sugar (glucose) in your blood. It is the primary test for diagnosing and monitoring diabetes.',
        categories: [
            {
                name: 'Fasting Blood Sugar (FBS)',
                subtitle: 'After 8+ hours of fasting',
                ranges: [
                    { label: 'Normal', value: '70-99 mg/dL (3.9-5.5 mmol/L)', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Prediabetes', value: '100-125 mg/dL (5.6-6.9 mmol/L)', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Diabetes', value: '126 mg/dL or higher (7.0+ mmol/L)', color: '#F44336', icon: 'fa-times-circle' }
                ]
            },
            {
                name: 'Random Blood Sugar',
                subtitle: 'Any time of day',
                ranges: [
                    { label: 'Normal', value: 'Below 140 mg/dL (7.8 mmol/L)', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Prediabetes', value: '140-199 mg/dL (7.8-11.0 mmol/L)', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Diabetes', value: '200 mg/dL or higher (11.1+ mmol/L)', color: '#F44336', icon: 'fa-times-circle' }
                ]
            },
            {
                name: 'HbA1c (Glycated Hemoglobin)',
                subtitle: 'Average blood sugar over 2-3 months',
                ranges: [
                    { label: 'Normal', value: 'Below 5.7%', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Prediabetes', value: '5.7% - 6.4%', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Diabetes', value: '6.5% or higher', color: '#F44336', icon: 'fa-times-circle' }
                ]
            }
        ],
        tips: [
            'Fast for at least 8 hours before a fasting blood sugar test',
            'Stay hydrated with water during fasting',
            'Avoid strenuous exercise before the test',
            'Inform your healthcare provider about any medications'
        ],
        source: 'American Diabetes Association (ADA) Standards of Care 2024'
    },
    'blood-pressure': {
        title: 'Blood Pressure Monitoring',
        icon: 'fa-heart',
        color: '#E91E63',
        description: 'Blood pressure is the force of blood pushing against artery walls. It is measured in millimeters of mercury (mmHg) with two numbers: systolic (heart beating) over diastolic (heart resting).',
        categories: [
            {
                name: 'Blood Pressure Categories',
                subtitle: 'Based on AHA/ACC 2017 Guidelines',
                ranges: [
                    { label: 'Normal', value: 'Systolic < 120 AND Diastolic < 80 mmHg', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Elevated', value: 'Systolic 120-129 AND Diastolic < 80 mmHg', color: '#8BC34A', icon: 'fa-arrow-up' },
                    { label: 'High BP Stage 1', value: 'Systolic 130-139 OR Diastolic 80-89 mmHg', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'High BP Stage 2', value: 'Systolic ≥ 140 OR Diastolic ≥ 90 mmHg', color: '#FF5722', icon: 'fa-exclamation-circle' },
                    { label: 'Hypertensive Crisis', value: 'Systolic > 180 AND/OR Diastolic > 120 mmHg', color: '#F44336', icon: 'fa-times-circle' }
                ]
            }
        ],
        tips: [
            'Rest for 5 minutes before measurement',
            'Sit with feet flat on floor, back supported',
            'Arm should be at heart level',
            'Avoid caffeine, exercise, and smoking 30 min before',
            'Take multiple readings and record the average',
            'Measure at the same time each day for consistency'
        ],
        source: 'American Heart Association (AHA) & American College of Cardiology (ACC) 2017'
    },
    'bmi': {
        title: 'Body Mass Index (BMI) Assessment',
        icon: 'fa-weight',
        color: '#9C27B0',
        description: 'BMI is a measure of body fat based on height and weight. Formula: BMI = weight (kg) ÷ height² (m²). It is a screening tool, not a diagnostic measure.',
        categories: [
            {
                name: 'Adult BMI Categories',
                subtitle: 'For adults 20 years and older',
                ranges: [
                    { label: 'Underweight', value: 'BMI < 18.5', color: '#2196F3', icon: 'fa-arrow-down' },
                    { label: 'Normal Weight', value: 'BMI 18.5 - 24.9', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Overweight', value: 'BMI 25.0 - 29.9', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Obesity Class I', value: 'BMI 30.0 - 34.9', color: '#FF5722', icon: 'fa-exclamation-circle' },
                    { label: 'Obesity Class II', value: 'BMI 35.0 - 39.9', color: '#E91E63', icon: 'fa-times-circle' },
                    { label: 'Obesity Class III', value: 'BMI ≥ 40', color: '#F44336', icon: 'fa-times-circle' }
                ]
            },
            {
                name: 'Asian BMI Categories',
                subtitle: 'WHO recommendations for Asian populations',
                ranges: [
                    { label: 'Underweight', value: 'BMI < 18.5', color: '#2196F3', icon: 'fa-arrow-down' },
                    { label: 'Normal Weight', value: 'BMI 18.5 - 22.9', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Overweight', value: 'BMI 23.0 - 24.9', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Obesity', value: 'BMI ≥ 25', color: '#F44336', icon: 'fa-times-circle' }
                ]
            }
        ],
        tips: [
            'BMI does not measure body fat directly',
            'Athletes may have high BMI due to muscle mass',
            'Consider waist circumference as additional measure',
            'Children and teens use age-specific BMI percentiles',
            'Consult healthcare provider for comprehensive assessment'
        ],
        source: 'World Health Organization (WHO) & CDC Guidelines'
    },
    'respiratory': {
        title: 'Respiratory Assessment',
        icon: 'fa-lungs',
        color: '#00BCD4',
        description: 'Respiratory assessment evaluates lung function through oxygen saturation (SpO2), respiratory rate, and basic lung sounds. It is crucial for detecting respiratory conditions.',
        categories: [
            {
                name: 'Oxygen Saturation (SpO2)',
                subtitle: 'Measured by pulse oximeter',
                ranges: [
                    { label: 'Normal', value: '95% - 100%', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Mild Hypoxemia', value: '91% - 94%', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Moderate Hypoxemia', value: '86% - 90%', color: '#FF5722', icon: 'fa-exclamation-circle' },
                    { label: 'Severe Hypoxemia', value: 'Below 85%', color: '#F44336', icon: 'fa-times-circle' }
                ]
            },
            {
                name: 'Respiratory Rate (Adults)',
                subtitle: 'Breaths per minute at rest',
                ranges: [
                    { label: 'Normal', value: '12 - 20 breaths/min', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Tachypnea (Fast)', value: '> 20 breaths/min', color: '#FF9800', icon: 'fa-arrow-up' },
                    { label: 'Bradypnea (Slow)', value: '< 12 breaths/min', color: '#2196F3', icon: 'fa-arrow-down' }
                ]
            },
            {
                name: 'Peak Expiratory Flow (PEF)',
                subtitle: 'For asthma monitoring',
                ranges: [
                    { label: 'Green Zone', value: '80% - 100% of personal best', color: '#4CAF50', icon: 'fa-check-circle' },
                    { label: 'Yellow Zone', value: '50% - 79% of personal best', color: '#FF9800', icon: 'fa-exclamation-triangle' },
                    { label: 'Red Zone', value: 'Below 50% of personal best', color: '#F44336', icon: 'fa-times-circle' }
                ]
            }
        ],
        tips: [
            'Remove nail polish for accurate pulse oximeter readings',
            'Warm hands if cold for better readings',
            'Count respirations for a full 60 seconds',
            'Note breathing effort and use of accessory muscles',
            'Seek immediate care if SpO2 drops below 92%'
        ],
        source: 'National Institutes of Health (NIH) & WHO Guidelines'
    }
};

// View test information - creates beautiful modal
function viewTestInfo(testType) {
    console.log('Viewing test info:', testType);
    
    const data = medicalTestData[testType];
    if (!data) {
        alert('Test information not available');
        return;
    }
    
    // Build modal content
    let categoriesHTML = data.categories.map(cat => `
        <div style="margin-bottom: 24px;">
            <h4 style="color: #333; font-size: 16px; margin: 0 0 4px 0; font-weight: 600;">${cat.name}</h4>
            <p style="color: #666; font-size: 13px; margin: 0 0 12px 0;">${cat.subtitle}</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${cat.ranges.map(range => `
                    <div style="display: flex; align-items: center; padding: 12px 16px; background: linear-gradient(135deg, ${range.color}15 0%, ${range.color}08 100%); border-left: 4px solid ${range.color}; border-radius: 8px;">
                        <i class="fas ${range.icon}" style="color: ${range.color}; font-size: 18px; margin-right: 12px; width: 24px; text-align: center;"></i>
                        <div style="flex: 1;">
                            <span style="font-weight: 600; color: ${range.color}; font-size: 14px;">${range.label}</span>
                            <span style="color: #555; font-size: 13px; margin-left: 8px;">${range.value}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    let tipsHTML = data.tips.map(tip => `
        <li style="margin-bottom: 8px; color: #555; font-size: 13px;">
            <i class="fas fa-check" style="color: #4CAF50; margin-right: 8px; font-size: 11px;"></i>${tip}
        </li>
    `).join('');
    
    const modalContent = `
        <div class="modal-header" style="background: linear-gradient(135deg, ${data.color} 0%, ${data.color}CC 100%); padding: 28px 32px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50%; right: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -60%; left: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
                <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <i class="fas ${data.icon}" style="font-size: 26px; color: white;"></i>
                </div>
                <div>
                    <h2 style="margin: 0; color: white; font-size: 22px; font-weight: 600;">${data.title}</h2>
                    <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Medical Interpretation Guide</p>
                </div>
            </div>
            <button onclick="closeTestInfoModal()" style="position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: none; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; backdrop-filter: blur(4px);" onmouseover="this.style.background='rgba(255,255,255,0.35)';this.style.transform='rotate(90deg)'" onmouseout="this.style.background='rgba(255,255,255,0.2)';this.style.transform='rotate(0deg)'">×</button>
        </div>
        
        <div class="modal-body" style="padding: 28px 32px; max-height: 60vh; overflow-y: auto; background: linear-gradient(180deg, #f8f9fa 0%, white 100%);">
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; padding: 16px; background: #f0f7ff; border-radius: 10px; border-left: 4px solid ${data.color};">
                <i class="fas fa-info-circle" style="color: ${data.color}; margin-right: 8px;"></i>
                ${data.description}
            </p>
            
            ${categoriesHTML}
            
            <div style="background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%); border-radius: 12px; padding: 20px; margin-top: 8px;">
                <h4 style="color: #2E7D32; font-size: 15px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-lightbulb" style="color: #66BB6A;"></i> Preparation Tips
                </h4>
                <ul style="margin: 0; padding: 0; list-style: none;">
                    ${tipsHTML}
                </ul>
            </div>
        </div>
        
        <div style="padding: 16px 32px 20px; background: white; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0; font-size: 11px; color: #888;">
                <i class="fas fa-book-medical" style="margin-right: 6px;"></i>
                Source: ${data.source}
            </p>
            <button onclick="closeTestInfoModal()" style="padding: 10px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, ${data.color} 0%, ${data.color}CC 100%); color: white; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.3s; box-shadow: 0 4px 12px ${data.color}40;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px ${data.color}50'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px ${data.color}40'">
                Got It
            </button>
        </div>
    `;
    
    const modal = document.getElementById('testInfoModal');
    const content = document.getElementById('testInfoContent');
    
    if (modal && content) {
        content.innerHTML = modalContent;
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

function closeTestInfoModal() {
    const modal = document.getElementById('testInfoModal');
    const content = document.getElementById('testInfoContent');
    
    if (modal) {
        if (content) content.classList.add('closing');
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('active', 'closing');
            if (content) content.classList.remove('closing');
        }, 300);
    }
}

// Export functions
window.viewPatient = viewPatient;
window.viewTestInfo = viewTestInfo;
window.closeTestInfoModal = closeTestInfoModal;
