// ============================================
// PRIMARY CARE SERVICES JAVASCRIPT
// ============================================

// Data Storage
let patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
let supplies = JSON.parse(localStorage.getItem('clinikabayan_supplies')) || [];
let volunteers = JSON.parse(localStorage.getItem('clinikabayan_volunteers')) || [];
let tests = JSON.parse(localStorage.getItem('clinikabayan_tests')) || [];
let currentPatientId = parseInt(localStorage.getItem('clinikabayan_lastPatientId') || '0');

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
    localStorage.setItem('clinikabayan_lastPatientId', currentPatientId);
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Primary Care page loading...');
    checkAuth();
    initTabs();
    setupEventListeners();
    renderPatients();
    renderSupplies();
    renderVolunteers();
    renderTests();
    console.log('Primary Care page loaded successfully');
});

// Initialize tabs functionality
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });
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
            p.firstName.toLowerCase().includes(query) ||
            p.lastName.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query) ||
            p.address.toLowerCase().includes(query)
        );
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No patients found.</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(patient => `
        <div class="patient-card" onclick="viewPatientDetails('${patient.id}')">
            <div class="patient-header">
                <div class="patient-avatar ${patient.gender === 'Male' ? 'male' : ''}">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-basic-info">
                    <h4>${patient.firstName} ${patient.lastName}</h4>
                    <p class="patient-id">ID: ${patient.id}</p>
                </div>
                <span class="badge badge-${patient.status === 'active' ? 'success' : patient.status === 'ongoing' ? 'warning' : 'primary'}">${patient.status}</span>
            </div>
            <div class="patient-details">
                <div class="detail-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${patient.age} years old, ${patient.gender}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${patient.address}</span>
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
    `).join('');
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
    const modal = document.getElementById('newPatientModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
        
        // Reset form
        document.getElementById('patientRegistrationForm').reset();
        
        // Set current date for DOB field max
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateOfBirth').setAttribute('max', today);
    }
}

// Close new patient modal
function closeNewPatientModal() {
    const modal = document.getElementById('newPatientModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

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
function saveNewPatient() {
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
    
    // Save to storage
    patients.push(patientData);
    
    // Add to patient list for rendering (if not already there)
    const patientsList = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
    if (!patientsList.find(p => p.id === simplePatient.id)) {
        patientsList.push(simplePatient);
        localStorage.setItem('clinikabayan_patients', JSON.stringify(patientsList));
    }
    
    localStorage.setItem('clinikabayan_lastPatientId', currentPatientId);
    
    // Update patient data with simplified version
    patients = patientsList;
    
    // Show success message
    showNotification(`Patient registered successfully! ID: ${patientId}`, 'success');
    
    // Close registration modal
    closeNewPatientModal();
    
    // Refresh patient list
    renderPatients();
    
    // Open medical record modal for first consultation
    setTimeout(() => {
        openPatientRecordModal(patientData);
    }, 500);
}

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

// View patient details
function viewPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        openPatientRecordModal(patient);
    }
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
window.openAddSupplyForm = openAddSupplyForm;
window.openAddVolunteerForm = openAddVolunteerForm;
window.openAddTestForm = openAddTestForm;
window.editSupply = editSupply;
window.contactVolunteer = contactVolunteer;
window.viewVolunteerDetails = viewVolunteerDetails;
window.logout = logout;

console.log('All Primary Care functions exposed globally');

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
    console.log('Viewing patient details:', patientId);
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        alert('Patient not found!');
        return;
    }
    
    alert(`Patient Details\n\nID: ${patient.id}\nName: ${patient.firstName} ${patient.lastName}\nAge: ${patient.age}\nGender: ${patient.gender}\nAddress: ${patient.address}\nPhone: ${patient.phone || 'N/A'}\nLast Visit: ${formatDate(patient.lastVisit)}\nStatus: ${patient.status}\nCondition: ${patient.condition}\n\nIn the full application, this would open a detailed modal with:\n- Complete medical history\n- Vital signs chart\n- Lab results\n- Prescriptions\n- Appointment history`);
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

// Open add supply form
function openAddSupplyForm() {
    console.log('Opening add supply form');
    
    const supplyName = prompt('Enter supply name:');
    if (!supplyName) return;
    
    const quantity = prompt('Enter initial quantity:', '100');
    if (!quantity) return;
    
    const reorderLevel = prompt('Enter reorder level:', '50');
    if (!reorderLevel) return;
    
    const category = prompt('Enter category (Medication/Antibiotics/Equipment/Supplies):', 'Medication');
    if (!category) return;
    
    const newSupply = {
        id: supplies.length + 1,
        name: supplyName,
        quantity: parseInt(quantity),
        reorderLevel: parseInt(reorderLevel),
        category: category,
        status: 'adequate'
    };
    
    supplies.push(newSupply);
    localStorage.setItem('clinikabayan_supplies', JSON.stringify(supplies));
    renderSupplies();
    showNotification(`${supplyName} added successfully!`, 'success');
}

// Open add volunteer form
function openAddVolunteerForm() {
    console.log('Opening add volunteer form');
    
    const name = prompt('Enter volunteer full name:');
    if (!name) return;
    
    const role = prompt('Enter role (e.g., General Physician, Nurse, Midwife):', 'General Physician');
    if (!role) return;
    
    const license = prompt('Enter license number:');
    if (!license) return;
    
    const schedule = prompt('Enter availability schedule (e.g., Mon, Wed, Fri):', 'Mon, Wed');
    if (!schedule) return;
    
    const newVolunteer = {
        id: volunteers.length + 1,
        name: name,
        role: role,
        license: license,
        status: 'available',
        schedule: schedule
    };
    
    volunteers.push(newVolunteer);
    localStorage.setItem('clinikabayan_volunteers', JSON.stringify(volunteers));
    renderVolunteers();
    showNotification(`${name} added successfully!`, 'success');
}

// Open add test form
function openAddTestForm() {
    console.log('Opening add test form');
    alert('Add Medical Test\n\nThis feature allows adding new diagnostic tests.\n\nIn the full application, this would open a form to add:\n- Test Name\n- Description\n- Duration\n- Cost\n- Interpretation Guidelines\n- Normal ranges\n- Required equipment');
}

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
