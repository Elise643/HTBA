document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", () => {
    const auth = firebase.auth();
    const div = document.querySelector("#accountInfo");

    auth.onAuthStateChanged(async user => {
      if (!user) {
        const p = document.createElement("p");
        p.innerHTML = `Not logged in. <a href='/login'>Log in</a> to access account information.`;
        div.appendChild(p);
        return;
      }

      const p = document.createElement("p");
      p.textContent = `Logged in as ${user.displayName}`;

      const pfp = document.createElement("img");
      pfp.id = "pfp";
      pfp.src = user.photoURL || "/images/defaultPFP.png";
      pfp.style.maxWidth = "150px";
      pfp.style.display = "block";

      const editPFP = document.createElement("input");
      editPFP.type = "file";
      editPFP.id = "uploadPFP";
      editPFP.accept = "image/*";

      const savePFP = document.createElement("button");
      savePFP.textContent = "Save";

      const loading = document.createElement("div");
      loading.className = "spinner";
      loading.style.display = "none";

      savePFP.addEventListener("click", async () => {
        const file = editPFP.files[0];
        if (!file) {
          alert("You need to actually pick an image. -_-");
          return;
        }

        savePFP.disabled = true;
        editPFP.disabled = true;
        loading.style.display = "inline-block";

        try {
          // Try Cloudinary
          const cloudinaryData = new FormData();
          cloudinaryData.append("file", file);
          cloudinaryData.append("upload_preset", "htba-preset");

          const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dnl9rrcr5/image/upload", {
            method: "POST",
            body: cloudinaryData,
          });

          let imageUrl;
          if (cloudinaryRes.ok) {
            const cloudinaryJson = await cloudinaryRes.json();
            imageUrl = cloudinaryJson.secure_url;
          } else {
            throw new Error("Cloudinary upload failed");
          }

          await user.updateProfile({ photoURL: imageUrl });
          pfp.src = imageUrl;
        } catch (err) {
          console.warn("Cloudinary failed, trying Imgur...");

          try {
            const imgurData = new FormData();
            imgurData.append("image", file);

            const imgurRes = await fetch("https://api.imgur.com/3/image", {
              method: "POST",
              headers: {
                Authorization: "Client-ID 37b62003f061f9b"
              },
              body: imgurData
            });

            if (!imgurRes.ok) throw new Error("Imgur upload failed");

            const imgurJson = await imgurRes.json();
            const imageUrl = imgurJson.data.link;

            await user.updateProfile({ photoURL: imageUrl });
            pfp.src = imageUrl;
            alert("Hosted on Imgur rather than Cloudinary. If this means nothing to you, ignore it.");
          } catch (e) {
            console.error("Both uploads failed:", e);
            alert("Image upload failed. Try again (or tell Elise something's wrong lol)");
          }
        } finally {
          loading.style.display = "none";
          savePFP.disabled = false;
          editPFP.disabled = false;
        }
      });
   const accInfo = document.createElement("table");
try {
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (userDoc.exists) {
    const userData = userDoc.data();

    const datas = [
      { label: "Username/Display Name: ", data: userData.displayName },
      { label: "Account Type: ", data: userData.type },
      { label: "First Name: ", data: userData.firstName },
      { label: "Middle Name: ", data: userData.middleName },
      { label: "Title: ", data: userData.title },
      { label: "Last Name: ", data: userData.lastName },
      { label: "Role: ", data: userData.role },
      { label: "Subject: ", data: userData.subject }


    ];

    datas.forEach(({ label, data }) => {
      if (data) {
        const tr = document.createElement("tr");
        const tdl = document.createElement("td");
        tdl.textContent = label;
        const tdd = document.createElement("td");
        tdd.textContent = titleCase(data);
        tr.appendChild(tdl);
        tr.appendChild(tdd);
        accInfo.appendChild(tr);
      }
    });

    div.appendChild(accInfo);
  } else {
    const p = document.createElement("p");
    p.textContent = "No account info found in Firestore.";
    div.appendChild(p);
  }
} catch (err) {
  console.error("Error fetching user info:", err);
  const p = document.createElement("p");
  p.textContent = "Failed to load account details.";
  div.appendChild(p);
}

      div.appendChild(p);
      div.appendChild(pfp);
      div.appendChild(editPFP);
      div.appendChild(savePFP);
      div.appendChild(loading);
      div.appendChild(accInfo);
    });
  });
});

//yes I just stole this from w3schools don't judge me
//stealing code, it's like coding, but easier!
//genuinely though to an extent all coding is just copying and pasting
function titleCase(s) {
    return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}
