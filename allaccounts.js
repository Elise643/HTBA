document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const accHolder = document.getElementById("accHolder");      

        const usersRef = db.collection("users");
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
          accHolder.textContent = "No accounts found...";
          return;
        }
const h = document.createElement("div");
          snapshot.forEach(doc => {
            const userData = doc.data();

            const fullName = userData.firstName + " " + userData.lastName;
            const person = document.createElement("div");
            person.classList.add("accountInList");

            const img = document.createElement("img");
            img.classList.add("pfp");
            img.src = userData.photoURL || "images/defaultPFP.png";
            img.alt = fullName || "Profile image";

            person.innerHTML = `
              <a href="/profile?user=${userData.displayName}">${img.outerHTML}</a>
              <div class="stacked">
              <a href="/profile?user=${userData.displayName}">
              <p class="displayName">${fullName}</p>
              <p class="username">@${userData.displayName}</p>
              <p class="pronouns">${userData.pronouns || "No pronouns found."}</p>
              <p class="username">${(userData.role || userData.type).charAt(0).toUpperCase() + (userData.role || userData.type).slice(1)}</p>
              </a>
              </div>
            `;
            h.appendChild(person);
          });
          accHolder.innerHTML = h.innerHTML;
        });
  });