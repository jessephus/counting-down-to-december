import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const audio = await readFile(new URL('./chorus.m4a', import.meta.url));
const standalone = source.replace('src="chorus.m4a"', `src="data:audio/mp4;base64,${audio.toString('base64')}"`);
await writeFile(new URL('./counting-down-preview.html', import.meta.url), standalone);
console.log('Built counting-down-preview.html with embedded audio.');

const srt = await readFile(new URL('./lyrics.srt', import.meta.url), 'utf8');
const seconds = value => {
  const [h, m, s] = value.replace(',', '.').split(':').map(Number);
  return h * 3600 + m * 60 + s;
};
const lyrics = srt.trim().split(/\r?\n\r?\n/).flatMap(block => {
  const [, timing, ...lines] = block.split(/\r?\n/);
  const [start, end] = timing.split(' --> ').map(seconds);
  const text = lines.join(' ');
  return /^(Verse \d|Pre.Chorus|Chorus|Bridge)$/.test(text) ? [] : [{ start, end, text }];
});
const film = (await readFile(new URL('./film.js', import.meta.url), 'utf8'))
  .replace('__TIMED_LYRICS__', JSON.stringify(lyrics));
const fullAudio = await readFile(new URL('./full-track.m4a', import.meta.url));
const full = source
  .replace('Paper universe study</title>', 'Full scrapbook film</title>')
  .replace('A paper universe · motion study 01', 'A paper universe · full-length second cut')
  .replace('FIRST CHORUS / 20 SECONDS', 'FULL SONG / 3:04')
  .replace('max="20"', 'max="184.08"')
  .replace('0:00 / 0:20', '0:00 / 3:04')
  .replace('music video preview', 'music video second cut')
  .replace('aria-label="Restart excerpt"', 'aria-label="Restart full film"')
  .replace('aria-label="Preview position in seconds"', 'aria-label="Film position in seconds"')
  .replace('aria-label="Two paper silhouettes in home and Madrid scrapbook scenes, connected by a red thread, with rising sun and flying calendar pages"', 'aria-label="An illustrated scrapbook following two orchestra classmates through a long-distance relationship, Madrid postcards, a December reunion, and a shared tandem ride"')
  .replace('<footer>', `<div style="display: flex; align-items: center; gap: 16px; margin-top: 16px; flex-wrap: wrap"><label for="chapters" class="sub">Jump to a spread</label><select id="chapters" style="font: inherit; padding: 8px; border-radius: 10px; color: var(--cp-text); background: var(--cp-surface); border: 1px solid var(--cp-border)"><option value="">Choose a chapter…</option></select><span id="chapter" class="sub" aria-live="polite"></span></div><footer>`)
  .replace(/<p class="note">[\s\S]*?<\/p>/, '<p class="note"><strong>Full-length second cut.</strong> Your complete track, twelve beat-synced chapters, a countdown that hits zero on the final chorus, and a full-screen tandem finale. Character likenesses and detailed art direction remain provisional. All audio stays in this file; no network requests or uploads. Browser animation, not yet an exported video.</p>')
  .replace('href="counting-down-preview.html"', 'href="counting-down-full-film.html"')
  .replace('Save standalone preview ↓', 'Save full film ↓')
  .replace('src="chorus.m4a"', `src="data:audio/mp4;base64,${fullAudio.toString('base64')}"`)
  .replace(/<script>\n'use strict';[\s\S]*?<\/script>/, () => `<script>\n${film}\n</script>`);
await writeFile(new URL('./counting-down-full-film.html', import.meta.url), full);
console.log(`Built counting-down-full-film.html with ${lyrics.length} timed lyric lines and full embedded audio.`);
