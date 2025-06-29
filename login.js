document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", () => {
    const auth = window.auth;
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email").value.trim();
    const email = emailInput.includes("@") ? emailInput: emailInput + "@thescript.lol"
    const password = document.getElementById("password").value.trim();

    window.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        document.getElementById("message").textContent = "Welcome!";
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
    const username = email.replace("@thescript.lol", "");
    info.textContent = `Logged in as: ${username}`;
    window.location.href = "/myaccount";
  } else {
    info.textContent = "Not logged in";
  }
});
});
