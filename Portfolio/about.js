const globe = document.getElementById('tech-globe');
const toggle = document.getElementById('motion-toggle');
let dragging = false;
let startX = 0;
let rotation = 0;

toggle.addEventListener('click', () => {
  const paused = globe.classList.toggle('is-paused');
  toggle.textContent = paused ? 'Resume rotation' : 'Pause rotation';
  toggle.setAttribute('aria-pressed', String(paused));
});

globe.addEventListener('pointerdown', (event) => {
  dragging = true;
  startX = event.clientX;
  globe.setPointerCapture(event.pointerId);
  globe.classList.add('is-paused');
});

globe.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  rotation += (event.clientX - startX) * 0.5;
  startX = event.clientX;
  globe.style.animation = 'none';
  globe.style.transform = `rotateY(${rotation}deg) rotateX(-7deg)`;
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  toggle.textContent = 'Resume rotation';
  toggle.setAttribute('aria-pressed', 'true');
}
globe.addEventListener('pointerup', endDrag);
globe.addEventListener('pointercancel', endDrag);

toggle.addEventListener('click', () => {
  if (!globe.classList.contains('is-paused')) {
    globe.style.animation = '';
    globe.style.transform = '';
    rotation = 0;
  }
});
