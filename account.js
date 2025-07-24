document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.onAuthStateChanged((user) => {
      const existingPfp = document.getElementById("profile");
      if (existingPfp) existingPfp.remove();

      const existingMenu = document.getElementById("profileMenu");
      if (existingMenu) existingMenu.remove();

      if (user) {
        document.querySelector("#accountLogin").textContent = "Account";
        document.querySelector("#accountLogin").setAttribute("href", "/myaccount");

        // Fetch user data first
        db.collection("users").doc(user.uid).get()
          .then((doc) => {
            const userData = doc.exists ? doc.data() : {};

            // Create PFP with loaded color
            const PFP = document.createElement("img");
            PFP.id = "profile";
            PFP.style.backgroundColor = userData.photoColorHex || "#ccc"; // fallback color
            PFP.setAttribute("src", user.photoURL || "/images/defaultPFP.png");

            // Create dropdown menu
            const menu = document.createElement("div");
            menu.id = "profileMenu";
            menu.style.display = "none";

            // Profile Settings link
            const profileOption = document.createElement("div");
            const profileLink = document.createElement("a");
            profileOption.textContent = "Profile Settings";
            profileLink.href = "/myaccount";
            profileLink.appendChild(profileOption);

            // View Profile link
            const viewProfile = document.createElement("div");
            const proLink = document.createElement("a");
            viewProfile.textContent = "View Profile";

            const displayName = userData.displayName || userData.username || "unknown";
            proLink.href = "/profile?user=" + encodeURIComponent(displayName);
            proLink.appendChild(viewProfile);

            // Logout option
            const logoutOption = document.createElement("div");
            logoutOption.textContent = "Log Out";
            logoutOption.onclick = (e) => {
              e.stopPropagation();
              auth.signOut();
              menu.style.display = "none";
              document.querySelector("#accountLogin").textContent = "Login";
              document.querySelector("#accountLogin").setAttribute("href", "/login");
            };

            // Append menu options
            menu.appendChild(profileLink);
            menu.appendChild(proLink);
            menu.appendChild(logoutOption);

            // Append menu to body
            document.body.appendChild(menu);

            // Toggle dropdown visibility on PFP click
            PFP.onclick = (e) => {
              e.stopPropagation();
              menu.style.display = menu.style.display === "block" ? "none" : "block";
            };

            // Hide menu when clicking outside
            document.addEventListener("click", () => {
              menu.style.display = "none";
            });

            // Prevent menu click from closing itself
            menu.addEventListener("click", (e) => e.stopPropagation());

            // Add PFP to header
            document.querySelector("header").appendChild(PFP);
          })
          .catch((error) => {
            console.error("Error fetching user document:", error);
          });
      } else {
        // User signed out: reset UI
        document.querySelector("#accountLogin").textContent = "Login";
        document.querySelector("#accountLogin").setAttribute("href", "/login");
      }
    });
  });
});
