export default function decorate(block) {
  const slides = [...block.children].map((row) => {
    const cell = row.firstElementChild;
    const picture = cell.querySelector('picture');
    const subtitle = cell.querySelector('p:not(:has(picture))');
    const heading = cell.querySelector('h1, h2');
    return { picture, subtitle: subtitle?.textContent.trim(), heading: heading?.cloneNode(true) };
  });

  block.innerHTML = '';

  // slide list
  const ul = document.createElement('ul');
  ul.className = 'hero-slideshow-slides';
  slides.forEach(({ picture, subtitle, heading }) => {
    const li = document.createElement('li');
    li.className = 'hero-slideshow-slide';

    const bg = document.createElement('div');
    bg.className = 'hero-slideshow-bg';
    if (picture) bg.append(picture);
    li.append(bg);

    const content = document.createElement('div');
    content.className = 'hero-slideshow-content';
    if (subtitle) {
      const p = document.createElement('p');
      p.className = 'hero-slideshow-subtitle';
      p.textContent = subtitle;
      content.append(p);
    }
    if (heading) {
      heading.removeAttribute('class');
      content.append(heading);
    }
    li.append(content);
    ul.append(li);
  });
  block.append(ul);

  // controls
  const controls = document.createElement('div');
  controls.className = 'hero-slideshow-controls';
  controls.innerHTML = `
    <button class="hero-slideshow-prev" aria-label="Previous slide" type="button">&#8592;</button>
    <span class="hero-slideshow-counter"></span>
    <button class="hero-slideshow-next" aria-label="Next slide" type="button">&#8594;</button>
  `;
  block.append(controls);

  let current = 0;
  let timer;
  const items = [...ul.children];
  const counter = controls.querySelector('.hero-slideshow-counter');

  function show(index) {
    items[current].classList.remove('active');
    current = (index + items.length) % items.length;
    items[current].classList.add('active');
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 5000);
  }

  show(0);
  startAuto();

  controls.querySelector('.hero-slideshow-prev').addEventListener('click', () => { show(current - 1); startAuto(); });
  controls.querySelector('.hero-slideshow-next').addEventListener('click', () => { show(current + 1); startAuto(); });

  // touch swipe
  let touchStartX = 0;
  block.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { show(dx < 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  // transparent header when hero is visible
  document.body.classList.add('has-hero-slideshow');
}
