// ============================================
// FIREBASE AUTHENTICATION FUNCTIONS
// ============================================

// Check if Firebase is available
function isFirebaseAvailable() {
    return typeof firebase !== 'undefined' && firebase.auth && firebase.firestore;
}

// Register new user with Firebase
async function registerUserFirebase(fullname, email, role, password) {
    try {
        // Create user account with Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        await user.updateProfile({
            displayName: fullname
        });
        
        // Store additional user data in Firestore
        await db.collection('users').doc(user.uid).set({
            fullname: fullname,
            email: email,
            role: role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: null
        });
        
        console.log('User registered successfully in Firebase');
        return { success: true, user: user };
    } catch (error) {
        console.error('Firebase registration error:', error);
        return { success: false, error: error.message };
    }
}

// Login user with Firebase
async function loginUserFirebase(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update last login in Firestore
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Get user data from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        console.log('User logged in successfully');
        return { 
            success: true, 
            user: {
                uid: user.uid,
                email: user.email,
                fullname: userData.fullname,
                role: userData.role
            }
        };
    } catch (error) {
        console.error('Firebase login error:', error);
        
        // Handle specific error codes
        if (error.code === 'auth/user-not-found') {
            return { error: 'USER_NOT_FOUND' };
        } else if (error.code === 'auth/wrong-password') {
            return { error: 'WRONG_PASSWORD' };
        } else if (error.code === 'auth/invalid-email') {
            return { error: 'INVALID_EMAIL' };
        } else if (error.code === 'auth/user-disabled') {
            return { error: 'USER_DISABLED' };
        }
        
        return { error: 'LOGIN_FAILED', message: error.message };
    }
}

// Logout user
async function logoutUserFirebase() {
    try {
        await auth.signOut();
        console.log('User logged out successfully');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

// Check if user is logged in
function checkAuthStateFirebase() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

// Export functions for use in other files
window.FirebaseAuth = {
    register: registerUserFirebase,
    login: loginUserFirebase,
    logout: logoutUserFirebase,
    checkAuthState: checkAuthStateFirebase,
    isAvailable: isFirebaseAvailable
};
