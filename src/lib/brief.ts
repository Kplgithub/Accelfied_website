/** A brief built step by step in the hero, carried to /get-matched in the URL. */
export interface Brief {
  service: string;
  country: string;
  budget: string;
  timeline: string;
  brief: string;
}

/** Builds the /get-matched link that carries a finished brief. */
export function matchedHref(brief: Brief) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(brief)) if (value) params.set(key, value);
  return `/get-matched?${params.toString()}`;
}
