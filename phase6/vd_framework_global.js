/**
 * VD Framework 4 — vd_framework_global.js
 * 30 base components, all migrated to VDBaseElement.
 *
 * Phase 2+3 changes vs v3:
 *  - All classes extend VDBaseElement (defined in vd_framework_utils.js)
 *  - this.attachShadow() removed from every constructor (VDBaseElement handles it)
 *  - innerHTML += replaced with proper <slot> pattern (VdStructure, VdSidepanel, VdMainpanel)
 *  - All addEventListener → _addListener() for automatic cleanup
 *  - All setTimeout → _addTimeout() for automatic cleanup
 *  - Constructor-only DOM building moved to connectedCallback → render()
 *  - Light-DOM components declare static get shadowMode() { return "none"; }
 *
 * Load order: vd_framework_utils.js → THIS FILE → vd_framework_macrocomponents.js
 *
 * @version 4.0
 * @author  Vivacity Design — https://www.vivacitydesign.net
 */

/* =============================================================================
   Shared helper
   ============================================================================= */
function normalizeSize(value, defaultUnit = "px") {
  if (!value) return "auto";
  const v = value.trim();
  if (/[a-z%]+$/i.test(v)) return v;
  return v + defaultUnit;
}

/* =============================================================================
   NAVIGATION
   ============================================================================= */

