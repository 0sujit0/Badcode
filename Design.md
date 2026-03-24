# badcode — Design Reference

> Upload this file in future conversations to give Claude full context on the app's pages, layouts, and design system.

---

## Table of Contents

1. [App Overview](#app-overview)
2. [Design System](#design-system)
3. [Navigation Structure](#navigation-structure)
4. [Pages](#pages)
   - [Landing Page](#landing-page-)
   - [Dashboard Page](#dashboard-page-dashboard)
   - [Level Page](#level-page-levelid)
   - [Lesson Page](#lesson-page-lessonid)
   - [Level Complete Page](#level-complete-page-level-completeid)
5. [Global Components](#global-components)

---

## App Overview

**badcode** is a browser-based SQL learning platform. Users progress through 10 levels (modules), each containing 5–8 mission problems. They write SQL queries in a Monaco editor, run them against an in-browser SQLite engine, and get immediate feedback.

- **Routing**: Hash-based (`/#/`, `/#/dashboard`, `/#/level/1`, `/#/lesson/L1_P1`, `/#/level-complete/1`)
- **Themes**: Dark (default) and Light, toggled via navbar, stored in `localStorage`
- **Responsive**: Mobile breakpoint at 768px

---

## Design System

### Color Palette

#### Dark Theme (Default — `:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-page` | `#0D0D0D` | Main page background |
| `--bg-card` | `#161616` | Card surfaces |
| `--bg-elevated` | `#1C1C1C` | Raised surfaces, dropdowns |
| `--bg-inset` | `#1C1C1C` | Inset/recessed areas |
| `--bg-editor` | `#111111` | Monaco editor background |
| `--border` | `#222228` | Default borders |
| `--border-main` | `#2A2A2A` | Stronger borders |
| `--border-accent` | `rgba(200,245,66,0.35)` | Accent-colored borders |
| `--text-primary` | `#F0F0F0` | Main body text |
| `--text-secondary` | `#999999` | Secondary/label text |
| `--text-muted` | `#666666` | Disabled/muted text |
| `--text-inverse` | `#0A0A0B` | Dark text on bright backgrounds |
| `--accent` | `#C8FF00` | Primary brand accent (lime/yellow) |
| `--accent-dim` | `rgba(200,245,66,0.12)` | Accent tinted backgrounds |
| `--accent-glow` | `rgba(200,245,66,0.08)` | Subtle glow behind accented elements |
| `--success` | `#34D399` | Correct answers, completions |
| `--success-dim` | `rgba(52,211,153,0.10)` | Success tinted backgrounds |
| `--error` | `#F87171` | Wrong queries, error messages |
| `--error-dim` | `rgba(248,113,113,0.08)` | Error tinted backgrounds |
| `--warning` | `#FBBF24` | Locked states, PK type pills |
| `--code-bg` | `#1A1A24` | Inline code backgrounds |
| `--code-color` | `#C8F542` | Inline code text |

#### Light Theme Override (`[data-theme="light"]`)

Warm palette: white surfaces (`#FFFFFF`), olive accent (`#6B8F00`), rich body text (`#1A1A18`), softer shadows instead of hard borders. All semantic colors adapted for readability.

---

### Typography

| Token | Font | Usage |
|-------|------|-------|
| `--font-sans` | DM Sans | Default body, UI labels |
| `--font-mono` | JetBrains Mono | Code, badges, numbers, type pills |
| `--font-serif` | Instrument Serif | Hero headlines only |

**Size scale** (base `18px`, scales down to `15px` on mobile):
- Hero H1: `clamp(48px, 5.5vw, 76px)` — responsive
- Section titles: `1.5rem`
- Body: `14.5px – 16px`
- Labels/badges: `0.8rem – 0.9rem`
- Monospace labels: `0.6rem – 0.7rem`

---

### Spacing & Radius

```
Gap scale: 0.5rem / 1rem / 1.5rem / 2rem

--radius-sm:   6px    (small elements, type pills)
--radius-md:   10px   (buttons, small cards)
--radius-lg:   14px   (cards, panels)
--radius-2xl:  28px   (large hero cards)
--radius-full: 9999px (pills, circular badges)
```

---

### Shadows

```
--shadow-sm:       0 1px 3px rgba(0,0,0,0.2)
--shadow-md:       0 4px 16px rgba(0,0,0,0.4)
--shadow-lg:       0 12px 32px rgba(0,0,0,0.6)
--shadow-elevated: 0 4px 16px rgba(0,0,0,0.3)
--glow-green:      0 0 24px rgba(200,245,66,0.12)
```

---

### Animations

| Name | Duration | Description |
|------|----------|-------------|
| `fadeUp` | 0.4s cubic-bezier | Translate Y+12px → 0, opacity 0→1. Used on cards, sections |
| `pulse-ring` | 2s infinite | Scale + glow box-shadow pulse on active badges |
| `track-pulse` | 1.8s infinite | Opacity pulse on active progress dots |
| `badge-glow` | 3s infinite | Box-shadow pulse on accent badges |
| `spin` | 0.7s linear | Loading spinners |
| `code-line-in` | staggered | Landing page editor lines animate in sequence |

---

### Button Styles

| Class | Appearance |
|-------|-----------|
| `.btn-primary` | Accent (`#C8FF00`) background, dark text, hover: lift + shadow |
| `.btn-outline` | Transparent, thin border, secondary text; hover: accent border + text |
| `.btn-dark` | Elevated background, primary text, subtle border |

All buttons: `transition: 0.18s ease`, `border-radius: --radius-md`

---

### Badge / Pill Styles

| Class | Appearance |
|-------|-----------|
| `.badge-accent` | Accent-tinted background, accent text, glowing border |
| `.badge-subtle` | Elevated background, muted text |
| `.type-pill` | Monospace, `0.65rem`, used for SQL column types; PK highlighted in `--warning` |

---

## Navigation Structure

```
/ (Landing)
├── "Open the Editor"  → /lesson/L1_P1
└── "View Curriculum"  → /dashboard

/dashboard
├── Continue banner    → current lesson or level
├── Module card click  → /level/:id
└── Mode toggle: Guided (locked progression) | Explore (all open)

/level/:id
├── Back link          → /dashboard
├── Mission card "Start"  → /lesson/:id
├── Mission card "Review" → /lesson/:id  (already complete)
└── Level complete CTA → /level-complete/:id

/lesson/:id
├── Breadcrumbs Modules › Level › Problem X
├── Back to Level      → /level/:id
├── Progress dots      → sibling lessons in same level
└── On success "Continue" → next /lesson/:id  OR  /level-complete/:id

/level-complete/:id
├── Back to Level      → /level/:id
├── Next Level         → /level/:id+1
└── Back to Modules    → /dashboard
```

---

## Pages

---

### Landing Page (`/`)

**Layout**: Two-column split hero, centered content below on mobile stack.

#### Left Column — Copy
- **Eyebrow badge**: Accent-colored pill with a blinking dot indicator + text like "57 problems · 8 levels · 100% browser"
- **H1**: Serif font (Instrument Serif), `clamp(48px, 5.5vw, 76px)`, can include italic emphasis words
- **Subheading**: 16px DM Sans, secondary text color, 1–2 sentences describing the platform
- **CTAs**: Two buttons side-by-side — Primary (`btn-primary`: "Open the Editor") + Outline (`btn-outline`: "View Curriculum")
- **Social proof stats**: 3 stat blocks in a flex row separated by thin vertical dividers
  - "57 challenges", "8 levels", "$0 free"
  - Each: large bold number + small muted label

#### Right Column — Animated Editor Mockup
A perspectively-tilted (3D CSS transform) card layered with multiple box-shadows to look elevated:
- **Titlebar**: macOS-style traffic-light dots (red/yellow/green) + tab label `"problem_04.sql"` + badge `"Level 2 · Filters"`
- **Split body**:
  - **Left (code pane)**: Line numbers (muted, right-aligned) + syntax-highlighted SQL lines
    - Colors: Purple for `SELECT/FROM/WHERE` keywords, blue for functions, accent green for table names, warning orange for numbers
    - Lines animate in sequentially with staggered delays
    - Blinking cursor at end of last line
  - **Right (results pane)**: A results table with a striped header row and 5 sample data rows; first data row subtly highlighted; rows fade in after the code animation completes
- **Statusbar**: Bottom strip with "Connected to ShopKart DB" status + "Query passed" message
- **Ambient glow**: A pulsing radial gradient behind the card (accent color, very subtle)

**Animations**: All elements stagger-fade in on mount. The code pane animates line-by-line. The results table rows fade in after.

**Mobile**: Single column. Right column (editor) stacks below the copy. 3D transform removed. Editor still shows but static.

---

### Dashboard Page (`/dashboard`)

**Layout**: Full-width vertical sections, module cards in a responsive 3-column grid.

#### Continue Banner (Top)
- Accent border-top + subtle radial gradient background
- Left: Pulsing accent badge with level number + title "Continue where you left off" + level name + truncated problem description
- Right: 110px progress bar + "Continue" `btn-primary` button
- Badge has a `pulse-ring` glow animation

#### Stats Row (3 columns)
- "X / Y Problems Solved", "N Modules In Progress", "M Modules Remaining"
- Each cell: large monospace number + small uppercase label
- Subtle backgrounds and borders, no hover effects

#### Section Header
- Title: "All Modules" (small caps, monospace)
- Mode toggle buttons: **Guided** (lock icon) | **Explore** (compass icon)
  - Active button: Accent background/text
  - Inactive: Outline/ghost style

#### Module Cards Grid (3 columns, responsive → 1 on mobile)
Staggered `fadeUp` animation (70ms delay per card).

Each card contains:
- **Top row**: Large module number (`01`–`10`, monospace, muted) + state badge
- **Title**: Level name, `1.1rem`, bold
- **Skills**: Flex-wrapped pill tags (small, monospace font)
- **Footer**: Progress bar (3px, accent fill) + difficulty dots (1–3 filled circles) + "X/Y" counter

Card states:

| State | Border | Badge | Hover |
|-------|--------|-------|-------|
| Not Started | Default gray | Muted "Not Started" | Subtle border highlight |
| In Progress | Accent + glow shadow | Yellow "In Progress" | Accent glow intensifies |
| Complete | Success green | Green "Complete" | Success border highlight |
| Locked | Default gray | Warning "Locked" (lock icon) | Reduced opacity, no CTA |

In Progress cards have a 2px accent top stripe and a faint left border glow.

---

### Level Page (`/level/:id`)

**Layout**: Vertical sections — hero at top, skills row, then vertical mission card list.

#### Hero Section
- **Left content**:
  - Level tag: `"Level 01 · The SELECT Statement"` — small caps, accent color, left accent line
  - H1: Monospace, heavy (`800`), all-caps SQL concept names (e.g., `SELECT & DISTINCT, ALIASES, CONCAT`)
  - Description text: Secondary color, `max-width: 460px`
- **Right**: Circular SVG progress ring
  - Accent-colored `stroke`, animated `stroke-dashoffset` on mount
  - Center: Large bold count of completed missions + small `"of X"` label

#### Skills Row
Horizontal flex row of concept pills:
- **Unlocked**: Accent background + text + checkmark icon in circle
- **Locked**: Gray background + gray border, no checkmark

#### Mission Cards (Vertical list)
Each card is a 3-column grid: `[36px badge] [body] [action]`

**Badge column**:
| State | Style |
|-------|-------|
| Active | Accent bg, dark text, `pulse-ring` glow animation |
| Complete | Accent-tinted bg, checkmark icon |
| Future/Locked | Gray bg, lock icon |

**Body column**:
- Title: `14px`, monospace, bold, single-line
- Description: `12.5px`, secondary color, truncated to one line
- Concept tag: Small accent pill (active) or muted pill (others)

**Action column**:
- 3 vertical difficulty bars (`3px` wide), filled to indicate difficulty (1–3)
- CTA button: `"Start"` (active) / `"Review"` (complete) / lock icon (locked)

Hover: Active cards translate up slightly + border color intensifies.

#### Completion Banners
- **Level locked** (prerequisites not met): Warning background + lock icon + explanation text
- **All missions done**: Success background + checkmark + "Next Level →" CTA

---

### Lesson Page (`/lesson/:id`)

**Layout**: 3-column sticky layout: `[left 300px] [middle, flex-grow] [right 280px]`. Left and right panels are sticky; middle scrolls.

**Mobile**: Stacks to single column — Context → Schema → Editor → Results.

#### Left Panel — Problem Context (300px, sticky)

1. **Problem nav**: Back link (`← Back to Level`) + `"X / Y"` counter + progress dot track
   - Dots: `6px` circles — filled (complete), outline (future), accent + pulsing (active)
2. **Problem title**: `1.5rem`, bold
3. **Difficulty badge**: Colored dot + `"EASY" / "MEDIUM" / "HARD"` — semantic colors (success/warning/error)
4. **Problem description card**: Inset background, bordered, secondary text, may include inline code segments
5. **Hint panel** (label + 3 hint cards):
   - Hint 1: Always revealed (accent-tinted background)
   - Hint 2: Locked → reveals on first failed run attempt
   - Hint 3: Locked → reveals on second failure (success-tinted when revealed)
   - After 3 failures: `"Show Answer in Editor"` button appears
6. **AI Coach container**: Appears when activated (from navbar toggle); shows spinner while processing, then structured response

#### Middle Panel — Editor & Results

**Editor card**:
- Header: `"QUERY EDITOR"` label + `"SQL"` small badge + `"Run"` `btn-primary` button (`Ctrl+Enter` also works)
- Monaco editor: `280px` height, dark theme, `14px` JetBrains Mono, no minimap, word-wrap off
- Placeholder text: Gray italic `"Write your SQL query here..."`
- On success: card border turns `--success` green
- On error: card border stays default

**Results card**:
- Header: `"RESULTS"` label + status dot (gray/green/red) + status text
- States:
  - **Empty**: Table icon + `"Run a query to see results"`
  - **Success**: Green checkmark banner (`"Query passed"` + execution time) + results table below
  - **Error**: Red X banner + error message text + suggestion box with highlighted SQL snippets
- Results table: Monospace `12px`, column headers with accent underline, rows with subtle hover tint, sticky header
- On success: `"Continue →"` button appears below table

#### Right Panel — Schema Explorer (280px, sticky, scrollable)

- Section label: `"SCHEMA EXPLORER"` + database icon
- For each table:
  - Collapsible header: Table icon + table name + `"IN USE"` badge (if queried in this problem)
  - When expanded: Description text + columns list
  - Each column row: Column name + type pill (monospace, `0.65rem`); PK columns highlighted in `--warning`
  - **Active table** (the one being queried): Accent left border + tinted background + brighter text
- Mobile: Hidden by default, revealed via `"Schema ▾"` toggle button at top

If the problem is a pipeline problem: Right panel shows a Pipeline Sidebar with problem-specific data flow UI instead of (or alongside) the schema explorer.

---

### Level Complete Page (`/level-complete/:id`)

**Layout**: Centered card, max-width `640px`, vertically centered in page.

#### Back Link
Small `"← Back to Level"` link (muted, hover accent), top-left.

#### Main Card (`.card-dark`)
- **Success icon**: `56px` accent circle with white checkmark SVG
- **Star rating**: 3 SVG stars, filled/outlined based on performance (0–3)
- **Heading**: `"Level X complete!"` or `"You've completed badcode!"` (final level)
- **Subheading**: `"You finished [Level Name]. Keep the momentum going!"`
- **Stats grid** (3 equal columns):
  - Each cell: Large bold stat number + small uppercase muted label
  - Stats shown: Solved, Clean Solves, Used Hints
  - Cells have subtle white-opacity backgrounds and borders
- **CTAs** (stacked or side-by-side):
  - `"Next Level: [Name] →"` — `btn-primary` (accent)
  - `"Back to Modules"` — `btn-outline`
  - Last level only shows `"Back to Modules"`

---

## Global Components

### Navbar (Fixed, full-width)

- **Backdrop**: Semi-transparent dark background + `backdrop-filter: blur(12px)`
- **Left**: Brand mark (accent circle with `"*"`) + `"badcode"` wordmark + breadcrumb navigation (secondary links with `"›"` separators)
- **Right**:
  - AI Coach toggle: Label text + animated toggle switch (knob slides, accent when on)
  - `"Cheat Sheet"` — `btn-outline`
  - Theme toggle: Circular icon button (sun ↔ moon icon, swaps with smooth transition)
  - `"Sign In"` — `btn-primary`

### Cards

| Class | Description |
|-------|-------------|
| `.card` | Standard card — `--bg-card` surface, `--border` border, `--radius-lg`, hover lightens border/background |
| `.card-dark` | Darker variant — thicker borders, `--radius-2xl`, used on completion screens |

### Progress Indicators

| Type | Description |
|------|-------------|
| Progress dots | 6px circles in a track; filled = complete, outline = future, accent + pulsing = active |
| Progress bars | `3px` height, `--accent` fill, `border-radius: full`, animated width transitions |
| Progress ring | SVG circle, `stroke-dashoffset` animates from 0 to filled on mount |
| Difficulty bars | 3× `3px` wide vertical bars; filled count = difficulty level |

---

*This file was auto-generated from the source code on 2026-03-24. Re-generate when major UI changes are made.*
