export default function decorate(block) {
  const [infoCell, endpointCell] = [...block.firstElementChild.children];

  // extract formspree endpoint from a link or plain text in the second cell
  const endpointLink = endpointCell.querySelector('a[href*="formspree.io"]');
  const endpoint = endpointLink?.href || endpointCell.textContent.trim();

  // replace second cell with the form
  endpointCell.innerHTML = `
    <form class="contact-form-form" novalidate>
      <div class="contact-form-field">
        <label for="cf-name">Your Name <span aria-hidden="true">*</span></label>
        <input id="cf-name" name="name" type="text" required maxlength="64" autocomplete="name">
      </div>
      <div class="contact-form-field">
        <label for="cf-email">Your Email <span aria-hidden="true">*</span></label>
        <input id="cf-email" name="email" type="email" required maxlength="64" autocomplete="email">
      </div>
      <div class="contact-form-field">
        <label for="cf-message">Your Message <span aria-hidden="true">*</span></label>
        <textarea id="cf-message" name="message" required rows="6" maxlength="5000"></textarea>
      </div>
      <button class="contact-form-submit button primary" type="submit">Send Message</button>
      <p class="contact-form-status" aria-live="polite" hidden></p>
    </form>
  `;

  const form = endpointCell.querySelector('form');
  const status = form.querySelector('.contact-form-status');

  function showStatus(type, message) {
    status.textContent = message;
    status.dataset.type = type;
    status.hidden = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!endpoint) {
      showStatus('error', 'Form endpoint is not configured.');
      return;
    }

    const submit = form.querySelector('.contact-form-submit');
    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.hidden = true;

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (resp.ok) {
        form.reset();
        showStatus('success', 'Thank you! Your message has been sent.');
      } else {
        const data = await resp.json().catch(() => ({}));
        showStatus('error', data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      showStatus('error', 'Could not send your message. Please check your connection.');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send Message';
    }
  });

  // style the info cell
  infoCell.classList.add('contact-form-info');
}
