
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { createUserIfNotExists } from './firestore.js';

// Auth instance is now exported from firestore.js to ensure single initialization
import { auth } from './firestore.js';

// ------------------------------------------------------
// Streamlit Backend API Configuration
// ------------------------------------------------------
const STREAMLIT_API_URL = "https://dashclothing.streamlit.app";

/**
 * Send measurement data to the Streamlit backend API with a secure Firebase ID token.
 * - Checks auth.currentUser; if null → alerts and returns null.
 * - Generates a fresh ID token via getIdToken(true).
 * - Sends POST to STREAMLIT_API_URL with Authorization: Bearer <token>.
 * - Returns the parsed JSON response from the backend.
 *
 * @param {Object} payload - The data to send (e.g. { waist, image_url })
 * @param {number} payload.waist - Waist measurement in inches
 * @param {string} [payload.image_url] - Optional uploaded image URL
 * @returns {Promise<Object|null>} Parsed JSON response or null on failure.
 */
export const sendToStreamlitAPI = async (payload) => {
    const user = auth.currentUser;

    if (!user) {
        alert("Please login first");
        console.warn("⚠️ sendToStreamlitAPI: No user logged in.");
        return null;
    }

    try {
        // Force-refresh the ID token
        const idToken = await user.getIdToken(true);
        console.log("✅ Fresh ID token generated for Streamlit API call.");

        const response = await fetch(STREAMLIT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Streamlit API error (${response.status}):`, errorText);
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Streamlit API response received:", data);
        return data;
    } catch (error) {
        console.error("❌ Error calling Streamlit API:", error);
        throw error;
    }
};

const googleProvider = new GoogleAuthProvider();

// ------------------------------------------------------
// Auth Functions
// ------------------------------------------------------

/**
 * Register a new user with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 * @returns {Promise<UserCredential>}
 */
export const registerEmailPassword = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile
        if (name) {
            await updateProfile(userCredential.user, {
                displayName: name
            });
        }

        // Create user document in Firestore
        await createUserIfNotExists(userCredential.user, 'password');

        return userCredential;
    } catch (error) {
        console.error("Registration Error:", error);
        throw error;
    }
};

/**
 * Login with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const loginEmailPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Check/Create user document in Firestore
        await createUserIfNotExists(userCredential.user, 'password');

        return userCredential;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

/**
 * Login with Google
 * @returns {Promise<UserCredential>}
 */
export const loginGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);

        // Check/Create user document in Firestore
        await createUserIfNotExists(userCredential.user, 'google');

        return userCredential;
    } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
    }
};

/**
 * Logout the current user
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
};

/**
 * Monitor authentication state
 * @param {function} callback - Function to call with user object (or null)
 */
export const monitorAuthState = (callback) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Ensure data exists whenever we detect a user
            createUserIfNotExists(user, user.providerData?.[0]?.providerId || 'unknown');
        }
        callback(user);
    });
};

/**
 * Send password reset email
 * @param {string} email 
 */
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Reset Password Error:", error);
        throw error;
    }
};

export { auth };
