// signup.js - modular signup logic for Firebase

// Wait for Firebase and DOM to load
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", () => {
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

    if (!accountType) {
      displayMessage("Please select an account type.");
      return;
    }

    const username = getValue("username");
    const emailField = document.getElementById("email");
    const email = emailField ? emailField.value.trim() : `${username}@thescript.lol`;
    const password = getValue("password");
    const name = getValue("name");
    const mname = getValue("mname");
    const lname = getValue("lname");

    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        return user.updateProfile({ displayName: username }).then(() => {
          const userData = {
            type: accountType,
            displayName: username,
            firstName: name,
            middleName: mname,
            lastName: lname,
            displayNameLower:username.toLowerCase()
          };

          if (accountType === "staff") {
            userData.title = getValue("title");
            userData.role = getValue("role");
            if (userData.role === "teacher") {
              userData.subject = getValue("subject");
            }
          }

          return db.collection("users").doc(user.uid).set(userData);
        });
      })
      .then(() => {
        displayMessage("Sign up successful! You are now logged in.");
        document.getElementById("signupForm").reset();
        window.location.href = "/myaccount";
      })
      .catch(error => {
        displayMessage(error.message);
      });
  });
});
});

function populateForm(accType) {
  const form = document.querySelector("#signupForm");
  form.querySelectorAll("label, input, button, select, div#roleOptions").forEach(el => el.remove());

  addInput(form, "username", true, "Enter your username", "Username:");

  if (accType === "admin") {
    addInput(form, "email", true, "Enter your email", "Email:", "email");
  }

  if (accType === "student") {
    addInput(form, "name", true, "Enter your first name", "First Name:");
    addInput(form, "mname", false, "Enter your middle name", "Middle Name:");
    addInput(form, "lname", true, "Enter your last name", "Last Name:");
  }

  if (accType === "staff") {
    addInput(form, "title", true, "Mr., Mrs., Ms., etc.", "Title:");
    addInput(form, "lname", true, "Enter your last name", "Last Name:");

    const role = document.createElement("select");
    role.id = "role";
    role.required = true;

    const def = document.createElement("option");
    def.value = "";
    def.disabled = true;
    def.selected = true;
    def.textContent = "Select your role";
    role.appendChild(def);

    const roles = [
      { value: "teacher", text: "Teacher" },
      { value: "principal", text: "Principal" },
      { value: "counselor", text: "Counselor" },
      { value: "nurse", text: "Nurse" }
    ];

    roles.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      role.appendChild(option);
    });

    const label = document.createElement("label");
    label.setAttribute("for", "role");
    label.textContent = "Role:";

    form.appendChild(label);
    form.appendChild(role);

    const div = document.createElement("div");
    div.id = "roleOptions";
    form.appendChild(div);

    role.addEventListener("change", () => {
      const chosenRole = role.value;
      div.innerHTML = "";

      if (chosenRole === "teacher") {
        addInput(div, "subject", true, "Enter your subject", "Class Subject:");
      }
    });
  }

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

function displayMessage(msg) {
  const messageEl = document.getElementById("signup-message");
  if (messageEl) {
    messageEl.textContent = msg;
  } else {
    alert(msg); 
  }
}
