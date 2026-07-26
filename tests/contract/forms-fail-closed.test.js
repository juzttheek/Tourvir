import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (filename) => readFile(new URL(`../../${filename}`, import.meta.url), 'utf8');

describe('Phase 2 form boundary', () => {
  it('contains no Firebase write path or unconfirmed success copy', async () => {
    const source = await read('src/scripts/forms.ts');
    expect(source).not.toMatch(/firebase|firestore|\.collection\(/i);
    expect(source).not.toMatch(/sent successfully|submitted successfully/i);
  });

  it('keeps each form honest until managed endpoints are configured', async () => {
    const forms = await read('src/scripts/forms.ts');
    expect(forms.match(/temporarily unavailable/g)).toHaveLength(3);
    expect(forms).toContain('Online inquiries are temporarily unavailable');
  });

  it('uses only inquiry element IDs present in the inquiry markup', async () => {
    const source = await read('src/scripts/forms.ts');
    const markup = await read('src/pages/inquiry.astro');
    const inquiryStart = source.indexOf('export function initMultiStepForm');
    const inquiryEnd = source.indexOf('export function initInterestTags');
    const inquirySource = source.slice(inquiryStart, inquiryEnd);
    const ids = [...inquirySource.matchAll(/getElementById\(['"]([^'"]+)/g)].map(
      (match) => match[1],
    );
    for (const id of ids) expect(markup).toContain(`id="${id}"`);
  });
});
