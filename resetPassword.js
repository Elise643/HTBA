import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const auth = getAuth();
const buttons = document.querySelectorAll(".passwordresetbutton");
buttons[0].addEventListener("click", function(){
    document.querySelector("#resetInstructions").innerHTML = `
    <p>I'm assuming you've reset your password for at least one other website in your lifetime. This is standard, it will send you a password reset email. The website has no way to access what your password currently is or what you change it to as it is fully encrypted.</p>
    <form>
    <label for="emailforpasswordreset">Enter your email address here: </label>
    <input type="text" id="emailforpasswordreset">
    <input id="sendtheemail" type="submit" value="Send Reset Email">
    </form>
    `
document.querySelector("#sendtheemail").addEventListener("click",function(){
const email = document.querySelector("#emailforpasswordreset").value;
if (!email.includes("@")) alert("That's not an email");
else {
sendPasswordResetEmail(auth, "user@example.com")
  .then(() => {
    document.querySelector("#resetInstructions").innerHTML = "<p>Reset email sent.</p>";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  });
}
})

})


