import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (filename) => readFile(new URL(`../../${filename}`, import.meta.url), 'utf8');

describe('Phase 2 form boundary', () => {
  it('contains no Firebase write path or unconfirmed success copy', async () => {
    const source = `${await read('js/main.js')}\n${await read('js/inquiry.js')}`;
    expect(source).not.toMatch(/firebase|firestore|\.collection\(/i);
    expect(source).not.toMatch(/sent successfully|submitted successfully/i);
  });

  it('keeps each form honest until managed endpoints are configured', async () => {
    const main = await read('js/main.js');
    const inquiry = await read('js/inquiry.js');
    expect(main.match(/temporarily unavailable/g)).toHaveLength(2);
    expect(inquiry).toContain('Online inquiries are temporarily unavailable');
  });

  it('uses only inquiry element IDs present in the inquiry markup', async () => {
    const source = await read('js/inquiry.js');
    const markup = await read('inquiry.html');
    const ids = [...source.matchAll(/getElementById\(['"]([^'"]+)/g)].map((match) => match[1]);
    for (const id of ids) expect(markup).toContain(`id="${id}"`);
  });
});
