// ============================================
// PRIMARY CARE SERVICES JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize tabs
    initTabs();
    
    // Setup event listeners
    setupEventListeners();
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
// PATIENT REGISTRATION FUNCTIONS
// ============================================

// Store for patients (simulating database)
let patients = JSON.parse(localStorage.getItem('clinikabayan_patients')) || [];
let currentPatientId = localStorage.getItem('clinikabayan_lastPatientId') || 0;

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
    
    // Save to storage
    patients.push(patientData);
    localStorage.setItem('clinikabayan_patients', JSON.stringify(patients));
    localStorage.setItem('clinikabayan_lastPatientId', currentPatientId);
    
    // Show success message
    showNotification(`Patient registered successfully! ID: ${patientId}`, 'success');
    
    // Close registration modal
    closeNewPatientModal();
    
    // Open medical record modal for first consultation
    setTimeout(() => {
        openPatientRecordModal(patientData);
    }, 500);
    
    // Add patient card to dashboard
    addPatientCard(patientData);
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

// Export functions to window
window.openNewPatientForm = openNewPatientForm;
window.closeNewPatientModal = closeNewPatientModal;
window.calculateAge = calculateAge;
window.saveNewPatient = saveNewPatient;
window.closePatientRecordModal = closePatientRecordModal;
window.saveMedicalRecord = saveMedicalRecord;
window.saveDraft = saveDraft;
window.viewPatientDetails = viewPatientDetails;

// Search patients
function searchPatients(query) {
    console.log('Searching patients:', query);
    // In real app, this would filter the patient list
    if (query.length >= 3) {
        // Perform search
        console.log('Performing search for:', query);
    }
}

// Filter patients by status
function filterPatientsByStatus(status) {
    console.log('Filtering patients by status:', status);
    // In real app, this would filter the patient cards
}

// Open add supply form
function openAddSupplyForm() {
    console.log('Opening add supply form');
    alert('Add Medical Supply\n\nThis would open a form to add:\n- Supply Name\n- Quantity\n- Reorder Level\n- Expiration Date\n- Storage Location');
}

// Open add volunteer form
function openAddVolunteerForm() {
    console.log('Opening add volunteer form');
    alert('Add Volunteer\n\nThis would open a form to register:\n- Full Name\n- Specialization/Role\n- License Number\n- Contact Information\n- Availability Schedule');
}

// Open add test form
function openAddTestForm() {
    console.log('Opening add test form');
    alert('Add Medical Test\n\nThis would open a form to add:\n- Test Name\n- Description\n- Duration\n- Cost\n- Interpretation Guidelines');
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
