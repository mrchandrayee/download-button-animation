(() => {
  const page = document.querySelector('.page');
  const button = document.querySelector('#download');
  const stage = document.querySelector('#progressStage');
  const rig = document.querySelector('#rig');
  const fill = document.querySelector('#railFill');
  const percent = document.querySelector('#percent');
  const state = document.querySelector('#state');
  const meta = document.querySelector('#fileMeta');
  const hint = document.querySelector('#hint');
  const again = document.querySelector('#again');

  const TOTAL = 512 * 1024;
  const CHUNK_SIZE = 16 * 1024;
  const MIN_MS = 3000;
  let busy = false;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function paintProgress(progress) {
    const p = Math.max(0, Math.min(1, progress));
    fill.style.strokeDashoffset = String(1 - p);

    // The rig travels from its circular start position to the line.
    // Each point blends its place on the circle with its place on the line.
    const rx = 160 + Math.cos(Math.PI * 2 * p - Math.PI) * 120;
    const ry = 34;
    const lineX = 8 + 304 * p;
    const lineY = 64;
    const x = rx + (lineX - rx) * p;
    const y = ry + (lineY - ry) * p;
    rig.style.transform = `translate(${x}px, ${y}px)`;

    percent.textContent = `${Math.round(p * 100)}%`;
  }

  function makePayload() {
    const intro = 'Download Button animation demo file\\n'
      + 'This file is generated locally by the demo.\\n'
      + 'It is not fetched from an external server.\\n\\n';
    const pattern = 'A real byte stream is being read in chunks.\\n';
    const encoder = new TextEncoder();
    const prefix = encoder.encode(intro);
    const chunk = encoder.encode(pattern.repeat(350));
    const chunks = [prefix];
    let total = prefix.length;
    while (total + chunk.length < TOTAL) {
      chunks.push(chunk);
      total += chunk.length;
    }
    if (total < TOTAL) chunks.push(new Uint8Array(TOTAL - total));
    return chunks;
  }

  async function runDownload() {
    if (busy) return;
    busy = true;
    page.classList.remove('complete');
    page.classList.add('running');
    again.hidden = true;
    hint.textContent = 'Preparing a local file stream…';
    state.textContent = 'CONNECTING TO STREAM';
    meta.textContent = 'download-demo.txt · 512 KB';
    paintProgress(0);

    const chunks = makePayload();
    let index = 0;
    let loaded = 0;
    const started = performance.now();

    const stream = new ReadableStream({
      async pull(controller) {
        if (index >= chunks.length) {
          controller.close();
          return;
        }
        // A short delay makes the local stream progress visible in the demo.
        await sleep(22);
        const value = chunks[index++];
        controller.enqueue(value);
      }
    });

    const reader = stream.getReader();
    const received = [];
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        received.push(value);
        loaded += value.length;

        const actual = loaded / TOTAL;
        const elapsed = performance.now() - started;
        // Pace fast local streams so the animation can be seen.
        const shown = Math.min(actual, elapsed / MIN_MS);
        paintProgress(shown);
        state.textContent = 'DOWNLOADING';
        hint.textContent = `Receiving ${Math.round(loaded / 1024)} KB of 512 KB…`;
      }

      const elapsed = performance.now() - started;
      if (elapsed < MIN_MS) await sleep(MIN_MS - elapsed);
      paintProgress(1);

      const blob = new Blob(received, { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'download-demo.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);

      state.textContent = 'COMPLETE';
      percent.textContent = '100%';
      meta.textContent = 'download-demo.txt · 512 KB · saved';
      hint.textContent = 'Your file is ready. Download completed successfully.';
      page.classList.add('complete');
      again.hidden = false;
    } catch (error) {
      state.textContent = 'DOWNLOAD FAILED';
      hint.textContent = 'The local stream could not be read. Please try again.';
      again.hidden = false;
      console.error(error);
    } finally {
      busy = false;
    }
  }

  button.addEventListener('click', runDownload);
  again.addEventListener('click', runDownload);
  stage.addEventListener('click', runDownload);
  paintProgress(0);
})();