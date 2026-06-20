export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [questionCell, answerCell] = [...row.children];

    row.classList.add('faq-item');

    // question → button
    const btn = document.createElement('button');
    btn.className = 'faq-question';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = questionCell.textContent.trim();
    questionCell.replaceChildren(btn);

    // answer → hidden panel
    answerCell.classList.add('faq-answer');
    answerCell.hidden = true;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      answerCell.hidden = open;
    });
  });
}
