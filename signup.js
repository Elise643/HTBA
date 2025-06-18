document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const accountType = document.getElementById("accountType").value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Set displayName
        return user.updateProfile({
          displayName: username
        }).then(() => {
          // Save account type to Firestore
          return db.collection("users").doc(user.uid).set({
            type: accountType,
            displayName: username
          });
        });
      })
      .then(() => {
        document.getElementById("signup-message").textContent = "Sign up successful! You are now logged in.";
      })
      .catch((error) => {
        document.getElementById("signup-message").textContent = error.message;
      });
  });
});
