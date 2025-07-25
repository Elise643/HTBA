const overlay = document.createElement("div");
overlay.classList.add("dimmingOverlay");
overlay.innerHTML = `
<div class="new-task-menu"><p style="margin:auto; font-size:3em;">LEAVE<br>THIS IS NOT FUNCTIONAL</p><button type="button" onclick="javascript:history.back()">Back</button></div>
`
document.body.appendChild(overlay);
document.body.style = "overflow-y:hidden; pointer-events:none; touch-action:none;";