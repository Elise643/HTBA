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
    const email = document.getElementById("email").value.trim() || `${username}@atschool.lol`;
    const password = document.getElementById("password").value;
        const name = document.getElementById("name")?.value.trim() || "";
        const mname = document.getElementById("mname")?.value.trim() || "";
        const lname = document.getElementById("lname")?.value.trim() || "";

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
            displayName: username,
            firstName: name,
            middleName: mname,
            lastName: lname
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
    addInput(form, "password", true, "Enter your password", "Password: ", "password");
  }

  const sub = document.createElement("input");
  sub.type = "submit";
  sub.textContent = "Submit";
}

function addInput(form, id, req, placeholder, labelText, type = "text") {
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;

  const input = document.createElement("input");
  input.id = id;
  input.required = req;
  input.placeholder = placeholder;
  input.type = type;

  form.appendChild(label);
  form.appendChild(input);
}