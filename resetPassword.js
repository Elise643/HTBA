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

buttons[1].addEventListener("click",function(){

 document.querySelector("#resetInstructions").innerHTML = `
    <p>This is NOT an automatic password reset. What this does is <em>send a request</em> for the website owner to change it. This is because these accounts do not have actual email addresses, and thus cannot do a traditional reset.</p>
    <form id="resetForm">
      <label for="username">Username:</label>
  <input type="text" name="username" placeholder="Username" required/>
        <label for="password">New Password:</label>
    <input type="password" name="password" placeholder="New Password" required />
        <label for="name">YOUR Name (Not the account's name):</label>
            <input type="text" name="name" placeholder="Your Name" required />
  <button type="submit">Request Password Change</button>
    </form>
  `;
     (function() {
    emailjs.init("VgzmUqOAqD_f6BPx5");
  })();
  document.getElementById("resetForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    emailjs.sendForm("service_rva1cje", "at-school-password", this)
      .then(function() {
        alert("Message sent successfully!");
        document.getElementById("resetForm").reset();
      }, function(error) {
        console.error("FAILED...", error);
        alert("Oops, something went wrong.");
      });
  });


});

  });
});