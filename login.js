document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!window.auth) {
      console.error("Firebase Auth not initialized");
      document.getElementById("message").textContent = "Auth not ready.";
      return;
    }

    window.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        document.getElementById("message").textContent = "Welcome!";
        console.log("Logged in user:", userCredential.user);
        // window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error("Login error", error);
        document.getElementById("message").textContent = error.message;
      });
  });
});
