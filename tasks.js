document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("firebase-ready", () => {
        const container = document.querySelector("#tasks-container");
        auth.onAuthStateChanged(async user => {
    if (!user) {
        container.innerHTML = "<p>What are you even doing? You're not logged in. Stop looking for homework and just log in to your own account, E.N.</p>"
    } else {
        try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            const userData = userDoc.data();
            if (userData.taskList && userData.taskList.length>0) {
              const table = document.createElement("table");
              container.appendChild(table);
              for (task of userData.taskList){
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>
                <input type="checkbox" ${(task.completion!="manual"||task.status=="complete")? "disabled":""} ${task.status=="complete"? "selected":""}>
                </td>
                <td>
                <p>${task.name}</p>
                </td>
                `
                table.appendChild(row);
              }
            }
            else {
                        container.innerHTML = "<p>Congratulations, you're task-free! That could mean you don't have any tasks, or just that they haven't been added here.</p>"

            }
            const addTask = document.createElement("div");
            container.appendChild(addTask);
            addTask.id = "new-task-button";
            addTask.textContent = "Add Task";
            addTask.addEventListener("click", function(){
                const overlay = document.createElement("div");
                overlay.classList.add("dimmingOverlay");
                overlay.innerHTML = `
                <div class="new-task-menu">
                    <h2>New Task</h2>
                    <p>Who are you assigning a task to?</p>
                    <div id="whoOptions">

                    </div>
                    <button id = "closeMenu">Close Menu</button>
                </div>
                `
                document.body.appendChild(overlay);
                if (userData.type=="student"){
                    document.querySelector("#whoOptions").innerHTML = `<input type="radio" name="who" value="${userData.displayNameLower}" id="${userData.displayNameLower}" selected>    <label for="${userData.displayNameLower}">${userData.callBy || userData.firstName} (You)</label>`;
                }
                
                document.querySelector("#closeMenu").addEventListener("click",function(){
                    document.querySelector(".dimmingOverlay").remove();
                })
            })
        } catch (error) {
            console.error("Failed to load user data:", error);
        }
    }
});

    });
});