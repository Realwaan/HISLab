# Firebase Setup Instructions for Clinikabayan HIS

## Overview
Your application now supports Firebase for online database storage. Follow these steps to set up your Firebase project.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `clinikabayan-his` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"** and wait for setup to complete

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Clinikabayan Web App`
3. **DO NOT** check "Also set up Firebase Hosting" (not needed)
4. Click **"Register app"**
5. You'll see your Firebase configuration code - **COPY THIS**, you'll need it in Step 4

## Step 3: Enable Authentication

1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in providers
4. Toggle **"Enable"** to ON
5. Click **"Save"**

## Step 4: Set Up Firestore Database

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose your preferred location (e.g., `asia-southeast1` for Philippines)
5. Click **"Enable"**

### Set Up Firestore Rules (Important!)

After creating the database, update the rules:

1. Go to the **"Rules"** tab in Firestore Database
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Patients collection - authenticated users can read/write
    match /patients/{patientId} {
      allow read, write: if request.auth != null;
    }
    
    // Medical records - authenticated users can read/write
    match /medical_records/{recordId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Update Firebase Configuration

1. Go back to **Project Overview** → **Project settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Find your web app and look for **"SDK setup and configuration"**
4. Select **"Config"** (not npm)
5. You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "clinikabayan-his.firebaseapp.com",
  projectId: "clinikabayan-his",
  storageBucket: "clinikabayan-his.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

6. **COPY all these values**

7. Open `js/firebase-config.js` in your code editor

8. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",              // Replace with your apiKey
    authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",      // Replace with your authDomain
    projectId: "YOUR_ACTUAL_PROJECT_ID",        // Replace with your projectId
    storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET", // Replace with your storageBucket
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID", // Replace with your messagingSenderId
    appId: "YOUR_ACTUAL_APP_ID"                 // Replace with your appId
};
```

9. **Save the file**

## Step 6: Test Your Setup

1. Make sure your development server is running:
   ```
   python -m http.server 8000
   ```

2. Open `http://localhost:8000` in your browser

3. Try to create a new account:
   - Fill in the registration form
   - Click "Create Account"
   - You should see "Registration successful!"

4. Check Firebase Console:
   - Go to **Authentication** → **Users** tab
   - You should see your new user listed
   - Go to **Firestore Database** → **Data** tab
   - You should see a `users` collection with your user data

5. Try logging in with your new account

## Step 7: Deploy Your Website

Once everything works locally, you can deploy using Firebase Hosting:

1. Install Firebase CLI (in PowerShell):
   ```powershell
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```powershell
   firebase login
   ```

3. Initialize Firebase in your project folder:
   ```powershell
   cd D:\Mao2
   firebase init
   ```
   - Select **"Hosting"**
   - Choose your existing project
   - Set public directory: `.` (current directory)
   - Configure as single-page app: **No**
   - Don't overwrite index.html

4. Deploy:
   ```powershell
   firebase deploy
   ```

5. Your website will be live at: `https://YOUR_PROJECT_ID.web.app`

## Troubleshooting

### "Firebase not defined" error
- Make sure you have internet connection (Firebase SDK loads from CDN)
- Check browser console for script loading errors

### "Permission denied" in Firestore
- Make sure you've set up the Firestore rules (Step 4)
- Make sure you're logged in (Authentication working)

### Registration/Login not working
- Open browser console (F12) and check for errors
- Verify your Firebase configuration is correct in `firebase-config.js`
- Make sure Email/Password authentication is enabled

### LocalStorage fallback
- If Firebase is not configured or fails, the system automatically falls back to localStorage
- This means your app will still work during development
- But localStorage data won't sync online or persist across devices

## Important Notes

1. **Security**: Keep your Firebase configuration private when deploying
2. **Test Mode**: The Firestore rules above are for development. Update them for production
3. **Quotas**: Firebase free tier has limits (50K reads/day, 20K writes/day)
4. **Backup**: Consider exporting Firestore data regularly for backups

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Review browser console for JavaScript errors
3. Verify all configuration values are correct
4. Make sure Firebase services (Auth + Firestore) are enabled

---

**Your project is ready for Firebase!** Once you complete these steps, your accounts will be stored online and accessible from any device.
