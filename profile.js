const username = (new URLSearchParams(window.location.search)).get("user");
if (!username || username==="") {
alert("Don't be an incompetant worm. \"\" is not a username. It's just blank.")
}

document.addEventListener("DOMContentLoaded", async () => {
  const db = firebase.firestore();
  const profileContainer = document.getElementById("profileContainer");

  

  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("username", "==", username).limit(1).get();

    if (querySnapshot.empty) {
      profileContainer.innerHTML = "<p>User not found.</p>";
      return;
    }

    const userData = querySnapshot.docs[0].data();
    renderProfile(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    profileContainer.innerHTML = "<p>Error loading profile.</p>";
  }
});
