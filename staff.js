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

            const editableTag = isEditable(authority, currentUserData, userData, uid, doc.id) ? `<div class="editButton">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path></path>
  </svg>
</div>` : "";

            person.innerHTML = `
              ${img.outerHTML}              
              <p>${staffName}</p>
              <p class="pronouns">${userData.pronouns || "No pronouns found."}</p>
              <div class="staffBio">
                ${userData.bio || "No bio found."}
                ${editableTag}
              </div>
            `;

            const editButton = person.querySelector(".editButton");
            if (editButton) {
              editButton.addEventListener("click", function () {
                const overlay = document.createElement("div");
                overlay.classList.add("dimmingOverlay");

                const editMenu = document.createElement("div");
                editMenu.classList.add("staff-edit-menu");
                overlay.appendChild(editMenu);
                document.body.appendChild(overlay);

                editMenu.innerHTML = `
                  <h2>${staffName}</h2>
                  <table>
                    <tr><td>Title:</td><td><input type="text" placeholder="${userData.title || 'Title'}"></td></tr>
                    <tr><td>Pronouns:</td><td><input type="text" placeholder="${userData.pronouns || 'Pronouns'}"></td></tr>
                    <tr><td>First Name:</td><td><input type="text" placeholder="${userData.firstName || 'First name'}"></td></tr>
                    <tr><td>Last Name:</td><td><input type="text" placeholder="${userData.lastName || 'Last name'}"></td></tr>
                    <tr><td>Bio:</td><td><input type="text" placeholder="${userData.bio || 'Bio'}"></td></tr>
                  </table>
                  <input type='submit' value="Save Changes">
                `;

                const saveBtn = editMenu.querySelector("input[type='submit']");
                saveBtn.addEventListener("click", async () => {
                  const inputs = editMenu.querySelectorAll("input[type='text']");
                  const [titleInput, pronounsInput, firstNameInput, lastNameInput, bioInput] = inputs;
                    const updates = {};

                    const titleVal = titleInput.value.trim();
                    if (titleVal) updates.title = titleVal;

                    const pronounsVal = pronounsInput.value.trim();
                    if (pronounsVal) updates.pronouns = pronounsVal;

                    const firstNameVal = firstNameInput.value.trim();
                    if (firstNameVal) updates.firstName = firstNameVal;

                    const lastNameVal = lastNameInput.value.trim();
                    if (lastNameVal) updates.lastName = lastNameVal;

                    const bioVal = bioInput.value.trim();
                    if (bioVal) updates.bio = bioVal;

                    // Only update fields that were actually filled
                    if (Object.keys(updates).length > 0) {
                      await db.collection("users").doc(doc.id).update(updates);
                    }

                  overlay.remove();
                  location.reload();
                });

                // Add cancel button
                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancel";
                cancelBtn.style.marginTop = "10px";
                cancelBtn.addEventListener("click", () => overlay.remove());
                editMenu.appendChild(cancelBtn);
              });
            }

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
