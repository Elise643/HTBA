document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        auth.onAuthStateChanged(async user => {
            if (!user) {
                document.querySelector("#read-doc-holder").innerHTML = "Oops! You don't seem to be signed in. (Or you're signed in to an account that doesn't have script reading access)";
                            document.querySelector("read-doc-holder").style.display = "block";
                                        document.querySelector("#loadMessage").remove;


                return;
            } else {
                const userDoc = await db.collection("users").doc(user.uid).get();
                const userData = userDoc.data();
                if (userData.type === "visitor" || userData.type === "Visitor") {
                document.querySelector("#read-doc-holder").innerHTML = "Oops! You don't seem to be signed in. (Or you're signed in to an account that doesn't have script reading access)";
                
                            document.querySelector("read-doc-holder").style.display = "block";
                                        document.querySelector("#loadMessage").remove;

return;
            }
            }

            document.querySelector("read-doc-holder").style.display = "block";
            document.querySelector("#loadMessage").remove;
        });
    });
});
