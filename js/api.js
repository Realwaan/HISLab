// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Service Class
class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Clear auth token
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Get headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic request method
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: this.getHeaders()
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Request failed');
            }

            return result;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // ============================================
    // AUTH
    // ============================================
    async login(username, password) {
        const result = await this.request('/auth/login', 'POST', { username, password });
        if (result.token) {
            this.setToken(result.token);
        }
        return result;
    }

    async register(userData) {
        return this.request('/auth/register', 'POST', userData);
    }

    logout() {
        this.clearToken();
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }

    // ============================================
    // PATIENTS
    // ============================================
    async getPatients() {
        return this.request('/patients');
    }

    async getPatient(id) {
        return this.request(`/patients/${id}`);
    }

    async createPatient(patientData) {
        return this.request('/patients', 'POST', patientData);
    }

    async updatePatient(id, patientData) {
        return this.request(`/patients/${id}`, 'PUT', patientData);
    }

    async deletePatient(id) {
        return this.request(`/patients/${id}`, 'DELETE');
    }

    // ============================================
    // APPOINTMENTS
    // ============================================
    async getAppointments(date = null, status = null) {
        let query = '';
        const params = [];
        if (date) params.push(`date=${date}`);
        if (status) params.push(`status=${status}`);
        if (params.length) query = '?' + params.join('&');
        
        return this.request(`/appointments${query}`);
    }

    async createAppointment(appointmentData) {
        return this.request('/appointments', 'POST', appointmentData);
    }

    async updateAppointment(id, appointmentData) {
        return this.request(`/appointments/${id}`, 'PUT', appointmentData);
    }

    async deleteAppointment(id) {
        return this.request(`/appointments/${id}`, 'DELETE');
    }

    // ============================================
    // TASKS
    // ============================================
    async getTasks(status = null, priority = null) {
        let query = '';
        const params = [];
        if (status) params.push(`status=${status}`);
        if (priority) params.push(`priority=${priority}`);
        if (params.length) query = '?' + params.join('&');
        
        return this.request(`/tasks${query}`);
    }

    async createTask(taskData) {
        return this.request('/tasks', 'POST', taskData);
    }

    async updateTask(id, taskData) {
        return this.request(`/tasks/${id}`, 'PUT', taskData);
    }

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, 'DELETE');
    }

    // ============================================
    // TRANSPORT
    // ============================================
    async getTransports(status = null) {
        let query = status ? `?status=${status}` : '';
        return this.request(`/transports${query}`);
    }

    async createTransport(transportData) {
        return this.request('/transports', 'POST', transportData);
    }

    async updateTransport(id, transportData) {
        return this.request(`/transports/${id}`, 'PUT', transportData);
    }

    async deleteTransport(id) {
        return this.request(`/transports/${id}`, 'DELETE');
    }

    // ============================================
    // CAMPAIGNS
    // ============================================
    async getCampaigns(status = null) {
        let query = status ? `?status=${status}` : '';
        return this.request(`/campaigns${query}`);
    }

    async createCampaign(campaignData) {
        return this.request('/campaigns', 'POST', campaignData);
    }

    async updateCampaign(id, campaignData) {
        return this.request(`/campaigns/${id}`, 'PUT', campaignData);
    }

    async deleteCampaign(id) {
        return this.request(`/campaigns/${id}`, 'DELETE');
    }

    // ============================================
    // INVENTORY
    // ============================================
    async getInventory(category = null, lowStock = false) {
        let query = '';
        const params = [];
        if (category) params.push(`category=${category}`);
        if (lowStock) params.push('lowStock=true');
        if (params.length) query = '?' + params.join('&');
        
        return this.request(`/inventory${query}`);
    }

    async createInventoryItem(itemData) {
        return this.request('/inventory', 'POST', itemData);
    }

    async updateInventoryItem(id, itemData) {
        return this.request(`/inventory/${id}`, 'PUT', itemData);
    }

    async deleteInventoryItem(id) {
        return this.request(`/inventory/${id}`, 'DELETE');
    }

    // ============================================
    // DASHBOARD STATS
    // ============================================
    async getStats() {
        return this.request('/stats');
    }
}

// Create global API instance
const api = new ApiService();

// Export for use in other files
window.api = api;
