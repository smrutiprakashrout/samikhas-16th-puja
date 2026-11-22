// Single source of truth for ALL text/data. Sections must read from here only.
// NAME ORDER follows the final printed card (mother before father, grandmother before grandfather).
// TODO(owner): confirm order + fill mapsUrl.

export const content = {
  gate: { kicker: 'You are invited', cta: 'Tap to open', ariaLabel: 'Tap to open the invitation', numeral: '16', suffix: 'th' },

  invocation: { sanskrit: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥', label: 'An Auspicious Beginning' },

  title: { number: '16', suffix: 'th', text: 'Birthday Puja' },

  invite: {
    blessing: 'With the blessings of the Almighty',
    headline: 'A Joyous Celebration',
    body: 'We cordially invite you to join us in celebrating the auspicious occasion of the',
  },

  invitation: {
    label: 'With the blessings of the Almighty',
    before: 'We joyfully invite you to the ',
    key: 'sixteenth birthday puja',
    after: ' of our beloved granddaughter, Samikshya.',
    closing: 'Your gracious presence will make this occasion even more special.',
  },

  puja: {
    dateLine: 'Sunday, 29 November 2026',
    title: { pre: 'Satyanarayan', accent: 'Puja' },
    time: '6:00',
    meridiem: 'PM',
    timeNote: 'onwards',
    arrive: { label: 'Kindly arrive before', time: '5:30 PM', hour: 5, minute: 30 },
  },

  honoree: {
    lead: 'Of our beloved granddaughter',
    first: 'Samikshya',
    rest: 'Pragyan Panda',
    photo: '/img/samikshya.webp',
    photoAlt: 'Samikshya',
  },

  family: {
    parentsLabel: 'Daughter of',
    parents: ['Manorama Nanda', 'Sarada Prasanna Panda'],
    grandLabel: 'With love and blessings from her grandparents',
    grand: ['Malati Panda', 'Nikunja Bihari Panda'],
  },

  shloka: {
    lines: [
      'ବକ୍ରତୁଣ୍ଡ ମହାକାୟ',
      'ସୂର୍ଯ୍ୟକୋଟି ସମପ୍ରଭ ।',
      'ନିର୍ବିଘ୍ନଂ କୁରୁ ମେ ଦେବ',
      'ସର୍ବକାର୍ଯ୍ୟେଷୁ ସର୍ବଦା ॥',
    ],
    meaning: 'O Lord with the curved trunk, radiant as a million suns, remove all obstacles from every task we undertake.',
    image: '/img/ganesha.webp',
  },

  event: {
    startISO: '2026-11-29T19:00:00+05:30',
    weekday: 'Sunday',
    dateLong: 'Sunday, 29 November 2026',
    day: '29', month: 'November', year: '2026',
    timeText: '7:00 PM onwards',
    durationMin: 240,
    title: "Samikshya's 16th Birthday Puja",
  },

  date: {
    label: 'Save the date',
    day: '29',
    month: 'November 2026',
    weekday: 'Sunday',
    time: '7:00 PM',
    timeNote: 'onwards',
    scratchHint: 'Scratch with your finger',
    scratchLabel: 'Scratch here',
    revealButton: 'Reveal the date',
    calendarLabel: 'Add to calendar',
    calendarUrl: 'https://calendar.app.google/Vu5tDqV1WnCpchCP6',
  },

  venue: {
    label: 'Venue',
    lines: ['Sapnpur, Sisua,', 'Salepur, Cuttack'],
    copyText: 'Sapnpur, Sisua, Salepur, Cuttack',   // OWNER may append the PIN code later
    lat: 20.488226, lng: 86.086465,
    embedUrl: 'https://www.google.com/maps?ll=20.488226,86.086465&z=16&t=m&output=embed',
    directionsUrl: 'https://maps.app.goo.gl/owquKixAFBJHX1Zt8',
    hint: 'Tap to explore',
    directionsLabel: 'Get directions',
    copyLabel: 'Copy address',
    copiedLabel: 'Copied',
  },

  rsvp: {
    label: 'For any queries',
    hint: 'Tap the diya',
    diyaLabel: 'Light the diya',
    callLabel: 'Call',
    whatsappLabel: 'WhatsApp',
    thanks: 'Thank you — we look forward to seeing you.',
    contacts: [
      { name: '', phone: '98539 93661', tel: '+919853993661', wa: '919853993661' },
      { name: '', phone: '77351 72417', tel: '+917735172417', wa: '917735172417' },
    ],   // OWNER: fill `name` (e.g. 'Papa'); if empty, no name line is rendered
  },

  contact: {
    heading: 'For any queries, please contact',
    phones: [
      { display: '+91 98539 93661', tel: '+919853993661', wa: '919853993661' },
      { display: '+91 77351 72417', tel: '+917735172417', wa: '917735172417' },
    ],
    rsvpPrompt: "Light the diya to confirm you'll join us",
    whatsappText: "Namaste 🙏 We will join Samikshya's 16th Birthday Puja on Sunday, 29 November 2026.",
  },

  closing: {
    blessing: 'With love and blessings',
    family: { pre: 'The', accent: 'Panda', post: 'family' },   // OWNER: confirm wording
    eventLine: "Samikshya's 16th Birthday Puja",
    dateLine: '29 November 2026',
    shareLabel: 'Share invitation',
    shareCopiedLabel: 'Link copied',
    shareTitle: "Samikshya's 16th Birthday Puja",
    shareText: 'You are warmly invited — Sunday, 29 November 2026, 7:00 PM onwards, Sapnpur, Sisua, Salepur, Cuttack.',
    thanks: 'Thank you for celebrating with us',
  },

  share: {
    title: "Samikshya's 16th Birthday Puja",
    text: "You are warmly invited to Samikshya's 16th Birthday Puja on Sunday, 29 November 2026, 7:00 PM onwards.",
  },
};
