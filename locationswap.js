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
                                currentLocation = getCookieByName("schoollocation");
                            }
                            else {
                                currentLocation = "WY";
                                document.cookie = `schoollocation=WY`;
                            }


                            let togDiv = document.createElement("div");
                            togDiv.classList.add("toggle-wrap");
                            togDiv.id = "toggle-wrap"
                            togDiv.innerHTML = `
                            <input type="checkbox" ${currentLocation==="WY" ? "" : "checked"} id="stateToggle" class="toggle-input">
                            <label for="stateToggle" class="toggle-label">
                                <span class="toggle-text left">WY</span>
                                <span class="toggle-text right">AR</span>
                                <span class="toggle-knob"></span>
                                <span class="toggle-background"></span>
                            </label>
                            `
                            

                            togDiv.querySelector("#stateToggle").addEventListener("change", (event) => {

                                document.cookie = `schoollocation=${!event.target.checked ? "WY" : "AR"}`;
                                console.log(document.cookie.includes("schoollocation=AR") ? "arkansas" : "wyoming")
                            })
                            document.querySelector("header").appendChild(togDiv)

                        

            }
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
/*                      
        auth.onAuthStateChanged((user) => {
            console.log(document.cookie.includes("atschoollocation=arkansas") ? "arkansas":"wyoming")
            const existingTog = document.getElementById("toggle-wrap");
            if (existingTog) existingTog.remove();

            let toggle = false;
            
            
            if (user) {
                db.collection("users").doc(user.uid).get()
                    .then((doc) => {
                        const userData = doc.exists ? doc.data() : {};
                        if (userData.role === "admin" || userData.location.length > 1) toggle++;
                        else {
                            document.cookie = `atschoollocation=${userData.location[0].replace("AR", "arkansas").replace("WY", "wyoming")}`
                        }
                    });
            }
            else toggle++;
            let wy = document.cookie.includes("atschoollocation=arkansas");
            console.log(document.cookie.includes("atschoollocation=arkansas") ? "arkansas":"wyoming")
            if (toggle) {
                let togDiv = document.createElement("div");
                togDiv.classList.add("toggle-wrap");
                togDiv.id = "toggle-wrap"
                togDiv.innerHTML = `
                    <input type="checkbox" ${wy ? "":"checked"}id="stateToggle" class="toggle-input">
                    <label for="stateToggle" class="toggle-label">
                        <span class="toggle-text left">WY</span>
                        <span class="toggle-text right">AR</span>
                        <span class="toggle-knob"></span>
                        <span class="toggle-background"></span>
                    </label>
                `
                document.querySelector("header").appendChild(togDiv)
                document.querySelector("#stateToggle").addEventListener("change",(event)=>{
                    
                        document.cookie = `atschoollocation=${!event.target.checked ? "wyoming":"arkansas"}`;
                        console.log(document.cookie.includes("atschoollocation=arkansas") ? "arkansas":"wyoming")
                })

            }

        });
    });
});
*/