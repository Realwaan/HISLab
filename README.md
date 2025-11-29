# 🏥 Clinikabayan Health Information System (HIS)

**Status**: ✅ **COMPLETE & READY FOR SUBMISSION**  
**Submission Date**: November 27, 2025

A comprehensive, fully-functional web-based Health Information System for Clinikabayan, featuring interactive patient management, multi-tab patient information system, appointment scheduling, and real-time data management.

## 🎯 Project Highlights

- ✅ **Complete Patient Management** with quick registration and auto-generated IDs
- ✅ **5-Tab Patient Information System**: Demographics, Medical History, Appointments, Vital Signs, Billing
- ✅ **Interactive Dashboard** with real-time KPI cards and Philippine time clock
- ✅ **Appointment Scheduling** with patient autocomplete and status tracking
- ✅ **Task Management** with priority levels and completion tracking
- ✅ **Full CRUD Operations** using localStorage for data persistence
- ✅ **Responsive Design** - works on desktop, tablet, and mobile
- ✅ **Professional UI** - Modern glassmorphism design with smooth animations

## ✨ Core Features

### 🔐 Authentication System
- Secure login with credential validation
- Session management using localStorage
- Logout functionality with redirect

### 📊 Interactive Dashboard
- **Real-time KPI Cards**: Total patients, appointments, pending referrals, campaigns
- **Philippine Time Clock**: Auto-updating in Asia/Manila timezone
- **Quick Action Buttons**: New Patient, Schedule Appointment, Add Task
- **Appointments Panel**: Today's schedule with clickable patient names
- **Tasks Widget**: Priority-based task management with checkboxes
- **Activity Feed**: Live updates of all system activities

### 👤 Patient Management (MAIN FEATURE!)
- **Quick Registration Form**: Fast patient enrollment with validation
- **Auto-Generated IDs**: CK-2025-001, CK-2025-002, etc.
- **Patient Directory**: Searchable grid view of all patients
- **5 Interactive Tabs** for Each Patient:
  1. **Demographics**: Personal info, contact details, registration date
  2. **Medical History**: Conditions, medications, allergies
  3. **Appointments**: Complete appointment history
  4. **Vital Signs**: Temperature, BP, heart rate, weight with status indicators
  5. **Billing**: Financial summary, charges, payments, balance

### 📅 Appointment Scheduling
- Interactive form with date/time pickers
- Patient name autocomplete from registered patients
- Multiple types: General Checkup, Follow-up, Prenatal, Vaccination, Consultation
- Status tracking: Pending → Confirmed → Completed
- Clickable patient names linking to full details

### ✓ Task Management
- Priority levels: High (red), Medium (orange), Low (green)
- Interactive checkboxes for completion
- Smart date display: "Today", "Tomorrow", or formatted date
- Visual feedback with strikethrough for completed tasks

### 🚑 Transport & Referral Module (Fully Functional)
- Transport request management with driver assignment
- Vehicle fleet tracking
- Hospital referral system
- Real-time status updates

### 🏥 Primary Care Services (Fully Functional)
- Patient admission dashboard
- Medical inventory management
- Volunteer coordination
- Demographics analysis tabs

### 📢 Health Education Campaigns
- Campaign planning and scheduling
- Resource allocation
- Impact tracking

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Firebase Firestore (online cloud database)
- **Authentication**: Firebase Authentication
- **Icons**: Font Awesome 6.0.0
- **Design**: Glassmorphism UI with backdrop-filter effects

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/clinikabayan-his.git
cd clinikabayan-his
```

2. Set up Firebase (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)):
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Set up Firestore database
   - Update `js/firebase-config.js` with your credentials

3. Run the development server:
```bash
python -m http.server 8000
```

4. Open `http://localhost:8000` in your browser

## 🔧 Firebase Configuration

