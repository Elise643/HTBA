import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();
const buttons = document.querySelectorAll(".resetpasswordbutton");

buttons[0].addEventListener("click", function () {
  document.querySelector("#resetInstructions").innerHTML = `
    <p>This will send you a password reset email. Your current or new password is not accessible to us—it’s fully encrypted.</p>
    <form id="resetForm">
      <label for="emailforpasswordreset">Enter your email address:</label>
      <input type="text" id="emailforpasswordreset" required>
      <input id="sendtheemail" type="submit" value="Send Reset Email">
    </form>
  `;

  document.querySelector("#resetForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.querySelector("#emailforpasswordreset").value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          document.querySelector("#resetInstructions").innerHTML = "<p>Reset email sent. Check your inbox.</p>";
        })
        .catch((error) => {
          console.error("Error sending reset email:", error.code, error.message);
          document.querySelector("#resetInstructions").innerHTML = `<p>Error: ${error.message}</p>`;
        });
    }
  });
});
