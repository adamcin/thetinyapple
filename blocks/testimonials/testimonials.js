export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const cell = row.firstElementChild;
    return {
      picture: cell.querySelector('picture'),
      name: cell.querySelector('h2, h3'),
      quote: cell.querySelector('p:not(:has(picture)), blockquote'),
    };
  });

  block.innerHTML = '';

  const ul = document.createElement('ul');
  ul.className = 'testimonials-slides';

  items.forEach(({ picture, name, quote }) => {
    const li = document.createElement('li');
    li.className = 'testimonials-slide';

    if (picture) {
      const bg = document.createElement('div');
      bg.className = 'testimonials-bg';
      bg.append(picture);
      li.append(bg);
    }

    const content = document.createElement('div');
    content.className = 'testimonials-content';

    if (name) {
      const h = document.createElement('h2');
      h.textContent = name.textContent;
      content.append(h);
    }
    if (quote) {
      const p = document.createElement('p');
      p.className = 'testimonials-quote';
      p.textContent = quote.textContent;
      content.append(p);
    }
    li.append(content);
    ul.append(li);
  });

  block.append(ul);

  const slides = [...ul.children];
  if (slides.length < 2) return;

  // controls
  const controls = document.createElement('div');
  controls.className = 'testimonials-controls';
  controls.innerHTML = `
    <button class="testimonials-prev" aria-label="Previous testimonial" type="button">&#8592;</button>
    <span class="testimonials-counter"></span>
    <button class="testimonials-next" aria-label="Next testimonial" type="button">&#8594;</button>
  `;
  block.append(controls);

  let current = 0;
  const counter = controls.querySelector('.testimonials-counter');

  function show(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    counter.textContent = `${current + 1} / ${slides.length}`;
  }

  show(0);
  controls.querySelector('.testimonials-prev').addEventListener('click', () => show(current - 1));
  controls.querySelector('.testimonials-next').addEventListener('click', () => show(current + 1));
}
