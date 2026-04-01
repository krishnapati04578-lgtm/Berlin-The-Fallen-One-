import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// World-building animation overlay
function showWorldAnimation(type = "success", message = "") {
  const overlay = document.getElementById("worldOverlay");
  if (!overlay) return;
  overlay.className = "world-overlay " + type;
  const msg = overlay.querySelector(".world-message");
  if (msg) msg.textContent = message;
  overlay.style.display = "flex";
  setTimeout(() => {
    overlay.style.opacity = "1";
  }, 10);
}

function hideWorldAnimation() {
  const overlay = document.getElementById("worldOverlay");
  if (!overlay) return;
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
}

// Navigate with fade transition
function navigateTo(url) {
  document.body.style.transition = "opacity 0.4s ease";
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = url;
  }, 400);
}

// Google sign-in
window.signInWithGoogle = async function () {
  try {
    showWorldAnimation("loading", "Crossing the threshold...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      navigateTo("/setup.html");
    } else {
      navigateTo("/dashboard.html");
    }
  } catch (err) {
    hideWorldAnimation();
    showError(err.message);
  }
};

// Email sign-in
window.signInWithEmail = async function () {
  const email = document.getElementById("emailInput")?.value?.trim();
  const password = document.getElementById("passwordInput")?.value;
  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }
  try {
    showWorldAnimation("loading", "The gates open...");
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      navigateTo("/setup.html");
    } else {
      navigateTo("/dashboard.html");
    }
  } catch (err) {
    hideWorldAnimation();
    showError(err.message);
  }
};

// Email register
window.registerWithEmail = async function () {
  const email = document.getElementById("emailInput")?.value?.trim();
  const password = document.getElementById("passwordInput")?.value;
  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }
  try {
    showWorldAnimation("loading", "Forging your seal...");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    navigateTo("/setup.html");
  } catch (err) {
    hideWorldAnimation();
    showError(err.message);
  }
};

// Sign out
window.signOutUser = async function () {
  try {
    await signOut(auth);
    navigateTo("/index.html");
  } catch (err) {
    console.error(err);
  }
};

// Show error helper
function showError(msg) {
  const el = document.getElementById("authError");
  if (el) {
    el.textContent = msg;
    el.style.display = "block";
  } else {
    alert(msg);
  }
}

// Auth state observer — used by pages that require auth
window.onAuthReady = function (callback) {
  onAuthStateChanged(auth, callback);
};

// Check username availability
window.checkUsername = async function (username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);
  return snap.empty;
};

// Save user profile (setup page)
window.saveUserProfile = async function (uid, username, avatar) {
  await setDoc(doc(db, "users", uid), {
    username,
    avatar,
    subscribed: false,
    memberSince: serverTimestamp(),
    chaptersRead: 0,
    timeSpentReading: 0
  });
};

export { navigateTo };
