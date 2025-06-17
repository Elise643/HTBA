async function loadPartial(id, file) {
  const res = await fetch(file);
  const text = await res.text();
  document.getElementById(id).innerHTML = text;
}

window.addEventListener('DOMContentLoaded', () => {
  loadPartial('header-container', 'partials/header.html');
  loadPartial('footer-container', 'partials/footer.html');
});
