/**
 * VD Framework 4 — vd_framework_utils.js
 * Foundation layer: VDBaseElement base class + VDUtils helpers.
 *
 * MUST be loaded BEFORE vd_framework_global.js and vd_framework_macrocomponents.js:
 *   <script src="vd_framework_utils.js"></script>
 *   <script src="vd_framework_global.js"></script>
 *   <script src="vd_framework_macrocomponents.js"></script>
 *
 * @version 4.0
 * @author  Vivacity Design — https://www.vivacitydesign.net
 */

/* =============================================================================
   VDBaseElement — Base class for all VD Framework custom elements
   =============================================================================
   Every VD component extends VDBaseElement instead of HTMLElement.
   Provides:
   - Shadow DOM attachment in constructor
   - Automatic cleanup of event listeners, intervals and timeouts on disconnect
   - _addListener() / _addInterval() / _addTimeout() registration helpers
   - _makeAccessible() for ARIA + keyboard support on interactive elements
   - Recommended render() hook (override in subclasses)
   ============================================================================= */

class VDBaseElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Internal registries — populated via the helper methods below.
    this._listeners = [];  // { target, event, handler, options }
    this._intervals  = [];  // interval ids
    this._timeouts   = [];  // timeout ids
  }

  /* -----------------------------------------------------------------------
     Lifecycle
  ----------------------------------------------------------------------- */

  connectedCallback() {
    // Override in subclass and call this.render() or build DOM here.
    // Calling super.connectedCallback() is optional but safe.
  }

  /**
   * Universal cleanup — called automatically by the browser when the
   * element is removed from the DOM. All registered listeners, intervals
   * and timeouts are cleared; no manual cleanup needed in subclasses as
   * long as they use the helper registration methods.
   *
   * Subclasses can still override, but MUST call super.disconnectedCallback().
   */
  disconnectedCallback() {
    this._listeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this._intervals.forEach(id => clearInterval(id));
    this._timeouts.forEach(id => clearTimeout(id));

    this._listeners = [];
    this._intervals  = [];
    this._timeouts   = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Override in subclass. Call this.render() when isConnected is true
    // to avoid rendering before the element is in the DOM.
    if (this.isConnected && typeof this.render === 'function') {
      this.render();
    }
  }

  /* -----------------------------------------------------------------------
     Registration helpers
     Use these instead of calling addEventListener / setInterval / setTimeout
     directly so that disconnectedCallback can clean up automatically.
  ----------------------------------------------------------------------- */

  /**
   * Register an event listener AND track it for automatic removal.
   * @param {EventTarget} target   - Element or object to attach the listener to.
   * @param {string}      event    - Event name (e.g. 'click', 'input').
   * @param {Function}    handler  - Callback function.
   * @param {object}      [options] - addEventListener options (optional).
   */
  _addListener(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    this._listeners.push({ target, event, handler, options });
  }

  /**
   * Register a setInterval call and track its id.
   * @param   {Function} fn        - Callback.
   * @param   {number}   delay     - Interval in ms.
   * @returns {number}             - Interval id (also stored internally).
   */
  _addInterval(fn, delay) {
    const id = setInterval(fn, delay);
    this._intervals.push(id);
    return id;
  }

  /**
   * Register a setTimeout call and track its id.
   * @param   {Function} fn        - Callback.
   * @param   {number}   delay     - Delay in ms.
   * @returns {number}             - Timeout id (also stored internally).
   */
  _addTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    this._timeouts.push(id);
    return id;
  }

  /* -----------------------------------------------------------------------
     Accessibility helper
  ----------------------------------------------------------------------- */

  /**
   * Make an interactive element accessible: adds role, tabindex, aria-label
   * and keyboard handler (Enter / Space triggers the action).
   *
   * @param {HTMLElement} el              - The element to enhance.
   * @param {object}      [opts]
   * @param {string}      [opts.label]    - aria-label value.
   * @param {string}      [opts.role]     - ARIA role (default: 'button').
   * @param {Function}    [opts.keyAction] - Called on Enter / Space keydown.
   *
   * @example
   *   const btn = this.shadowRoot.querySelector('.my-btn');
   *   this._makeAccessible(btn, {
   *     label: 'Close dialog',
   *     keyAction: () => this._close()
   *   });
   */
  _makeAccessible(el, { label, role = 'button', keyAction = null } = {}) {
    if (label) el.setAttribute('aria-label', label);
    el.setAttribute('role', role);
    el.setAttribute('tabindex', '0');

    if (keyAction) {
      this._addListener(el, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          keyAction(e);
        }
      });
    }
  }
}


