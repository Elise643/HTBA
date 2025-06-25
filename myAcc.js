document.addEventListener("DOMContentLoaded", () => {
document.addEventListener("firebase-ready", () => {
  const auth = firebase.auth();
  const div = document.querySelector("#accountInfo");

  auth.onAuthStateChanged(user => {
    if (!user) {
      const p = document.createElement("p");
      p.innerHTML = `Not logged in. <a href='/login'>Log in</a> to access account information.`;
      div.appendChild(p);
    } else {
      const p = document.createElement("p");
      p.textContent = `Logged in as ${user.displayName}`;
      const pfp = document.createElement("img");
      pfp.id = "pfp";
      pfp.src = user.photoURL || "/images/defaultPFP.png";
      const editPFP = document.createElement("input");
      editPFP.type = "file";
      editPFP.id = "uploadPFP";
      editPFP.accept="image/*"
      const savePFP = document.createElement("button");
      savePFP.textContent = "Save";
      savePFP.addEventListener("click", async () => {
      const file = editPFP.files[0];
      if (!file) {
        alert("You need to actually pick an image. -_-");
        return;
      }
        try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`profilePictures/${user.uid}`);
        await fileRef.put(file);
        const photoURL = await fileRef.getDownloadURL();
        await user.updateProfile({ photoURL });
        profilePic.src = photoURL;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to update profile picture.");
      }
    });
      div.appendChild(p);
      div.appendChild(pfp);
      div.appendChild(editPFP);
      div.appendChild(savePFP); 
    
    }
  });
});
});