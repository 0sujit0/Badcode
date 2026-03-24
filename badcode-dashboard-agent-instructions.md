# badcode Dashboard — UI Upgrade Instructions

> **For**: AI coding agent (Cursor / Claude Code / Windsurf)
> **Scope**: Dashboard page (`/#/dashboard`) only
> **Reference**: `Design.md` (the authoritative design spec) + `badcode-dashboard.html` (pixel-reference mockup)
> **Rule**: Use ONLY existing CSS variables from the design system. Do NOT introduce new colors, fonts, or tokens. Both dark and light themes must work — every change must respect `[data-theme="light"]` overrides.

---

## Pre-flight checklist

Before making any changes:

1. Open `Design.md` and locate the **Dashboard Page (`/dashboard`)** section (around line 214). This is your source of truth.
2. Identify the CSS file(s) that style the dashboard. Likely in `/src/styles/` or colocated with the dashboard component.
3. Identify the dashboard JS/HTML template that renders module cards, the continue banner, and the stats row.
4. Open `badcode-dashboard.html` in a browser — this is the target output. Toggle between dark/light themes using the navbar button to see both states.

---

## Change 1: Differentiate module card states visually

**Problem**: All four card states (Not Started, In Progress, Complete, Locked) look nearly identical. They all have the same border, same background, same visual weight.

**What to do**:

### In Progress cards
Add these styles to whatever class represents an in-progress module card:

```css
/* In Progress — accent top stripe + left glow */
border-top: 2px solid var(--accent);
border-color: var(--border-accent);
box-shadow: inset 3px 0 0 0 var(--accent-glow), var(--glow-green);
```

On hover, intensify the glow:

```css
/* In Progress hover */
box-shadow: inset 3px 0 0 0 rgba(200,245,66,0.15), 0 0 32px rgba(200,245,66,0.18);
transform: translateY(-2px);
```

The module number (`01`, `02`, etc.) should be colored `var(--accent)` for in-progress cards.

### Complete cards
Add a success-colored left border:

```css
/* Complete */
border-left: 3px solid var(--success);
```

On hover:

```css
/* Complete hover */
border-color: var(--success);
border-left: 3px solid var(--success);
```

The module number should be `var(--success)` with `opacity: 0.7`.

### Not Started cards
No changes to default styling. On hover, just lighten the border:

```css
/* Not Started hover */
border-color: var(--border-main);
```

Module number color: `var(--text-muted)`.

### Locked cards
The card itself animates in normally, but the inner content wrapper should be dimmed:

```css
/* Locked — dim inner content */
.card-inner-content { /* whatever wraps the card body */
  opacity: 0.5;
}
```

Module number: `var(--text-muted)` with `opacity: 0.4`. Cursor should be `not-allowed`. No hover effects.

### Badge styling per state

Each card's status badge should be styled differently:

| State | Background | Text color |
|-------|-----------|------------|
| Not Started | `var(--bg-elevated)` | `var(--text-muted)` |
| In Progress | `var(--accent-dim)` | `var(--accent)` |
| Complete | `var(--success-dim)` | `var(--success)` |
| Locked | `var(--bg-elevated)` | `var(--warning)` |

Badge base styles: `font-family: var(--font-mono)`, `font-size: 10px`, `font-weight: 600`, `padding: 3px 10px`, `border-radius: var(--radius-full)`, `text-transform: uppercase`, `letter-spacing: 0.5px`.

**Light theme**: All CSS variables auto-swap. No additional overrides needed — `var(--accent)` becomes `#6B8F00`, `var(--success)` becomes `#16A34A`, etc.

---

## Change 2: Upgrade the Continue Banner

**Problem**: The continue banner is flat — plain card background, no visual pull, no animation.

**What to do**:

Replace the current banner styles with:

```css
.continue-banner {
  border-top: 3px solid var(--accent);
  background: var(--bg-card);
  background-image: radial-gradient(ellipse at 20% 50%, var(--accent-dim) 0%, transparent 60%);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}
```

The badge (the icon/number element on the left) needs the `pulse-ring` animation:

```css
@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,245,66,0.3); }
  50% { box-shadow: 0 0 0 8px rgba(200,245,66,0); }
}
```

**Light theme override** for the pulse animation (the rgba values need to use the olive accent):

```css
[data-theme="light"] .banner-badge {
  animation-name: pulse-ring-light;
}
@keyframes pulse-ring-light {
  0%, 100% { box-shadow: 0 0 0 0 rgba(107,143,0,0.25); }
  50% { box-shadow: 0 0 0 8px rgba(107,143,0,0); }
}
```

