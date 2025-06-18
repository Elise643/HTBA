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
