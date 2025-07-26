document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".read-tree-menu .toggle");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement.parentElement;
      parent.classList.toggle("open");

      const img = btn.querySelector("img");
      const isRotated = img.style.transform === "rotate(180deg)";
      img.style.transform = isRotated ? "rotate(0deg)" : "rotate(180deg)";
    });
  });
});
