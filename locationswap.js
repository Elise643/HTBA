document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        const auth = firebase.auth();
        const db = firebase.firestore();

        auth.onAuthStateChanged((user) => {
            
            const existingTog = document.getElementById("toggle-wrap");
            if (existingTog) existingTog.remove();

            let toggle = false;
            let wy = document.cookie.includes("atschoollocation=arkansas");
            if (user) {
                db.collection("users").doc(user.uid).get()
                    .then((doc) => {
                        console.log(doc.role)
                        if (doc.role === "admin" || doc.location.length > 1) toggle++;
                        else {
                            document.cookie = `atschoollocation=${doc.location[0].replace("AR", "arkansas").replace("WY", "wyoming")}`
                        }
                    });
            }
            else toggle++;

            if (toggle) {
                let togDiv = document.createElement("div");
                togDiv.classList.add("toggle-wrap");
                togDiv.id = "toggle-wrap"
                togDiv.innerHTML = `
                    <input type="checkbox" id="stateToggle" class="toggle-input">
                    <label for="stateToggle" class="toggle-label">
                        <span class="toggle-text left">WY</span>
                        <span class="toggle-text right">AR</span>
                        <span class="toggle-knob"></span>
                        <span class="toggle-background"></span>
                    </label>
                `
                document.querySelector("header").appendChild(togDiv)

            }

        });
    });
});
