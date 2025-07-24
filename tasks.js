document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        const container = document.querySelector("#tasks-container");

        auth.onAuthStateChanged(async user => {
            if (!user) {
                container.innerHTML = "<p>What are you even doing? You're not logged in. Stop looking for homework and just log in to your own account, E.N.</p>";
            } else {
                try {
                    const userDoc = await db.collection("users").doc(user.uid).get();
                    const userData = userDoc.data();

                    if (userData.taskList && userData.taskList.length > 0) {
                        const table = document.createElement("table");
                        container.innerHTML = "";
                        container.appendChild(table);

                        for (task of userData.taskList) {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>
                                    <input type="checkbox" ${(task.completion != "manual" || task.status == "complete") ? "disabled" : ""} ${task.status == "complete" ? "checked" : ""}>
                                </td>
                                <td>
                                    <p>${task.name}</p>
                                </td>
                            `;
                            table.appendChild(row);
                        }
                    } else {
                        container.innerHTML = "<p>Congratulations, you're task-free! That could mean you don't have any tasks, or just that they haven't been added here.</p>";
                    }

                    const addTask = document.createElement("div");
                    container.appendChild(addTask);
                    addTask.id = "new-task-button";
                    addTask.textContent = "Add Task";

                    addTask.addEventListener("click", async function () {
                        const overlay = document.createElement("div");
                        overlay.classList.add("dimmingOverlay");
                        overlay.innerHTML = `
                            <div class="new-task-menu">
                                <h2>New Task</h2>
                                <p>Who are you assigning a task to?</p>
                                <div id="whoOptions"></div>
                                <button id="closeMenu">Close Menu</button>
                            </div>
                        `;
                        document.body.appendChild(overlay);

                        const usersRef = db.collection("users");
                        const snapshot = await usersRef.get();
                        const currentUID = user.uid;
                        const authority = userData.type == "staff" ? userData.role : userData.type;

                        const options = [];

                        snapshot.forEach(doc => {
                            let assignable = false;
                            const compUser = doc.data();

                            if (authority == "admin" || authority == "owner") assignable = true;

                            if (compUser.type == "student" && ["student", "teacher", "nurse", "counselor"].includes(authority)) {
                                assignable = true;
                            }

                            if (compUser.type == "staff" && compUser.role == "teacher" &&
                                ["principal", "teacher", "nurse", "counselor"].includes(authority)) {
                                assignable = true;
                            }

                            if ((compUser.type == "staff" && (compUser.role == "nurse" || compUser.role == "counselor")) &&
                                authority == "principal") {
                                assignable = true;
                            }

                            if (doc.id === currentUID) assignable = true;

                            if (assignable) {
                                const displayName = compUser.displayName;
                                const labelText = (compUser.callBy || compUser.staffName || compUser.firstName || displayName) + (doc.id === currentUID ? " (You!)" : "");
                                options.push({
                                    displayName,
                                    labelText,
                                    isCurrentUser: doc.id === currentUID
                                });
                            }
                        });

                        // Sort options alphabetically by label text
                        options.sort((a, b) => a.labelText.localeCompare(b.labelText));

                        // Append sorted options to the DOM
                        const whoOptionsDiv = document.getElementById("whoOptions");
                        options.forEach(opt => {
                            const radio = document.createElement("input");
                            radio.type = "radio";
                            radio.name = "who";
                            radio.value = opt.displayName;
                            radio.id = opt.displayName;
                            if (opt.isCurrentUser) radio.checked = true;

                            const label = document.createElement("label");
                            label.htmlFor = opt.displayName;
                            label.textContent = opt.labelText;

                            const div = document.createElement("div");
                            div.appendChild(radio);
                            div.appendChild(label);
                            whoOptionsDiv.appendChild(div);
                        });

                        document.querySelector("#closeMenu").addEventListener("click", function () {
                            document.querySelector(".dimmingOverlay").remove();
                        });
                    });
                } catch (error) {
                    console.error("Failed to load user data:", error);
                }
            }
        });
    });
});