class VDRadioNav extends VDBaseElement {
  static get observedAttributes() { return ["backgroundcolor","align","textcolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg    = this.getAttribute("backgroundcolor") || "transparent";
    const align = this.getAttribute("align")           || "flex-start";
    const label = this.getAttribute("label")           || "Navigation options";
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:block; }
          .nav { display:flex; flex-wrap:wrap; justify-content:var(--nav-align,flex-start);
                 background-color:var(--nav-bg,transparent); padding:10px; border-radius:8px; }
        </style>
        <div class="nav" role="radiogroup" aria-label="${label}"><slot></slot></div>`;
    }
    this.style.setProperty("--nav-bg",    bg);
    this.style.setProperty("--nav-align", align);
  }
}

class VDRadioLink extends VDBaseElement {
  static get observedAttributes() { return ["active","url","textcolor","activecolor","shadowcolor","backgroundcolor","show-radio"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected) return;
    if (name === "active") {
      const container = this.shadowRoot.querySelector(".container");
      const radio = this.shadowRoot.querySelector('input[type="radio"]');
      if (!container || !radio) return;
      const isActive = newValue === "true";
      container.classList.toggle("active", isActive);
      radio.checked = isActive;
    } else { this.render(); }
  }
  render() {
    const textcolor   = this.getAttribute("textcolor");
    const activecolor = this.getAttribute("activecolor");
    const shadowcolor = this.getAttribute("shadowcolor");
    const bgColor     = this.getAttribute("backgroundcolor");
    const isActive    = this.getAttribute("active") === "true";
    const showRadio   = this.getAttribute("show-radio") !== "false";
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(VDUtils.buildStyle(`
      .container { display:flex; align-items:center; margin:0 10px; padding:10px 15px; border-radius:10px;
        background-color:var(--backgroundcolor,transparent); color:var(--textcolor,#000); cursor:pointer;
        transition:background-color 0.3s,color 0.3s,box-shadow 0.3s; box-shadow:0 4px 10px var(--shadowcolor,rgba(0,0,0,0.1)); }
      .container.active { background-color:var(--activecolor,#007bff); color:var(--textcolor,#fff); }
      .radio { margin-right:10px; }
      .radio.hidden { display:none; }
      .link-text { flex-grow:1; }
    `));
    const container = document.createElement("div");
    container.className = "container";
    container.style.setProperty("--textcolor",       textcolor);
    container.style.setProperty("--activecolor",     activecolor);
    container.style.setProperty("--shadowcolor",     shadowcolor);
    container.style.setProperty("--backgroundcolor", bgColor);
    if (isActive) container.classList.add("active");
    // Phase 3: ARIA
    container.setAttribute("role",         "radio");
    container.setAttribute("aria-checked",  isActive ? "true" : "false");
    container.setAttribute("tabindex",      isActive ? "0" : "-1");
    this._makeAccessible(container, { label: this.textContent.trim() || "Option", role: "radio", keyAction: () => { radio.checked = true; this._selectLink(); } });
    const radio = document.createElement("input");
    radio.type = "radio"; radio.name = "navigation"; radio.className = "radio";
    if (!showRadio) radio.classList.add("hidden");
    if (isActive)   radio.checked = true;
    const linkText = document.createElement("span");
    linkText.className = "link-text";
    linkText.innerHTML = this.innerHTML;
    container.appendChild(radio);
    container.appendChild(linkText);
    this._addListener(radio,     "change", () => this._selectLink());
    this._addListener(container, "click",  () => { radio.checked = true; this._selectLink(); });
    this.shadowRoot.appendChild(container);
  }
  _selectLink() {
    const allLinks = this.getRootNode().host.parentNode.querySelectorAll("vd-radiolink");
    allLinks.forEach((link) => {
      link.shadowRoot.querySelector(".container").classList.remove("active");
      link.shadowRoot.querySelector(".container").setAttribute("aria-checked","false");
      link.shadowRoot.querySelector(".container").setAttribute("tabindex","-1");
      link.shadowRoot.querySelector('input[type="radio"]').checked = false;
      link.setAttribute("active","false");
    });
    this.shadowRoot.querySelector(".container").classList.add("active");
    this.shadowRoot.querySelector(".container").setAttribute("aria-checked","true");
    this.shadowRoot.querySelector(".container").setAttribute("tabindex","0");
    this.shadowRoot.querySelector('input[type="radio"]').checked = true;
    this.setAttribute("active","true");
    if (this.getAttribute("url")) window.location.href = this.getAttribute("url");
  }
}

class VDSkewNav extends VDBaseElement {
  static get observedAttributes() { return ["backgroundcolor","shadowcolor","align"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg     = this.getAttribute("backgroundcolor") || "transparent";
    const shadow = this.getAttribute("shadowcolor")     || "transparent";
    const align  = this.getAttribute("align")           || "flex-start";
    const label  = this.getAttribute("label")           || "Navigation";
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:block; }
          .nav { display:flex; flex-wrap:wrap; justify-content:var(--nav-align,flex-start);
                 background-color:var(--nav-bg,transparent);
                 box-shadow:0 4px 8px var(--nav-shadow,transparent); padding:10px; border-radius:8px; }
        </style>
        <div class="nav" role="navigation" aria-label="${label}"><slot></slot></div>`;
    }
    this.style.setProperty("--nav-bg",     bg);
    this.style.setProperty("--nav-shadow", shadow);
    this.style.setProperty("--nav-align",  align);
  }
}

class VDSkewLink extends VDBaseElement {
  static get observedAttributes() { return ["url","target","skewcolor","textcolor","hovercolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(VDUtils.buildStyle(`
      .link { display:inline-block; margin:0 2px; background-color:var(--skewcolor); color:var(--textcolor);
              padding:10px 15px; border-radius:5px; transform:skew(-30deg); transition:background-color 0.3s; text-decoration:none; font-weight:bold; }
      .link:hover { background-color:var(--hovercolor); }
    `));
    const link = document.createElement("a");
    link.className = "link";
    link.href   = this.getAttribute("url");
    link.target = this.getAttribute("target");
    link.style.setProperty("--skewcolor",  this.getAttribute("skewcolor"));
    link.style.setProperty("--textcolor",  this.getAttribute("textcolor"));
    link.style.setProperty("--hovercolor", this.getAttribute("hovercolor"));
    link.setAttribute("role", "menuitem");
    this._makeAccessible(link, { label: this.textContent.trim(), role: "menuitem", keyAction: () => link.click() });
    link.innerHTML = this.innerHTML;
    this.shadowRoot.appendChild(link);
  }
}

class VDPopNav extends VDBaseElement {
  static get observedAttributes() { return ["backgroundcolor","shadowcolor","align"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg     = this.getAttribute("backgroundcolor") || "transparent";
    const shadow = this.getAttribute("shadowcolor")     || "transparent";
    const align  = this.getAttribute("align")           || "flex-start";
    const label  = this.getAttribute("label")           || "Navigation";
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:block; }
          .nav { display:flex; flex-wrap:wrap; justify-content:var(--nav-align,flex-start);
                 background-color:var(--nav-bg,transparent);
                 box-shadow:0 4px 8px var(--nav-shadow,transparent); padding:10px; border-radius:8px; }
        </style>
        <div class="nav" role="navigation" aria-label="${label}"><slot></slot></div>`;
    }
    this.style.setProperty("--nav-bg",     bg);
    this.style.setProperty("--nav-shadow", shadow);
    this.style.setProperty("--nav-align",  align);
  }
}

class VDPopLink extends VDBaseElement {
  static get observedAttributes() { return ["url","target","backgroundcolor","textcolor","hovercolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(VDUtils.buildStyle(`
      .link { display:inline-block; margin:0 4px; background-color:var(--backgroundcolor); color:var(--textcolor);
              padding:10px 15px; border-radius:5px; transition:all 0.3s linear; text-decoration:none; font-weight:bold; }
      .link:hover { transform:scale(1.2); background-color:var(--hovercolor); z-index:1; }
    `));
    const link = document.createElement("a");
    link.className = "link";
    link.href   = this.getAttribute("url");
    link.target = this.getAttribute("target");
    link.style.setProperty("--backgroundcolor", this.getAttribute("backgroundcolor"));
    link.style.setProperty("--textcolor",       this.getAttribute("textcolor"));
    link.style.setProperty("--hovercolor",      this.getAttribute("hovercolor"));
    link.setAttribute("role", "menuitem");
    this._makeAccessible(link, { label: this.textContent.trim(), role: "menuitem", keyAction: () => link.click() });
    link.innerHTML = this.innerHTML;
    this.shadowRoot.appendChild(link);
  }
}

/* =============================================================================
   LAYOUT  — v4: innerHTML += fixed → <slot>
   ============================================================================= */

class VdStructure extends VDBaseElement {
  static get observedAttributes() { return ["orientation","shadowcolor","border","backgroundcolor","textcolor","width","height"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:flex; flex-direction:var(--orientation,row); border-radius:12px;
                  box-shadow:0 4px 10px var(--shadowcolor,#000); border:var(--border,none);
                  background-color:var(--backgroundcolor,#fff); color:var(--textcolor,#000);
                  width:var(--width,auto); height:var(--height,auto); padding:4px; box-sizing:border-box; }
          @media (max-width:770px) { :host { flex-direction:column; padding:2px; width:auto; height:auto; } }
        </style>
        <slot></slot>`;
    }
    this.style.setProperty("--orientation",     this.getAttribute("orientation") === "portrait" ? "column" : "row");
    this.style.setProperty("--shadowcolor",     this.getAttribute("shadowcolor"));
    this.style.setProperty("--border",          this.getAttribute("border") === "true" ? "1px solid #000" : "none");
    this.style.setProperty("--backgroundcolor", this.getAttribute("backgroundcolor"));
    this.style.setProperty("--textcolor",       this.getAttribute("textcolor"));
    this.style.setProperty("--width",           this.getAttribute("width"));
    this.style.setProperty("--height",          this.getAttribute("height"));
  }
}

class VdSidepanel extends VDBaseElement {
  static get observedAttributes() { return ["shadowcolor","backgroundcolor","textcolor","width","height","padding"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:block; border-radius:8px; box-shadow:0 4px 10px var(--shadowcolor,#000); background-color:var(--backgroundcolor,#fff);
                  color:var(--textcolor,#000); width:var(--width,auto); height:var(--height,auto);
                  padding:var(--padding,4px); box-sizing:border-box; }
          @media (max-width:770px) { :host { width:100%; padding:2px; height:auto; } }
        </style>
        <slot></slot>`;
    }
    this.style.setProperty("--shadowcolor",     this.getAttribute("shadowcolor"));
    this.style.setProperty("--backgroundcolor", this.getAttribute("backgroundcolor"));
    this.style.setProperty("--textcolor",       this.getAttribute("textcolor"));
    this.style.setProperty("--width",           this.getAttribute("width"));
    this.style.setProperty("--height",          this.getAttribute("height"));
    this.style.setProperty("--padding",         this.getAttribute("padding"));
  }
}

class VdMainpanel extends VDBaseElement {
  static get observedAttributes() { return ["shadowcolor","backgroundcolor","textcolor","width","height","padding"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display:block; border-radius:8px; box-shadow:0 4px 10px var(--shadowcolor,#000); background-color:var(--backgroundcolor,#fff);
                  color:var(--textcolor,#000); width:var(--width,auto); height:var(--height,auto);
                  padding:var(--padding,4px); box-sizing:border-box; }
          @media (max-width:770px) { :host { width:100%; padding:2px; height:auto; } }
        </style>
        <slot></slot>`;
    }
    this.style.setProperty("--shadowcolor",     this.getAttribute("shadowcolor"));
    this.style.setProperty("--backgroundcolor", this.getAttribute("backgroundcolor"));
    this.style.setProperty("--textcolor",       this.getAttribute("textcolor"));
    this.style.setProperty("--width",           this.getAttribute("width"));
    this.style.setProperty("--height",          this.getAttribute("height"));
    this.style.setProperty("--padding",         this.getAttribute("padding"));
  }
}

// v4: light DOM component
class hspacer extends VDBaseElement {
  static get shadowMode() { return "none"; }
  connectedCallback() {
    const distance = parseInt(this.getAttribute("distance")) || 0;
    const inner    = this.innerHTML;
    this.innerHTML = `<span style="padding:0 ${distance}px;">${inner}</span>`;
  }
}

class VdSp extends VDBaseElement {
  static get observedAttributes() { return ["textalign","bordercolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback(name, oldValue, newValue) {
    const wrapper = this.shadowRoot.querySelector(".wrapper");
    if (!wrapper) return;
    if (name === "textalign")   wrapper.style.textAlign       = newValue;
    if (name === "bordercolor") wrapper.style.borderLeftColor = newValue;
  }
  render() {
    if (!this.shadowRoot.querySelector("style")) {
      this.shadowRoot.innerHTML = `<style>.wrapper{display:block;padding-left:16px;border-left:10px solid black;}</style><div class="wrapper"><slot></slot></div>`;
    }
    const wrapper = this.shadowRoot.querySelector(".wrapper");
    wrapper.style.textAlign       = this.getAttribute("textalign")   || "left";
    wrapper.style.borderLeftColor = this.getAttribute("bordercolor") || "black";
  }
}

/* =============================================================================
   ALIGNMENT
   ============================================================================= */

class VDRight extends VDBaseElement {
  connectedCallback() {
    if (!this.shadowRoot.querySelector("div")) {
      const w = document.createElement("div");
      w.style.cssText = "display:flex;flex-direction:column;align-items:flex-end;";
      w.innerHTML = "<slot></slot>";
      this.shadowRoot.appendChild(w);
    }
  }
}
class VDLeft extends VDBaseElement {
  connectedCallback() {
    if (!this.shadowRoot.querySelector("div")) {
      const w = document.createElement("div");
      w.style.cssText = "display:flex;flex-direction:column;align-items:flex-start;";
      w.innerHTML = "<slot></slot>";
      this.shadowRoot.appendChild(w);
    }
  }
}
class VDCenter extends VDBaseElement {
  connectedCallback() {
    if (!this.shadowRoot.querySelector("div")) {
      const w = document.createElement("div");
      w.style.cssText = "display:flex;flex-direction:column;align-items:center;";
      w.innerHTML = "<slot></slot>";
      this.shadowRoot.appendChild(w);
    }
  }
}

/* =============================================================================
   TYPOGRAPHY
   ============================================================================= */

class VDBI extends VDBaseElement {
  connectedCallback() { this.render(); }
  render() {
    this.shadowRoot.innerHTML = "";
    const s = document.createElement("span");
    s.innerHTML = this.innerHTML; s.style.fontWeight = "bold"; s.style.fontStyle = "italic";
    this.shadowRoot.appendChild(s);
  }
}
class VDBU extends VDBaseElement {
  connectedCallback() { this.render(); }
  render() {
    this.shadowRoot.innerHTML = "";
    const s = document.createElement("span");
    s.innerHTML = this.innerHTML; s.style.fontWeight = "bold"; s.style.textDecoration = "underline";
    this.shadowRoot.appendChild(s);
  }
}
class VDIU extends VDBaseElement {
  connectedCallback() { this.render(); }
  render() {
    this.shadowRoot.innerHTML = "";
    const s = document.createElement("span");
    s.innerHTML = this.innerHTML; s.style.fontStyle = "italic"; s.style.textDecoration = "underline";
    this.shadowRoot.appendChild(s);
  }
}

/* =============================================================================
   UI DISPLAY
   ============================================================================= */

class VDColorCard extends VDBaseElement {
  static get observedAttributes() { return ["backgroundcolor","textcolor","shadowcolor","imgsrc","width","imgwidth","imgheight"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg  = this.getAttribute("backgroundcolor") || "#ffffff";
    const tc  = this.getAttribute("textcolor")       || "#000000";
    const sc  = this.getAttribute("shadowcolor")     || "rgba(0,0,0,0.1)";
    const img = this.getAttribute("imgsrc")          || "";
    const w   = normalizeSize(this.getAttribute("width")     || "300","px");
    const iw  = normalizeSize(this.getAttribute("imgwidth")  || "50", "px");
    const ih  = normalizeSize(this.getAttribute("imgheight") || "50", "px");
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;width:${w};}
        .card{background-color:${bg};color:${tc};padding:20px;border-radius:12px;box-shadow:0 4px 12px ${sc};
              transition:all 0.3s ease;cursor:pointer;position:relative;overflow:hidden;}
        .card:hover{transform:translateY(-2px);box-shadow:0 6px 20px ${sc};}
        .card::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transition:left 0.5s;}
        .card:hover::before{left:100%;}
        .card-content{position:relative;z-index:1;}
        .card-image{width:${iw};height:${ih};border-radius:8px;margin-bottom:15px;object-fit:cover;}
        ::slotted(h3){margin:0 0 10px 0;font-size:1.2em;}
        ::slotted(p){margin:0;line-height:1.5;}
      </style>
      <div class="card">
        <div class="card-content">
          ${img ? `<img src="${img}" alt="Card image" class="card-image">` : ""}
          <slot></slot>
        </div>
      </div>`;
    this._addListener(this.shadowRoot.querySelector(".card"), "click", () => {
      this.dispatchEvent(new CustomEvent("vd-card-click",{detail:{element:this},bubbles:true}));
    });
  }
}

class VDColorBadge extends VDBaseElement {
  static get observedAttributes() { return ["backgroundcolor","textcolor","shadowcolor","imgsrc","width","imgwidth","imgheight"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg  = this.getAttribute("backgroundcolor") || "#ffffff";
    const tc  = this.getAttribute("textcolor")       || "#000000";
    const sc  = this.getAttribute("shadowcolor")     || "rgba(0,0,0,0.2)";
    const img = this.getAttribute("imgsrc")          || "";
    const w   = normalizeSize(this.getAttribute("width")     || "650");
    const iw  = normalizeSize(this.getAttribute("imgwidth")  || "100");
    const ih  = normalizeSize(this.getAttribute("imgheight") || "auto");
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;width:${w};}
        .badge{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:16px;
               background-color:${bg};color:${tc};border-radius:12px;box-shadow:0 4px 10px ${sc};
               padding:10px 16px;transition:box-shadow 0.3s ease,transform 0.3s ease;cursor:pointer;}
        .badge:hover{transform:translateY(-2px);box-shadow:0 6px 16px ${sc};}
        .badge img{width:${iw};height:${ih};border-radius:8px;object-fit:cover;flex-shrink:0;}
        .badge-content{flex:1;display:flex;flex-direction:column;justify-content:center;}
        ::slotted(h3){margin:0 0 4px 0;font-size:1.1em;}
        ::slotted(p){margin:0;line-height:1.5;}
      </style>
      <div class="badge">
        ${img ? `<img src="${img}" alt="Badge image">` : ""}
        <div class="badge-content"><slot></slot></div>
      </div>`;
  }
}

class UserPill extends VDBaseElement {
  static get observedAttributes() { return ["image","textcolor","title","width"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bgImage   = this.getAttribute("image")     || "";
    const textColor = this.getAttribute("textcolor") || "#000";
    const title     = this.getAttribute("title")     || "";
    const width     = this.getAttribute("width")     || "250px";
    const content   = this.innerHTML.trim();
    this.shadowRoot.innerHTML = `
      <style>
        .userpill{position:relative;text-align:center;color:${textColor};width:${width};height:${width};margin:5px;padding:8px;
                  border-radius:50%;box-shadow:0px 4px 15px grey;border:1px solid black;
                  background-image:url('${bgImage}');background-position:center;background-repeat:no-repeat;background-size:cover;}
        .head{position:absolute;top:20%;left:50%;transform:translate(-50%,-50%);}
        .head h1{font-size:1.4rem;text-align:center;margin:0;}
        .text{position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);font-size:1rem;text-align:justify;}
      </style>
      <div class="userpill">
        <div class="head"><h1>${VDUtils.sanitizeHTML(title)}</h1></div>
        <div class="text">${content}</div>
      </div>`;
  }
}

/* =============================================================================
   FEEDBACK
   ============================================================================= */

class VDLike extends VDBaseElement {
  constructor() { super(); this.liked = false; this.count = 0; }
  static get observedAttributes() { return ["backgroundcolor","textcolor","hovercolor","shadowcolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg = this.getAttribute("backgroundcolor") || "#f0f0f0";
    const tc = this.getAttribute("textcolor")       || "#333333";
    const hc = this.getAttribute("hovercolor")      || "#e0e0e0";
    const sc = this.getAttribute("shadowcolor")     || "rgba(0,0,0,0.1)";
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:inline-block;}
        .like-button{background-color:${bg};color:${tc};border:none;padding:12px 20px;border-radius:25px;cursor:pointer;
          font-size:16px;font-weight:500;transition:all var(--vd-transition,0.2s ease);box-shadow:0 2px 8px ${sc};position:relative;overflow:hidden;
          min-width:120px;display:flex;align-items:center;justify-content:center;gap:8px;}
        .like-button:hover{background-color:${hc};transform:translateY(-1px);box-shadow:0 4px 12px ${sc};}
        .like-button:active{transform:translateY(0);transition:transform 0.1s;}
        .like-button.liked{background-color:var(--vd-success,#4caf50);color:white;animation:pulse 0.3s ease;}
        .count{background:rgba(255,255,255,0.3);padding:2px 8px;border-radius:12px;font-size:14px;min-width:20px;text-align:center;}
        @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
        .ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,0.6);transform:scale(0);animation:ripple-anim 0.6s linear;pointer-events:none;}
        @keyframes ripple-anim{to{transform:scale(4);opacity:0;}}
      </style>
      <button class="like-button">
        <span class="text"><slot></slot></span>
        <span class="count">${this.count}</span>
      </button>`;
    const btn = this.shadowRoot.querySelector(".like-button");
    const cnt = this.shadowRoot.querySelector(".count");
    // Phase 3: ARIA
    btn.setAttribute("aria-label",   "Like");
    btn.setAttribute("aria-pressed", this.liked ? "true" : "false");
    this._makeAccessible(btn, { label: "Like", role: "button", keyAction: () => btn.click() });
    this._addListener(btn, "click", (e) => {
      const ripple = document.createElement("span"); ripple.className = "ripple";
      const rect = btn.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size+"px";
      ripple.style.left = (e.clientX-rect.left-size/2)+"px"; ripple.style.top = (e.clientY-rect.top-size/2)+"px";
      btn.appendChild(ripple); this._addTimeout(() => ripple.remove(), 600);
      this.liked = !this.liked; this.count = Math.max(0, this.count + (this.liked ? 1 : -1));
      btn.classList.toggle("liked", this.liked); cnt.textContent = this.count;
      btn.setAttribute("aria-pressed", this.liked ? "true" : "false");
      this.dispatchEvent(new CustomEvent("vd-like-toggle",{detail:{liked:this.liked,count:this.count,element:this},bubbles:true}));
    });
  }
}

class VDDislike extends VDBaseElement {
  constructor() { super(); this.disliked = false; this.count = 0; }
  static get observedAttributes() { return ["backgroundcolor","textcolor","hovercolor","shadowcolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg = this.getAttribute("backgroundcolor") || "#f0f0f0";
    const tc = this.getAttribute("textcolor")       || "#333333";
    const hc = this.getAttribute("hovercolor")      || "#e0e0e0";
    const sc = this.getAttribute("shadowcolor")     || "rgba(0,0,0,0.1)";
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:inline-block;}
        .dislike-button{background-color:${bg};color:${tc};border:none;padding:12px 20px;border-radius:25px;cursor:pointer;
          font-size:16px;font-weight:500;transition:all var(--vd-transition,0.2s ease);box-shadow:0 2px 8px ${sc};position:relative;overflow:hidden;
          min-width:120px;display:flex;align-items:center;justify-content:center;gap:8px;}
        .dislike-button:hover{background-color:${hc};transform:translateY(-1px);box-shadow:0 4px 12px ${sc};}
        .dislike-button:active{transform:translateY(0);transition:transform 0.1s;}
        .dislike-button.disliked{background-color:var(--vd-error,#e74c3c);color:white;animation:pulse 0.3s ease;}
        .count{background:rgba(255,255,255,0.3);padding:2px 8px;border-radius:12px;font-size:14px;min-width:20px;text-align:center;}
        @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
        .ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,0.6);transform:scale(0);animation:ripple-anim 0.6s linear;pointer-events:none;}
        @keyframes ripple-anim{to{transform:scale(4);opacity:0;}}
      </style>
      <button class="dislike-button">
        <span class="text"><slot></slot></span>
        <span class="count">${this.count}</span>
      </button>`;
    const btn = this.shadowRoot.querySelector(".dislike-button");
    const cnt = this.shadowRoot.querySelector(".count");
    // Phase 3: ARIA
    btn.setAttribute("aria-label",   "Dislike");
    btn.setAttribute("aria-pressed", this.disliked ? "true" : "false");
    this._makeAccessible(btn, { label: "Dislike", role: "button", keyAction: () => btn.click() });
    this._addListener(btn, "click", (e) => {
      const ripple = document.createElement("span"); ripple.className = "ripple";
      const rect = btn.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size+"px";
      ripple.style.left = (e.clientX-rect.left-size/2)+"px"; ripple.style.top = (e.clientY-rect.top-size/2)+"px";
      btn.appendChild(ripple); this._addTimeout(() => ripple.remove(), 600);
      this.disliked = !this.disliked; this.count = Math.max(0, this.count + (this.disliked ? 1 : -1));
      btn.classList.toggle("disliked", this.disliked); cnt.textContent = this.count;
      btn.setAttribute("aria-pressed", this.disliked ? "true" : "false");
      this.dispatchEvent(new CustomEvent("vd-dislike-toggle",{detail:{disliked:this.disliked,count:this.count,element:this},bubbles:true}));
    });
  }
}

/* =============================================================================
   ACCORDION
   ============================================================================= */

class VDAccordion extends VDBaseElement {
  constructor() { super(); this.isOpen = false; }
  static get observedAttributes() { return ["title","backgroundcolor","textcolor","width","headheight"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const title = this.getAttribute("title")           || "Accordion";
    const bg    = this.getAttribute("backgroundcolor") || "#f8f9fa";
    const tc    = this.getAttribute("textcolor")       || "#333333";
    const w     = this.getAttribute("width")           || "100%";
    const hh    = this.getAttribute("headheight")      || "50px";
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;width:${w};}
        .accordion{border:1px solid var(--vd-border,#dee2e6);border-radius:var(--vd-radius,8px);overflow:hidden;background-color:${bg};box-shadow:var(--vd-shadow,0 2px 8px rgba(0,0,0,0.1));}
        .accordion-header{height:${hh};padding:0 20px;background-color:${bg};color:${tc};cursor:pointer;
          display:flex;align-items:center;justify-content:space-between;transition:background-color var(--vd-transition,0.2s ease);font-weight:600;user-select:none;}
        .accordion-header:hover{background-color:rgba(0,0,0,0.05);}
        .accordion-icon{font-size:18px;transition:transform 0.3s ease;}
        .accordion-icon.open{transform:rotate(180deg);}
        .accordion-content{max-height:0;overflow:hidden;transition:max-height 0.3s ease;background-color:rgba(255,255,255,0.5);}
        .accordion-content.open{max-height:500px;}
        .accordion-body{padding:20px;color:${tc};}
        ::slotted(*){margin:0 0 15px 0;} ::slotted(*:last-child){margin-bottom:0;}
      </style>
      <div class="accordion">
        <div class="accordion-header">
          <span class="accordion-title">${VDUtils.sanitizeHTML(title)}</span>
          <span class="accordion-icon">▼</span>
        </div>
        <div class="accordion-content">
          <div class="accordion-body"><slot></slot></div>
        </div>
      </div>`;
    const header  = this.shadowRoot.querySelector(".accordion-header");
    const content = this.shadowRoot.querySelector(".accordion-content");
    const icon    = this.shadowRoot.querySelector(".accordion-icon");
    if (this.isOpen) { content.classList.add("open"); icon.classList.add("open"); }
    // Phase 3: ARIA + keyboard
    header.setAttribute("role",          "button");
    header.setAttribute("tabindex",      "0");
    header.setAttribute("aria-expanded", this.isOpen ? "true" : "false");
    this._makeAccessible(header, { label: this.getAttribute("title") || "Section", role: "button", keyAction: () => header.click() });
    this._addListener(header, "click", () => {
      this.isOpen = !this.isOpen;
      content.classList.toggle("open", this.isOpen); icon.classList.toggle("open", this.isOpen);
      content.style.maxHeight = this.isOpen ? (this.shadowRoot.querySelector(".accordion-body").scrollHeight + 40) + "px" : "0";
      header.setAttribute("aria-expanded", this.isOpen ? "true" : "false");
      this.dispatchEvent(new CustomEvent("vd-accordion-toggle",{detail:{isOpen:this.isOpen,element:this},bubbles:true}));
    });
  }
}

/* =============================================================================
   TABLE  — light DOM
   ============================================================================= */

class VDTable extends VDBaseElement {
  static get shadowMode() { return "none"; }
  static styles = {
    wrapper: {display:"block",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.5)",overflow:"auto",backgroundColor:"white"},
    table:   {width:"100%",borderCollapse:"collapse",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'}
  };
  constructor() { super(); this.originalOrder = []; }
  connectedCallback() {
    let width = this.getAttribute("width") || "100%";
    let height = this.getAttribute("height") || "auto";
    const border = this.getAttribute("border") || "1";
    if (!isNaN(width) && width !== "") width = width+"px";
    if (!isNaN(height) && height !== "" && height !== "auto") height = height+"px";
    Object.assign(this.style, VDTable.styles.wrapper);
    this.style.width = width;
    if (height !== "auto") this.style.maxHeight = height;
    if (border !== "0") this.style.border = `${border}px solid #dee2e6`;
    const table = document.createElement("table");
    Object.assign(table.style, VDTable.styles.table);
    while (this.firstChild) table.appendChild(this.firstChild);
    this.appendChild(table); this._table = table;
    this._addTimeout(() => { this._setupSorting(); this._saveOriginalOrder(); this._applyRowStyles(); }, 0);
  }
  _applyRowStyles() {
    const rows = Array.from(this.querySelectorAll("vd-tr"));
    rows.forEach((row, i) => {
      if (i === 0) row.querySelectorAll("vd-th").forEach((th) => th._applyHeaderStyles());
      else row._applyDataRowStyles(i % 2 === 0);
    });
  }
  _setupSorting() { this._addListener(this, "vd-sort", (e) => this._sortTable(e.detail.column, e.detail.direction)); }
  _saveOriginalOrder() { this.originalOrder = Array.from(this.querySelectorAll("vd-tr")); }
  _sortTable(col, dir) {
    const rows = Array.from(this.querySelectorAll("vd-tr"));
    if (rows.length <= 1) return;
    const data = rows.slice(1);
    data.sort((a, b) => {
      const ac = a.querySelectorAll("vd-td")[col]; const bc = b.querySelectorAll("vd-td")[col];
      if (!ac || !bc) return 0;
      const at = ac.textContent.trim(); const bt = bc.textContent.trim();
      const an = parseFloat(at.replace(/[€$,]/g,"")); const bn = parseFloat(bt.replace(/[€$,]/g,""));
      const cmp = (!isNaN(an)&&!isNaN(bn)) ? an-bn : at.localeCompare(bt,"it",{numeric:true,sensitivity:"base"});
      return dir === "asc" ? cmp : -cmp;
    });
    data.forEach((r) => r.remove()); data.forEach((r) => this._table.appendChild(r));
    this._applyRowStyles();
  }
  resetOrder() {
    if (!this.originalOrder.length) return;
    Array.from(this.querySelectorAll("vd-tr")).forEach((r) => r.remove());
    this.originalOrder.forEach((r) => this._table.appendChild(r));
    this._applyRowStyles();
    this.querySelectorAll("vd-th[sortable]").forEach((h) => h.resetSort && h.resetSort());
  }
}

class VDTR extends VDBaseElement {
  static get shadowMode() { return "none"; }
  _applyDataRowStyles(isEven) {
    this.style.display = "table-row"; this.style.transition = "all 0.3s ease";
    const cells = this.querySelectorAll("vd-td");
    if (isEven) cells.forEach((c) => (c.style.backgroundColor = "#f8f9fa"));
    this._addListener(this, "mouseenter", () => cells.forEach((c) => (c.style.backgroundColor = "#e3f2fd")));
    this._addListener(this, "mouseleave", () => cells.forEach((c) => (c.style.backgroundColor = isEven ? "#f8f9fa" : "transparent")));
  }
  connectedCallback() { this.style.display = "table-row"; }
}

class VDTH extends VDBaseElement {
  static get shadowMode() { return "none"; }
  static styles = {
    base: {display:"table-cell",padding:"16px 12px",textAlign:"left",fontWeight:"600",fontSize:"14px",
           textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"2px solid rgba(0,0,0,0.3)",
           borderTop:"2px solid rgba(0,0,0,0.3)",
           background:"radial-gradient(circle,rgba(105,166,30,1) 76%,rgba(149,253,45,1) 100%)",
           color:"white",transition:"all 0.3s ease"}
  };
  constructor() { super(); this.sortDirection = "none"; this.columnIndex = 0; }
  _applyHeaderStyles() {
    Object.assign(this.style, VDTH.styles.base);
    if (this.hasAttribute("sortable")) this.style.cursor = "pointer";
  }
  connectedCallback() {
    this.style.display = "table-cell";
    if (this.hasAttribute("sortable") && !this._indicator) {
      const ind = document.createElement("span");
      ind.textContent = " ⇅"; ind.className = "sort-indicator";
      ind.style.cssText = "margin-left:8px;font-size:12px;opacity:0.7;transition:all 0.3s ease;";
      this.appendChild(ind); this._indicator = ind;
      this._addListener(this, "mouseenter", () => { this.style.backgroundColor = "rgba(255,255,255,0.1)"; this.style.transform = "translateY(-1px)"; });
      this._addListener(this, "mouseleave", () => { this.style.backgroundColor = "transparent"; this.style.transform = "translateY(0)"; });
      this._addListener(this, "click", () => this._handleSort());
    }
  }
  _handleSort() {
    const cells = Array.from(this.parentElement.children);
    this.columnIndex = cells.indexOf(this);
    cells.forEach((c, i) => { if (i !== this.columnIndex && c.tagName.toLowerCase() === "vd-th") c.resetSort && c.resetSort(); });
    if      (this.sortDirection === "none") { this.sortDirection = "asc";  this._indicator.textContent = " ↑"; this._indicator.style.opacity = "1"; }
    else if (this.sortDirection === "asc")  { this.sortDirection = "desc"; this._indicator.textContent = " ↓"; }
    else { this.sortDirection = "none"; this._indicator.textContent = " ⇅"; this._indicator.style.opacity = "0.7"; const t=this.closest("vd-table"); if(t&&t.resetOrder)t.resetOrder(); return; }
    const table = this.closest("vd-table");
    if (table) table.dispatchEvent(new CustomEvent("vd-sort",{detail:{column:this.columnIndex,direction:this.sortDirection}}));
  }
  resetSort() { this.sortDirection="none"; if(this._indicator){this._indicator.textContent=" ⇅";this._indicator.style.opacity="0.7";} }
}

class VDTD extends VDBaseElement {
  static get shadowMode() { return "none"; }
  connectedCallback() {
    Object.assign(this.style, {
      display:"table-cell",padding:"12px",borderBottom:"1px solid #e9ecef",
      fontSize:"14px",lineHeight:"1.5",verticalAlign:"middle",transition:"background-color 0.3s ease"
    });
  }
}

/* =============================================================================
   MODALS  — light DOM
   ============================================================================= */

class VdAlert extends VDBaseElement {
  static get shadowMode() { return "none"; }
  static get observedAttributes() { return ["open","width","height","title","backgroundcolor","textcolor","duration"]; }
  connectedCallback() { this.render(); this.style.display = "none"; }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") this.style.display = newValue !== null ? "block" : "none";
  }
  render() {
    const w = this.getAttribute("width")  || "400";
    const h = this.getAttribute("height") || "200";
    const t = this.getAttribute("title")  || "Alert";
    const bg = this.getAttribute("backgroundcolor") || "#333";
    const tc = this.getAttribute("textcolor")       || "#fff";
    const content = this.textContent;
    // Phase 3: ARIA
    this.setAttribute("role",       "alert");
    this.setAttribute("aria-live",  "assertive");
    this.setAttribute("aria-label", t);
    this.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${w}px;height:${h}px;background-color:${bg};color:${tc};padding:20px;
      border-radius:var(--vd-radius,8px);box-shadow:var(--vd-shadow,0 4px 6px rgba(0,0,0,0.3));z-index:9999;`;
    this.innerHTML = `<h3 style="margin-top:0;color:${tc}">${VDUtils.sanitizeHTML(t)}</h3><div>${content}</div>`;
  }
  show() {
    this.setAttribute("open","");
    const ms = parseInt(this.getAttribute("duration"), 10);
    if (ms > 0) this._addTimeout(() => this.hide(), ms);
  }
  hide() { this.removeAttribute("open"); }
}

class VdConfirmation extends VDBaseElement {
  static get shadowMode() { return "none"; }
  static get observedAttributes() { return ["open","width","height","title","backgroundcolor","textcolor"]; }
  connectedCallback() { this.render(); this.style.display = "none"; this._setupButtons(); }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") this.style.display = newValue !== null ? "flex" : "none";
  }
  render() {
    const w = this.getAttribute("width")  || "400";
    const h = this.getAttribute("height") || "250";
    const t = this.getAttribute("title")  || "Conferma";
    const bg = this.getAttribute("backgroundcolor") || "#333";
    const tc = this.getAttribute("textcolor")       || "#fff";
    const content = this.textContent;
    // Phase 3: ARIA
    this.setAttribute("role",            "dialog");
    this.setAttribute("aria-modal",      "true");
    this.setAttribute("aria-labelledby", "vd-confirm-title");
    this.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      width:${w}px;height:${h}px;background-color:${bg};color:${tc};padding:20px;
      border-radius:var(--vd-radius,8px);box-shadow:var(--vd-shadow,0 4px 6px rgba(0,0,0,0.3));z-index:9999;flex-direction:column;`;
    this.innerHTML = `
      <h3 id="vd-confirm-title" style="margin-top:0;color:${tc}">${VDUtils.sanitizeHTML(t)}</h3>
      <div style="flex:1;margin-bottom:20px;">${content}</div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button class="cancel-btn" style="padding:8px 20px;cursor:pointer;border:none;border-radius:4px;background-color:#666;color:white;">Cancel</button>
        <button class="ok-btn" style="padding:8px 20px;cursor:pointer;border:none;border-radius:4px;background-color:#4CAF50;color:white;">OK</button>
      </div>`;
  }
  _setupButtons() {
    this._addListener(this.querySelector(".ok-btn"),     "click", () => { this.dispatchEvent(new CustomEvent("confirm",{detail:{confirmed:true}}));  this.hide(); });
    this._addListener(this.querySelector(".cancel-btn"), "click", () => { this.dispatchEvent(new CustomEvent("confirm",{detail:{confirmed:false}})); this.hide(); });
  }
  show() { this.setAttribute("open",""); }
  hide() { this.removeAttribute("open"); }
}


/* =============================================================================
   NEW COMPONENTS — Phase 6
   vd-button, vd-chip, vd-hero, vd-section, vd-pricingcard
   ============================================================================= */

/* ---- vd-button ------------------------------------------------------------ */
class VdButton extends VDBaseElement {
  static get observedAttributes() {
    return ["label","href","target","backgroundcolor","textcolor","hovercolor",
            "variant","size","disabled","type","icon"];
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const label    = this.getAttribute("label")           || "";
    const href     = this.getAttribute("href")            || "";
    const target   = this.getAttribute("target")         || "_self";
    const bg       = this.getAttribute("backgroundcolor") || "var(--vd-primary,#667eea)";
    const tc       = this.getAttribute("textcolor")       || "#fff";
    const hc       = this.getAttribute("hovercolor")      || "var(--vd-primary-dark,#764ba2)";
    const variant  = this.getAttribute("variant")         || "primary";
    const size     = this.getAttribute("size")            || "md";
    const disabled = this.hasAttribute("disabled");
    const btnType  = this.getAttribute("type")            || "button";
    const icon     = this.getAttribute("icon")            || "";

    const padMap = { sm:"0.4rem 1rem;font-size:0.85rem", md:"0.75rem 1.75rem;font-size:1rem", lg:"1rem 2.5rem;font-size:1.1rem" };
    const pad = padMap[size] || padMap.md;

    let bgStyle, borderStyle, colorStyle;
    if (variant === "secondary") {
      bgStyle = "transparent"; borderStyle = `2px solid ${bg}`; colorStyle = bg;
    } else if (variant === "ghost") {
      bgStyle = "transparent"; borderStyle = "2px solid transparent"; colorStyle = bg;
    } else {
      bgStyle = bg; borderStyle = `2px solid ${bg}`; colorStyle = tc;
    }

    const iconHtml = icon ? `<span class="vd-btn-icon">${icon}</span>` : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        .vd-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.45em;
          padding: ${pad};
          background: ${bgStyle};
          color: ${colorStyle};
          border: ${borderStyle};
          border-radius: var(--vd-radius,8px);
          font-family: inherit; font-weight: 600; line-height: 1;
          cursor: ${disabled ? "not-allowed" : "pointer"};
          opacity: ${disabled ? "0.5" : "1"};
          text-decoration: none;
          white-space: nowrap; box-sizing: border-box;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          pointer-events: ${disabled ? "none" : "auto"};
        }
        .vd-btn:hover {
          background: ${hc}; color: ${tc}; border-color: ${hc};
          transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .vd-btn:active { transform: translateY(0); }
        .vd-btn-icon { line-height: 1; }
      </style>
      ${href && !disabled
        ? `<a class="vd-btn" href="${VDUtils.sanitizeHTML(href)}" target="${VDUtils.sanitizeHTML(target)}"
              role="button" aria-label="${VDUtils.sanitizeHTML(label||'link')}">${iconHtml}<slot>${VDUtils.sanitizeHTML(label)}</slot></a>`
        : `<button class="vd-btn" type="${btnType === "submit" ? "submit" : "button"}"
                   aria-label="${VDUtils.sanitizeHTML(label||'button')}"
                   ${disabled ? "disabled" : ""}>${iconHtml}<slot>${VDUtils.sanitizeHTML(label)}</slot></button>`
      }`;

    const el = this.shadowRoot.querySelector(".vd-btn");
    this._addListener(el, "click", (e) => {
      if (disabled) { e.preventDefault(); return; }
      this.dispatchEvent(new CustomEvent("vd-click", {
        bubbles: true, composed: true,
        detail: { element: this, label, href }
      }));
    });
  }
}

/* ---- vd-chip -------------------------------------------------------------- */
class VdChip extends VDBaseElement {
  static get observedAttributes() {
    return ["label","backgroundcolor","textcolor","bordercolor","removable","icon"];
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const label     = this.getAttribute("label")           || "";
    const bg        = this.getAttribute("backgroundcolor") || "rgba(255,255,255,0.08)";
    const tc        = this.getAttribute("textcolor")       || "#e0e0e0";
    const bc        = this.getAttribute("bordercolor")     || "rgba(255,255,255,0.2)";
    const removable = this.hasAttribute("removable");
    const icon      = this.getAttribute("icon") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; }
        .chip {
          display: inline-flex; align-items: center; gap: 0.35em;
          background: ${bg}; color: ${tc};
          border: 1px solid ${bc}; border-radius: 20px;
          padding: 0.3rem 0.85rem; font-size: 0.85rem;
          font-family: inherit; cursor: pointer; user-select: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .chip:hover { opacity: 0.82; transform: translateY(-1px); }
        .chip:active { transform: translateY(0); }
        .chip-icon { font-size: 1em; line-height: 1; }
        .rm {
          background: none; border: none; color: ${tc};
          cursor: pointer; font-size: 1em; line-height: 1;
          padding: 0 0 0 0.15em; opacity: 0.55; margin-left: 0.1em;
        }
        .rm:hover { opacity: 1; }
      </style>
      <span class="chip" role="button" tabindex="0" aria-label="${VDUtils.sanitizeHTML(label)}">
        ${icon ? `<span class="chip-icon">${icon}</span>` : ""}
        <slot>${VDUtils.sanitizeHTML(label)}</slot>
        ${removable ? `<button class="rm" aria-label="Remove">&#x2715;</button>` : ""}
      </span>`;

    const chip = this.shadowRoot.querySelector(".chip");
    this._addListener(chip, "click", (e) => {
      if (e.target.classList.contains("rm")) return;
      this.dispatchEvent(new CustomEvent("vd-chip-click", {
        bubbles: true, composed: true, detail: { element: this, label }
      }));
    });
    this._makeAccessible(chip, { label: label || "chip", role: "button", keyAction: () => chip.click() });

    if (removable) {
      const rm = this.shadowRoot.querySelector(".rm");
      this._addListener(rm, "click", (e) => {
        e.stopPropagation();
        const ev = new CustomEvent("vd-chip-remove", {
          bubbles: true, composed: true, cancelable: true,
          detail: { element: this, label }
        });
        this.dispatchEvent(ev);
        if (!ev.defaultPrevented) this.remove();
      });
    }
  }
}

/* ---- vd-hero -------------------------------------------------------------- */
class VdHero extends VDBaseElement {
  static get observedAttributes() {
    return ["title","subtitle","eyebrow","imgsrc","imgalt",
            "backgroundcolor","textcolor","accentcolor","padding"];
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const rawTitle = this.getAttribute("title")           || "";
    const subtitle = this.getAttribute("subtitle")        || "";
    const eyebrow  = this.getAttribute("eyebrow")         || "";
    const imgsrc   = this.getAttribute("imgsrc")          || "";
    const imgalt   = this.getAttribute("imgalt")          || "Hero image";
    const bg       = this.getAttribute("backgroundcolor") || "transparent";
    const tc       = this.getAttribute("textcolor")       || "#fff";
    const ac       = this.getAttribute("accentcolor")     || "var(--vd-primary,#667eea)";
    const padding  = this.getAttribute("padding")         || "80px 2rem 60px";

    // Support *word* → <em class="accent">word</em> in title for accent color
    const safeTitle = VDUtils.sanitizeHTML(rawTitle)
      .replace(/\*(.*?)\*/g, `<em class="accent">$1</em>`);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; background: ${bg}; }
        .hero { max-width: 900px; margin: 0 auto; padding: ${padding}; text-align: center; color: ${tc}; font-family: inherit; }
        .eyebrow { font-size: 0.9rem; opacity: 0.55; margin: 0 0 1rem; letter-spacing: 0.04em; }
        h1 { font-size: clamp(2.2rem,5vw,3.8rem); font-weight: 900; line-height: 1.1; color: ${tc}; margin: 0 0 1.25rem; }
        em.accent { color: ${ac}; font-style: normal; }
        .subtitle { font-size: 1.1rem; opacity: 0.65; max-width: 640px; margin: 0 auto 1.5rem; line-height: 1.75; }
        .badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-bottom: 1.5rem; }
        .cta-area { margin-bottom: 1.5rem; }
        .hero-img { width: 100%; max-width: 820px; border-radius: 14px; margin-top: 2.5rem; box-shadow: 0 24px 64px rgba(0,0,0,0.5); }
      </style>
      <div class="hero">
        ${eyebrow  ? `<p class="eyebrow">${VDUtils.sanitizeHTML(eyebrow)}</p>` : ""}
        ${safeTitle? `<h1>${safeTitle}</h1>` : ""}
        ${subtitle ? `<p class="subtitle">${VDUtils.sanitizeHTML(subtitle)}</p>` : ""}
        <div class="badges"><slot name="badges"></slot></div>
        <div class="cta-area"><slot name="cta"></slot></div>
        ${imgsrc   ? `<img src="${imgsrc}" alt="${VDUtils.sanitizeHTML(imgalt)}" class="hero-img">` : ""}
        <slot></slot>
      </div>`;
  }
}

/* ---- vd-section ----------------------------------------------------------- */
class VdSection extends VDBaseElement {
  static get observedAttributes() {
    return ["title","subtitle","textcolor","backgroundcolor","maxwidth","padding","align"];
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const title    = this.getAttribute("title")            || "";
    const subtitle = this.getAttribute("subtitle")         || "";
    const tc       = this.getAttribute("textcolor")        || "inherit";
    const bg       = this.getAttribute("backgroundcolor")  || "transparent";
    const mw       = normalizeSize(this.getAttribute("maxwidth") || "1100", "px");
    const pad      = this.getAttribute("padding")          || "80px 2rem";
    const align    = this.getAttribute("align")            || "left";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; background: ${bg}; }
        .inner { max-width: ${mw}; margin: 0 auto; padding: ${pad}; color: ${tc}; text-align: ${align}; }
        h2 { font-size: 2rem; font-weight: 800; color: ${tc}; margin: 0 0 0.6rem; }
        .sub { opacity: 0.65; line-height: 1.7; margin: 0 0 1.5rem; font-size: 1.05rem; }
      </style>
      <section class="inner" aria-label="${VDUtils.sanitizeHTML(title || "section")}">
        ${title    ? `<h2>${VDUtils.sanitizeHTML(title)}</h2>` : ""}
        ${subtitle ? `<p class="sub">${VDUtils.sanitizeHTML(subtitle)}</p>` : ""}
        <slot></slot>
      </section>`;
  }
}

/* ---- vd-pricingcard ------------------------------------------------------- */
class VdPricingCard extends VDBaseElement {
  static get observedAttributes() {
    return ["title","price","period","currency","note","description","backgroundcolor",
            "textcolor","shadowcolor","accentcolor","featured","ctalabel","ctahref","ctatarget",
            "featuredlabel"];
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const title        = this.getAttribute("title")           || "Plan";
    const price        = this.getAttribute("price")           || "0";
    const period       = this.getAttribute("period")          || "/mo";
    const currency     = this.getAttribute("currency")        || "€";
    const note         = this.getAttribute("note")            || "";
    const desc         = this.getAttribute("description")     || "";
    const bg           = this.getAttribute("backgroundcolor") || "#1a1a2e";
    const tc           = this.getAttribute("textcolor")       || "#e0e0e0";
    const sc           = this.getAttribute("shadowcolor")     || "rgba(0,0,0,0.3)";
    const ac           = this.getAttribute("accentcolor")     || "var(--vd-primary,#667eea)";
    const featured     = this.hasAttribute("featured");
    const featLabel    = this.getAttribute("featuredlabel")   || "⭐ Most Popular";
    const ctaLabel     = this.getAttribute("ctalabel")        || "Get Started";
    const ctaHref      = this.getAttribute("ctahref")         || "#";
    const ctaTarget    = this.getAttribute("ctatarget")       || "_self";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: ${bg}; color: ${tc};
          border-radius: var(--vd-radius,12px); padding: 2rem;
          box-shadow: 0 4px 20px ${sc};
          border: ${featured ? `2px solid ${ac}` : "1px solid rgba(255,255,255,0.08)"};
          position: relative; transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px ${sc}; }
        .featured-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: ${ac}; color: #fff;
          padding: 0.2rem 1.1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
          white-space: nowrap;
        }
        .plan-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 1rem; }
        .price-row { display: flex; align-items: baseline; gap: 0.1em; margin-bottom: 0.2rem; }
        .currency  { font-size: 1.5rem; font-weight: 700; }
        .amount    { font-size: 3.5rem; font-weight: 900; line-height: 1; color: #fff; }
        .period    { font-size: 1rem; opacity: 0.55; }
        .note      { font-size: 0.8rem; opacity: 0.5; margin: 0.3rem 0 1rem; }
        .desc      { font-size: 0.95rem; opacity: 0.7; line-height: 1.6; margin-bottom: 1.25rem; }
        .features  { list-style: none; padding: 0; margin: 0 0 1.5rem; }
        ::slotted(li) {
          padding: 0.45rem 0; font-size: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .cta {
          display: block; width: 100%; text-align: center;
          padding: 0.85rem 1.5rem;
          background: ${ac}; color: #fff;
          text-decoration: none; border-radius: var(--vd-radius,8px);
          font-weight: 700; font-size: 1rem;
          cursor: pointer; border: none; font-family: inherit;
          transition: opacity 0.2s, transform 0.15s; box-sizing: border-box;
        }
        .cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .cta:active { transform: translateY(0); }
      </style>
      <div class="card">
        ${featured ? `<div class="featured-badge">${VDUtils.sanitizeHTML(featLabel)}</div>` : ""}
        <p class="plan-title">${VDUtils.sanitizeHTML(title)}</p>
        <div class="price-row">
          <span class="currency">${VDUtils.sanitizeHTML(currency)}</span>
          <span class="amount">${VDUtils.sanitizeHTML(price)}</span>
          <span class="period">${VDUtils.sanitizeHTML(period)}</span>
        </div>
        ${note ? `<p class="note">${VDUtils.sanitizeHTML(note)}</p>` : ""}
        ${desc ? `<p class="desc">${VDUtils.sanitizeHTML(desc)}</p>`  : ""}
        <ul class="features"><slot></slot></ul>
        <a class="cta" href="${VDUtils.sanitizeHTML(ctaHref)}" target="${VDUtils.sanitizeHTML(ctaTarget)}">
          ${VDUtils.sanitizeHTML(ctaLabel)}
        </a>
      </div>`;

    const cta = this.shadowRoot.querySelector(".cta");
    this._addListener(cta, "click", () => {
      this.dispatchEvent(new CustomEvent("vd-cta-click", {
        bubbles: true, composed: true,
        detail: { element: this, href: ctaHref, label: ctaLabel }
      }));
    });
  }
}

/* =============================================================================
   CUSTOM ELEMENTS REGISTRATION
   ============================================================================= */
customElements.define("vd-radionav",    VDRadioNav);
customElements.define("vd-radiolink",   VDRadioLink);
customElements.define("vd-structure",   VdStructure);
customElements.define("vd-sidepanel",   VdSidepanel);
customElements.define("vd-mainpanel",   VdMainpanel);
customElements.define("vd-colorcard",   VDColorCard);
customElements.define("vd-colorbadge",  VDColorBadge);
customElements.define("vd-like",        VDLike);
customElements.define("vd-dislike",     VDDislike);
customElements.define("vd-bi",          VDBI);
customElements.define("vd-bu",          VDBU);
customElements.define("vd-iu",          VDIU);
customElements.define("vd-right",       VDRight);
customElements.define("vd-left",        VDLeft);
customElements.define("vd-center",      VDCenter);
customElements.define("vd-skewnav",     VDSkewNav);
customElements.define("vd-skewlink",    VDSkewLink);
customElements.define("vd-popnav",      VDPopNav);
customElements.define("vd-poplink",     VDPopLink);
customElements.define("vd-sp",          VdSp);
customElements.define("vd-accordion",   VDAccordion);
customElements.define("vd-table",       VDTable);
customElements.define("vd-tr",          VDTR);
customElements.define("vd-th",          VDTH);
customElements.define("vd-td",          VDTD);
customElements.define("vd-alert",       VdAlert);
customElements.define("vd-confirmation",VdConfirmation);
customElements.define("vd-pill",        UserPill);
customElements.define("vd-spacer",      hspacer);
customElements.define("vd-button",      VdButton);
customElements.define("vd-chip",        VdChip);
customElements.define("vd-hero",        VdHero);
customElements.define("vd-section",     VdSection);
customElements.define("vd-pricingcard", VdPricingCard);


// Debug event listeners (kept for backward compatibility)
document.addEventListener("vd-click",       (e) => console.log("Button clicked:", e.detail));
document.addEventListener("vd-chip-click",  (e) => console.log("Chip clicked:",  e.detail));
document.addEventListener("vd-chip-remove", (e) => console.log("Chip removed:",  e.detail));
document.addEventListener("vd-cta-click",   (e) => console.log("Pricing CTA:",   e.detail));

document.addEventListener("vd-card-click",       (e) => console.log("Card clicked:",      e.detail.element));
document.addEventListener("vd-like-toggle",      (e) => console.log("Like toggled:",      e.detail));
document.addEventListener("vd-dislike-toggle",   (e) => console.log("Dislike toggled:",   e.detail));
document.addEventListener("vd-accordion-toggle", (e) => console.log("Accordion toggled:", e.detail));
