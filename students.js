document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();

    auth.onAuthStateChanged(async user => {
      if (!user) {
        return; // Not logged in
      }

      const tableBody = document.querySelector("#studentTableBody");

      try {
        // Make sure Firebase Firestore is initialized
        const usersRef = firebase.firestore().collection("users");
        const snapshot = await usersRef.where("type", "==", "student").get();

        tableBody.innerHTML = ""; // Clear loading message

        if (snapshot.empty) {
          tableBody.innerHTML = "<tr><td colspan='3'>No students found.</td></tr>";
          return;
        }

        snapshot.forEach(doc => {
          const userData = doc.data();

          const tr = document.createElement("tr");

          const imgTd = document.createElement("td");
          const img = document.createElement("img");
          img.src = userData.photoURL || "https://via.placeholder.com/50";
          img.alt = userData.displayName || "Profile image";
          img.width = 50;
          img.height = 50;
          imgTd.appendChild(img);

          const displayNameTd = document.createElement("td");
          displayNameTd.textContent = userData.displayName || "(No name)";

          const firstNameTd = document.createElement("td");
          firstNameTd.textContent = userData.firstName || "(No first name)";

          tr.appendChild(imgTd);
          tr.appendChild(displayNameTd);
          tr.appendChild(firstNameTd);

          tableBody.appendChild(tr);
        });

      } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
      }
    });
  });
});
