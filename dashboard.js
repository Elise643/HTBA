document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        const auth = firebase.auth();
        const db = firebase.firestore();
        

        auth.onAuthStateChanged(async user => {
            if (!user) {
                return;
            }
            else {
                const dashboardDiv = document.createElement("div");
                dashboardDiv.innerHTML = `<p>Hello ${user.firstName}! Once this part is finished being coded, you'll be able to access your dashboard here.</p>`;
                document.getElementById("dashboard-holder").appendChild(dashboardDiv);
            }

        });
    });
});