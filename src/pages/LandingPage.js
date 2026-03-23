export default function LandingPage() {
  return `
    <style>
      :root {
        --lp-purple: #C39BFF;
        --lp-blue:   #6BA3FF;
      }

      /* ── Keyframes ─────────────────────────────────────── */
      @keyframes lp-fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes lp-fadeInLine {
        from { opacity: 0; transform: translateX(-8px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes lp-blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.25; }
      }
      @keyframes lp-cursorBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
      @keyframes lp-pulseGlow {
        0%, 100% { opacity: 0.35; transform: scale(1); }
        50%       { opacity: 0.65; transform: scale(1.12); }
      }

      /* ── Hero wrapper ──────────────────────────────────── */
      .lp-hero {
        position: relative;
        overflow: hidden;
        min-height: calc(100vh - 64px);
        display: grid;
        grid-template-columns: 1fr 1.1fr;
        gap: 60px;
        align-items: center;
        padding: 80px 48px 80px;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Ambient glow */
      .lp-glow {
        position: absolute;
        width: 560px;
        height: 560px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        top: -80px;
        right: -60px;
        pointer-events: none;
        animation: lp-pulseGlow 8s ease-in-out infinite;
      }

      /* ── Left column ───────────────────────────────────── */
      .lp-copy {
        position: relative;
        z-index: 1;
        max-width: 540px;
      }

      .lp-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 36px;
        padding: 6px 14px;
        background: var(--accent-glow);
        border: 1px solid rgba(200, 255, 0, 0.15);
        border-radius: 9999px;
        animation: lp-fadeInUp 0.5s ease-out both;
      }

      .lp-eyebrow-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--accent);
        flex-shrink: 0;
        animation: lp-blink 2s ease-in-out infinite;
      }

      .lp-headline {
        font-family: var(--font-serif);
        font-size: clamp(48px, 5.5vw, 76px);
        font-weight: 400;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--text-primary);
        margin-bottom: 28px;
        animation: lp-fadeInUp 0.5s ease-out 0.1s both;
      }

      .lp-headline em {
        font-style: italic;
        color: var(--accent);
      }

      .lp-sub {
        font-family: var(--font-sans);
        font-size: 16px;
        line-height: 1.7;
        color: var(--text-secondary);
        max-width: 420px;
        margin-bottom: 40px;
        animation: lp-fadeInUp 0.5s ease-out 0.2s both;
      }

      .lp-sub strong {
        color: var(--text-primary);
        font-weight: 500;
      }

      /* CTAs */
      .lp-actions {
        display: flex;
        align-items: center;
        gap: 14px;
        animation: lp-fadeInUp 0.5s ease-out 0.3s both;
      }

      .lp-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 13px;
        font-weight: 500;
        color: var(--bg-page);
        background: var(--accent);
        padding: 13px 26px;
        border-radius: var(--radius-md);
        text-decoration: none;
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .lp-btn-primary:hover {
        box-shadow: 0 4px 28px var(--accent-tint-strong);
        transform: translateY(-2px);
      }
      .lp-btn-primary .lp-arrow {
        transition: transform 0.2s;
      }
      .lp-btn-primary:hover .lp-arrow {
        transform: translateX(3px);
      }

      .lp-btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: var(--font-sans);
        font-size: 14px;
        font-weight: 500;
        color: var(--text-secondary);
        background: transparent;
        padding: 13px 22px;
        border-radius: var(--radius-md);
        text-decoration: none;
        border: 1px solid var(--border-hover);
        transition: color 0.2s, border-color 0.2s, background 0.2s;
      }
      .lp-btn-secondary:hover {
        color: var(--text-primary);
        border-color: var(--text-muted);
        background: var(--bg-elevated);
      }

      /* Social proof */
      .lp-proof {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 44px;
        padding-top: 28px;
        border-top: 1px solid var(--border-main);
        animation: lp-fadeInUp 0.5s ease-out 0.45s both;
      }

      .lp-proof-stat {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .lp-proof-number {
        font-family: var(--font-mono);
        font-size: 20px;
        font-weight: 500;
        color: var(--text-primary);
        letter-spacing: -0.02em;
      }

      .lp-proof-label {
        font-size: 11px;
        color: var(--text-muted);
        letter-spacing: 0.02em;
      }

      .lp-proof-divider {
        width: 1px;
        height: 34px;
        background: var(--border-main);
        flex-shrink: 0;
      }

      /* ── Right column: Editor ──────────────────────────── */
      .lp-visual {
        position: relative;
        z-index: 1;
        animation: lp-fadeInUp 0.7s ease-out 0.2s both;
      }

      .lp-editor {
        background: var(--bg-card);
        border: 1px solid var(--border-hover);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow:
          0 4px 6px rgba(0,0,0,0.15),
          0 20px 60px rgba(0,0,0,0.35),
          0 0 80px var(--accent-glow);
        transform: perspective(1200px) rotateY(-2deg) rotateX(1deg);
        transition: transform 0.45s ease;
      }
      .lp-editor:hover {
        transform: perspective(1200px) rotateY(0deg) rotateX(0deg);
      }

      /* Titlebar */
      .lp-titlebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 11px 14px;
        background: var(--bg-elevated);
        border-bottom: 1px solid var(--border-main);
      }

      .lp-dots {
        display: flex;
        gap: 6px;
      }
      .lp-dots span {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .lp-dots span:nth-child(1) { background: #FF5F57; }
      .lp-dots span:nth-child(2) { background: #FFBD2E; }
      .lp-dots span:nth-child(3) { background: #28CA41; }

      .lp-tab {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-secondary);
        background: var(--bg-inset);
        padding: 4px 12px;
        border-radius: var(--radius-sm);
      }

      .lp-badge {
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--accent);
        background: var(--accent-glow);
        padding: 3px 8px;
        border-radius: var(--radius-sm);
        letter-spacing: 0.04em;
      }

      /* Split body */
      .lp-editor-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 320px;
      }

      .lp-pane {
        padding: 18px;
      }
      .lp-pane:first-child {
        border-right: 1px solid var(--border-main);
      }

      .lp-pane-label {
        font-family: var(--font-mono);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .lp-running {
        color: var(--accent);
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .lp-running::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent);
        animation: lp-blink 1.5s ease infinite;
      }

      /* Code block */
      .lp-code {
        font-family: var(--font-mono);
        font-size: 12px;
        line-height: 1.75;
        color: var(--text-secondary);
      }

      .lp-code .lp-line {
        display: flex;
        gap: 0;
        opacity: 0;
        animation: lp-fadeInLine 0.3s ease-out forwards;
      }
      .lp-code .lp-line:nth-child(1) { animation-delay: 0.5s; }
      .lp-code .lp-line:nth-child(2) { animation-delay: 0.65s; }
      .lp-code .lp-line:nth-child(3) { animation-delay: 0.8s; }
      .lp-code .lp-line:nth-child(4) { animation-delay: 0.95s; }
      .lp-code .lp-line:nth-child(5) { animation-delay: 1.1s; }
      .lp-code .lp-line:nth-child(6) { animation-delay: 1.25s; }
      .lp-code .lp-line:nth-child(7) { animation-delay: 1.4s; }
      .lp-code .lp-line:nth-child(8) { animation-delay: 1.55s; }

      .lp-lnum {
        color: var(--text-muted);
        width: 26px;
        text-align: right;
        margin-right: 14px;
        user-select: none;
        flex-shrink: 0;
        opacity: 0.5;
      }

      .lp-kw  { color: var(--lp-purple); }
      .lp-fn  { color: var(--lp-blue); }
      .lp-tbl { color: var(--accent); }
      .lp-num { color: var(--warning); }
      .lp-op  { color: var(--text-muted); }

      /* Cursor on last line */
      .lp-cursor-line::after {
        content: '';
        display: inline-block;
        width: 2px;
        height: 14px;
        background: var(--accent);
        margin-left: 2px;
        vertical-align: text-bottom;
        animation: lp-cursorBlink 1s step-end infinite;
      }

      /* Results table */
      .lp-results {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-mono);
        font-size: 11px;
      }
      .lp-results th {
        text-align: left;
        padding: 5px 10px;
        color: var(--text-muted);
        border-bottom: 1px solid var(--border-main);
        font-weight: 500;
        letter-spacing: 0.03em;
        white-space: nowrap;
      }
      .lp-results td {
        padding: 6px 10px;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--border-main);
        white-space: nowrap;
      }
      .lp-results tr:last-child td { border-bottom: none; }
      .lp-results .lp-highlight td {
        color: var(--accent);
        background: var(--accent-glow);
      }

      .lp-results tr {
        opacity: 0;
        animation: lp-fadeInLine 0.25s ease-out forwards;
      }
      .lp-results thead tr              { animation-delay: 1.65s; }
      .lp-results tbody tr:nth-child(1) { animation-delay: 1.8s; }
      .lp-results tbody tr:nth-child(2) { animation-delay: 1.9s; }
      .lp-results tbody tr:nth-child(3) { animation-delay: 2.0s; }
      .lp-results tbody tr:nth-child(4) { animation-delay: 2.1s; }
      .lp-results tbody tr:nth-child(5) { animation-delay: 2.2s; }

      /* Editor footer */
      .lp-editor-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 14px;
        background: var(--bg-elevated);
        border-top: 1px solid var(--border-main);
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--text-muted);
      }

      .lp-footer-status {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .lp-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent);
        animation: lp-blink 2s ease-in-out infinite;
      }

      .lp-footer-pass { color: var(--success); }

      /* Floating caption */
      .lp-caption {
        margin-top: 14px;
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 6px;
        padding-left: 4px;
        animation: lp-fadeInUp 0.5s ease-out 0.65s both;
      }
      .lp-caption::before {
        content: '↳';
        color: var(--accent);
      }

      /* ── Responsive ────────────────────────────────────── */
      @media (max-width: 1024px) {
        .lp-hero {
          grid-template-columns: 1fr;
          padding: 60px 32px 60px;
          gap: 48px;
        }
        .lp-copy { max-width: 100%; }
        .lp-editor { transform: none; }
        .lp-editor:hover { transform: none; }
        .lp-glow { display: none; }
      }
      @media (max-width: 640px) {
        .lp-hero { padding: 40px 20px 40px; }
        .lp-actions { flex-direction: column; align-items: stretch; }
        .lp-editor-body { grid-template-columns: 1fr; }
        .lp-pane:first-child { border-right: none; border-bottom: 1px solid var(--border-main); }
        .lp-proof { flex-wrap: wrap; gap: 16px; }
        .lp-headline { font-size: clamp(40px, 10vw, 56px); }
      }
    </style>

    <section class="lp-hero">
      <div class="lp-glow"></div>

      <!-- Left: Copy -->
      <div class="lp-copy">
        <div class="lp-eyebrow">
          <span class="lp-eyebrow-dot"></span>
          57 problems &middot; 8 levels &middot; 100% browser
        </div>

        <h1 class="lp-headline">
          Stop watching.<br>
          Start <em>querying.</em>
        </h1>

        <p class="lp-sub">
          badcode drops you into a <strong>real database</strong> with a real editor.
          No slides, no hand-holding &mdash; just progressively harder SQL problems
          against production-shaped data.
        </p>

        <div class="lp-actions">
          <a href="#/lesson/L1_P1" class="lp-btn-primary">
            Open the Editor
            <span class="lp-arrow">&#8594;</span>
          </a>
          <a href="#/dashboard" class="lp-btn-secondary">
            View Curriculum ↓
          </a>
        </div>

        <div class="lp-proof">
          <div class="lp-proof-stat">
            <span class="lp-proof-number">57</span>
            <span class="lp-proof-label">SQL challenges</span>
          </div>
          <div class="lp-proof-divider"></div>
          <div class="lp-proof-stat">
            <span class="lp-proof-number">8</span>
            <span class="lp-proof-label">skill levels</span>
          </div>
          <div class="lp-proof-divider"></div>
          <div class="lp-proof-stat">
            <span class="lp-proof-number">$0</span>
            <span class="lp-proof-label">forever free</span>
          </div>
        </div>
      </div>

      <!-- Right: Editor mockup -->
      <div class="lp-visual">
        <div class="lp-editor">

          <div class="lp-titlebar">
            <div class="lp-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="lp-tab">problem_04.sql</span>
            <span class="lp-badge">Level 2 &middot; Filters</span>
          </div>

          <div class="lp-editor-body">
            <!-- Code pane -->
            <div class="lp-pane">
              <div class="lp-pane-label">
                <span>Query</span>
                <span class="lp-running">running</span>
              </div>
              <div class="lp-code">
                <div class="lp-line">
                  <span class="lp-lnum">1</span>
                  <span><span class="lp-kw">SELECT</span></span>
                </div>
                <div class="lp-line">
                  <span class="lp-lnum">2</span>
                  <span>&nbsp;&nbsp;<span class="lp-fn">product_name</span><span class="lp-op">,</span></span>
                </div>
                <div class="lp-line">
                  <span class="lp-lnum">3</span>
                  <span>&nbsp;&nbsp;<span class="lp-fn">category</span><span class="lp-op">,</span></span>
                </div>
                <div class="lp-line">
                  <span class="lp-lnum">4</span>
                  <span>&nbsp;&nbsp;<span class="lp-fn">price</span></span>
                </div>
                <div class="lp-line">
                  <span class="lp-lnum">5</span>
                  <span><span class="lp-kw">FROM</span> <span class="lp-tbl">Products</span></span>
                </div>
                <div class="lp-line">
                  <span class="lp-lnum">6</span>
                  <span><span class="lp-kw">WHERE</span> <span class="lp-fn">price</span> <span class="lp-op">&gt;</span> <span class="lp-num">500</span></span>
                </div>
                <div class="lp-line">
                  <span class="lp-lnum">7</span>
                  <span><span class="lp-kw">ORDER BY</span> <span class="lp-fn">price</span> <span class="lp-kw">DESC</span></span>
                </div>
                <div class="lp-line lp-cursor-line">
                  <span class="lp-lnum">8</span>
                  <span><span class="lp-kw">LIMIT</span> <span class="lp-num">5</span><span class="lp-op">;</span></span>
                </div>
              </div>
            </div>

            <!-- Results pane -->
            <div class="lp-pane">
              <div class="lp-pane-label">
                <span>Results</span>
                <span style="color: var(--accent);">5 rows &middot; 11ms</span>
              </div>
              <table class="lp-results">
                <thead>
                  <tr>
                    <th>product_name</th>
                    <th>category</th>
                    <th>price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="lp-highlight">
                    <td>MacBook Pro 16"</td>
                    <td>Electronics</td>
                    <td>2,399</td>
                  </tr>
                  <tr>
                    <td>Sony A7 IV</td>
                    <td>Electronics</td>
                    <td>1,899</td>
                  </tr>
                  <tr>
                    <td>Herman Miller</td>
                    <td>Furniture</td>
                    <td>1,395</td>
                  </tr>
                  <tr>
                    <td>Dyson V15</td>
                    <td>Appliances</td>
                    <td>749</td>
                  </tr>
                  <tr>
                    <td>iPad Pro 12.9"</td>
                    <td>Electronics</td>
                    <td>649</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="lp-editor-footer">
            <div class="lp-footer-status">
              <span class="lp-status-dot"></span>
              <span>Connected to ShopKart DB</span>
            </div>
            <span class="lp-footer-pass">&#10003; Query passed &middot; next problem &#8594;</span>
          </div>

        </div>
        <div class="lp-caption">This runs entirely in your browser via WebAssembly</div>
      </div>

    </section>
  `;
}
