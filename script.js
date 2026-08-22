const title = document.getElementById('title');
let clickCount = 0;
let clickTimer = null;

title.addEventListener('click', () => {
  clickCount += 1;

  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 2000);

  if (clickCount >= 5) {
    clickCount = 0;
    clearTimeout(clickTimer);
    rainGoats();
  }
});

function rainGoats() {
  const goatCount = 40;

  for (let i = 0; i < goatCount; i++) {
    const goat = document.createElement('span');
    goat.className = 'goat';
    goat.textContent = '🐐';
    goat.style.left = `${Math.random() * 100}vw`;
    goat.style.fontSize = `${1 + Math.random() * 2}rem`;

    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 1.5;
    goat.style.animationDuration = `${duration}s`;
    goat.style.animationDelay = `${delay}s`;

    goat.addEventListener('animationend', () => goat.remove());
    document.body.appendChild(goat);
  }
}
