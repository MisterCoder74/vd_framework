# VD Framework 4

**Vivacity Design Web Framework** — A zero-dependency Web Components library for building modern web pages with custom HTML tags.

> Built by [Vivacity Design](https://www.vivacitydesign.net) · Pure Vanilla JS + Web Components API · No external libraries required

---

## 📦 Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>

  <!-- Optional: override the default theme tokens -->
  <vd-theme primary="#667eea" secondary="#764ba2" border-radius="12px"></vd-theme>

  <vd-structure orientation="landscape" backgroundcolor="#f5f5f5">
    <vd-mainpanel>
      <vd-colorcard backgroundcolor="#667eea" textcolor="white" width="300px">
        Hello VD Framework 4!
      </vd-colorcard>
    </vd-mainpanel>
  </vd-structure>

  <!-- Load order is mandatory -->
  <script src="vd_framework_utils.js"></script>
  <script src="vd_framework_theme.js"></script>
  <script src="vd_framework_global.js"></script>
  <script src="vd_framework_macrocomponents.js"></script>
</body>
</html>
```

> ⚠️ All script `src` paths must be **relative** (no leading `/`).

---

## 🏗️ Architecture

### File Structure

```
vd_framework/
├── vd_framework_utils.js           ← Phase 1+2 ✅  Foundation layer (load first)
├── vd_framework_theme.js           ← Phase 3 ✅   Theme token system (load 2nd)
├── vd_framework_global.js          ← Phase 2+3 ✅  30 base components
├── vd_framework_macrocomponents.js ← Phase 2+3 ✅  15 complex components
├── openai_proxy.php                ← Phase 1 ✅   Secure OpenAI proxy (server-side)
├── calendar-backend.php            ←              Task persistence for vd-planner
└── README.md
```

### Load Order (mandatory)

```
vd_framework_utils.js
       ↓
vd_framework_theme.js    ← NEW in Phase 3
       ↓
vd_framework_global.js
       ↓
vd_framework_macrocomponents.js
```

---

## 🎨 Theming — `<vd-theme>`

`<vd-theme>` injects CSS custom properties (`--vd-*`) into `:root`.
All VD components consume these tokens automatically.

### Basic usage

```html
<vd-theme
  primary="#667eea"
  secondary="#764ba2"
  background="#f5f5f5"
  surface="#ffffff"
  text="#333333"
  border="#dddddd"
  radius="8px"
  shadow="0 2px 8px rgba(0,0,0,0.15)"
  font-family="Inter, sans-serif"
  transition="0.2s ease">
</vd-theme>
```

### Default tokens

| Token | Default | Description |
|---|---|---|
| `--vd-primary` | `#667eea` | Primary action colour |
| `--vd-primary-dark` | `#5a6fd6` | Darker primary |
| `--vd-secondary` | `#764ba2` | Secondary colour |
| `--vd-background` | `#f5f5f5` | Page background |
| `--vd-surface` | `#ffffff` | Card / panel surface |
| `--vd-text` | `#333333` | Primary text |
| `--vd-text-light` | `#666666` | Secondary text |
| `--vd-border` | `#dddddd` | Border colour |
| `--vd-success` | `#4caf50` | Like button, success states |
| `--vd-error` | `#f44336` | Dislike button, error states |
| `--vd-warning` | `#ff9800` | Warning states |
| `--vd-info` | `#2196f3` | Info states |
| `--vd-radius` | `8px` | Border radius |
| `--vd-shadow` | `0 2px 8px rgba(0,0,0,0.15)` | Card shadow |
| `--vd-font-family` | `system-ui, ...` | Font stack |
| `--vd-transition` | `0.2s ease` | Animation duration |
| `--vd-spacing` | `8px` | Base spacing unit |

### Programmatic API

```javascript
// Apply tokens without a <vd-theme> element
VdTheme.applyTokens({ primary: "#ff6b6b", radius: "4px" });

// Read a resolved token value
const primaryColor = VdTheme.getVar("primary"); // → "#ff6b6b"
```

### Per-element override

CSS custom properties cascade, so you can override for specific subtrees:

```css
/* Only purple buttons inside #sidebar */
#sidebar { --vd-primary: #9c27b0; }
```

---

## 🧩 Components (45 total)

### Base Components — `vd_framework_global.js` (30)

| Category | Components |
|---|---|
| **Layout** | `vd-structure`, `vd-mainpanel`, `vd-sidepanel`, `vd-left`, `vd-right`, `vd-center`, `vd-sp`, `vd-spacer` |
| **Navigation** | `vd-radionav`, `vd-radiolink`, `vd-popnav`, `vd-poplink`, `vd-skewnav`, `vd-skewlink` |
| **UI Display** | `vd-colorcard`, `vd-colorbadge`, `vd-accordion`, `vd-alert`, `vd-confirmation`, `vd-pill` |
| **Feedback** | `vd-like`, `vd-dislike` |
| **Tables** | `vd-table`, `vd-tr`, `vd-th`, `vd-td` |
| **Typography** | `vd-bi`, `vd-bu`, `vd-iu` |

### Macro Components — `vd_framework_macrocomponents.js` (15)

| Category | Components |
|---|---|
| **AI** | `vd-chatbot` (GPT-4), `vd-dalle` (DALL-E 3) |
| **Chat UI** | `vd-chatbox`, `vd-chatline`, `vd-inputbox` |
| **Interactive** | `vd-planner` (calendar + PHP backend), `vd-tabcontrol`, `vd-tab`, `vd-carousel` |
| **Visualization** | `vd-timeline`, `vd-timeline-item`, `vd-progresscircle`, `vd-countdown` |
| **Media** | `vd-video`, `vd-music` |

---

## ♿ ARIA & Accessibility (Phase 3)

All interactive components now ship with full ARIA semantics and keyboard support.

| Component | ARIA role | Added attributes / behaviour |
|---|---|---|
| `vd-radionav` | `radiogroup` | `aria-label` |
| `vd-radiolink` | `radio` | `aria-checked`, `tabindex`, keyboard select |
| `vd-skewnav`, `vd-popnav` | `navigation` | `aria-label` |
| `vd-skewlink`, `vd-poplink` | `menuitem` | keyboard activation |
| `vd-accordion` | `button` on header | `aria-expanded`, Enter/Space toggle |
| `vd-like` | `button` | `aria-label="Like"`, `aria-pressed` |
| `vd-dislike` | `button` | `aria-label="Dislike"`, `aria-pressed` |
| `vd-alert` | `alert` | `aria-live="assertive"` |
| `vd-confirmation` | `dialog` | `aria-modal`, `aria-labelledby` |
| `vd-progresscircle` | `progressbar` | `aria-valuenow/min/max` |
| `vd-countdown` | `timer` | `aria-label` |
| `vd-chatbox` | `log` | `aria-live="polite"` |
| `vd-inputbox` | — | `aria-label` on textarea |
| `vd-chatbot` | — | `role="log"` on history panel |
| `vd-dalle` | — | `role="log"` on history panel |
| `vd-carousel` | `region` | `aria-roledescription="carousel"` |
| `vd-tabcontrol` | `tablist` | `aria-label="Tabs"` |
| `vd-tab` | `tab` | `aria-selected`, `tabindex` synced with active state |
| `vd-timeline` | `list` | `aria-label` from title |
| `vd-timeline-item` | `listitem` | — |

---

## 🔐 OpenAI Integration (vd-chatbot, vd-dalle)

v4 uses a **server-side PHP proxy** (`openai_proxy.php`) to keep the API key secure.
The browser never sees the key — it only communicates with `openai_proxy.php`.

### Setup

**Option A — Environment variable (recommended):**
```
SetEnv OPENAI_API_KEY sk-...yourkey...
```

**Option B — `.env` file outside the webroot:**
```
OPENAI_API_KEY=sk-...yourkey...
```

> ⚠️ Never put `key.ini` or `.env` inside the webroot. Never commit API keys to version control.

---

## 🏛️ VDBaseElement API

| Method | Description |
|---|---|
| `_addListener(target, event, handler, [options])` | Register a listener — auto-removed on `disconnectedCallback` |
| `_addInterval(fn, delay)` | Register an interval — auto-cleared on disconnect |
| `_addTimeout(fn, delay)` | Register a timeout — auto-cleared on disconnect |
| `_makeAccessible(el, { label, role, keyAction })` | Add ARIA role, aria-label, tabindex and keyboard handler |
| `disconnectedCallback()` | Auto-cleanup (override with `super.disconnectedCallback()`) |
| `static get shadowMode()` | Return `"none"` to skip shadow DOM (light DOM components) |

## 🛠️ VDUtils API

| Method | Description |
|---|---|
| `VDUtils.sanitizeHTML(str)` | Escape HTML special chars |
| `VDUtils.createFragment(htmlString)` | Create `DocumentFragment` from HTML string |
| `VDUtils.appendChildren(container, elements[])` | Batch-append using `DocumentFragment` |
| `VDUtils.buildStyle(cssText)` | Create a `<style>` element |
| `VDUtils.attr(el, name, [fallback])` | Read attribute with default |
| `VDUtils.openaiRequest(payload, [proxyUrl])` | POST to `openai_proxy.php` |

---

## 🗺️ Development Phases

| Phase | Status | Description |
|---|---|---|
| **Phase 1 — Foundation** | ✅ Done | `vd_framework_utils.js` (VDBaseElement + VDUtils), `openai_proxy.php` |
| **Phase 2 — Refactoring** | ✅ Done | All 45 components → `VDBaseElement`, unified render, `<slot>` fix, `_addListener/_addInterval`, AI proxy |
| **Phase 3 — UX & DX** | ✅ Done | `vd_framework_theme.js` (CSS vars, `<vd-theme>`), full ARIA on 20 components, keyboard navigation |

---

## 📄 License

[Vivacity Design](https://www.vivacitydesign.net) · All rights reserved.
