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
      pfp.alt = `${user.displayName || "User"}'s Profile Picture`;
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
        if (!file || !file.type.startsWith("image/")) {
          alert("You need to actually pick an image. -_-");
          return;
        }

        savePFP.disabled = true;
        editPFP.disabled = true;
        loading.style.display = "inline-block";

        try {
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

      const savingIndicator = document.createElement("div");
      savingIndicator.textContent = "Saving...";
      savingIndicator.style.display = "none";
      savingIndicator.style.marginTop = "8px";
      savingIndicator.style.fontStyle = "italic";
      savingIndicator.style.color = "gray";

      try {
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();

          const datas = [
            { label: "Username/Display Name: ", data: userData.displayName, compat: ["all"], sh: "displayName", editable: false},
            { label: "Account Type: ", data: userData.type, editable: false},
            { label: "Title: ", data: userData.title, compat: ["all"], sh: "title" },
            { label: "First Name: ", data: userData.firstName, compat: ["all"], sh: "firstName" },
            { label: "Middle Name: ", data: userData.middleName, compat: ["all"], sh: "middleName" },
            { label: "Last Name: ", data: userData.lastName, compat: ["all"], sh: "lastName" },
            { label: "Role: ", data: userData.role, compat: ["staff"], sh: "role" },
            { label: "Subject: ", data: userData.subject, compat: ["teacher"], sh: "subject" },
            { label: "Power: ", data: userData.power, compat: ["staff", "student"], sh: "power" },
            { label: "Nickname(s): ", data: userData.nicknames, compat: ["all"], sh: "nicknames" },
            { label: "Birthday: ", data: userData.birthday, compat: ["all"], sh: "birthday" },
            { label: "In Universe Age: ", data: userData.canonAge, compat: ["staff", "student"], sh: "canonAge" },
            { label: "Current Age: ", data: userData.currentAge, compat: ["all"], sh: "currentAge" },
            { label: "Gender: ", data: userData.gender, compat: ["all"], sh: "gender" },
            { label: "Pronouns: ", data: userData.pronouns, compat: ["all"], sh: "pronouns" }
          ];

          const addData = document.createElement("div");
          const addDataLabel = document.createElement("label");
          addDataLabel.textContent = "Add Data";
          const selectData = document.createElement("select");
          selectData.id = "selectData";
          const defOption = document.createElement("option");
          defOption.selected = true;
          defOption.disabled = true;
          defOption.value = "";
          defOption.text = "Select Variable";

          addData.appendChild(addDataLabel);
          addData.appendChild(selectData);
          selectData.appendChild(defOption);

          selectData.addEventListener("change", () => {
            if (document.getElementById("dataInput")) {
              document.getElementById("dataInput").remove();
            }
            const datin = document.createElement("div");
            const indathere = document.createElement("input");
            const savedat = document.createElement("button");
            datin.appendChild(indathere);
            datin.appendChild(savedat);
            datin.id = "dataInput";
            indathere.id = "inputField";
            savedat.id = "saveData";
            savedat.textContent = "Save";

            savedat.onclick = async function () {
              const inputValue = document.querySelector("#inputField").value.trim();
              if (inputValue !== "") {
                const saveType = document.querySelector("#selectData").value;
                await db.collection("users").doc(user.uid).update({ [saveType]: inputValue });
                indathere.value = "";
              }
            };
            addData.appendChild(datin);
          });

          const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
              clearTimeout(timeout);
              timeout = setTimeout(() => func.apply(this, args), delay);
            };
          };

          datas.forEach(({ label, data, compat, sh, editable = true }) => {
            const compatible = !compat || compat[0] === "all" || compat.includes(userData.type) || (userData.type === "staff" && userData.role === "teacher" && compat.includes("teacher"));

            if (data) {
              const tr = document.createElement("tr");
              const tdl = document.createElement("td");
              tdl.textContent = label;
              const tdd = document.createElement("td");

              if (editable) {
                const input = document.createElement("input");
                input.type = "text";
                input.value = data;
                input.style.minWidth = "150px";

                const saveValue = async () => {
                  if (!sh) return;
                  const newVal = input.value.trim();
                  if (newVal !== data && newVal !== "") {
                    savingIndicator.style.display = "block";
                    try {
                      await db.collection("users").doc(user.uid).update({ [sh]: newVal });
                    } catch (err) {
                      console.error(`Error saving ${sh}:`, err);
                      alert(`Failed to save "${label}".`);
                    } finally {
                      savingIndicator.style.display = "none";
                    }
                  }
                };

                input.addEventListener("blur", debounce(saveValue, 300));
                input.addEventListener("keydown", e => {
                  if (e.key === "Enter") input.blur();
                });

                tdd.appendChild(input);
              } else {
                if (sh !== "displayName") {
                  tdd.textContent = titleCase(data);
                } else {
                  tdd.textContent = data;
                }
              }

              tr.appendChild(tdl);
              tr.appendChild(tdd);
              accInfo.appendChild(tr);
            } else if (compatible) {
              const op = document.createElement("option");
              op.value = sh;
              op.text = label.replace(": ", "");
              selectData.appendChild(op);
            }
          });

          div.appendChild(accInfo);
          if (selectData.childElementCount > 1) div.appendChild(addData);
          div.appendChild(savingIndicator);
        } else {
          const p = document.createElement("p");
          p.textContent = "No account info found. How did you even make an account like that?";
          div.appendChild(p);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        const p = document.createElement("p");
        p.textContent = "Failed to load account details.";
        div.appendChild(p);
      }

      div.appendChild(document.createElement("br"));
      div.appendChild(p);
      div.appendChild(pfp);
      div.appendChild(editPFP);
      div.appendChild(savePFP);
      div.appendChild(loading);
    });
  });
});

function titleCase(s) {
  return s.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
