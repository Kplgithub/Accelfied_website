import { Fragment, type ReactNode } from 'react';

/**
 * A small, safe Markdown renderer for blog posts: headings (## and ###), paragraphs,
 * lists, quotes, bold, italic and links. It builds React elements, never raw HTML,
 * so nothing typed in a post can run as code.
 */
export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  return <div className={className}>{blocks(source)}</div>;
}

function blocks(source: string): ReactNode[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]!;
    const key = out.length;
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      out.push(heading[1] === '##' ? <h2 key={key}>{inline(heading[2]!)}</h2> : <h3 key={key}>{inline(heading[2]!)}</h3>);
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index]!)) quote.push(lines[index++]!.replace(/^>\s?/, ''));
      out.push(<blockquote key={key}>{inline(quote.join(' '))}</blockquote>);
      continue;
    }
    const ordered = /^\d+[.)]\s+/.test(line);
    if (ordered || /^[-*]\s+/.test(line)) {
      const pattern = ordered ? /^\d+[.)]\s+/ : /^[-*]\s+/;
      const items: string[] = [];
      while (index < lines.length && pattern.test(lines[index]!)) items.push(lines[index++]!.replace(pattern, ''));
      const children = items.map((item, i) => <li key={i}>{inline(item)}</li>);
      out.push(ordered ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>);
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index]!.trim() && !/^(#{2,3}\s|>|[-*]\s|\d+[.)]\s)/.test(lines[index]!)) paragraph.push(lines[index++]!);
    out.push(<p key={key}>{inline(paragraph.join(' '))}</p>);
  }
  return out;
}

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [, label, href, bold, italic] = match;
    if (label && href) {
      const safe = /^https:\/\//i.test(href) || (href.startsWith('/') && !href.startsWith('//'));
      out.push(
        safe ? (
          <a key={at} href={href} {...(href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer nofollow' })}>
            {label}
          </a>
        ) : (
          <Fragment key={at}>{label}</Fragment>
        ),
      );
    } else if (bold) out.push(<strong key={at}>{bold}</strong>);
    else if (italic) out.push(<em key={at}>{italic}</em>);
    last = at + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
