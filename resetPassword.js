document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", () => {
const auth = firebase.auth();

const buttons = document.querySelectorAll(".resetpasswordbutton");

buttons[0].addEventListener("click", function () {
  document.querySelector("#resetInstructions").innerHTML = `
    <p>This will send a password reset email to your address.</p>
    <form id="resetForm">
      <label for="emailforpasswordreset">Email:</label>
      <input type="text" id="emailforpasswordreset" required>
      <input id="sendtheemail" type="submit" value="Send Reset Email">
    </form>
  `;

  document.querySelector("#resetForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.querySelector("#emailforpasswordreset").value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    auth.sendPasswordResetEmail(email)
      .then(() => {
        document.querySelector("#resetInstructions").innerHTML = "<p>Password reset email sent!</p>";
      })
      .catch((error) => {
        console.error("Error:", error.code, error.message);
        document.querySelector("#resetInstructions").innerHTML = `<p>Error: ${error.message}</p>`;
      });
  });
});
  });
});