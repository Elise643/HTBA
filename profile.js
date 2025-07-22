const username = (new URLSearchParams(window.location.search)).get("user");

if (!username || username.trim() === "") {
  alert("Don't be an incompetent worm. \"\" is not a username. It's just blank.");
  profileContainer.innerHTML = "<p>User error. You didn't put a username.</p>";
}

// Wait for DOM and Firebase to be ready
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const db = firebase.firestore();
    const profileContainer = document.getElementById("profileContainer");

    try {
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
      console.log("It's working I think");
      console.log(userData);

      // Example: Display user data
      profileContainer.innerHTML = `
      <div id="top">
      
        <img class="pfp" src=${userData.photoURL || "images/defaultPFP.png"}>
        <div class="stacked">
        <h2 class="displayName">${userData.callBy || userData.firstName || userData.displayName}</h2>
        <h4 class="username">${"@"+userData.displayName||"No display name found. (this is a problem btw)"}</h4>
        
        <p class="pronouns">${userData.pronouns || "Pronouns not found."}</p>
        </div>
      </div>
      `;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      profileContainer.innerHTML = "<p>Error loading profile.</p>";
    }
    const searchDiv = document.createElement("div");
    searchDiv.id = "searchDiv";
    profileContainer.appendChild(searchDiv);
    searchDiv.innerHTML = "<label>Search User </label><input id='userSearch' placeholder='Enter username'><br><button id='userSearchGo'>Search</button>";
document.querySelector("#userSearchGo").addEventListener("click", function(){
          const inp = document.querySelector("#userSearch");
          const val = inp ? inp.value || "":"";
          if (!val || val==""){
            alert("You can't search for a user without a username! What are you doing?")
          }
          else {
            window.location.href="/profile?user="+val;
          }
        });

  });
});