The label "CONTINUE WHERE YOU LEFT OFF" should be: `font-family: var(--font-mono)`, `font-size: 11px`, `color: var(--accent)`, `text-transform: uppercase`, `letter-spacing: 0.5px`.

The progress bar on the right should be `110px` wide, `4px` tall, `var(--accent)` fill, `var(--bg-elevated)` track.

---

## Change 3: Fix the cold-start stats row

**Problem**: When a new user arrives, the stats row shows "0 / 87 Problems solved", "0 Modules in progress", "10 Modules remaining" — all zeros, zero momentum.

**What to do**:

Add conditional rendering logic in JavaScript:

```javascript
// Pseudocode — adapt to your actual data model
const totalSolved = getUserProgress().totalSolved;

if (totalSolved === 0) {
  // NEW USER: Show encouraging framing
  // Cell 1: "87" with label "Challenges waiting"
  // Cell 2: "10" with label "Modules to explore"  
  // Cell 3: "$0" with label "Completely free"
} else {
  // ACTIVE USER: Show actual progress
  // Cell 1: "{solved} / 87" with label "Problems solved" — solved number in accent color
  // Cell 2: "{inProgress}" with label "Modules in progress"
  // Cell 3: "{remaining}" with label "Modules remaining"
}
```

For active users, the solved count number should use `color: var(--accent)` while the `/ 87` part stays `var(--text-primary)`.

Stats cell styling: `background: var(--bg-card)`, `border: 1px solid var(--border)`, `border-radius: var(--radius-md)`, `padding: 16px 20px`. Numbers: `font-family: var(--font-mono)`, `font-size: 28px`, `font-weight: 700`. Labels: `font-size: 12px`, `font-weight: 500`, `color: var(--text-muted)`, `text-transform: uppercase`.

---

## Change 4: Add progress bar + difficulty indicators to module cards

**Problem**: Module cards have no progress bar and no difficulty indicator in their footer.

**What to do**:

Add a footer section to each module card with three elements in a row:

### Progress bar (left, flex-grow)
```css
.progress-track {
  flex: 1;
  height: 3px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-right: 12px;
}
.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: var(--accent);
  transition: width 0.5s ease;
}
/* Complete modules use success color */
.progress-fill.complete { background: var(--success); }
```

Width = `(completedProblems / totalProblems) * 100%`.

### Difficulty dots (center)
3 vertical bars, each `4px` wide and `12px` tall, with `3px` gap, `border-radius: 2px`:

- Filled: `background: var(--accent)` (or `var(--success)` for complete modules)
- Unfilled: `background: var(--border-main)`

Each module has a difficulty level 1–3. Fill that many bars.

You'll need to add a `difficulty` property to your module data if it doesn't exist. Suggested values:
- Modules 1–3: difficulty 1
- Modules 4–6: difficulty 2
- Modules 7–10: difficulty 3

### Problem counter (right)
`font-family: var(--font-mono)`, `font-size: 11px`, `color: var(--text-muted)`. Format: `"X/Y"` where X = completed, Y = total problems in module.

---

## Change 5: Make the Guided/Explore toggle visible

**Problem**: The mode toggle is in the top-right corner of the section with no visual distinction between active and inactive states.

**What to do**:

Move it to sit on the same row as the "ALL MODULES" heading, right-aligned:

```css
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
```

Style the toggle buttons:

```css
.mode-btn {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: 0.18s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Active state — accent tint */
.mode-btn.active {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: var(--border-accent);
}

.mode-btn:not(.active):hover {
  border-color: var(--text-muted);
}
```

Place a lock icon before "Guided" and a compass icon before "Explore". Use inline SVGs, not emoji — keep icon size at `13px`.

---

## Change 6: Add staggered fadeUp animation to module cards

**Problem**: All cards appear instantly with no entrance animation.

**What to do**:

Add this keyframe (if not already present):

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Apply to all module cards with a base style:

```css
.module-card {
  opacity: 0;
  animation: fadeUp 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
```

Then add staggered delays. You can either:

