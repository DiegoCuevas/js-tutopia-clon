const $form = document.getElementById('loginForm');

function getrgb() {
  const r = Math.floor(Math.random() * 256); // Random between 0-255
  const g = Math.floor(Math.random() * 256); // Random between 0-255
  const b = Math.floor(Math.random() * 256); // Random between 0-255
  const rgb = `rgb(${r}, ${g}, ${b})`;
  return rgb;
}

$form.addEventListener('submit', event => {
  event.preventDefault();
  const username = htmlEntities(event.target.elements.username.value);
  const localUser = {
    name: username,
    color: getrgb()
  };
  localStorage.setItem('user', JSON.stringify(localUser));
  localStorage.setItem('channels', JSON.stringify(['general']));
  window.location = 'index.html';
});

if (localStorage.getItem('user')) {
  window.location = 'index.html';
}

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
