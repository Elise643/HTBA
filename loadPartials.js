async function loadPartial(id, file) {
  const res = await fetch(file);
  const text = await res.text();
  document.getElementById(id).innerHTML = text;
}

window.addEventListener('DOMContentLoaded', () => {
  let loc = document.cookie.includes("schoollocation=AR") ? "AR":"WY"
  loadPartial('header-container', `partials/${loc}/header.html`);
  loadPartial('footer-container', `partials/${loc}/footer.html`);
});
