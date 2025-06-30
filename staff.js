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
        const nurse = document.createElement("div");
        nurse.appendChild(document.createElement("p"));
        nurse.firstChild.textContent = "Nurse(s)";
        const teacher = document.createElement("div");
        teacher.appendChild(document.createElement("p"));
        teacher.firstChild.textContent = "Teacher(s)";
        const principal = document.createElement("div");
        principal.appendChild(document.createElement("p"));
        principal.firstChild.textContent = "Principal";

        snapshot.forEach(doc => {
          const userData = doc.data();
          if (userData && userData.type === "staff"){
const staffName =
  (userData.title ? userData.title.trim() + (!userData.title.includes(".") && !userData.title.includes("Principal") ? "." : "") + " " : "") +
  (userData.firstName ? userData.firstName.trim() + " " : "") +
  (userData.lastName || "");

         const person = document.createElement("td"); 
          const img = document.createElement("img");
          img.classList.add("bigPFP");
          img.src = userData.photoURL || "images/defaultPFP.png";
          img.alt = staffName || "Profile image";
          if (userData.role === "nurse") {
              if (!nurse.querySelector("tr")){
              nurse.appendChild(person);
          }
          if (userData.role === "teacher") {
              teacher.appendChild(person);
          }
          if (userData.role === "principal") {
              principal.appendChild(person);
          }
          person.innerHTML = `<table><tr><td>${staffName}:</td></tr><tr><td>${img.outerHTML}</td></tr></table>`;
          
          }
        });
        if (principal.childElementCount>1) staffHolder.appendChild(principal);
        if (teacher.childElementCount>1) staffHolder.appendChild(teacher);
        if (nurse.childElementCount>1) staffHolder.appendChild(nurse);


      } catch (error) {
        staffHolder.innerHTML = `Error: ${error.message}`;
      }
    
    });
  });
});
