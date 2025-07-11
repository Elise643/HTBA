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
        .where("displayNameLower", "==", username.toLowerCase())
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
      <div id="top">
      
        <img class="pfp" src=${userData.photoURL || "images/defaultPFP.png"}>
        <div class="stacked">
        <h2 class="displayName">${userData.callBy || userData.firstName || userData.displayName}</h2>
        <h4 class="username">${"@"+userData.displayName||"No display name found. (this is a problem btw)"}</h4>
        
        <p class="pronouns">${userData.pronouns || "Pronouns not found."}</p>
        </div>
      </div>
      `;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      profileContainer.innerHTML = "<p>Error loading profile.</p>";
    }
  });
});
