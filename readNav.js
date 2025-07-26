document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".tree-menu .toggle");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      parent.classList.toggle("open");
    });
  });
});
