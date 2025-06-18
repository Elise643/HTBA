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
        if (document.selectElementById("profileMenu").style.display==="none") document.selectElementById("profileMenu").style.display = "block";
        else document.selectElementById("profileMenu").style.display = "none";
      };

      document.querySelector("header").appendChild(PFP);

       const menu = document.createElement("div");
      menu.id = "profileMenu";
      menu.style.display = "none";
      const profileOption = document.createElement("div");
      profileOption.textContent = "Profile Settings";
      profileOption.onclick = () => {
        alert(`Logged in as ${user.displayName || user.email}`);
      };

      const logoutOption = document.createElement("div");
      logoutOption.textContent = "Log Out";
      logoutOption.onclick = () => {
        auth.signOut();
        menu.style.display = "none";
      };

      menu.appendChild(profileOption);
      menu.appendChild(logoutOption);
      document.body.appendChild(menu);

      document.addEventListener("click", () => {
        menu.style.display = "none";
      });
      menu.addEventListener("click", (e) => e.stopPropagation());
    }
  });
});
    }
  });
});
