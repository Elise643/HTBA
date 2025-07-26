document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        const container = document.querySelector("#tasks-container");

        auth.onAuthStateChanged(async user => {
            if (!user) {
                container.innerHTML = `
                    <p>What are you even doing? You're not logged in. 
                    Stop looking for homework and just log in to your own account, E.N.</p>
                `;
                return;
            }

            try {
                const userDoc = await db.collection("users").doc(user.uid).get();
                const userData = userDoc.data();

                renderTaskTable(userData.taskList || [], user);
                renderAddTaskButton(container, user, userData);
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        });
    });
});

// Renders the user's task table
function renderTaskTable(taskList, user) {
    const container = document.querySelector("#tasks-container");
    container.innerHTML = "";

    if (taskList.length === 0) {
        container.innerHTML = `
            <p>Congratulations, you're task-free! That could mean you don't have any tasks, 
            or just that they haven't been added here.</p>
        `;
        return;
    }

    const table = document.createElement("table");
    container.appendChild(table);

    taskList.forEach((task, index) => {
        const row = document.createElement("tr");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.disabled = task.completion !== "manual" || task.status === "complete";
        checkbox.checked = task.status === "complete";

        if (!checkbox.disabled) {
            checkbox.addEventListener("change", async () => {
                taskList[index].status = checkbox.checked ? "complete" : "incomplete";
                try {
                    await db.collection("users").doc(user.uid).update({ taskList });
                    renderTaskTable(taskList, user); // Refresh view
                } catch (err) {
                    console.error("Failed to update task status:", err);
                }
            });
        }

        row.innerHTML = `
            <td></td>
            <td>
                <p>${task.name}</p>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ""}
            </td>
        `;

        row.querySelector("td").appendChild(checkbox);
        table.appendChild(row);
    });
}

// Creates the "Add Task" button and menu
function renderAddTaskButton(container, user, userData) {
    const addTask = document.createElement("div");
    addTask.id = "new-task-button";
    addTask.textContent = "Add Task";
    container.appendChild(addTask);

    addTask.addEventListener("click", async () => {
        const overlay = document.createElement("div");
        overlay.classList.add("dimmingOverlay");
        overlay.innerHTML = `
            <div class="new-task-menu" id="new-task-menu">
                <h2>New Task</h2>
                <p>Who are you assigning a task to?</p>
                <div id="whoOptions"></div>
                <button id="closeMenu">Close Menu</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const whoOptionsDiv = overlay.querySelector("#whoOptions");
        const options = await getAssignableUsers(user.uid, userData);

        // Sort and display assignable users
        options.sort((a, b) => a.labelText.localeCompare(b.labelText));
        for (const opt of options) {
            const div = document.createElement("div");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "who";
            radio.value = opt.displayName;
            radio.id = opt.displayName;
            if (opt.isCurrentUser) radio.checked = true;

            const label = document.createElement("label");
            label.htmlFor = opt.displayName;
            label.textContent = opt.labelText;

            div.appendChild(radio);
            div.appendChild(label);
            whoOptionsDiv.appendChild(div);
        }

        // Add task fields
        const moreOptions = document.createElement("div");
        moreOptions.innerHTML = `
            <label for="name">Task Name:</label>
            <input name="name" type="text" required><br>

            <label for="completion">Method of Completion:</label>
            <select name="completion" required>
                <option value="manual" selected>Manual</option>
                <option value="auto">Auto</option>
                <option value="manual-backend">Manual (Backend)</option>
            </select><br>

            <label for="description">Task Description:</label>
            <input name="description" type="text"><br>

            <button type="submit">Submit</button>
        `;
        overlay.querySelector("#new-task-menu").insertBefore(
            moreOptions,
            overlay.querySelector("#closeMenu")
        );

        overlay.querySelector("#closeMenu").addEventListener("click", () => {
            overlay.remove();
        });

        // Submit logic
        moreOptions.querySelector("button[type='submit']").addEventListener("click", async () => {
            const selectedUserRadio = overlay.querySelector("input[name='who']:checked");
            const name = overlay.querySelector("input[name='name']").value.trim();
            const completion = overlay.querySelector("select[name='completion']").value;
            const description = overlay.querySelector("input[name='description']").value.trim();

            if (!name || !selectedUserRadio) {
                alert("Please fill out required fields.");
                return;
            }

            const newTask = {
                name,
                description,
                completion,
                status: "incomplete",
                timestamp: Date.now()
            };

            const assignToName = selectedUserRadio.value;

            try {
                // Fetch user by displayName (not ideal in production - use UID if possible)
                const snapshot = await db.collection("users")
                    .where("displayName", "==", assignToName)
                    .get();

                if (snapshot.empty) {
                    alert("User not found.");
                    return;
                }

                const targetDoc = snapshot.docs[0];
                const taskList = targetDoc.data().taskList || [];
                taskList.push(newTask);

                await db.collection("users").doc(targetDoc.id).update({ taskList });

                if (targetDoc.id === user.uid) {
                    renderTaskTable(taskList, user);
                }

                overlay.remove();
            } catch (err) {
                console.error("Error assigning task:", err);
                alert("Failed to assign task.");
            }
        });
    });
}

// Determines which users are assignable by current user
async function getAssignableUsers(currentUID, currentUserData) {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const authority = currentUserData.type === "staff" ? currentUserData.role : currentUserData.type;

    const options = [];

    snapshot.forEach(doc => {
        const compUser = doc.data();
        let assignable = false;

        if (doc.id === currentUID) assignable = true;
        if (compUser.type === "owner") assignable = false;

        if (["admin", "owner"].includes(authority)) assignable = true;
        else if (compUser.type === "student" && ["student", "teacher", "nurse", "counselor"].includes(authority)) assignable = true;
        else if (compUser.type === "staff" && compUser.role === "teacher" && ["principal", "teacher", "nurse", "counselor"].includes(authority)) assignable = true;
        else if (compUser.type === "staff" && ["nurse", "counselor"].includes(compUser.role) && authority === "principal") assignable = true;

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

    return options;
}
