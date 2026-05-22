/**
 * Geez Wood — site-wide config.
 * Change values here; they propagate everywhere via imports.
 */

export const SITE = {
  // ─── identity ───────────────────────────────────
  name:        'Ting',
  brand:       'Geez Wood',
  tagline:     'a small, slow wood — notes, code, half-thoughts',

  // ─── deployment ─────────────────────────────────
  url:         'https://woodsettler.com',
  domain:      'woodsettler.com',
  locale:      'zh-CN',
  location:    '上海',
  foundedYear: 2026,
  currentYear: 2026,

  // ─── owner ──────────────────────────────────────
  email:       'hi@woodsettler.com',
  github:      'https://github.com/WoodSettler',
  mastodon:    '',

  // ─── footer copy ────────────────────────────────
  copyright:   '© 2026 Ting · CC BY-NC 4.0 · v0.1 · still figuring out',
  brandBlurb:  'Ting 的 Geez Wood · 一片慢的小林子, 收着我读的、做的、还没想清楚的东西。',
  signoff:     '— tended in 上海 since 2026',
  typeset:     'set in Latitude, Director & Source Serif',
};

/**
 * Top nav — order matters.
 */
export const NAV = [
  { id: 'home',        label: 'home',        href: '/' },
  { id: 'writing',     label: 'writing',     href: '/writing' },
  { id: 'wood',        label: 'wood',        href: '/wood' },
  { id: 'collections', label: 'collections', href: '/collections' },
  { id: 'now',         label: 'now',         href: '/now' },
  { id: 'about',       label: 'about',       href: '/about' },
];

/**
 * Whether to render the letter-subscribe form.
 * Set true after you wire up Buttondown/MailerLite.
 */
export const FEATURES = {
  lettersForm:  false,   // hide subscribe button for now
  contactForm:  false,   // use mailto: instead of in-page form
  cmdkSearch:   false,   // search UI present but visual-only until wired
  analytics:    false,   // intentionally not added
};
