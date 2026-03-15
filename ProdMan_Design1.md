# UI Design Rules

## Visual Identity

- Dark-themed dashboard with near-black layered backgrounds (`#111111`, `#1a1a1a`, `#0d0d0d`)
- Light card surfaces for primary/left panels (`#f5f4ef`, `#ffffff`)
- Accent color: **yellow-green** (`#d4f032` or similar) — used exclusively for CTAs, active nav states, selected badges, and primary action buttons
- All other UI elements remain monochrome (black, white, grays)
- No gradients, no drop shadows, no glow effects — flat surfaces only

---

## Typography

- Font: clean sans-serif throughout (system font stack or Inter)
- Two weights only: `400` regular and `500` medium — never `600` or `700`
- Display numbers: large (`2.2h`, `15%`) with small muted labels beneath
- Labels: `11–12px`, muted gray (`#888` or equivalent)
- Field values: `13–14px`, near-white or dark depending on panel
- Timestamps and metadata: `11px`, low-contrast muted text
- Sentence case always — never ALL CAPS or Title Case in labels

---

## Layout

- Two-column asymmetric split: **light left panel** + **dark right panel**
- Left panel: primary record detail, engagement history, editable fields
- Right panel: contextual intelligence — duplicate detection, alerts, related records
- Responsive column grid using `repeat(auto-fit, minmax(160px, 1fr))`
- Generous internal whitespace — `padding: 1.25rem` on cards, `gap: 12–16px` between elements
- No nested scroll containers — content auto-fits height

---

## Cards & Containers

- `border-radius: 12–16px` on all cards
- Border: `0.5px solid` with low-opacity (`rgba(255,255,255,0.1)` on dark, `rgba(0,0,0,0.08)` on light)
- Dark panel cards: `#1e1e1e` or `#242424` background
- Light panel cards: `#ffffff` or `#f5f4ef` background
- No card titles in ALL CAPS — always sentence case

---

## Components

### Status Pipeline Bar
- Horizontal stepper: `Contacted → Nurturing → Unqualified → Converted`
- Active step: filled dark pill with checkmark
- Next step: yellow-green accent pill
- Inactive steps: ghost/outline pills
- Full-width, inside light panel

### Field Rows (Editable)
- Label above (`11px`, muted) → value below (`13–14px`, primary)
- Edit icon (`✏`) appears inline on hover — do not show by default
- Arranged in a 3-column grid inside the record panel

### Engagement History List
- Icon (form, email, calendar) + title + subtitle in two lines
- Timestamp right-aligned, muted, small (`11px`)
- Paginated with `1 of 3 →` navigator at the bottom
- Collapsible section with `∧` toggle

### Duplicate Detection Panel (Right side)
- Alert banner at top: muted info tone, not alarming
- Each duplicate in a dark card with: avatar, name, title, company, phone, email
- Checkmark circle (yellow-green when selected) on the left
- Engagement history column on the right of each card
- Action buttons: `New Lead`, `Delete`, `Merge` — pill style, accent or ghost

### Data / Analytics Widget
- Large metric display (`2.2h`) with label beneath
- Mini horizontal bar chart — striped/hatched fill for one bar, solid dark for another
- Small percentage labels below bars

---

## Interaction States

- Hover: subtle background shift (`rgba(255,255,255,0.05)` on dark panels)
- Active / selected: yellow-green border or fill
- Buttons: `0.5px` border, transparent background, hover fills with `background-secondary`
- Focus rings: `box-shadow: 0 0 0 2px accent` — no other shadow types
- Active nav item: yellow-green pill background with dark text

---

## Iconography

- Monochrome outlined icons — no filled colorful icons
- `16px` size inline, `20px` for section headers
- Icon + label always paired with `8px` gap
- Use SVG paths — no emoji

---

## Questioning Flow (Before Building)

Before generating any UI output, always ask the user the following questions. Ask them together, not one by one:

1. **What type of application is this?** (CRM, SaaS dashboard, admin panel, marketplace, etc.)
2. **What is the primary data object or entity?** (Lead, Order, User, Product, etc.)
3. **What are the 3–5 core sections or pages?**
4. **What actions should users perform?** (Create, edit, merge, convert, assign, etc.)
5. **What fields matter most for the main record view?**
6. **Is there a smart alert or duplicate detection feature needed?**
7. **What is the preferred accent color?** (Default: yellow-green as per design system)
8. **Who are the primary users?** (Sales reps, ops, admins, customers, etc.)
9. **Any data widgets or integrations to surface?** (Forms, email, analytics, etc.)
10. **What is the brand name?**

Collect all answers before writing a single line of code or markup.

---

## Output Format

- Single self-contained HTML file — no separate CSS or JS files
- Realistic dummy data — no placeholder text like "Lorem Ipsum"
- All interactive states implemented (hover, active, selected)
- Fully responsive within a `max-width: 1280px` container
- Dark right panel and light left panel must both be present