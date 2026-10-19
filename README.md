# Counting Down to December

A full-length, illustrated paper-scrapbook music-video second cut for the original
3:04 song. Built with Canvas 2D, without dependencies, external fonts, or network
requests. This is a browser animation, not an exported video.

## Watch

Open `counting-down-full-film.html` in a current desktop browser and select
**Play with sound**. The track is embedded, so no server or internet connection
is needed. Scrub the timeline or use **Jump to a spread** to review chapters.
The approved 20-second chorus study remains in `counting-down-preview.html`.

## Edit and rebuild

Requires Node.js 18 or newer:

```sh
node build.mjs
node check.mjs
```

- `film.js`: full-film scenes, paper figures, book transitions, and player.
- `index.html`: approved chorus preview and shared player/theme template.
- `lyrics.srt`: source lyric timings.
- `build.mjs`: creates both standalone HTML files with embedded local audio.
- `chorus.m4a` and `full-track.m4a`: browser-compatible AAC audio assets.

The audio files are committed; the generated HTML files are not. Every push to
`main` runs the `Deploy to GitHub Pages` workflow
(`.github/workflows/deploy.yml`), which rebuilds, checks, and publishes to the
`gh-pages` branch. It can also be run manually from the Actions tab. The full
film is served at the site root and the 20-second chorus study at
`/counting-down-preview.html`. The Pages site is public.

## Second-cut direction

Everything is locked to the song. `film.js` embeds a beat grid (~95 BPM) and a
loudness curve derived from `full-track.m4a`; page turns land on downbeats, the
rose thread pulses on every beat, and a "days till December" calendar flips one
page per beat from the first chorus down to zero. If the mix changes, re-derive
`BEATS` and `ENERGY`.

Twelve chapters run from the concert ticket and orchestra "meep"/"murp" through
the walk home, quiet mornings, two-city calls, postcards and voice notes, the
sweater, a chalkboard language, the flight, and the airport reunion. The music
drops out just before the last chorus: the run freezes, the swell builds, and the
hug lands on the downbeat with the calendar at zero. The camera then pushes past
the book's edges so the two pages finally meet, and the couple rides one tandem
across a full-screen landscape before the cover closes.

The art uses a light stop-motion "boil" (12 fps figures, re-cut paper edges), and
the Madrid boy keeps his signature duck-tuft of hair. Video export is still to come.
