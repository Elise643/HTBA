document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".read-tree-menu .toggle");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      parent.classList.toggle("open");
      btn.querySelector("img").style.transform.toggle("rotate(180deg)");
    });
  });
});
