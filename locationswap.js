document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        const auth = firebase.auth();
        const db = firebase.firestore();
        auth.onAuthStateChanged((user) => {
            console.log(document.cookie)
            const existingTog = document.getElementById("toggle-wrap");
            if (existingTog) existingTog.remove();
            let currentLocation = "";
            let makeToggle = true;
            if (user) {
                db.collection("users").doc(user.uid).get()
                    .then((doc) => {

                        const userData = doc.exists ? doc.data() : {};
                        let role = userData.type;
                        let location = userData.location || [];
                        makeToggle = !(location.length === 1);
                        console.log("Make toggle = "+makeToggle)
                        console.log(userData);
                        console.log(`
                            Role: ${role}
                            Location: ${location}
                            Toggle Existence: ${makeToggle}
                            `);
                        if (!makeToggle) {
                            document.cookie = `schoollocation=${userData.location[0]}`
                            currentLocation = userData.location[0];
                        }
                    });
            }
            if (makeToggle) {

                            if (document.cookie.includes("schoollocation")) {
                                console.log("Cookie found")
                                currentLocation = getCookieByName("schoollocation");
                            }
                            else {
                                console.log("No cookie found")
                                currentLocation = "WY";
                                document.cookie = `schoollocation=WY`;
                            }
                            console.log(currentLocation)


                            let togDiv = document.createElement("div");
                            togDiv.classList.add("toggle-wrap");
                            togDiv.id = "toggle-wrap"
                            togDiv.innerHTML = `
                            <input type="checkbox" ${currentLocation==="WY" ? "checked" : ""} id="stateToggle" class="toggle-input">
                            <label for="stateToggle" class="toggle-label">
                                <span class="toggle-text left">WY</span>
                                <span class="toggle-text right">AR</span>
                                <span class="toggle-knob"></span>
                                <span class="toggle-background"></span>
                            </label>
                            `
                            

                            togDiv.querySelector("#stateToggle").addEventListener("change", (event) => {

                                document.cookie = `schoollocation=${document.getElementById("stateToggle").checked ? "WY" : "AR"}`;
                                console.log(document.cookie);
                                updatePage();
                            })
                            document.querySelector("header").appendChild(togDiv)

                        

            }
            updatePage()
        });
    });
});

function getCookieByName(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
    return null;
}

function updatePage(){
    let location = getCookieByName("schoollocation");
    let hI = document.getElementById("headerIcon");
    hI.src = `images/${location==="WY"?"AT":"IN"}-School-Logo.png`
    hI.alt = `${location==="WY"?"AT":"IN"} School Logo`
    let footerText = document.querySelector("footer");
    footerText.innerHTML =   `&copy; 2025-2026 ${location==="WY"?"AT":"IN"} School`
    document.querySelector("header h1").textContent = location==="WY"?"Awkward Tchildren School":"Iawkward Nchildren School"
    document.title = `${location==="WY"?"AT":"IN"} School`
}