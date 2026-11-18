/**
 * Questions and answers from a post's FAQ section, for FAQPage structured data. The section is a
 * `## FAQs` (or `## FAQ`, `## Frequently asked questions`) heading, each question a `###` heading
 * and the answer the text below it, up to the next heading. Markdown marks are stripped.
 */
export function blogFaq(body: string): Array<{ q: string; a: string }> {
  const lines = body.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((line) => /^##\s+(faqs?|frequently asked questions)\s*:?\s*$/i.test(line.trim()));
  if (start < 0) return [];
  const out: Array<{ q: string; a: string }> = [];
  let current: { q: string; a: string[] } | null = null;
  const flush = () => {
    const answer = plain(current?.a.join(' ') ?? '');
    if (current && answer) out.push({ q: plain(current.q), a: answer });
  };
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    const question = /^###\s+(.+)$/.exec(line);
    if (question) {
      flush();
      current = { q: question[1]!, a: [] };
    } else if (current && line.trim()) {
      current.a.push(line.trim().replace(/^([-*]|\d+[.)])\s+/, ''));
    }
  }
  flush();
  return out.slice(0, 20);
}

/** Text without Markdown links, bold or italics. */
function plain(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
