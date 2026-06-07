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

  <!-- Your VD components go here -->
  <vd-structure orientation="landscape" backgroundcolor="#f5f5f5">
    <vd-mainpanel>
      <vd-colorcard backgroundcolor="#667eea" textcolor="white" width="300px">
        Hello VD Framework 4!
      </vd-colorcard>
    </vd-mainpanel>
  </vd-structure>

  <!-- Load order is mandatory: utils → global → macrocomponents -->
  <script src="vd_framework_utils.js"></script>
  <script src="vd_framework_global.js"></script>
  <script src="vd_framework_macrocomponents.js"></script>
</body>
</html>
```

---

## 🏗️ Architecture

### File Structure

```
vd_framework/
├── vd_framework_utils.js          ← Phase 1 ✅  Foundation layer (load first)
├── vd_framework_global.js         ← Phase 2 🔄  30 base components
├── vd_framework_macrocomponents.js← Phase 2 🔄  15 complex components
├── openai_proxy.php               ← Phase 1 ✅  Secure OpenAI proxy (server-side)
├── calendar-backend.php           ←             Task persistence for vd-planner
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

> ⚠️ All script `src` paths must be **relative** (no leading `/`).

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
| **AI** | `vd-chatbot` (GPT-4), `vd-dalle` (DALL-E 3), `vd-chatbox`, `vd-chatline`, `vd-inputbox` |
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
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(VDUtils.buildStyle(`
      .box { color: ${VDUtils.attr(this, 'color', '#000')}; }
    `));

    const btn = document.createElement('button');
    btn.textContent = VDUtils.attr(this, 'label', 'Click me');

    // ✅ Registered listener — auto-removed on disconnect
    this._addListener(btn, 'click', () => console.log('clicked'));

    // ✅ Accessible by default
    this._makeAccessible(btn, {
      label: VDUtils.attr(this, 'label', 'Action button'),
      keyAction: () => console.log('keyboard activated')
    });

    this.shadowRoot.appendChild(btn);
  }
}
customElements.define('my-component', MyComponent);
```

### VDBaseElement API

| Method | Description |
|---|---|
| `_addListener(target, event, handler, [options])` | Register a listener — auto-removed on `disconnectedCallback` |
| `_addInterval(fn, delay)` | Register an interval — auto-cleared on disconnect |
| `_addTimeout(fn, delay)` | Register a timeout — auto-cleared on disconnect |
| `_makeAccessible(el, { label, role, keyAction })` | Add ARIA role, aria-label, tabindex and keyboard handler |
| `disconnectedCallback()` | Auto-cleanup (override with `super.disconnectedCallback()`) |

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

## 🗺️ Development Phases

| Phase | Status | Description |
|---|---|---|
| **Phase 1 — Foundation** | ✅ Done | `vd_framework_utils.js` (VDBaseElement + VDUtils), `openai_proxy.php` |
| **Phase 2 — Refactoring** | 🔄 Next | Migrate all 45 components to `VDBaseElement`, unify render pattern, remove `innerHTML +=` |
| **Phase 3 — UX & DX** | 📋 Planned | `<vd-theme>` theming system, full ARIA coverage, keyboard navigation |

---

## 📄 License

[Vivacity Design](https://www.vivacitydesign.net) · All rights reserved.
