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

                renderTaskTable(userData.taskList || []);
                renderAddTaskButton(container, user, userData);
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        });
    });
});

// Renders the user's task table
function renderTaskTable(taskList) {
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

    for (const task of taskList) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <input type="checkbox" 
                    ${task.completion !== "manual" || task.status === "complete" ? "disabled" : ""} 
                    ${task.status === "complete" ? "checked" : ""}>
            </td>
            <td>
                <p>${task.name}</p>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ""}
            </td>
        `;
        table.appendChild(row);
    }
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
        overlay.querySelector("#new-task-menu").insertBefore(moreOptions,overlay.querySelector("#closeMenu"));

        overlay.querySelector("#closeMenu").addEventListener("click", () => {
            overlay.remove();
        });

        // Placeholder for submit logic
        moreOptions.querySelector("button[type='submit']").addEventListener("click", () => {
            
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
