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
    // In real app, this would open a detailed patient modal or navigate to patient page
    alert(`Opening patient record for Patient ID: ${patientId}\n\nIn the full application, this would show:\n- Complete medical history\n- Test results\n- Prescriptions\n- Upcoming appointments`);
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
    
    // Show patient details in a modal or alert
    const details = `
Patient Details

ID: ${patient.id || patient._id || patient.patientId || 'N/A'}
Name: ${patient.firstName || ''} ${patient.lastName || ''}
Age: ${patient.age || 'N/A'}
Gender: ${patient.gender || 'N/A'}
Address: ${patient.address || 'N/A'}
Phone: ${patient.phone || patient.contactNumber || 'N/A'}
Last Visit: ${patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}
Status: ${patient.status || 'N/A'}
Condition: ${patient.condition || 'N/A'}

In the full application, this would open a detailed modal with:
- Complete medical history
- Vital signs chart
- Lab results
- Prescriptions
- Appointment history
    `.trim();
    
    alert(details);
}

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

// View test information
function viewTestInfo(testType) {
    console.log('Viewing test info:', testType);
    
    const testInfo = {
        'blood-sugar': {
            title: 'Blood Sugar Test Interpretation',
            normal: 'Fasting: 70-100 mg/dL | Random: < 140 mg/dL',
            prediabetes: 'Fasting: 100-125 mg/dL | Random: 140-199 mg/dL',
            diabetes: 'Fasting: ≥ 126 mg/dL | Random: ≥ 200 mg/dL'
        },
        'blood-pressure': {
            title: 'Blood Pressure Interpretation',
            normal: 'Systolic: < 120 mmHg | Diastolic: < 80 mmHg',
            elevated: 'Systolic: 120-129 mmHg | Diastolic: < 80 mmHg',
            hypertension: 'Systolic: ≥ 130 mmHg | Diastolic: ≥ 80 mmHg'
        },
        'bmi': {
            title: 'BMI Interpretation',
            underweight: 'BMI < 18.5',
            normal: 'BMI: 18.5-24.9',
            overweight: 'BMI: 25-29.9',
            obese: 'BMI ≥ 30'
        },
        'respiratory': {
            title: 'Respiratory Assessment',
            normal: 'O2 Saturation: ≥ 95% | Respiratory Rate: 12-20 breaths/min',
            concern: 'O2 Saturation: 90-94% | May need supplemental oxygen',
            critical: 'O2 Saturation: < 90% | Immediate medical attention required'
        }
    };
    
    const info = testInfo[testType];
    if (info) {
        let message = `${info.title}\n\n`;
        for (let key in info) {
            if (key !== 'title') {
                message += `${key.toUpperCase()}: ${info[key]}\n`;
            }
        }
        alert(message);
    }
}

// Export functions
window.viewPatient = viewPatient;
window.viewTestInfo = viewTestInfo;
