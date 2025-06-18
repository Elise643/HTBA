// Wait for Firebase to be ready
document.addEventListener("DOMContentLoaded", () => {
  if (!firebase.apps.length) {
    console.error("Firebase not initialized yet");
    return;
  }

  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    // Remove any existing profile image first
    const existingPfp = document.getElementById("profile");
    if (existingPfp) existingPfp.remove();

    if (user) {
      const PFP = document.createElement("img");

      PFP.setAttribute("src", "/images/defaultPFP.png");

      if (user.photoURL) {
        PFP.setAttribute("src", user.photoURL);
      }

      PFP.id = "profile";
      PFP.style.cursor = "pointer";

      PFP.onclick = function() {
        console.log("Profile picture clicked");
      };

      document.querySelector("header").appendChild(PFP);
    }
  });
});
