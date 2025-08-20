document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
 auth.onAuthStateChanged(async user => {
            if (!user) {
                document.querySelectorAll("iframe").forEach(el=> function(){
                    el.remove()
                }
                );
            }
            else {
                const userDoc = await db.collection("users").doc(user.uid).get();
                const userData = userDoc.data();
                if (userData.type==="visitor"||userData.type==="Visitor") {
document.querySelectorAll("iframe").forEach(el=> function(){
                    el.remove()
                }
                );
                }
            }
    });
});
});