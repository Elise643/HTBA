document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();

    auth.onAuthStateChanged(async user => {
      if (!user) {
        return; // Not logged in
      }
      document.getElementById("superSecretStuffHere").innerHTML = `
      <table>
  <thead>
    <tr>
      <th>Photo</th>
      <th>Display Name</th>
      <th>First Name</th>
    </tr>
  </thead>
  <tbody id="studentTableBody">
    <tr><td colspan="3">Loading...</td></tr>
  </tbody>
</table>
`;
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
          img.classList.add("pfp");
          img.src = userData.photoURL || "/defaultProfile";
          img.alt = userData.displayName || "Profile image";
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
