/**
 * Loads the <model-viewer> web component on demand.
 *
 * One shared promise serves every caller (ARModal, ARView), the script is only
 * injected when something actually needs it, and a failed or timed-out load
 * rejects so the UI can show an error and offer a retry instead of spinning
 * forever.
 */
const SCRIPT_URL = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
const TIMEOUT_MS = 30_000;

let pending: Promise<void> | null = null;

export function loadModelViewer(): Promise<void> {
  if (typeof customElements !== 'undefined' && customElements.get('model-viewer')) {
    return Promise.resolve();
  }
  if (pending) return pending;

  pending = new Promise<void>((resolve, reject) => {
    document.querySelector('script[data-model-viewer]')?.remove();

    const script = document.createElement('script');
    script.type = 'module';
    script.src = SCRIPT_URL;
    script.dataset.modelViewer = 'true';

    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = (error?: Error) => {
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      if (error) {
        // Keep the <script>: the fetch cannot be cancelled anyway, and a late
        // arrival still upgrades <model-viewer>. Line 21 clears it next attempt.
        pending = null; // allow a retry
        reject(error);
      } else {
        resolve();
      }
    };

    // A backgrounded phone (a call or a notification mid-download) must not be
    // blamed on the network: re-arm instead of failing while the tab is hidden.
    const arm = () => {
      timer = setTimeout(() => {
        if (document.visibilityState === 'hidden') arm();
        else finish(new Error('model-viewer script timed out'));
      }, TIMEOUT_MS);
    };
    arm();

    // A module script fires `load` even when it throws while evaluating, so wait
    // for the definition itself; the timer still rejects if it never happens.
    script.onload = () => {
      if (customElements.get('model-viewer')) finish();
      else customElements.whenDefined('model-viewer').then(() => finish());
    };
    script.onerror = () => finish(new Error('model-viewer script failed to load'));
    document.head.appendChild(script);
  });

  return pending;
}
