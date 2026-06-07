/**
 * VD Framework 4 — Theme Component
 * @file    vd_framework_theme.js
 * @version 4.0
 * @description
 *   <vd-theme> injects CSS custom properties (--vd-*) into :root so every VD
 *   component can consume a unified colour/font/spacing theme.
 *
 *   Load BEFORE vd_framework_global.js and vd_framework_macrocomponents.js.
 *
 *   Usage:
 *     <vd-theme
 *       primary="#667eea"
 *       secondary="#764ba2"
 *       background="#f5f5f5"
 *       text="#333333"
 *       font-family="Inter, sans-serif"
 *       border-radius="8px">
 *     </vd-theme>
 *
 *   CSS custom properties pierce the Shadow DOM boundary, so all shadow-DOM
 *   components automatically pick up theme tokens from :root.
 *
 *   Programmatic API:
 *     VdTheme.applyTokens({ primary: "#ff6b6b" });   // no element needed
 *     VdTheme.getVar("primary");                      // read resolved value
 *
 * @author Vivacity Design — https://www.vivacitydesign.net
 */

/** Default values for every --vd-* token. */
const VD_THEME_DEFAULTS = {
  "primary":          "#667eea",
  "primary-dark":     "#5a6fd6",
  "secondary":        "#764ba2",
  "background":       "#f5f5f5",
  "surface":          "#ffffff",
  "text":             "#333333",
  "text-light":       "#666666",
  "text-inverse":     "#ffffff",
  "border":           "#dddddd",
  "success":          "#4caf50",
  "warning":          "#ff9800",
  "error":            "#f44336",
  "info":             "#2196f3",
  "radius":           "8px",
  "radius-sm":        "4px",
  "radius-lg":        "16px",
  "shadow":           "0 2px 8px rgba(0,0,0,0.15)",
  "shadow-lg":        "0 8px 32px rgba(0,0,0,0.18)",
  "font-family":      "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
  "font-size":        "16px",
  "font-size-sm":     "14px",
  "font-size-lg":     "18px",
  "transition":       "0.2s ease",
  "spacing":          "8px",
  "spacing-sm":       "4px",
  "spacing-md":       "16px",
  "spacing-lg":       "24px",
};

/**
 * vd-theme
 *
 * Place anywhere in <body> — preferably before other VD components.
 * Attributes map 1-to-1 with VD_THEME_DEFAULTS keys.
 */
class VdTheme extends VDBaseElement {
  static get shadowMode() { return "none"; }

  static get observedAttributes() {
    return Object.keys(VD_THEME_DEFAULTS);
  }

  connectedCallback() {
    // Remove any pre-existing injected theme sheet
    const existing = document.getElementById("vd-theme-tokens");
    if (existing) existing.remove();
    this._styleEl = document.createElement("style");
    this._styleEl.id = "vd-theme-tokens";
    document.head.appendChild(this._styleEl);
    this._apply();
  }

  attributeChangedCallback() {
    if (this.isConnected && this._styleEl) this._apply();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._styleEl) { this._styleEl.remove(); this._styleEl = null; }
  }

  _apply() {
    const lines = Object.entries(VD_THEME_DEFAULTS).map(([key, def]) => {
      const val = this.getAttribute(key) || def;
      return `  --vd-${key}: ${val};`;
    });
    this._styleEl.textContent = `:root {\n${lines.join("\n")}\n}`;
  }

  /**
   * Read a resolved --vd-* CSS custom property value from :root.
   * @param {string} token  e.g. "primary", "radius"
   * @returns {string}
   */
  static getVar(token) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--vd-${token}`)
      .trim();
  }

  /**
   * Apply theme tokens programmatically without a <vd-theme> element.
   * @param {Object<string,string>} tokens  e.g. { primary: "#ff0000", radius: "4px" }
   */
  static applyTokens(tokens = {}) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(`--vd-${key}`, value);
    }
  }
}

customElements.define("vd-theme", VdTheme);
window.VdTheme          = VdTheme;
window.VD_THEME_DEFAULTS = VD_THEME_DEFAULTS;
