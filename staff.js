document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();

    auth.onAuthStateChanged(async user => {
    
      staffHolder = document.getElementById("staffHolder");

      try {
        const usersRef = firebase.firestore().collection("users");
        const snapshot = await usersRef.get();
        staffHolder.innerHTML="";
        if (snapshot.empty) {
          staffHolder.innerHTML = "No staff found. Dangerous.";
          return;
        }
        snapshot.forEach(doc => {
          const userData = doc.data();
          if (userData && userData.type === "staff"){
const staffName =
  (userData.title ? userData.title.trim() + (!userData.title.includes(".") && !userData.title.includes("Principal") ? "." : "") + " " : "") +
  (userData.firstName ? userData.firstName.trim() + " " : "") +
  (userData.lastName || "");

         const divS = document.createElement("div"); 
          const img = document.createElement("img");
          img.classList.add("bigPFP");
          img.src = userData.photoURL || "images/defaultPFP.png";
          img.alt = staffName || "Profile image";
          staffHolder.appendChild(divS);
          divS.innerHTML = `${staffName}: <br>`;
          divS.appendChild(img);
          }
        });

      } catch (error) {
        staffHolder.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
      }
    
    });
  });
});
