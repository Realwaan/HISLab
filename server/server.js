require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Patient, Appointment, Task, Transport, Campaign, User, Inventory } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Generate unique IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'Staff'
        });
        
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        user.lastLogin = new Date();
        await user.save();
        
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// PATIENT ROUTES
// ============================================

// Get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single patient
app.get('/api/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create patient
app.post('/api/patients', async (req, res) => {
    try {
        const patient = new Patient({
            ...req.body,
            patientId: generateId('PAT')
        });
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update patient
app.put('/api/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete patient
app.delete('/api/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// APPOINTMENT ROUTES
// ============================================

// Get all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const { date, status } = req.query;
        let query = {};
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }
        
        if (status) query.status = status;
        
        const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create appointment
app.post('/api/appointments', async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            appointmentId: generateId('APT')
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update appointment
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// TASK ROUTES
// ============================================

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const { status, priority } = req.query;
        let query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;
        
        const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            taskId: generateId('TSK')
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// TRANSPORT ROUTES
// ============================================

// Get all transport requests
app.get('/api/transports', async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        
        const transports = await Transport.find(query).sort({ requestDate: -1 });
        res.json(transports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create transport request
app.post('/api/transports', async (req, res) => {
    try {
        const transport = new Transport({
            ...req.body,
            requestId: generateId('TRN')
        });
        await transport.save();
        res.status(201).json(transport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update transport request
app.put('/api/transports/:id', async (req, res) => {
    try {
        const transport = await Transport.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!transport) return res.status(404).json({ error: 'Transport request not found' });
        res.json(transport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete transport request
app.delete('/api/transports/:id', async (req, res) => {
    try {
        const transport = await Transport.findByIdAndDelete(req.params.id);
        if (!transport) return res.status(404).json({ error: 'Transport request not found' });
        res.json({ message: 'Transport request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// CAMPAIGN ROUTES
// ============================================

// Get all campaigns
app.get('/api/campaigns', async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        
        const campaigns = await Campaign.find(query).sort({ startDate: -1 });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create campaign
app.post('/api/campaigns', async (req, res) => {
    try {
        const campaign = new Campaign({
            ...req.body,
            campaignId: generateId('CMP')
        });
        await campaign.save();
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update campaign
app.put('/api/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete campaign
app.delete('/api/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// INVENTORY ROUTES
// ============================================

// Get all inventory items
app.get('/api/inventory', async (req, res) => {
    try {
        const { category, lowStock } = req.query;
        let query = {};
        if (category) query.category = category;
        if (lowStock === 'true') {
            query.$expr = { $lte: ['$quantity', '$minStock'] };
        }
        
        const items = await Inventory.find(query).sort({ name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create inventory item
app.post('/api/inventory', async (req, res) => {
    try {
        const item = new Inventory({
            ...req.body,
            itemId: generateId('INV')
        });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inventory item
app.put('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete inventory item
app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// DASHBOARD STATS
// ============================================

app.get('/api/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const [
            totalPatients,
            totalAppointments,
            todayAppointments,
            pendingTasks,
            activeTransports,
            activeCampaigns,
            lowStockItems
        ] = await Promise.all([
            Patient.countDocuments(),
            Appointment.countDocuments(),
            Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
            Task.countDocuments({ status: 'Pending' }),
            Transport.countDocuments({ status: { $in: ['Pending', 'Approved', 'In Transit'] } }),
            Campaign.countDocuments({ status: 'Active' }),
            Inventory.countDocuments({ $expr: { $lte: ['$quantity', '$minStock'] } })
        ]);
        
        res.json({
            totalPatients,
            totalAppointments,
            todayAppointments,
            pendingTasks,
            activeTransports,
            activeCampaigns,
            lowStockItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📊 API Endpoints:');
    console.log('   POST /api/auth/register - Register user');
    console.log('   POST /api/auth/login - Login');
    console.log('   GET/POST /api/patients - Patients');
    console.log('   GET/POST /api/appointments - Appointments');
    console.log('   GET/POST /api/tasks - Tasks');
    console.log('   GET/POST /api/transports - Transport Requests');
    console.log('   GET/POST /api/campaigns - Campaigns');
    console.log('   GET/POST /api/inventory - Inventory');
    console.log('   GET /api/stats - Dashboard Stats');
});
