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
      <div id="profileInfo">
        <div id="top">
          <img class="pfp" src="${userData.photoURL || "images/defaultPFP.png"}">
          <div class="stacked">
            <p class="displayName">${userData.callBy || userData.firstName || userData.displayName}</p>
            <p class="username">${userData.displayName ? "@" + userData.displayName : "No display name found."}</p>
            <p class="pronouns">${userData.pronouns || "Pronouns not found."}</p>
          </div>
        </div>
        <div class="profile-bio-div">
            <p class="profile-bio">${userData.bio || ""}</p>
            </div>
            </div>
            <div id="profilePhotos">
            <div id="photosTabular"></div>
            <div id="containsPhotos"></div>
            </div>
      `;
      try {
        const photos = db.collection("pictures");
        let nameArray = [];
        if (userData.firstName)nameArray.push(userData.firstName);
        if (userData.displayName)nameArray.push(userData.displayName);
        if (userData.callBy)nameArray.push(userData.callBy);
        if (userData.nicknames)nameArray.push(userData.nicknames);


        const querySnapshot = await photos
          .where("characterTags", "array-contains-any", nameArray)
          .get();
        let typeList = [];
        for (let doc of querySnapshot.docs) {
        const picture = doc.data();
        if (!typeList.includes(picture.imageType)) {
           typeList.push(picture.imageType);
        }
        let img = document.createElement("img");
        img.src = picture.imageUrl;
        document.querySelector("#containsPhotos").appendChild(img);


}

        for (let tab of typeList){
          let d = document.createElement("div");
          d.class = "photosTab";
          d.textContent = tab;
          document.querySelector("#photosTabular").appendChild(d);
        }
      }
      catch (error) {
        console.error("Error getting pictures: ", error);
        let err = document.createElement("p");
        err.textContent = "Error getting pictures";
        document.querySelector("#profilePhotos").appendChild(err);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      profileContainer.innerHTML = "<p>Error loading profile.</p>";
    }

    });
    
    const searchDiv = document.createElement("div");
    searchDiv.id = "searchDiv";
    searchDiv.innerHTML = `
  <label>Search User </label>
  <input id='userSearch' placeholder='Enter username'>
  <br>
  <button id='userSearchGo'>Search</button>
`;

profileContainer.parentNode.appendChild(searchDiv);

function doSearch() {
  const val = document.querySelector("#userSearch")?.value || "";
  if (!val.trim()) {
    alert("You can't search for a user without a username.");
  } else {
    window.location.href = "/profile?user=" + encodeURIComponent(val);
  }
}

document.querySelector("#userSearchGo").addEventListener("click", doSearch);

document.querySelector("#userSearch").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // prevents accidental form submit behavior in some browsers
    doSearch();
  }
});

});
