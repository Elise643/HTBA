document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        auth.onAuthStateChanged(async user => {
    if (!user) {
        return;
    } else {
        try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            const userData = userDoc.data();
            const firstName = userData.callBy || userData.firstName || "User";

            const dashboardDiv = document.createElement("div");
            dashboardDiv.innerHTML = `<p>Hello ${firstName}! Once this part is finished being coded, you'll be able to access your ${userData.type} dashboard here.</p>`;
            document.getElementById("dashboard-holder").appendChild(dashboardDiv);
        } catch (error) {
            console.error("Failed to load user data:", error);
        }
    }
});

    });
});