document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const staffHolder = document.getElementById("staffHolder");

    auth.onAuthStateChanged(async user => {
      try {
        staffHolder.innerHTML = "";

        let authority = "none";
        let currentUserData = null;
        const uid = user?.uid || null;

        if (user) {
          const userDoc = await db.collection("users").doc(uid).get();
          currentUserData = userDoc.data();
          authority = currentUserData?.type || "none";
        }

        const usersRef = db.collection("users");
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
          staffHolder.textContent = "No staff found. Dangerous.";
          return;
        }

        // Create containers for each role
        const nurse = document.createElement("div");
        nurse.appendChild(Object.assign(document.createElement("p"), { textContent: "Nurse(s)" }));
        const nurdiv = document.createElement("div");
        nurse.appendChild(nurdiv);

        const teacher = document.createElement("div");
        teacher.appendChild(Object.assign(document.createElement("p"), { textContent: "Teacher(s)" }));
        const teadiv = document.createElement("div");
        teacher.appendChild(teadiv);

        const principal = document.createElement("div");
        principal.appendChild(Object.assign(document.createElement("p"), { textContent: "Principal" }));
        const princdiv = document.createElement("div");
        principal.appendChild(princdiv);

        const counselor = document.createElement("div");
        counselor.appendChild(Object.assign(document.createElement("p"), { textContent: "Counselor(s)" }));
        const coundiv = document.createElement("div");
        counselor.appendChild(coundiv);

        // Helper functions
        function formatStaffName(data) {
          const title = data.title ? data.title.trim() + (!data.title.includes(".") && !data.title.includes("Principal") ? "." : "") + " " : "";
          const first = data.firstName ? data.firstName.trim() + " " : "";
          const last = data.lastName || "";
          return title + first + last;
        }

        function isEditable(authority, currentUser, targetData, uid, docId) {
          return authority === "admin" ||
                 authority === "owner" ||
                 (authority === "staff" && currentUser?.role === "principal") ||
                 (authority === "staff" && uid === (targetData.id || docId));
        }

        snapshot.forEach(doc => {
          const userData = doc.data();

          if (userData?.type === "staff") {
            const staffName = formatStaffName(userData);

            const person = document.createElement("div");
            person.classList.add("staffMember");

            const img = document.createElement("img");
            img.classList.add("bigPFP");
            img.src = userData.photoURL || "images/defaultPFP.png";
            img.alt = staffName || "Profile image";

            const editableTag = isEditable(authority, currentUserData, userData, uid, doc.id) ? "editable <br>" : "";

            person.innerHTML = `
              ${img.outerHTML}
              ${editableTag}
              <p>${staffName}</p>
              <p class="pronouns">${userData.pronouns || "No pronouns found."}</p>
              <div class="staffBio">
                ${userData.bio || "No bio found."}
              </div>
            `;

            const role = userData.role;
            if (role === "nurse") {
              nurdiv.appendChild(person);
            } else if (role === "teacher") {
              teadiv.appendChild(person);
            } else if (role === "principal") {
              princdiv.appendChild(person);
            } else if (role === "counselor") {
              coundiv.appendChild(person);
            }
          }
        });

        // Append categories if there are any staff in them
        if (princdiv.childElementCount > 0) staffHolder.appendChild(principal);
        if (teadiv.childElementCount > 0) staffHolder.appendChild(teacher);
        if (nurdiv.childElementCount > 0) staffHolder.appendChild(nurse);
        if (coundiv.childElementCount > 0) staffHolder.appendChild(counselor);

      } catch (error) {
        console.error("Staff loading error:", error);
        staffHolder.textContent = `Error: ${error.message}`;
      }
    });
  });
});
