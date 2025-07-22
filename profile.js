document.addEventListener("DOMContentLoaded", () => {
  const username = (new URLSearchParams(window.location.search)).get("user");
  const profileContainer = document.getElementById("profileContainer");

  if (!username || username.trim() === "") {
    alert("Don't be an incompetant worm! You're searching for a user but you left the username blank");
    profileContainer.innerHTML = "<p>User error. You didn't put a username.</p>";
    return;
  }

  document.addEventListener("firebase-ready", async () => {
    const db = firebase.firestore();

    try {
      profileContainer.innerHTML = "<p>Loading user profile...</p>";

      const usersRef = db.collection("users");
      const querySnapshot = await usersRef
        .where("displayNameLower", "==", username.toLowerCase())
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        profileContainer.innerHTML = "<p>User not found.</p>";
        return;
      }

      const userData = querySnapshot.docs[0].data();
      console.log("Fetched user:", userData);

      profileContainer.innerHTML = `
        <div id="top">
          <img class="pfp" src="${userData.photoURL || "images/defaultPFP.png"}">
          <div class="stacked">
            <p class="displayName">${userData.callBy || userData.firstName || userData.displayName}</p>
            <p class="username">${userData.displayName ? "@" + userData.displayName : "No display name found."}</p>
            <p class="pronouns">${userData.pronouns || "Pronouns not found."}</p>
            <div class="profile-bio-div">
            <p class="profile-bio">${userData.bio || ""}</p>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      profileContainer.innerHTML = "<p>Error loading profile.</p>";
    }

    const searchDiv = document.createElement("div");
    searchDiv.id = "searchDiv";
    searchDiv.innerHTML = `
      <label>Search User </label>
      <input id='userSearch' placeholder='Enter username'>
      <br>
      <button id='userSearchGo'>Search</button>
    `;
    profileContainer.parentNode.appendChild(searchDiv);

    document.querySelector("#userSearchGo").addEventListener("click", () => {
      const val = document.querySelector("#userSearch")?.value || "";
      if (!val.trim()) {
        alert("You can't search for a user without a username.");
      } else {
        window.location.href = "/profile?user=" + encodeURIComponent(val);
      }
    });
  });
});
