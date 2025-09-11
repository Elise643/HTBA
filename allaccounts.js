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

          snapshot.forEach(doc => {
            const userData = doc.data();

            const fullName = userData.firstName + " " + userData.lastName;
            const person = document.createElement("div");
            person.classList.add("accountInList");

            const img = document.createElement("img");
            img.classList.add("bigPFP");
            img.src = userData.photoURL || "images/defaultPFP.png";
            img.alt = fullName || "Profile image";

            person.innerHTML = `
              ${img.outerHTML}
              <div>
              <p>${fullName}</p>
              <p class="pronouns">${userData.pronouns || "No pronouns found."}</p>
              <a href="/profile?user=${userData.displayName}"><p class="smallUN">${userData.displayName}</p></a>
              </div>
            `;
            accHolder.appendChild(person);

          });
        });
  });