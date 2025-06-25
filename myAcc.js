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

      // Retry-safe image loader
      const loadImageWithRetry = (url, target, retries = 5) => {
        const tryLoad = () => {
          const img = new Image();
          img.onload = () => target.src = url;
          img.onerror = () => {
            if (retries > 0) {
              setTimeout(() => tryLoad(--retries), 1000);
            } else {
              alert("Failed to load new profile picture after upload.");
            }
          };
          img.src = url;
        };
        tryLoad();
      };

      savePFP.addEventListener("click", async () => {
        const file = editPFP.files[0];
        if (!file) {
          alert("You need to actually pick an image. -_-");
          return;
        }

        try {
          // Upload to Cloudinary
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
          loadImageWithRetry(imageUrl, pfp);
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
            loadImageWithRetry(imageUrl, pfp);

            alert("Hosted on Imgur rather than default Cloudinary. If this means nothing to you, ignore it. I just want to know for my own stuff.");
          } catch (e) {
            console.error("Both uploads failed:", e);
            alert("Image upload failed. Try again (or tell Elise something's wrong lol)");
          }
        }
      });

      div.appendChild(p);
      div.appendChild(pfp);
      div.appendChild(editPFP);
      div.appendChild(savePFP);
    });
  });
});
