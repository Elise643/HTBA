document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();

    auth.onAuthStateChanged(async user => {
      const staffHolder = document.getElementById("staffHolder");

      try {
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

        const teacher = document.createElement("div");
        teacher.appendChild(Object.assign(document.createElement("p"), { textContent: "Teacher(s)" }));

        const principal = document.createElement("div");
        principal.appendChild(Object.assign(document.createElement("p"), { textContent: "Principal" }));

        snapshot.forEach(doc => {
          const userData = doc.data();

          if (userData?.type === "staff") {
            const staffName =
              (userData.title ? userData.title.trim() + (!userData.title.includes(".") && !userData.title.includes("Principal") ? "." : "") + " " : "") +
              (userData.firstName ? userData.firstName.trim() + " " : "") +
              (userData.lastName || "");

            const person = document.createElement("div");
            const img = document.createElement("img");
            img.classList.add("bigPFP");
            img.src = userData.photoURL || "images/defaultPFP.png";
            img.alt = staffName || "Profile image";

            person.innerHTML = `
            <div class="staffMember">
              ${img.outerHTML}
              <p>${staffName}</p>
              </div>`;

            if (userData.role === "nurse") {
              nurse.appendChild(person);
            } else if (userData.role === "teacher") {
              teacher.appendChild(person);
            } else if (userData.role === "principal") {
              principal.appendChild(person);
            }
          }
        });

        // Only append if roles were found
        if (principal.childElementCount > 1) staffHolder.appendChild(principal);
        if (teacher.childElementCount > 1) staffHolder.appendChild(teacher);
        if (nurse.childElementCount > 1) staffHolder.appendChild(nurse);

      } catch (error) {
        staffHolder.textContent = `Error: ${error.message}`;
      }
    });
  });
});
