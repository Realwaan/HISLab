const mongoose = require('mongoose');

// Patient Schema
const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },
    contactNumber: { type: String },
    email: { type: String },
    address: { type: String },
    status: { type: String, default: 'active' },
    condition: { type: String },
    lastVisit: { type: Date },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        contactNumber: String
    },
    bloodType: { type: String },
    allergies: [String],
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    appointmentId: { type: String, unique: true, sparse: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    patientName: { type: String, required: true },
    type: { type: String, default: 'General Checkup' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, default: 'Scheduled' },
    doctor: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
    taskId: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, default: 'Medium' },
    status: { type: String, default: 'Pending' },
    dueDate: { type: Date },
    assignedTo: { type: String },
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Transport Request Schema
const transportSchema = new mongoose.Schema({
    requestId: { type: String, unique: true, sparse: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    patientName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    pickupLocation: { type: String },
    destination: { type: String },
    from: { type: String },
    to: { type: String },
    reason: { type: String },
    requestDate: { type: Date },
    requestTime: { type: String },
    requestedAt: { type: Date, default: Date.now },
    transportType: { type: String, default: 'Ambulance' },
    status: { type: String, default: 'pending' },
    priority: { type: String, default: 'MEDIUM' },
    notes: { type: String },
    driver: { type: String },
    vehicle: { type: String },
    assignedVehicle: { type: String },
    assignedDriver: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Health Campaign Schema
const campaignSchema = new mongoose.Schema({
    campaignId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String },
    targetParticipants: { type: Number, default: 100 },
    currentParticipants: { type: Number, default: 0 },
    actualParticipants: { type: Number, default: 0 },
    status: { type: String, default: 'upcoming' },
    budget: { type: Number },
    resources: [{
        item: String,
        quantity: Number
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// User Schema (for authentication)
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Doctor', 'Nurse', 'Staff', 'Receptionist'], default: 'Staff' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Inventory Schema
const inventorySchema = new mongoose.Schema({
    itemId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    unit: { type: String, default: 'pcs' },
    minStock: { type: Number, default: 10 },
    location: { type: String },
    expiryDate: { type: Date },
    supplier: { type: String },
    lastRestocked: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = {
    Patient: mongoose.model('Patient', patientSchema),
    Appointment: mongoose.model('Appointment', appointmentSchema),
    Task: mongoose.model('Task', taskSchema),
    Transport: mongoose.model('Transport', transportSchema),
    Campaign: mongoose.model('Campaign', campaignSchema),
    User: mongoose.model('User', userSchema),
    Inventory: mongoose.model('Inventory', inventorySchema)
};