Update `js/firebase-config.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed setup instructions.

## 🚀 Usage

### User Registration
1. Go to the login page
2. Click "Create new account"
3. Fill in your details (Full Name, Email, Role, Password)
4. Click "Create Account"
5. Your account is saved online via Firebase

### User Roles
- **Barangay Health Worker** - Basic patient care
- **Midwife** - Maternal health services
- **Nurse** - General nursing care
- **Doctor** - Medical diagnosis and treatment
- **Administrator** - System administration

### Navigation
1. **Login Page** (`index.html`) - Authentication
2. **Dashboard** (`pages/dashboard.html`) - Overview with widgets
3. **Primary Care** (`pages/primary-care.html`) - Patient registration & records
4. **Transport & Referral** - Patient transfers
5. **Health Campaigns** - Community health programs

## 📱 System Modules

### 1. Primary Care Services
Located at: `pages/primary-care.html`

**Sub-modules:**
- **Admission Dashboard**: View and manage patient records
- **Demographics**: Track service areas and patient statistics
- **Inventory**: Monitor medical supplies and reorder alerts
- **Volunteers**: Manage medical volunteer schedules
- **Available Tests**: Catalog of medical tests with interpretation guides

### 2. Transport & Referral
Located at: `pages/transport-referral.html` (Template)

**Features:**
- Record patient referrals
- Schedule transport services
- Manage partner hospitals

### 3. Health Education Campaigns
Located at: `pages/health-campaigns.html` (Template)

**Features:**
- Schedule awareness campaigns
- Track program objectives
- Measure KPIs

## 📁 File Structure
```
clinikabayan-his/
│
├── index.html                    # Login/Registration page
│
├── pages/                        # Application pages
│   ├── dashboard.html            # Main dashboard with widgets
│   ├── primary-care.html         # Patient registration & records
│   ├── transport-referral.html   # Transport & referral
│   └── health-campaigns.html     # Health campaigns
│
├── css/                          # Stylesheets
│   ├── main.css                  # Global styles
│   ├── login.css                 # Login page styles
│   ├── dashboard.css             # Dashboard and widgets
│   ├── primary-care.css          # Primary care module
│   ├── transport-referral.css
│   └── health-campaigns.css
│
├── js/                           # JavaScript files
│   ├── firebase-config.js        # Firebase initialization
│   ├── firebase-auth.js          # Firebase auth wrapper
│   ├── login.js                  # Authentication logic
│   ├── dashboard.js              # Dashboard functionality
│   ├── primary-care.js           # Primary care module
│   ├── transport-referral.js
│   └── health-campaigns.js
│
├── assets/                       # Images and media
│   ├── logo.png                  # Clinikabayan logo
│   └── background.png            # Login background
│
├── FIREBASE_SETUP.md             # Firebase setup guide
├── README.md                     # This file
└── .gitignore                    # Git ignore rules
```

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Vibrant Colors** - #2196F3 (Primary), #4CAF50 (Success), #FFC107 (Warning), #F44336 (Danger)
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - CSS transitions and transforms
- **Philippine Timezone** - Real-time clock display

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules to protect patient data
- Password visibility toggles
- Role-based access control
- Encrypted password storage

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

## ✅ Status

**Production Ready** with Firebase Integration

Features:
- ✅ Complete authentication system
- ✅ Online database storage
- ✅ Patient registration with auto-calculations
- ✅ Medical record forms
- ✅ Live activity feed
- ✅ Dashboard widgets
- ✅ Glassmorphism design

## 🤝 Contributing

This is an academic project developed for Clinikabayan. For suggestions or improvements, please contact the developer.

## 📞 Support

For technical issues:
1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Review browser console for errors
3. Verify Firebase configuration is correct

## 👨‍💻 Developer

Developed for: **Clinikabayan Health Center**  
Project Type: Information Systems - Final Lab Output  
Due Date: November 27, 2025

---

**Healthcare is a right, not a privilege.** - Clinikabayan
