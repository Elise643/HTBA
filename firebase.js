


///////////////////////
  const firebaseScripts = [
    "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js",
    "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"
  ];

  firebaseScripts.forEach(src => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  });

  // Wait for scripts to load before initializing Firebase
  window.addEventListener("load", () => {
    const checkFirebaseReady = setInterval(() => {
      if (window.firebase && firebase.initializeApp) {
        clearInterval(checkFirebaseReady);
        
const firebaseConfig = {
  apiKey: "AIzaSyA4CjV2R9NivDMmpnbtIA-DFwj9TwJBe4Q",
  authDomain: "htba-b7975.firebaseapp.com",
  projectId: "htba-b7975",
  storageBucket: "htba-b7975.appspot.com",
  messagingSenderId: "380246220203",
  appId: "1:380246220203:web:3ff4ad0d1d93d2d79946ee",
  measurementId: "G-XKLZFE6P67"
};

firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth(); 
      }
    }, 100);
  });
