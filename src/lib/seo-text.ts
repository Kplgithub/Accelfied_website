/** Search results show about this many characters of a page description. */
export const MAX_DESCRIPTION = 155;

/** Search results show about this many characters of a title. */
export const MAX_TITLE = 60;

/** Open Graph fields every page shares. Next.js replaces, not merges, the root `openGraph`, so pages that set their own spread this in. */
export const OG_DEFAULTS = { siteName: 'Accelfied', locale: 'en_IN' } as const;
