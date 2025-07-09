const username = (new URLSearchParams(window.location.search)).get("user");

if (!username || username.trim() === "") {
  alert("Don't be an incompetent worm. \"\" is not a username. It's just blank.");
}

// Wait for DOM and Firebase to be ready
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const db = firebase.firestore();
    const profileContainer = document.getElementById("profileContainer");

    try {
      const usersRef = db.collection("users");
      const querySnapshot = await usersRef
        .where("username", "==", username)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        profileContainer.innerHTML = "<p>User not found.</p>";
        return;
      }

      const userData = querySnapshot.docs[0].data();
      console.log("It's working I think");
      console.log(userData);

      // Example: Display user data
      profileContainer.innerHTML = `
        <h2>${userData.displayName || userData.username}</h2>
        <p>Email: ${userData.email || "Hidden"}</p>
        <p>Joined: ${userData.createdAt ? userData.createdAt.toDate().toDateString() : "Unknown"}</p>
      `;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      profileContainer.innerHTML = "<p>Error loading profile.</p>";
    }
  });
});
