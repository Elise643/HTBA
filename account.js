document.addEventListener("DOMContentLoaded", () => {
  if (!firebase.apps.length) {
    console.error("Firebase not initialized yet");
    return;
  }

  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    const existingPfp = document.getElementById("profile");
    if (existingPfp) existingPfp.remove();

    const existingMenu = document.getElementById("profileMenu");
    if (existingMenu) existingMenu.remove();

    if (user) {
      const PFP = document.createElement("img");
      PFP.id = "profile";
      PFP.setAttribute("src", user.photoURL || "/images/defaultPFP.png");

      // Create dropdown menu
      const menu = document.createElement("div");
      menu.id = "profileMenu";
      menu.style.display = "none";

      const profileOption = document.createElement("div");
      profileOption.textContent = "Profile Settings";
      profileOption.onclick = (e) => {
        e.stopPropagation();
        alert(`Logged in as ${user.displayName || user.email}`);
        menu.style.display = "none";
      };

      const logoutOption = document.createElement("div");
      logoutOption.textContent = "Log Out";
      logoutOption.onclick = (e) => {
        e.stopPropagation();
        auth.signOut();
        menu.style.display = "none";
      };

      menu.appendChild(profileOption);
      menu.appendChild(logoutOption);
      document.body.appendChild(menu);

      // Toggle dropdown visibility
      PFP.onclick = (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      };

      document.addEventListener("click", () => {
        menu.style.display = "none";
      });

      menu.addEventListener("click", (e) => e.stopPropagation());

      document.querySelector("header").appendChild(PFP);
    }
  });
});
