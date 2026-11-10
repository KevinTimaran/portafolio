import { portfolio } from './content.js';

const FOLIOS = [
  { numeral: 'I', name: 'El autor', subtitle: 'Frontispicio' },
  { numeral: 'II', name: 'Las obras', subtitle: 'Obras escogidas' },
  { numeral: 'III', name: 'El oficio', subtitle: 'Artes & herramientas' },
  { numeral: 'IV', name: 'El cuaderno', subtitle: 'Notas al margen' },
  { numeral: 'V', name: 'Correspondencia', subtitle: 'Una conversación pendiente' },
];

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeUrl = value => {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
};
const ornament = '<span class="reader-ornament" aria-hidden="true"><i></i>✧<i></i></span>';

export function createReader({ onClose, onPageTurn, portraitUrl = '/assets/kevin-portrait.jpg' } = {}) {
  let page = 0;
  let opened = false;
  let turning = false;
  let previousFocus;
  let animationTimeout;
  let hideTimeout;
  let frame;
  let inertSiblings = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const element = document.createElement('section');
  element.className = 'codex-reader';
  element.hidden = true;
  element.inert = true;
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  element.setAttribute('aria-label', 'Codex Operum, libro del portafolio');
  element.setAttribute('aria-hidden', 'true');
  element.innerHTML = `
    <div class="reader-paper" tabindex="-1">
      <header class="reader-running-header">
        <span class="reader-imprint">CODEX <span>OPERUM</span></span>
        <span class="reader-header-center">Un cuaderno de obras & pensamientos</span>
        <button class="reader-close" type="button" aria-label="Cerrar el libro y volver a la fogata">Cerrar el libro <span aria-hidden="true">↗</span></button>
      </header>
      <nav class="reader-index" aria-label="Índice del libro">
        ${FOLIOS.map((folio, index) => `<button type="button" data-reader-page="${index}"${index === 0 ? ' aria-current="page"' : ''}><span>${folio.numeral}.</span> ${folio.name}</button>`).join('')}
      </nav>
      <main class="reader-folio" id="reader-folio" tabindex="-1"></main>
      <footer class="reader-footer">
        <button class="reader-previous" type="button"><span aria-hidden="true">←</span> Hoja anterior</button>
        <span class="reader-folio-count" aria-live="polite" aria-atomic="true">FOLIO I <i>de</i> V</span>
        <button class="reader-next" type="button">Pasar la hoja <span aria-hidden="true">→</span></button>
      </footer>
      <div class="reader-fold" aria-hidden="true"></div>
    </div>
  `;
  document.body.append(element);
  const paper = element.querySelector('.reader-paper');
  const stage = element.querySelector('.reader-folio');
  const closeButton = element.querySelector('.reader-close');
  const previousButton = element.querySelector('.reader-previous');
  const nextButton = element.querySelector('.reader-next');

  function sectionHeading(eyebrow, title, description = '') {
    return `<div class="reader-section-heading"><p class="reader-eyebrow">${eyebrow}</p><h2>${title}</h2>${description ? `<p class="reader-deck">${description}</p>` : ''}</div>`;
  }

  function render() {
    const p = portfolio;
    switch (page) {
      case 0:
        stage.innerHTML = `
          <div class="reader-frontispiece">
            <div class="reader-intro-copy">
              <p class="reader-eyebrow">Folio primero · El autor</p>
              <h2>${escapeHtml(p.name)}<br><em>${escapeHtml(p.surname)}</em></h2>
              <p class="reader-discipline">${escapeHtml(p.discipline)}</p>
              <div class="reader-short-rule" aria-hidden="true"></div>
              <p class="reader-lead">${escapeHtml(p.introduction)}</p>
              <p class="reader-body-copy">${escapeHtml(p.welcome)}</p>
              <button class="reader-inline-link" data-reader-page="1" type="button">Recorrer las obras <span aria-hidden="true">⟶</span></button>
            </div>
            <figure class="reader-portrait-figure">
              <div class="reader-portrait-frame"><div class="reader-portrait-crop"><img src="${escapeHtml(portraitUrl)}" alt="Retrato del autor, procedente de la cubierta del códice" draggable="false"></div></div>
              <figcaption><span>FIG. I</span> &nbsp; Retrato del autor<br><i>De la cubierta a estas páginas.</i></figcaption>
            </figure>
          </div>
          <div class="reader-colophon">${ornament}<p>Una colección en constante escritura.</p></div>`;
        break;
      case 1:
        stage.innerHTML = `
          ${sectionHeading('Folio segundo · Obras escogidas', 'De la idea <em>a la materia.</em>', 'Una colección de exploraciones, decisiones y pequeños descubrimientos.')}
          <div class="reader-works">${p.projects.map((work, index) => `
            <article class="reader-work${index === 0 ? ' reader-work-featured' : ''}">
              <span class="reader-work-number">${escapeHtml(work.number)}</span>
              <div class="reader-work-body">
                <div class="reader-work-meta"><span>${escapeHtml(work.category)}</span><span>${escapeHtml(work.year)}</span></div>
                <h3>${escapeHtml(work.title)}</h3>
                <p>${escapeHtml(work.description)}</p>
                <details class="reader-work-details"><summary>${index === 0 ? 'Notas sobre la obra' : 'Una página por escribir'} <span aria-hidden="true">+</span></summary><div><p>${escapeHtml(work.detail)}</p>${work.tools ? `<p class="reader-tools">${escapeHtml(work.tools)}</p>` : ''}${safeUrl(work.url) ? `<a href="${escapeHtml(safeUrl(work.url))}" target="_blank" rel="noopener noreferrer">Visitar proyecto ↗</a>` : ''}</div></details>
              </div>
              <span class="reader-work-status">${escapeHtml(work.status)}</span>
            </article>`).join('')}</div>`;
        break;
      case 2:
        stage.innerHTML = `
          ${sectionHeading('Folio tercero · Artes & herramientas', 'El placer <em>de hacer.</em>', 'Tres maneras de acercarme a una idea. Un mismo deseo de darle vida.')}
          <div class="reader-interests">${p.interests.map(interest => `
            <section class="reader-interest">
              <span class="reader-interest-numeral">${escapeHtml(interest.numeral)}</span>
              <h3>${escapeHtml(interest.title)}</h3>
              <p class="reader-interest-label">${escapeHtml(interest.label)}</p>
              <p>${escapeHtml(interest.description)}</p>
            </section>`).join('')}</div>
          <blockquote class="reader-quote">«La técnica abre el camino.<br>La sensibilidad decide adónde ir.»</blockquote>
          <p class="reader-center-note">Un índice abierto de intereses, siempre en construcción.</p>`;
        break;
      case 3:
        stage.innerHTML = `
          ${sectionHeading('Folio cuarto · Notas al margen', 'Todavía hay mucho <em>por escribir.</em>')}
          <div class="reader-about-layout">
            <aside class="reader-margin-note"><span class="reader-note-number">IV</span><p>Sobre el camino,<br>las preguntas<br>y el aprendizaje.</p><span class="reader-small-star" aria-hidden="true">✧</span></aside>
            <div class="reader-about-prose">${p.about.map((text, index) => `<p${index === 0 ? ' class="reader-drop-cap"' : ''}>${escapeHtml(text)}</p>`).join('')}<p class="reader-manuscript-note">Historia personal · por completar</p><p class="reader-signature">${escapeHtml(p.name)}</p></div>
          </div>
          <div class="reader-colophon">${ornament}<p>${escapeHtml(p.quote)}</p></div>`;
        break;
      case 4: {
        const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email);
        const links = p.links.map(link => ({ ...link, url: safeUrl(link.url) })).filter(link => link.url);
        stage.innerHTML = `
          <div class="reader-letter">
            <p class="reader-eyebrow">Folio quinto · Correspondencia</p>
            <span class="reader-letter-ornament" aria-hidden="true">✧</span>
            <h2>Las buenas ideas<br>comienzan con <em>una conversación.</em></h2>
            <p class="reader-letter-text">Si una de estas páginas despertó una idea,<br>tal vez podamos escribir la siguiente juntos.</p>
            ${hasEmail ? `<a class="reader-contact-link" href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)} <span aria-hidden="true">↗</span></a>` : '<p class="reader-contact-pending">Los datos de contacto se añadirán próximamente.</p>'}
            ${links.length ? `<nav class="reader-social-links" aria-label="Enlaces del autor">${links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} ↗</a>`).join('')}</nav>` : ''}
            <p class="reader-signature">${escapeHtml(p.name)}</p>
            <p class="reader-letter-end">FIN DEL PRESENTE CUADERNO<br><i>La historia continúa.</i></p>
          </div>`;
        break;
      }
    }
    element.querySelectorAll('.reader-index [data-reader-page]').forEach(button => {
      if (Number(button.dataset.readerPage) === page) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    previousButton.disabled = page === 0;
    nextButton.disabled = page === FOLIOS.length - 1;
    element.querySelector('.reader-folio-count').innerHTML = `FOLIO ${FOLIOS[page].numeral} <i>de</i> V`;
    stage.setAttribute('aria-label', FOLIOS[page].subtitle);
  }

  function goTo(index) {
    if (!opened || turning || index < 0 || index >= FOLIOS.length || page === index) return;
    const direction = index > page ? 'forward' : 'backward';
    turning = true;
    element.dataset.turnDirection = direction;
    element.classList.add('reader-is-turning');
    onPageTurn?.();
    const delay = reducedMotion.matches ? 0 : 230;
    animationTimeout = window.setTimeout(() => {
      page = index;
      render();
      paper.scrollTo({ top: 0, behavior: 'instant' });
      stage.focus({ preventScroll: true });
      element.classList.remove('reader-is-turning');
      element.classList.add('reader-page-arriving');
      animationTimeout = window.setTimeout(() => {
        element.classList.remove('reader-page-arriving');
        turning = false;
      }, reducedMotion.matches ? 0 : 320);
    }, delay);
  }

  function requestClose() {
    if (onClose) onClose();
    else hide();
  }

  function onClick(event) {
    const pageButton = event.target.closest('[data-reader-page]');
    if (pageButton) goTo(Number(pageButton.dataset.readerPage));
    if (event.target.closest('.reader-close')) requestClose();
    if (event.target.closest('.reader-next')) goTo(page + 1);
    if (event.target.closest('.reader-previous')) goTo(page - 1);
  }

  function onKeyDown(event) {
    if (!opened) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      requestClose();
      return;
    }
    const editable = event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (!editable && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      event.stopPropagation();
      goTo(page + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Tab') {
      const focusable = Array.from(element.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex="0"]')).filter(item => item.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === stage || document.activeElement === paper)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  function show() {
    if (opened) return;
    opened = true;
    clearTimeout(hideTimeout);
    previousFocus = document.activeElement;
    inertSiblings = Array.from(document.body.children).filter(sibling => sibling !== element && sibling instanceof HTMLElement).map(sibling => [sibling, sibling.inert]);
    inertSiblings.forEach(([sibling]) => { sibling.inert = true; });
    element.hidden = false;
    element.inert = false;
    element.setAttribute('aria-hidden', 'false');
    render();
    paper.scrollTop = 0;
    frame = requestAnimationFrame(() => {
      element.classList.add('reader-is-visible');
      closeButton.focus({ preventScroll: true });
    });
  }

  function hide() {
    if (!opened) return;
    opened = false;
    turning = false;
    cancelAnimationFrame(frame);
    clearTimeout(animationTimeout);
    element.classList.remove('reader-is-visible', 'reader-is-turning', 'reader-page-arriving');
    inertSiblings.forEach(([sibling, wasInert]) => { if (sibling.isConnected) sibling.inert = wasInert; });
    inertSiblings = [];
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    if (element.contains(document.activeElement)) document.activeElement.blur();
    element.inert = true;
    element.setAttribute('aria-hidden', 'true');
    hideTimeout = window.setTimeout(() => { element.hidden = true; }, reducedMotion.matches ? 0 : 650);
  }

  element.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
  render();
  return {
    element,
    show,
    hide,
    next: () => goTo(page + 1),
    previous: () => goTo(page - 1),
    isOpen: () => opened,
    dispose() {
      hide();
      clearTimeout(hideTimeout);
      clearTimeout(animationTimeout);
      cancelAnimationFrame(frame);
      element.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
      element.remove();
    },
  };
}