/* =============================================================================
   VDUtils — Shared utility functions
   =============================================================================
   Static utility object available globally as window.VDUtils.
   Use these helpers for all DOM manipulation inside VD components to ensure
   consistency, performance and safety.
   ============================================================================= */

const VDUtils = {

  /* -----------------------------------------------------------------------
     Security
  ----------------------------------------------------------------------- */

  /**
   * Escape HTML special characters to prevent XSS.
   * Use when inserting untrusted / user-provided text into the DOM.
   *
   * @param   {string} str  - Raw (potentially unsafe) string.
   * @returns {string}      - HTML-safe escaped string.
   *
   * @example
   *   el.innerHTML = VDUtils.sanitizeHTML(userInput);
   */
  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  },

  /* -----------------------------------------------------------------------
     DOM Building
  ----------------------------------------------------------------------- */

  /**
   * Create a DocumentFragment from an HTML string using a <template> element.
   * Safe for developer-authored template literals; DO NOT pass unsanitized
   * user content here — use sanitizeHTML() first if needed.
   *
   * @param   {string} htmlString - Valid HTML markup.
   * @returns {DocumentFragment}
   *
   * @example
   *   const frag = VDUtils.createFragment('<li class="item">Hello</li>');
   *   this.shadowRoot.querySelector('ul').appendChild(frag);
   */
  createFragment(htmlString) {
    const tpl = document.createElement('template');
    tpl.innerHTML = htmlString;
    return tpl.content.cloneNode(true);
  },

  /**
   * Append multiple elements to a container via a single DocumentFragment
   * (one reflow instead of N).
   *
   * @param {Element}   container - Target parent element.
   * @param {Element[]} elements  - Array of elements to append.
   *
   * @example
   *   VDUtils.appendChildren(wrapper, items.map(i => buildItemEl(i)));
   */
  appendChildren(container, elements) {
    const fragment = document.createDocumentFragment();
    elements.forEach(el => fragment.appendChild(el));
    container.appendChild(fragment);
  },

  /**
   * Create a <style> element with the given CSS text.
   * Convenience wrapper for the common shadow DOM pattern.
   *
   * @param   {string}      cssText - CSS rules string.
   * @returns {HTMLStyleElement}
   *
   * @example
   *   this.shadowRoot.appendChild(VDUtils.buildStyle(`.box { color: red; }`));
   */
  buildStyle(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    return style;
  },

  /* -----------------------------------------------------------------------
     Attribute helpers
  ----------------------------------------------------------------------- */

  /**
   * Read an attribute and return its value or a default.
   *
   * @param   {Element} el           - The element.
   * @param   {string}  name         - Attribute name.
   * @param   {*}       [fallback=''] - Default when attribute is absent/null.
   * @returns {string}
   *
   * @example
   *   const color = VDUtils.attr(this, 'backgroundcolor', '#ffffff');
   */
  attr(el, name, fallback = '') {
    return el.getAttribute(name) ?? fallback;
  },

  /* -----------------------------------------------------------------------
     OpenAI proxy helper
  ----------------------------------------------------------------------- */

  /**
   * Send a request to the VD Framework openai_proxy.php endpoint.
   * The proxy keeps the API key server-side; never call OpenAI directly
   * from client-side JavaScript in production.
   *
   * @param   {object}  payload      - { type: 'chat'|'image', ...params }
   * @param   {string}  [proxyUrl]   - Path to the proxy (default: 'openai_proxy.php').
   * @returns {Promise<object>}      - Parsed JSON response from OpenAI (via proxy).
   * @throws  {Error}               - On network failure or non-2xx HTTP status.
   *
   * @example — Chat:
   *   const data = await VDUtils.openaiRequest({
   *     type: 'chat',
   *     model: 'gpt-4',
   *     messages: [{ role: 'user', content: 'Hello!' }]
   *   });
   *   const reply = data.choices[0].message.content;
   *
   * @example — Image:
   *   const data = await VDUtils.openaiRequest({
   *     type: 'image',
   *     prompt: 'A futuristic city at dusk',
   *     size: '1024x1024',
   *     quality: 'standard'
   *   });
   *   const imageUrl = data.data[0].url;
   */
  async openaiRequest(payload, proxyUrl = 'openai_proxy.php') {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI proxy error ${response.status}: ${errText}`);
    }

    return response.json();
  }
};

// Expose globally so all VD component files can access without import.
window.VDUtils     = VDUtils;
window.VDBaseElement = VDBaseElement;
