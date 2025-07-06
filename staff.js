document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();

    auth.onAuthStateChanged(async user => {
      const staffHolder = document.getElementById("staffHolder");
      try {
        const authority = !user ? "none":user.type;
        const usersRef = firebase.firestore().collection("users");
        const snapshot = await usersRef.get();
        staffHolder.innerHTML = "";

        if (snapshot.empty) {
          staffHolder.textContent = "No staff found. Dangerous.";
          return;
        }

        // Create containers
        const nurse = document.createElement("div");
        nurse.appendChild(Object.assign(document.createElement("p"), { textContent: "Nurse(s)" }));
nurdiv = document.createElement("div");
        nurse.appendChild(nurdiv);

        const teacher = document.createElement("div");
        teacher.appendChild(Object.assign(document.createElement("p"), { textContent: "Teacher(s)" }));
teadiv = document.createElement("div");
        teacher.appendChild(teadiv);

        const principal = document.createElement("div");
        principal.appendChild(Object.assign(document.createElement("p"), { textContent: "Principal" }));
        princdiv = document.createElement("div");
        principal.appendChild(princdiv);

        const counselor = document.createElement("div");
        counselor.appendChild(Object.assign(document.createElement("p"), { textContent: "Counselor(s)" }));
coundiv = document.createElement("div");
        counselor.appendChild(coundiv);

        snapshot.forEach(doc => {
          const userData = doc.data();

          if (userData?.type === "staff") {
            const staffName =
              (userData.title ? userData.title.trim() + (!userData.title.includes(".") && !userData.title.includes("Principal") ? "." : "") + " " : "") +
              (userData.firstName ? userData.firstName.trim() + " " : "") +
              (userData.lastName || "");

            const person = document.createElement("div");
            person.classList.add("staffMember");
            const img = document.createElement("img");
            img.classList.add("bigPFP");
            img.src = userData.photoURL || "images/defaultPFP.png";
            img.alt = staffName || "Profile image";
            console.log("authority is " + authority);
            console.log("id is " + user.id);
            console.log("staff id is " + userData.id);

            person.innerHTML = `
              ${img.outerHTML}
              ${((authority === "admin" || (authority === "staff" && user.role === "principal") || authority === "owner" || (authority === "staff" && user.id === userData.id))) ? "editable <br>":""}
              <p>${staffName}</p>
              <p class="pronouns">${userData.pronouns || "No pronouns found."}</p>
              <div class="staffBio">
              ${userData.bio || "No bio found."}
              </div>
              `;

            if (userData.role === "nurse") {
              nurdiv.appendChild(person);
            } else if (userData.role === "teacher") {
              teadiv.appendChild(person);
            } else if (userData.role === "principal") {
              princdiv.appendChild(person);
            }
            else if (userData.role === "counselor") {
              coundiv.appendChild(person);
            }
          }
        });

        // Only append if roles were found
        if (princdiv.childElementCount > 0) staffHolder.appendChild(principal);
        if (teadiv.childElementCount > 0) staffHolder.appendChild(teacher);
        if (nurdiv.childElementCount > 0) staffHolder.appendChild(nurse);
        if (coundiv.childElementCount > 0) staffHolder.appendChild(counselor);


      } catch (error) {
        staffHolder.textContent = `Error: ${error.message}`;
      }
    });
  });
});
