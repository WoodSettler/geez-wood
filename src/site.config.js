/**
 * Geez Wood — site-wide config.
 * Change values here; they propagate everywhere via imports.
 */

export const SITE = {
  // ─── identity ───────────────────────────────────
  name:        'Tingrui',
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
  copyright:   '© 2026 Tingrui · CC BY-NC 4.0 · v0.1 · still figuring out',
  signoff:     '— tended in 上海 since 2026',
  typeset:     'set in Latitude, Director & Source Serif',
};

/**
 * Top nav — order matters.
 */
export const NAV = [
  { id: 'writing',     label: 'writing',     href: '/writing' },
  { id: 'collections', label: 'collections', href: '/collections' },
  { id: 'now',         label: 'now',         href: '/now' },
  { id: 'about',       label: 'about',       href: '/about' },
];

/**
 * 功能开关
 */
export const FEATURES = {
  cmdkSearch:   false,   // search UI present but visual-only until wired
  analytics:    false,   // intentionally not added
};
