document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("firebase-ready", async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const accHolder = document.getElementById("accHolder");
    const currentLoc = getCookieByName("schoollocation");

    // Wait for auth to resolve (user is null when signed out)
    const user = await new Promise(resolve => {
      const unsub = auth.onAuthStateChanged(u => { unsub(); resolve(u); });
    });

    let isPrivileged = false;
    if (user) {
      const { claims } = await user.getIdTokenResult();
      isPrivileged = ["admin", "owner"].includes(claims.type);
    }

    let query = db.collection("users");
    if (!isPrivileged) query = query.where("listed", "==", true);

    let snapshot;
    try {
      snapshot = await query.get();
    } catch (err) {
      console.error(err);
      accHolder.textContent = "Couldn't load accounts.";
      return;
    }

    if (snapshot.empty) {
      accHolder.textContent = "No accounts found...";
      return;
    }

    const frag = document.createDocumentFragment();
    snapshot.forEach(doc => {
      const u = doc.data();
      const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
      const profileUrl = `/profile?user=${encodeURIComponent(u.displayName || "")}`;

      const person = document.createElement("div");
      person.className = "accountInList";

      const picLink = document.createElement("a");
      picLink.href = profileUrl;
      const img = document.createElement("img");
      img.className = "pfp";
      img.src = u.photoURL || "images/defaultPFP.png";
      img.alt = fullName || "Profile image";
      picLink.appendChild(img);

      const stacked = document.createElement("div");
      stacked.className = "stacked";
      const textLink = document.createElement("a");
      textLink.href = profileUrl;
      textLink.append(
        makeP("displayName", fullName),
        makeP("username", "@" + (u.displayName || "")),
        makeP("pronouns", u.pronouns || "No pronouns found."),
        makeP("username", getRoleLabel(u, currentLoc))
      );
      stacked.appendChild(textLink);

      person.append(picLink, stacked);
      frag.appendChild(person);
    });
    accHolder.replaceChildren(frag);
  });
});

function makeP(className, text) {
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  return p;
}

function getRoleLabel(u, loc) {
  let role = u.type;
  if (typeof u.role === "string") role = u.role;
  else if (u.role && typeof u.role === "object" && u.role[loc]) role = u.role[loc];
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
}

function getCookieByName(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}