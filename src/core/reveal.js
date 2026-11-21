const css = `.reveal .w{display:inline-block;opacity:0;transform:translateY(20px);transition:opacity .9s var(--ease-out),transform .9s var(--ease-out);transition-delay:calc(var(--i)*45ms)}
.reveal.in-view .w{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.reveal .w{opacity:1;transform:none;transition:none}}`;

function splitText(node, counter) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parts = node.textContent.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    for (const part of parts) {
      if (/^\s+$/.test(part)) fragment.append(document.createTextNode(part));
      else if (part) {
        const span = document.createElement('span');
        span.className = 'w';
        span.style.setProperty('--i', counter.value++);
        span.textContent = part;
        fragment.append(span);
      }
    }
    node.replaceWith(fragment);
  } else {
    for (const child of [...node.childNodes]) splitText(child, counter);
  }
}

export function reveal(rootEl) {
  if (!document.getElementById('reveal-css')) {
    const style = document.createElement('style');
    style.id = 'reveal-css';
    style.textContent = css;
    document.head.append(style);
  }
  const elements = [...rootEl.querySelectorAll('.reveal')];
  for (const el of elements) {
    if (!el.querySelector('.w')) splitText(el, { value: 0 });
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: .25 });
  for (const el of elements) if (!el.classList.contains('in-view')) observer.observe(el);
  return observer;
}
