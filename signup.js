document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  let accountType = "";
  const radios = document.querySelectorAll('input[name="accountType"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (accountType!=radio.value){
      accountType = radio.value;
      populateForm(radio.value);
      }
    });
  });
  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

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

function populateForm(accType) {
    const form = document.querySelector("#signupForm");
    form.querySelectorAll("label,input").forEach(element=>{element.remove()});
  if (accType==="student"){
    addInput(form, "username", true, "Enter your Username", "Username: ");
    addInput(form, "name", true, "Enter your Name", "First Name: ");
    addInput(form, "mname", false, "Enter your middle name", "Middle Name: ");
    addInput(form, "lname", true, "Enter your last name", "Last Name: ");
    addInput(form, "password", true, "Enter your password", "Password: ");


  }
}

function addInput(form, id, req, placeholder, labelText){
    const input = document.createElement("input");
    input.id = id;
    input.required = req;
    const label = document.createElement("label");
    label.setAttribute("for",id);
    input.type = "text";
    input.placeholder = placeholder;
    label.textContent = labelText;
    form.appendChild(label);
    form.appendChild(input);
}