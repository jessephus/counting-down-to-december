import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const html = await read('counting-down-full-film.html');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
assert.equal(scripts.length, 2);
for (const script of scripts) new vm.Script(script);
assert(!html.includes('__TIMED_LYRICS__'));
assert(html.includes('src="data:audio/mp4;base64,'));
const preview = await read('counting-down-preview.html');
const template = await read('index.html');
const audio = await readFile(new URL('chorus.m4a', import.meta.url));
assert.equal(preview, template.replace('src="chorus.m4a"', `src="data:audio/mp4;base64,${audio.toString('base64')}"`));

for (const theme of ['light', 'dark']) {
  let depth = 0;
  const context = new Proxy({
    save() { depth++; },
    restore() { assert(depth > 0, 'Unbalanced canvas restore'); depth--; },
    measureText(text) { return { width: text.length * 15 }; },
    ellipse(...args) { assert(args.every(Number.isFinite), 'Invalid ellipse coordinate'); },
  }, {
    get(target, key) { return key in target ? target[key] : () => {}; },
  });
  const element = () => ({
    value: '', textContent: '', hidden: true, disabled: true, children: [],
    listeners: {},
    append(child) { this.children.push(child); },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    getContext() { return context; },
  });
  const elements = Object.fromEntries(['film', 'song', 'play', 'seek', 'clock', 'chapter', 'chapters', 'error', 'restart'].map(id => [`#${id}`, element()]));
  const song = elements['#song'];
  Object.assign(song, { currentTime: 0, readyState: 4, ended: false, paused: true });
  const sandbox = vm.createContext({
    document: {
      documentElement: { dataset: { theme } },
      querySelector: selector => elements[selector],
      createElement: element,
    },
    getComputedStyle: () => ({ getPropertyValue: key => `var(${key})` }),
    requestAnimationFrame() {},
  });
  vm.runInContext(scripts[1], sandbox);
  const result = vm.runInContext(`(() => {
    const times=[0,3.7,6.8,9.9,10.771,18,25,34,48,83,90,100,114,141,152,159.8,160.5,HIT-.001,HIT,HIT+.3,162,176,180.3,DURATION];
    for(const scene of scenes) for(const offset of [0,.001,.3,.6,.9,1.199,1.2]) times.push(scene.start+offset);
    for(const t of times) draw(t);
    for(let t=0;t<=DURATION;t+=.5) draw(t);
    return {tandem:+(scenes[11].land+.01).toFixed(3),chapters:scenes.length,lyrics:timedLyrics.length,frameChecks:times.length+Math.ceil(DURATION/.5)};
  })()`, sandbox);
  assert.equal(depth, 0, 'Canvas state leaked between frames');
  assert.equal(result.chapters, 12);
  assert.equal(result.lyrics, 36);
  assert.equal(elements['#chapters'].children.length, result.chapters);
  assert.equal(elements['#play'].disabled, false, 'Cached metadata must enable playback');
  elements['#chapters'].value = '';
  song.currentTime = 70;
  elements['#chapters'].listeners.change({ target: elements['#chapters'] });
  assert.equal(song.currentTime, 70, 'Placeholder must not restart playback');
  elements['#chapters'].value = String(result.tandem);
  elements['#chapters'].listeners.change({ target: elements['#chapters'] });
  assert.equal(song.currentTime, result.tandem);
  elements['#restart'].listeners.click();
  assert.equal(song.currentTime, 0);
  console.log(`${theme}: ${result.frameChecks} frames, ${result.chapters} chapters, 36 lyrics, chapter seeking and restart passed.`);
}
console.log('Generated scripts compile; approved preview matches its original source.');
