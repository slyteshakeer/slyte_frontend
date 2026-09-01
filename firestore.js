
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDTsf6B6of8uLdHTLj0-mmBurzq_ivczjE",
    authDomain: "dash-clothing.firebaseapp.com",
    projectId: "dash-clothing",
    storageBucket: "dash-clothing.firebasestorage.app",
    messagingSenderId: "543355895871",
    appId: "1:543355895871:web:8cc0b962b780a44563788a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ------------------------------------------------------
// User Management Logic
// ------------------------------------------------------

/**
 * Create user document if it doesn't exist
 * @param {object} user - Firebase User object
 * @param {string} providerId - 'password' or 'google.com'
 */
export const createUserIfNotExists = async (user, providerId = 'password') => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Create new user document
            await setDoc(userRef, {
                name: user.displayName || "User",
                email: user.email,
                authProvider: providerId,
                createdAt: serverTimestamp()
            });
            console.log("✅ User document created in Firestore");
        } else {
            console.log("ℹ️ User document already exists");
        }
    } catch (error) {
        console.error("❌ Error creating user document:", error);
    }
};

export { db, auth };
