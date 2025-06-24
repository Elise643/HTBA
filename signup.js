// signup.js - modular signup logic for Firebase

// Wait for Firebase and DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  let accountType = "";
  const radios = document.querySelectorAll('input[name="accountType"]');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (accountType !== radio.value) {
        accountType = radio.value;
        populateForm(accountType);
      }
    });
  });

  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = getValue("username");
    const emailField = document.getElementById("email");
    const email = emailField ? emailField.value.trim() : `${username}@atschool.lol`;
    const password = getValue("password");
    const name = getValue("name");
    const mname = getValue("mname");
    const lname = getValue("lname");

    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        return user.updateProfile({ displayName: username })
          .then(() => {
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
      .catch(error => {
        document.getElementById("signup-message").textContent = error.message;
      });
  });
});

function populateForm(accType) {
  const form = document.querySelector("#signupForm");
  form.querySelectorAll("label, input, button").forEach(el => el.remove());

  addInput(form, "username", true, "Enter your username", "Username:");

  if (accType === "admin") {
    addInput(form, "email", true, "Enter your email", "Email:", "email");
  }

  addInput(form, "name", true, "Enter your first name", "First Name:");
  addInput(form, "mname", false, "Enter your middle name", "Middle Name:");
  addInput(form, "lname", true, "Enter your last name", "Last Name:");
  addInput(form, "password", true, "Enter your password", "Password:", "password");

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Sign Up";
  form.appendChild(submitBtn);
}

function addInput(form, id, required, placeholder, labelText, type = "text") {
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;

  const input = document.createElement("input");
  input.id = id;
  input.required = required;
  input.placeholder = placeholder;
  input.type = type;

  form.appendChild(label);
  form.appendChild(input);
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
} 
