# VD Framework 4 — Phase 6: New Components

## Summary

Phase 6 adds **5 new base components** to `vd_framework_global.js` and extends the existing `vd-video` player with fullscreen support. All changes are informed by the Phase 5 feasibility test (real-world CertainThing promo page rebuild, 90% component coverage).

---

## New Components

### `vd-button`
Generic CTA button. Renders as `<a>` (when `href` is set) or native `<button>`. Supports three visual variants, three sizes, disabled state, icon prefix, and slot content.
- **Fires:** `vd-click` → `{ element, label, href }`
- **Key attributes:** `label`, `href`, `target`, `variant` (primary/secondary/ghost), `size` (sm/md/lg), `backgroundcolor`, `textcolor`, `hovercolor`, `icon`, `type`, `disabled`

### `vd-chip`
Lightweight inline tag/badge. Lighter than `vd-pill` — no image, no profile context. Ideal for feature tags, status badges, filter chips.
- **Fires:** `vd-chip-click` → `{ element, label }` | `vd-chip-remove` (cancelable) → `{ element, label }`
- **Key attributes:** `label`, `icon`, `removable`, `backgroundcolor`, `textcolor`, `bordercolor`

### `vd-hero`
Full hero section: eyebrow → headline → subtitle → badges slot → CTA slot → hero image.
- **Named slots:** `slot="badges"` (chip row), `slot="cta"` (button area), default slot (after image)
- **Accent syntax:** `title="Text *accented word* here"` → accented word renders in `accentcolor`
- **Key attributes:** `title`, `subtitle`, `eyebrow`, `imgsrc`, `imgalt`, `backgroundcolor`, `textcolor`, `accentcolor`, `padding`

### `vd-section`
Semantic `<section>` wrapper with built-in h2 heading, subtitle paragraph, max-width centering and slot. Eliminates repeated page-section div boilerplate.
- **Key attributes:** `title`, `subtitle`, `backgroundcolor`, `textcolor`, `maxwidth`, `padding`, `align`

### `vd-pricingcard`
Dedicated pricing card with price display, feature list slot, and CTA button. Supports featured state (accent border + badge).
- **Fires:** `vd-cta-click` → `{ element, href, label }`
- **Key attributes:** `title`, `price`, `currency`, `period`, `note`, `description`, `featured`, `featuredlabel`, `ctalabel`, `ctahref`, `ctatarget`, `accentcolor`, `backgroundcolor`, `textcolor`, `shadowcolor`

---

## Modified Component

### `vd-video` (VideoTag)
Updated in `vd_framework_macrocomponents.js`.
- **New attribute:** `fullscreen` — boolean; set to `"true"` to trigger fullscreen programmatically via attribute
- **New method:** `element.enterFullscreen()` — programmatic fullscreen trigger from JS
- **Fires:** `vd-fullscreen` → `{ element }` — on fullscreen activation
- **Controls:** added fullscreen button (⛶) to the control bar
- **Backward-compatible:** all existing attributes (`file`, `title`, `backgroundcolor`, `textcolor`, `bordercolor`) unchanged

---

## Component Count

| File | Phase 3 | Phase 6 |
|---|---|---|
| `vd_framework_global.js` | 30 | **35** (+5) |
| `vd_framework_macrocomponents.js` | 15 | 15 (1 updated) |
| **Total** | **45** | **50** |

---

## Interactivity Contract

All new components follow the VD4 interactivity contract:
- Events fire with `bubbles: true, composed: true` — they cross Shadow DOM boundaries and bubble to `document`
- All `addEventListener` calls go through `_addListener()` — auto-removed on `disconnectedCallback`
- All interactive elements have ARIA roles and keyboard handlers via `_makeAccessible()`
- `vd-chip-remove` is `cancelable: true` — call `e.preventDefault()` to suppress auto-removal

---

## Files Changed

```
phase6/
├── vd_framework_global.js         # +5 new components
├── vd_framework_macrocomponents.js # vd-video fullscreen update
├── vd_framework_doc.html           # updated docs (51 components)
└── README.md                       # this file
```

---

## Phase History

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Done | Foundation: VDBaseElement, PHP proxy, README |
| Phase 2 | ✅ Done | Refactoring: all 45 components migrated |
| Phase 3 | ✅ Done | UX & DX: theming, ARIA, keyboard coverage |
| Phase 4 | ✅ Done | Documentation: full component reference |
| Phase 5 | ✅ Done | Feasibility: real promo page rebuild (90% coverage) |
| Phase 6 | ✅ Done | New components: vd-button, vd-chip, vd-hero, vd-section, vd-pricingcard + vd-video fullscreen |
