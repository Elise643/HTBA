// firebase.js — dynamically load Firebase Compat SDKs and initialize

const firebaseScripts = [
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"
];

// Load each Firebase SDK script
firebaseScripts.forEach(src => {
  const script = document.createElement("script");
  script.src = src;
  script.async = false; // preserve order
  document.head.appendChild(script);
});

// Wait until all scripts are loaded and Firebase is available
window.addEventListener("load", () => {
  const checkFirebaseReady = setInterval(() => {
    if (window.firebase && firebase.initializeApp) {
      clearInterval(checkFirebaseReady);

      // Your Firebase config
      const firebaseConfig = {
        apiKey: "AIzaSyA4CjV2R9NivDMmpnbtIA-DFwj9TwJBe4Q",
        authDomain: "htba-b7975.firebaseapp.com",
        projectId: "htba-b7975",
        storageBucket: "htba-b7975.appspot.com",
        messagingSenderId: "380246220203",
        appId: "1:380246220203:web:3ff4ad0d1d93d2d79946ee",
        measurementId: "G-XKLZFE6P67"
      };

      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      // Optionally expose Firebase services globally
      window.auth = firebase.auth();
      window.db = firebase.firestore();
      window.storage = firebase.storage();

      // 🔔 Notify all other scripts that Firebase is ready
      document.dispatchEvent(new Event("firebase-ready"));
    }
  }, 100); // check every 100ms
});
