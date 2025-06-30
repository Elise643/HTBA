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
        const nurse = document.createElement("table");
        nurse.appendChild(document.createElement("th"));
        nurse.firstChild.appendChild(document.createElement("td"));
        nurse.firstChild.firstChild.textContent = "Nurse(s)";
        const teacher = document.createElement("table");
        teacher.appendChild(document.createElement("th"));
        teacher.firstChild.appendChild(document.createElement("td"));
        teacher.firstChild.firstChild.textContent = "Teacher(s)";
        const principal = document.createElement("table");
        principal.appendChild(document.createElement("th"));
        principal.firstChild.appendChild(document.createElement("td"));
        principal.firstChild.firstChild.textContent = "Principal";

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
                nurse.appendChild(document.createElement("tr"));
              }
              nurse.querySelector("tr").appendChild(person);
          }
          if (userData.role === "teacher") {
              if (!teacher.querySelector("tr")){
                teacher.appendChild(document.createElement("tr"));
              }
              teacher.querySelector("tr").appendChild(person);
          }
          if (userData.role === "principal") {
              if (!principal.querySelector("tr")){
                principal.appendChild(document.createElement("tr"));
              }
              princial.querySelector("tr").appendChild(person);
          }
          person.innerHTML = `${staffName}: <br>`;
          person.appendChild(img);
          }
        });
        if (principal.querySelector("tr")) staffHolder.appendChild(principal);
        if (teacher.querySelector("tr")) staffHolder.appendChild(teacher);
        if (nurse.querySelector("tr")) staffHolder.appendChild(nurse);


      } catch (error) {
        staffHolder.innerHTML = `Error: ${error.message}`;
      }
    
    });
  });
});
