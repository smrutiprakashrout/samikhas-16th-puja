import './rsvp.css';

export default {
  id: '07-rsvp',

  html(content) {
    const c = content?.content ?? content;
    const r = c.rsvp;
    const rows = r.contacts.map(ct => `
      <div class="row">
        ${ct.name ? `<p class="nm label">${ct.name}</p>` : ''}
        <p class="num">${ct.phone}</p>
        <div class="acts"><div class="ven">
          <a class="btn" href="tel:${ct.tel}">${r.callLabel}</a>
          <a class="btn fill" href="https://wa.me/${ct.wa}" target="_blank" rel="noopener">${r.whatsappLabel}</a>
        </div></div>
      </div>`).join('');

    return `
<div class="glowr" aria-hidden="true"></div>
<p class="rl label">${r.label}</p>
<button class="diya" id="diya" type="button" aria-label="${r.diyaLabel}" aria-pressed="false">
  <svg viewBox="0 0 156 130" aria-hidden="true">
   <defs><linearGradient id="br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DC9C"/><stop offset=".5" stop-color="#E0AF70"/><stop offset="1" stop-color="#8E6221"/></linearGradient>
   <radialGradient id="fl" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFF6E0"/><stop offset=".4" stop-color="#FFD58A"/><stop offset="1" stop-color="#E48C35"/></radialGradient></defs>
   <ellipse cx="78" cy="118" rx="52" ry="7" fill="#6E4C28" opacity=".22"/>
   <path d="M18 80H138C138 104 112 116 78 116S18 104 18 80Z" fill="url(#br)" stroke="#8E6221" stroke-width="1.2"/><path d="M28 86H128" stroke="#FFF2CF" stroke-opacity=".6" stroke-width="1"/><ellipse cx="78" cy="80" rx="60" ry="9" fill="#C98A3E" stroke="#8E6221" stroke-width="1"/>
   <path d="M70 78C74 64 82 64 86 78" fill="#6E4C28"/><rect x="76" y="64" width="4" height="14" rx="2" fill="#3a2a18"/>
   <g class="flame"><path d="M78 20C92 38 96 52 90 64C86 72 70 72 66 64C60 52 66 38 78 20Z" fill="url(#fl)"/><path d="M78 40C84 50 85 58 82 64C80 68 76 68 74 64C71 58 73 50 78 40Z" fill="#FFF9EC"/></g>
  </svg>
</button>
<p class="dh label" id="dh">${r.hint}</p>
<div class="rows">${rows}</div>
<p class="up" aria-live="polite">${r.thanks}</p>
<div class="grain" aria-hidden="true"></div>`;
  },

  mount({ root, reduced }) {
    const diya = root.querySelector('#diya');
    if (!diya) return null;

    function light(vibrate) {
      if (root.classList.contains('lit')) return;
      root.classList.add('lit');
      diya.setAttribute('aria-pressed', 'true');
      if (vibrate) {
        try {
          if (navigator.userActivation?.hasBeenActive !== false) navigator.vibrate?.(20);
        } catch { /* ignore */ }
      }
    }

    const onClick = () => light(true);
    diya.addEventListener('click', onClick);

    let io;
    if (reduced) {
      io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting && e.intersectionRatio >= .4)) {
          light(false);
          io.disconnect();
        }
      }, { threshold: [.4] });
      io.observe(root);
    }

    return {
      destroy() {
        diya.removeEventListener('click', onClick);
        io?.disconnect();
      },
    };
  },
};
