# Download Button — Complete Runnable Project

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://mrchandrayee.github.io/download-button-animation/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org) [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

A screen-based recreation of the uploaded **5.03-second** video (720 × 1280, 30 fps).

## Run
1. Extract `download-button-animation.zip`.
2. Open `index.html` in Chrome, Edge, Firefox or Safari.
3. Click the cyan download icon.
4. The browser downloads `download-demo.txt` when the progress animation completes.

No npm installation, build step, API key or backend is required.

Optional local server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## What the video shows
- Near-black / deep teal background.
- Header: **Download Button**.
- Cyan circular download icon at the centre.
- After activation, the circular ring unfolds into a horizontal progress rail.
- A small parachute / payload rig moves along the rail as the percentage increases.
- Final state shows a cyan checkmark and **Complete**.
- Three code preview panels: `index.html`, `style.css`, `app.js`.

## Readable source code transcribed from the video

The video shows these fragments clearly; formatting has been normalized.

### `index.html`
```html
<!-- ONE stroke is both the
     ring and the track -->
<path class="rail rail--fill"
      pathLength="1"/>

<!-- the payload that falls -->
<g class="rig">
  <g class="canopy">…</g>
  <path class="arrow"/>
  <path class="check"/>
</g>
```

### `style.css`
```css
/* pathLength=1, so dashoffset
   IS the progress — 0 → 1 */
.rail--fill {
  stroke-dasharray: 1 1;
  stroke-dashoffset: 0;
}

/* nothing flies if you asked
   for less motion */
@media (prefers-reduced-motion) {
  .rig { display: none }
}
```

### `app.js`
```js
// the ring UNROLLS into the
// bar: each point blends its
// place on the circle with
// its place on the line
y = ry + (lineY - ry) * p;

// real bytes, real stream
loaded += value.length;
actual = loaded / total;

// paced so a fast one reads
shown = Math.min(actual,
  elapsed / minMs);
```

Only these portions of the original source are visible in the screen recording. Helper functions and the complete original app source are not shown. The runnable code is reconstructed from the visible UI and fragments; it is not claimed to be the original repository.

## Implemented behavior
- Cyan circular download button.
- Progress ring becomes a horizontal progress rail.
- SVG payload/parachute marker moves along the rail.
- Percentage and status update during download.
- Generates a real local text file as a `ReadableStream`, reads it chunk by chunk and counts actual bytes.
- After completion, triggers a browser download of `download-demo.txt`.
- Replay button appears after completion.
- Respects the user's reduced-motion preference.

## Project files
- `index.html` — demo UI and code preview panels.
- `style.css` — dark teal styling, cyan icon, progress rail and responsive layout.
- `app.js` — local stream generation, byte counting, progress animation and file download.
- `README.md` — source transcription and run guide.

## Accuracy / limitations
This is a frontend recreation, not the original project's full source. The original code panels are small; the transcribed fragments above are what can be read in the video. The rest of the implementation is reconstructed.

The download is a locally generated 512 KB text file, not a download from a remote server. No external service or backend is connected.

## 👨‍💻 Author

**mrchandrayee** · [GitHub](https://github.com/mrchandrayee)

## 📄 License

[MIT License](./LICENSE)
