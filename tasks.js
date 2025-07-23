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
                container.innerHTML = userData.taskList;
            }
            else {
                        container.innerHTML = "<p>Congratulations, you're task-free! That could mean you don't have any tasks, or just that they haven't been added here.</p>"

            }
        } catch (error) {
            console.error("Failed to load user data:", error);
        }
    }
});

    });
});