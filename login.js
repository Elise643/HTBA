document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email").value.trim();
    const email = emailInput.includes("@") ? emailInput: emailInput + "@thescript.lol"
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

auth.onAuthStateChanged((user) => {
  const info = document.getElementById("user-info");
  if (user) {
    const email = user.email;
    const username = email.replace("@atschool.lol", "");
    info.textContent = `Logged in as: ${username}`;
  } else {
    info.textContent = "Not logged in";
  }
});

