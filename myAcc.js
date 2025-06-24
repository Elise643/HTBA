document.addEventListener("DOMContentLoaded", () => {
  if (!firebase.apps.length) {
    console.error("Firebase not initialized yet");
    return;
  }

  const auth = firebase.auth();
  const div = document.querySelector("#accountInfo");

  auth.onAuthStateChanged(user => {
    if (!user) {
      const p = document.createElement("p");
      p.innerHTML = "Not logged in. <a href='/login'>Log in</a> to access account information.";
      div.appendChild(p);
    } else {
      const p = document.createElement("p");
      p.textContent = `Logged in as ${user.displayName}`;
      const pfp = document.createElement("img");
      pfp.id = "pfp";
      pfp.src = user.photoURL || "/images/defaultPFP.png";

      div.appendChild(p);
      div.appendChild(pfp);
    }
  });
});
