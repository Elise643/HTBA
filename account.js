const auth = firebase.auth();

// Listen for auth state changes (show user info and toggle logout button)
auth.onAuthStateChanged((user) => {
  if (user) {
    const pfp = document.createElement("img");
    if (user.picture) {
      pfp.setAttribute("src",user.picture);
    }
    else {
      pfp.setAttribute("src","/images/defaultPFP.png");
    }
    pfp.id = "profile";
    pfp.onclick = function() {
      console.log("Profile picture clicked");
    }
    document.querySelector("header").appendChild(pfp);
  }
}