**Option A — CSS nth-child** (simpler, works for up to 10 cards):
```css
.module-card:nth-child(1) { animation-delay: 0ms; }
.module-card:nth-child(2) { animation-delay: 70ms; }
.module-card:nth-child(3) { animation-delay: 140ms; }
.module-card:nth-child(4) { animation-delay: 210ms; }
.module-card:nth-child(5) { animation-delay: 280ms; }
.module-card:nth-child(6) { animation-delay: 350ms; }
.module-card:nth-child(7) { animation-delay: 420ms; }
.module-card:nth-child(8) { animation-delay: 490ms; }
.module-card:nth-child(9) { animation-delay: 560ms; }
.module-card:nth-child(10) { animation-delay: 630ms; }
```

**Option B — Inline style** (set in JS during render):
```javascript
card.style.animationDelay = `${index * 70}ms`;
```

Use Option B if cards are rendered dynamically.

---

## Change 7: Limit skill tags to 3 per card with overflow pill

**Problem**: Some cards show 4–5 keyword pills (SELECT, DISTINCT, ALIASES, CONCAT, etc.), adding visual clutter on the browse view.

**What to do**:

In the template that renders skill pills per card:

```javascript
const maxVisible = 3;
const skills = module.skills; // e.g. ["SELECT", "DISTINCT", "ALIASES", "CONCAT"]
const visible = skills.slice(0, maxVisible);
const overflow = skills.length - maxVisible;

// Render `visible` as normal pills
// If overflow > 0, render one more pill: "+{overflow}"
```

The overflow pill should look different — transparent background, default border, muted text, italic:

```css
.skill-pill.overflow {
  background: transparent;
  border-color: var(--border);
  color: var(--text-muted);
  font-style: italic;
}
```

---

## Change 8: Increase surface contrast in light theme

**Problem**: White cards on light gray background creates very low contrast in light mode. Dark mode doesn't have this issue.

**What to do**:

In the `[data-theme="light"]` override section:

```css
[data-theme="light"] {
  --bg-page: #F5F4F0;  /* was likely #FAFAF8 or similar — darken slightly */
}
```

If `--bg-page` is already set in light theme, try `#F5F4F0` or `#F2F1ED` — warm enough to match the palette, dark enough to contrast against `#FFFFFF` card surfaces.

Additionally, ensure light-theme cards have a visible border:

```css
[data-theme="light"] .module-card {
  border: 1px solid #E2E1DC;  /* use --border token */
}
```

Test by squinting at the screen — cards should be clearly distinguishable from the page background.

---

## Change 9: Strengthen module number weight

**Problem**: The module numbers (01, 02, etc.) are large but light gray, blending into the background. They don't anchor the eye.

**What to do**:

For **Not Started** cards: change from `var(--text-muted)` (`#666666`) to a slightly stronger tone:

```css
.state-not-started .card-num {
  color: var(--text-secondary);  /* #999999 in dark, #6B6B65 in light — more visible than --text-muted */
  opacity: 0.7;
}
```

For **In Progress**: already handled in Change 1 — `var(--accent)`.

For **Complete**: already handled — `var(--success)` at `opacity: 0.7`.

For **Locked**: `var(--text-muted)` at `opacity: 0.4` — deliberately faint.

---

## Verification checklist

After all changes, verify:

- [ ] Toggle dark ↔ light theme. Every element should adapt. No hardcoded hex colors.
- [ ] In-progress card has accent top stripe, left glow, and glows brighter on hover.
- [ ] Complete cards have green left border.
- [ ] Locked cards are visibly dimmed (inner content at 0.5 opacity). Cursor is `not-allowed`.
- [ ] Continue banner has radial gradient visible, badge pulsing, progress bar present.
- [ ] Stats row shows encouraging copy for brand-new users (0 progress), real stats for active users.
- [ ] Each card footer shows: progress bar (left) + difficulty bars (center) + X/Y counter (right).
- [ ] Guided/Explore toggle is next to "All Modules" heading, active state uses accent colors.
- [ ] Cards stagger in with 70ms delay between each.
- [ ] Skill pills max out at 3 visible + "+N" overflow pill.
- [ ] Light theme cards are clearly distinct from page background.
- [ ] Module numbers are stronger (not washed out) for Not Started cards.
- [ ] Mobile: cards stack to 1 column, banner stacks vertically, stats row stacks to 1 column.

---

## Files likely touched

- Dashboard CSS (all 9 changes)
- Dashboard JS/template (changes 1, 3, 4, 6, 7 — conditional rendering, data binding, animation delays)
- Module data model (change 4 — may need `difficulty` field per module)
- Global CSS (change 8 — light theme `--bg-page` value)

## Reference files

- `Design.md` — the authoritative design spec
- `badcode-dashboard.html` — pixel-reference mockup showing the final target state with all changes applied (both themes)
