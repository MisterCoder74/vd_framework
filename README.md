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

  <vd-structure orientation="landscape" backgroundcolor="#f5f5f5">
    <vd-mainpanel>
      <vd-colorcard backgroundcolor="#667eea" textcolor="white" width="300px">
        Hello VD Framework 4!
      </vd-colorcard>
    </vd-mainpanel>
  </vd-structure>

  <!-- Load order is mandatory -->
  <script src="vd_framework_utils.js"></script>
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
├── vd_framework_global.js          ← Phase 2 ✅   30 base components
├── vd_framework_macrocomponents.js ← Phase 2 ✅   15 complex components
├── openai_proxy.php                ← Phase 1 ✅   Secure OpenAI proxy (server-side)
├── calendar-backend.php            ←              Task persistence for vd-planner
└── README.md
```

### Load Order (mandatory)

```
vd_framework_utils.js
       ↓
vd_framework_global.js
       ↓
vd_framework_macrocomponents.js
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

## 🔐 OpenAI Integration (vd-chatbot, vd-dalle)

v4 uses a **server-side PHP proxy** (`openai_proxy.php`) to keep the API key secure.
The browser never sees the key — it only communicates with `openai_proxy.php`.

### Setup

**Option A — Environment variable (recommended for production):**
```
SetEnv OPENAI_API_KEY sk-...yourkey...
```

**Option B — `.env` file outside the webroot:**
Create a `.env` file **one directory above** your `public_html` / webroot:
```
OPENAI_API_KEY=sk-...yourkey...
```

### Component attributes

```html
<!-- Optional: custom proxy path -->
<vd-chatbot
  proxy="openai_proxy.php"
  name="My Assistant"
  model="gpt-4o-mini"
  bgcolor="#1a1a2e"
  color="white"
  chatcolor="#f0f0f0"
  typingindicator="true"
  input-rows="3"
  input-placeholder="Ask me anything...">
</vd-chatbot>

<vd-dalle
  proxy="openai_proxy.php"
  name="Image Generator"
  model="dall-e-3"
  imagesize="1024x1024"
  imagenumber="1"
  download="true">
</vd-dalle>
```

> ⚠️ Never put `key.ini` or `.env` inside the webroot. Never commit API keys to version control.

---

## 🏛️ VDBaseElement (v4 Base Class)

All v4 components extend `VDBaseElement` (defined in `vd_framework_utils.js`).

### Key features

```javascript
class MyComponent extends VDBaseElement {
  static get observedAttributes() {
    return ['color', 'label'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .box { color: ${VDUtils.attr(this, 'color', '#000')}; }
      </style>
      <div class="box">${VDUtils.sanitizeHTML(VDUtils.attr(this, 'label', 'Hello'))}</div>
    `;
  }
}

// Light DOM component (no shadow root):
class MyLightComponent extends VDBaseElement {
  static get shadowMode() { return "none"; }

  connectedCallback() {
    this.innerHTML = `<span>${VDUtils.sanitizeHTML(this.getAttribute("text"))}</span>`;
  }
}
```

### VDBaseElement API

| Method | Description |
|---|---|
| `_addListener(target, event, handler, [options])` | Register a listener — auto-removed on `disconnectedCallback` |
| `_addInterval(fn, delay)` | Register an interval — auto-cleared on disconnect |
| `_addTimeout(fn, delay)` | Register a timeout — auto-cleared on disconnect |
| `_makeAccessible(el, { label, role, keyAction })` | Add ARIA role, aria-label, tabindex and keyboard handler |
| `disconnectedCallback()` | Auto-cleanup (override with `super.disconnectedCallback()`) |
| `static get shadowMode()` | Return `"none"` to skip shadow DOM (light DOM components) |

---

## 🛠️ VDUtils API

Static utility object available globally as `window.VDUtils`.

| Method | Description |
|---|---|
| `VDUtils.sanitizeHTML(str)` | Escape HTML special chars — use for untrusted/user content |
| `VDUtils.createFragment(htmlString)` | Create `DocumentFragment` from HTML string via `<template>` |
| `VDUtils.appendChildren(container, elements[])` | Batch-append elements using a single `DocumentFragment` |
| `VDUtils.buildStyle(cssText)` | Create a `<style>` element with the given CSS |
| `VDUtils.attr(el, name, [fallback])` | Read attribute with default value |
| `VDUtils.openaiRequest(payload, [proxyUrl])` | POST to `openai_proxy.php` — returns parsed JSON from OpenAI |

---

## 📄 Phase 2 Migration Notes

All 45 components migrated to `VDBaseElement` in v4.

### Changes applied globally

| Change | Details |
|---|---|
| `extends VDBaseElement` | All 45 components — replaces `extends HTMLElement` |
| `this.attachShadow()` removed | `VDBaseElement` handles shadow DOM creation |
| `innerHTML +=` fixed | `VdStructure`, `VdSidepanel`, `VdMainpanel` now use `<slot>` |
| `addEventListener` → `_addListener()` | Automatic cleanup on disconnect |
| `setInterval` → `_addInterval()` | Auto-cleared on disconnect (`VdCountdown`, `VdCarousel`, `VdPlanner`) |
| `setTimeout` → `_addTimeout()` | Auto-cleared on disconnect |
| Light DOM flag | `static get shadowMode() { return "none"; }` on `VDTable`, `VDTR`, `VDTH`, `VDTD`, `VdAlert`, `VdConfirmation`, `hspacer`, `VdCarousel` |
| AI proxy | `VdChatbot` + `VdDalle`: replaced `fetch("key.ini")` + direct OpenAI calls with `VDUtils.openaiRequest()` via `openai_proxy.php` |

---

## 🗺️ Development Phases

| Phase | Status | Description |
|---|---|---|
| **Phase 1 — Foundation** | ✅ Done | `vd_framework_utils.js` (VDBaseElement + VDUtils), `openai_proxy.php` |
| **Phase 2 — Refactoring** | ✅ Done | All 45 components migrated to `VDBaseElement`, unified render pattern, `<slot>` fix, `_addListener/_addInterval`, AI proxy |
| **Phase 3 — UX & DX** | 📋 Planned | `<vd-theme>` theming system, full ARIA coverage, keyboard navigation |

---

## 📄 License

[Vivacity Design](https://www.vivacitydesign.net) · All rights reserved.
