/**
 * VD Framework 4 — vd_framework_macrocomponents.js
 * 15 complex components, all migrated to VDBaseElement.
 *
 * Phase 2+3 changes vs v3:
 *  - All classes extend VDBaseElement
 *  - this.attachShadow() removed from every constructor
 *  - All addEventListener → _addListener() for automatic cleanup
 *  - setInterval → _addInterval(), setTimeout → _addTimeout()
 *  - VdChatbot / VdDalle: removed loadApiKey() + direct OpenAI fetch →
 *      now use VDUtils.openaiRequest() → openai_proxy.php (API key server-side)
 *  - VdCarousel: light DOM (shadowMode = "none")
 *  - VdPlanner: disconnectedCallback calls super.disconnectedCallback()
 *
 * Load order: vd_framework_utils.js → vd_framework_global.js → THIS FILE
 *
 * @version 4.0
 * @author  Vivacity Design — https://www.vivacitydesign.net
 */

/* =============================================================================
   VISUALIZATION
   ============================================================================= */

class VdTimeline extends VDBaseElement {
  static get observedAttributes() { return ["backgroundcolor","shadowcolor","title","width","height","textcolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const bg = this.getAttribute("backgroundcolor") || "#000000";
    const sc = this.getAttribute("shadowcolor")     || "#000000";
    const t  = this.getAttribute("title")           || "";
    const w  = this.getAttribute("width")           || "600px";
    const h  = this.getAttribute("height")          || "auto";
    const tc = this.getAttribute("textcolor")       || "#000000";
    this.shadowRoot.innerHTML = `
      <style>
        .timeline{position:relative;padding:10px;box-shadow:0 4px 10px ${sc};background-color:${bg};
                  display:inline-block;border-radius:12px;width:${w};height:${h};color:${tc};box-sizing:border-box;}
        ::slotted(vd-timeline-item){box-sizing:border-box;display:block;}
      </style>
      <div class="timeline" role="list" aria-label="${VDUtils.sanitizeHTML(t)}"><h2>${VDUtils.sanitizeHTML(t)}</h2><slot></slot></div>`;
  }
}

class VdTimelineItem extends VDBaseElement {
  static get observedAttributes() { return ["date","width","title","backgroundcolor","textcolor"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const date = this.getAttribute("date")            || "";
    const w    = this.getAttribute("width")           || "400px";
    const t    = this.getAttribute("title")           || "";
    const bg   = this.getAttribute("backgroundcolor") || "#ffffff";
    const tc   = this.getAttribute("textcolor")       || "#000000";
    const desc = this.innerHTML.trim();
    this.shadowRoot.innerHTML = `
      <style>
        .timeline-item{margin:20px 10px;background-color:${bg};color:${tc};width:${w};padding:10px;border-radius:5px;
                       box-shadow:0 2px 5px rgba(0,0,0,0.1);position:relative;box-sizing:border-box;}
        .timeline-date{font-weight:bold;}
        .timeline-content{margin-left:20px;}
        .timeline-title{font-weight:bold;font-size:1.2em;margin:5px 0;}
      </style>
      <div class="timeline-item" role="listitem">
        <div class="timeline-date">${VDUtils.sanitizeHTML(date)}</div>
        <div class="timeline-content">
          <div class="timeline-title">${VDUtils.sanitizeHTML(t)}</div>
          <div class="timeline-description">${desc}</div>
        </div>
      </div>`;
  }
}

class VdProgressCircle extends VDBaseElement {
  constructor() {
    super();
    this.svg              = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.circleBackground = document.createElementNS("http://www.w3.org/2000/svg","circle");
    this.circleProgress   = document.createElementNS("http://www.w3.org/2000/svg","circle");
    this.percentText      = document.createElementNS("http://www.w3.org/2000/svg","text");
    this.shadowRoot.appendChild(this.svg);
    this.svg.append(this.circleBackground, this.circleProgress, this.percentText);
  }
  static get observedAttributes() { return ["value","color","width"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const value  = this.getAttribute("value") || 0;
    const color  = this.getAttribute("color") || "var(--vd-primary,#667eea)";
    const w      = parseInt(this.getAttribute("width")) || 120;
    const radius = (w-10)/2, sw = 10, circ = 2*Math.PI*radius, offset = circ-(value/100)*circ;
    this.svg.setAttribute("width",w); this.svg.setAttribute("height",w);
    this.circleBackground.setAttribute("cx",w/2); this.circleBackground.setAttribute("cy",w/2);
    this.circleBackground.setAttribute("r",radius); this.circleBackground.setAttribute("stroke","#e6e6e6");
    this.circleBackground.setAttribute("stroke-width",sw); this.circleBackground.setAttribute("fill","transparent");
    this.circleProgress.setAttribute("cx",w/2); this.circleProgress.setAttribute("cy",w/2);
    this.circleProgress.setAttribute("r",radius); this.circleProgress.setAttribute("stroke",color);
    this.circleProgress.setAttribute("stroke-width",sw); this.circleProgress.setAttribute("fill","transparent");
    this.circleProgress.setAttribute("stroke-dasharray",circ); this.circleProgress.setAttribute("stroke-dashoffset",offset);
    this.circleProgress.setAttribute("transform",`rotate(-90 ${w/2} ${w/2})`);
    this.circleProgress.setAttribute("style","transition:stroke-dashoffset 0.5s ease;");
    this.percentText.setAttribute("x",w/2); this.percentText.setAttribute("y",w/2+4);
    this.percentText.setAttribute("font-size","16"); this.percentText.setAttribute("text-anchor","middle");
    this.percentText.setAttribute("fill",color); this.percentText.textContent = `${value}%`;
    // Phase 3: ARIA progressbar
    this.setAttribute("role",          "progressbar");
    this.setAttribute("aria-valuenow", String(value));
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", "100");
    this.setAttribute("aria-label",    this.getAttribute("label") || `Progress: ${value}%`);
  }
}

class VdCountdown extends VDBaseElement {
  constructor() {
    super();
    this._span  = document.createElement("span");
    this._style = document.createElement("style");
    this.shadowRoot.append(this._style, this._span);
  }
  static get observedAttributes() { return ["backgroundcolor","textcolor","end"]; }
  connectedCallback() {
    // Phase 3: ARIA
    this.setAttribute("role",       "timer");
    this.setAttribute("aria-label", this.getAttribute("label") || "Countdown timer");
    this._updateStyles(); this._startCountdown();
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name==="backgroundcolor"||name==="textcolor") this._updateStyles();
    if (name==="end") this._startCountdown();
  }
  _updateStyles() {
    const bg = this.getAttribute("backgroundcolor")||"white";
    const tc = this.getAttribute("textcolor")||"black";
    this._style.textContent = `span{background-color:${bg};color:${tc};padding:4px 6px;border-radius:4px;}`;
  }
  _startCountdown() {
    const endDate = new Date(this.getAttribute("end")).getTime();
    const tick = () => {
      const left = endDate - new Date().getTime();
      if (left < 0) { this._span.textContent = "Expired!"; return; }
      const d=Math.floor(left/(1000*60*60*24)), h=Math.floor((left%(1000*60*60*24))/(1000*60*60)),
            m=Math.floor((left%(1000*60*60))/(1000*60)), s=Math.floor((left%(1000*60))/1000);
      this._span.textContent = `${d}g ${h}h ${m}m ${s}s`;
    };
    tick();
    this._addInterval(tick, 1000); // v4: auto-cleared on disconnect
  }
}

/* =============================================================================
   CHAT PRIMITIVES
   ============================================================================= */

class VdChatbox extends VDBaseElement {
  constructor() {
    super();
    this._container = document.createElement("div");
    this._styleEl   = document.createElement("style");
    this.shadowRoot.append(this._styleEl, this._container);
  }
  static get observedAttributes() { return ["backgroundcolor","textcolor","shadowcolor","width"]; }
  connectedCallback() {
    // Phase 3: ARIA live region
    this._container.setAttribute("role",      "log");
    this._container.setAttribute("aria-live", "polite");
    this._container.setAttribute("aria-label","Chat messages");
    this._updateStyles(); this._renderLines();
  }
  attributeChangedCallback() { if (this.isConnected) this._updateStyles(); }
  _updateStyles() {
    const bg = this.getAttribute("backgroundcolor")||"white";
    const tc = this.getAttribute("textcolor")||"black";
    const sc = this.getAttribute("shadowcolor")||"rgba(0,0,0,0.1)";
    const w  = (this.getAttribute("width")||"300")+"px";
    this._styleEl.textContent = `div{background-color:${bg};color:${tc};width:${w};padding:10px;box-shadow:0 4px 10px ${sc};border-radius:4px;}`;
  }
  _renderLines() {
    Array.from(this.childNodes)
      .filter((n) => n.nodeType===Node.ELEMENT_NODE && n.tagName.toLowerCase()==="vd-chatline")
      .forEach((line) => this._container.appendChild(line));
  }
}

class VdChatline extends VDBaseElement {
  constructor() {
    super();
    this._lineEl  = document.createElement("div");
    this._styleEl = document.createElement("style");
    this.shadowRoot.append(this._styleEl, this._lineEl);
  }
  static get observedAttributes() { return ["user","backgroundcolor","textcolor"]; }
  connectedCallback() {
    this._updateStyles();
    this._lineEl.innerHTML = `<b>${VDUtils.sanitizeHTML(this.getAttribute("user")||"")}</b>: ${this.textContent}`;
  }
  attributeChangedCallback() { if (this.isConnected) this._updateStyles(); }
  _updateStyles() {
    const bg = this.getAttribute("backgroundcolor")||"white";
    const tc = this.getAttribute("textcolor")||"black";
    this._styleEl.textContent = `div{background-color:${bg};color:${tc};padding:6px;border-radius:4px;margin:4px 0;}`;
  }
}

/* =============================================================================
   CAROUSEL  — light DOM
   ============================================================================= */

class VdCarousel extends VDBaseElement {
  static get shadowMode() { return "none"; }
  connectedCallback() {
    this._images     = Array.from(this.children);
    this._currentIdx = 0;
    this._speed      = parseInt(this.getAttribute("speed"))  || 300;
    this._direction  = this.getAttribute("direction")        || "left";
    // Phase 3: ARIA carousel
    this.setAttribute("role",                "region");
    this.setAttribute("aria-roledescription","carousel");
    this.setAttribute("aria-label",          this.getAttribute("label") || "Image carousel");
    Object.assign(this.style, {
      display:"block", overflow:"hidden", position:"relative",
      width:           this.getAttribute("width")           || "300px",
      height:          this.getAttribute("height")          || "200px",
      border:          this.getAttribute("border")==="true" ? "2px solid #000" : "none",
      backgroundColor: this.getAttribute("backgroundcolor") || "transparent"
    });
    this._images.forEach((img, i) => {
      Object.assign(img.style, {width:"100%",height:"100%",objectFit:"cover",position:"absolute",
        transition:`transform ${this._speed}ms ease-in-out`});
      img.style.transform = i===0 ? "translateX(0)" : (this._direction==="left" ? "translateX(100%)" : "translateX(-100%)");
    });
    this._startCarousel();
    if (this.getAttribute("stoponhover")==="true") {
      this._addListener(this, "mouseover", () => this._stopCarousel());
      this._addListener(this, "mouseout",  () => this._startCarousel());
    }
  }
  _startCarousel() { this._addInterval(() => this._nextImage(), this._speed+2000); }
  _stopCarousel()  { this._intervals.forEach((id) => clearInterval(id)); this._intervals=[]; }
  _nextImage() {
    this._images[this._currentIdx].style.transform = this._direction==="left" ? "translateX(-100%)" : "translateX(100%)";
    this._currentIdx = (this._currentIdx+1)%this._images.length;
    this._images[this._currentIdx].style.transform = "translateX(0)";
  }
}

/* =============================================================================
   INPUT BOX
   ============================================================================= */

class VdInputBox extends VDBaseElement {
  static get observedAttributes() { return ["width","placeholder","rows","verifyenter"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const w    = this.getAttribute("width")       || "100%";
    const ph   = this.getAttribute("placeholder") || "Enter message...";
    const rows = this.getAttribute("rows")        || "1";
    const ve   = this.getAttribute("verifyenter") === "true";
    this.shadowRoot.innerHTML = `
      <style>*{margin:0;padding:0;box-sizing:border-box;}
        textarea{width:${w};resize:vertical;font-family:Arial,sans-serif;padding:10px;border:1px solid #ccc;border-radius:4px;}
      </style>
      <textarea rows="${rows}" placeholder="${ph}" id="inputfield"></textarea>`;
    this._input = this.shadowRoot.querySelector("#inputfield");
    // Phase 3: ARIA
    this._input.setAttribute("aria-label", ph);
    if (ve) {
      this._addListener(this._input, "keydown", (e) => {
        if (e.key==="Enter" && !e.shiftKey) {
          e.preventDefault();
          this.dispatchEvent(new CustomEvent("verifypress",{detail:this.value}));
        }
      });
    }
  }
  get value() { return this._input ? this._input.value : ""; }
  set value(v) { if (this._input) this._input.value = v; }
}

/* =============================================================================
   CHATBOT  — v4: uses openai_proxy.php (no key.ini)
   ============================================================================= */

class VdChatbot extends VDBaseElement {
  constructor() {
    super();
    this.chatMemory          = [];
    this.typingIndicatorFlag = false;
    this._typingElement      = null;
    this._inputBox           = null;
  }
  connectedCallback() {
    this.typingIndicatorFlag = this.getAttribute("typingindicator")==="true";
    this.render();
    this.chatMemory.push({role:"system",
      content:"You are a full stack developer working for a Web Agency. You are helpful, creative, and always provide detailed explanations."});
    this._bindInput();
  }
  render() {
    const name      = this.getAttribute("name")             || "Chatbot";
    const bgcolor   = this.getAttribute("bgcolor")          || "black";
    const chatcolor = this.getAttribute("chatcolor")        || "#f9f9f9";
    const color     = this.getAttribute("color")            || "white";
    const rows      = this.getAttribute("input-rows")       || "5";
    const ph        = this.getAttribute("input-placeholder")|| "Scrivi il tuo messaggio qui...";
    this.shadowRoot.innerHTML = `
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        .chatbot-container{max-width:800px;margin:0 auto;font-family:Arial,sans-serif;}
        .chathistory{height:600px;width:100%;overflow-y:auto;border:1px solid #ccc;padding:15px;margin:10px 0;background-color:${chatcolor};border-radius:8px;}
        .user-message{background-color:#e3f2fd;padding:10px;margin:5px 0;border-radius:8px;border-left:4px solid #2196f3;}
        .chatgpt-message{background-color:#f1f8e9;padding:10px;margin:5px 0;border-radius:8px;border-left:4px solid #4caf50;position:relative;}
        .copy-btn{background:#4caf50;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;float:right;font-size:12px;}
        .copy-btn:hover{background:#45a049;}
        #typing-indicator{font-style:italic;color:#666;margin:10px 0;}
        h3{text-align:center;color:${color};background:${bgcolor};padding:.5rem;border-radius:8px;}
      </style>
      <div class="chatbot-container">
        <h3>${VDUtils.sanitizeHTML(name)}</h3>
        <div class="chathistory" id="chatContainer" role="log" aria-live="polite" aria-label="Chat history"></div>
        <vd-inputbox placeholder="${ph}" rows="${rows}" verifyenter="true" style="width:100%;"></vd-inputbox>
      </div>`;
    this._hasEventListener = false;
    this._bindInput();
  }
  _bindInput() {
    const ib = this.shadowRoot.querySelector("vd-inputbox");
    if (ib && !this._hasEventListener) {
      this._addListener(ib, "verifypress", (e) => this.sendMessage(e.detail));
      this._hasEventListener = true;
    }
    this._inputBox = ib;
  }
  _showMessage(sender, message) {
    const container = this.shadowRoot.querySelector("#chatContainer");
    const name      = this.getAttribute("name")||"Chatbot";
    const msgDiv    = document.createElement("div");
    if (sender==="Guest") {
      msgDiv.className="user-message"; msgDiv.innerText=`Tu: ${message}`;
    } else if (sender==="GPT") {
      msgDiv.className="chatgpt-message"; msgDiv.innerText=`${name}: ${message}`;
      const btn=document.createElement("button"); btn.innerText="Copy"; btn.className="copy-btn";
      this._addListener(btn,"click",()=>navigator.clipboard.writeText(message).then(()=>{btn.innerText="Copied!";this._addTimeout(()=>btn.innerText="Copy",2000);}));
      msgDiv.appendChild(btn);
    } else {
      msgDiv.className="chatgpt-message"; msgDiv.innerText=`System: ${message}`;
    }
    container.appendChild(msgDiv);
    this.shadowRoot.querySelector(".chathistory").scrollTop=9999;
  }
  _showTypingIndicator() {
    if (!this._typingElement && this.typingIndicatorFlag) {
      this._typingElement=document.createElement("p");
      this._typingElement.id="typing-indicator"; this._typingElement.innerText="AI sta scrivendo...";
      this.shadowRoot.querySelector(".chathistory").appendChild(this._typingElement);
    }
  }
  _removeTypingIndicator() { if(this._typingElement){this._typingElement.remove();this._typingElement=null;} }
  async sendMessage(userInput) {
    if (!userInput.trim()) return;
    if (this._inputBox) this._inputBox.value="";
    this._showMessage("Guest", userInput);
    if (this.typingIndicatorFlag) this._showTypingIndicator();
    try {
      const proxyUrl = this.getAttribute("proxy")||"openai_proxy.php";
      const data = await VDUtils.openaiRequest({
        type:"chat", model:this.getAttribute("model")||"gpt-4o-mini",
        messages:[...this.chatMemory,{role:"user",content:userInput}]
      }, proxyUrl);
      let text=data.choices[0].message.content.trim();
      text=text.replace(/(html|css|script|php|python)?[\s\S]*?/g,"");
      text=text.replace(/###[\s\S]*?###/g,"");
      text=text.replace(/\*{3}[\s\S]*?\*{3}/g,"");
      this._showMessage("GPT",text);
      this.chatMemory.push({role:"user",content:userInput});
      this.chatMemory.push({role:"assistant",content:text});
      if(this.chatMemory.length>20) this.chatMemory=[this.chatMemory[0],...this.chatMemory.slice(-19)];
    } catch(e) {
      this._showMessage("System",e.message);
    } finally {
      this._removeTypingIndicator();
    }
  }
}

/* =============================================================================
   DALL-E  — v4: uses openai_proxy.php (no key.ini)
   ============================================================================= */

class VdDalle extends VDBaseElement {
  constructor() {
    super();
    this._chatContainer = null;
    this._typingEl      = null;
  }
  static get observedAttributes() {
    return ["model","imagesize","imagenumber","download","name","typingindicator","input-rows","bgcolor","color","input-placeholder","proxy"];
  }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  connectedCallback() { this.render(); this._addTimeout(()=>this._bindInput(),0); }
  render() {
    const name    = this.getAttribute("name")             || "DALL·E Generator";
    const bgColor = this.getAttribute("bgcolor")          || "#aaa";
    const color   = this.getAttribute("color")            || "black";
    const ph      = this.getAttribute("input-placeholder")|| "Scrivi il prompt qui...";
    const rows    = this.getAttribute("input-rows")       || "5";
    this.shadowRoot.innerHTML = `
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        .dalle-container{max-width:800px;margin:0 auto;font-family:Arial,sans-serif;}
        h3{text-align:center;color:${color};background:${bgColor};padding:0.5rem;border-radius:8px;}
        .chathistory{height:600px;overflow-y:auto;border:1px solid #ccc;padding:15px;background:#f9f9f9;border-radius:8px;margin-top:10px;}
        .user-message{background:#e3f2fd;padding:10px;margin:5px 0;border-radius:8px;border-left:4px solid #2196f3;}
        .chatgpt-message{background:#f1f8e9;padding:10px;margin:5px 0;border-radius:8px;border-left:4px solid #4caf50;}
        .generated-img{max-width:100%;height:auto;margin-top:10px;}
        .download-link{display:block;margin-top:10px;}
        #typing-indicator{font-style:italic;color:#666;margin:10px 0;}
        .input-container{margin-top:10px;}
      </style>
      <div class="dalle-container">
        <h3>${VDUtils.sanitizeHTML(name)}</h3>
        <div class="chathistory" id="chatContainer" role="log" aria-live="polite" aria-label="Image generation history"></div>
        <div class="input-container">
          <vd-inputbox placeholder="${ph}" rows="${rows}" verifyenter="true"></vd-inputbox>
        </div>
      </div>`;
    this._chatContainer=this.shadowRoot.querySelector("#chatContainer");
    this._hasEvent=false;
    this._addTimeout(()=>this._bindInput(),0);
  }
  _bindInput() {
    const ib=this.shadowRoot.querySelector("vd-inputbox");
    if(ib&&!this._hasEvent){this._addListener(ib,"verifypress",(e)=>this.generateImage(e.detail));this._hasEvent=true;}
  }
  _showMessage(sender,message,isImage=false,imageUrl=null,download=false) {
    const div=document.createElement("div");
    if(sender==="Guest"){div.className="user-message";div.innerText=`Tu: ${message}`;}
    else if(sender==="DALL·E"){
      div.className="chatgpt-message";
      if(isImage&&imageUrl){
        const img=document.createElement("img");img.src=imageUrl;img.className="generated-img";img.alt="Generated";div.appendChild(img);
        if(download){const a=document.createElement("a");a.href=imageUrl;a.target="_blank";a.innerText="Download Image";a.className="download-link";div.appendChild(a);}
      }else{div.innerText="DALL·E: "+message;}
    }else{div.className="chatgpt-message";div.innerText="Sistema: "+message;div.style.backgroundColor="#ffebee";div.style.borderLeftColor="#f44336";}
    this._chatContainer.appendChild(div);
    this._chatContainer.scrollTop=this._chatContainer.scrollHeight;
  }
  _showTypingIndicator(){
    if(!this._typingEl&&this.getAttribute("typingindicator")==="true"){
      this._typingEl=document.createElement("p");this._typingEl.id="typing-indicator";this._typingEl.innerText="Generando immagine...";
      this._chatContainer.appendChild(this._typingEl);this._chatContainer.scrollTop=this._chatContainer.scrollHeight;
    }
  }
  _removeTypingIndicator(){if(this._typingEl){this._typingEl.remove();this._typingEl=null;}}
  async generateImage(prompt) {
    if(!prompt||!prompt.trim()){this._showMessage("System","Inserisci un prompt per generare l'immagine");return;}
    const model=this.getAttribute("model")||"dall-e-3";
    const proxyUrl=this.getAttribute("proxy")||"openai_proxy.php";
    let size=this.getAttribute("imagesize");
    const n=Math.min(parseInt(this.getAttribute("imagenumber"))||1,4);
    const dl=this.getAttribute("download")==="true";
    if(model==="dall-e-2"&&!["256x256","512x512","1024x1024"].includes(size))size="512x512";
    else if(!["1024x1024","1024x1792","1792x1024"].includes(size))size="1024x1024";
    this._showMessage("Guest",prompt);this._showTypingIndicator();
    const ib=this.shadowRoot.querySelector("vd-inputbox");if(ib)ib.value="";
    try {
      const data=await VDUtils.openaiRequest({type:"image",model,prompt,n,size},proxyUrl);
      if(data.data&&data.data.length>0)data.data.forEach((img)=>this._showMessage("DALL·E","",true,img.url,dl));
      else throw new Error((data.error&&data.error.message)||"Errore API");
    }catch(e){this._showMessage("System",e.message);}
    finally{this._removeTypingIndicator();}
  }
}

/* =============================================================================
   PLANNER
   ============================================================================= */

class VdPlanner extends VDBaseElement {
  constructor() {
    super();
    this.currentDate=new Date(); this.selectedDateKey="";
    this.editingTaskIndex=null; this.allTasks={}; this.holidays={};
  }
  static get observedAttributes() { return ["year","today"]; }
  attributeChangedCallback(name,oldValue,newValue) {
    if(name==="today"){
      this.currentDate=this.hasAttribute("today")?new Date():(this.hasAttribute("year")?new Date(parseInt(this.getAttribute("year")),0,1):new Date());
      this.calculateHolidays(); if(this.shadowRoot.innerHTML)this.refreshAll();
    }else if(name==="year"&&newValue&&!isNaN(newValue)&&!this.hasAttribute("today")){
      this.currentDate=new Date(parseInt(newValue),0,1); this.calculateHolidays(); if(this.shadowRoot.innerHTML)this.refreshAll();
    }
  }
  connectedCallback() {
    this.render();
    if(this.hasAttribute("today"))this.currentDate=new Date();
    else if(this.hasAttribute("year")){const y=this.getAttribute("year");if(y&&!isNaN(y))this.currentDate=new Date(parseInt(y),0,1);}
    this.calculateHolidays(); this._setupEventListeners(); this.refreshAllWithBackend();
    this._addInterval(()=>this.refreshAllWithBackend(),5000); // v4: auto-cleared on disconnect
  }
  disconnectedCallback() { super.disconnectedCallback(); }
  calculateHolidays() {
    const year=this.currentDate.getFullYear(); this.holidays={};
    const easter=this.getEaster(year);
    this.holidays[`${year}-${String(easter.month).padStart(2,"0")}-${String(easter.day).padStart(2,"0")}`]="Easter";
    [{month:1,day:1,name:"New Year Day"},{month:2,day:14,name:"Valentine Day"},{month:4,day:25,name:"Liberation (IT)"},
     {month:5,day:1,name:"Workers Day"},{month:6,day:2,name:"Republic Day (IT)"},{month:7,day:4,name:"Independence Day (USA)"},
     {month:8,day:15,name:"Midsummer"},{month:10,day:31,name:"Halloween"},{month:11,day:1,name:"All Hallows Day"},
     {month:11,day:2,name:"Day of the Dead"},{month:12,day:24,name:"Christmas Eve"},{month:12,day:25,name:"Christmas Day"},
     {month:12,day:26,name:"St. Stephen Day"},{month:12,day:31,name:"New Year Eve"}]
    .forEach((h)=>{this.holidays[`${year}-${String(h.month).padStart(2,"0")}-${String(h.day).padStart(2,"0")}`]=h.name;});
  }
  getEaster(y){
    let f=Math.floor,a=y%19,b=f(y/100),c=y%100,d=f(b/4),e=b%4,g=f((8*b+13)/25),
        h=(19*a+b-d-g+15)%30,i=f(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,
        m=f((a+11*h+22*l)/451),month=f((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
    return {month,day};
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;font-family:Arial,sans-serif;color:#333;background:#f0f2f5;padding:1rem;}
        .calendar-container{max-width:1000px;margin:0 auto 2rem auto;background:white;padding:1rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
        .calendar-header{display:flex;justify-content:space-between;align-items:center;}
        .calendar-header button{background:#4A90E2;border:none;color:white;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;margin:0 0.25rem;}
        table.calendar{width:100%;border-collapse:collapse;margin-top:1rem;}
        .calendar th,.calendar td{border:1px solid #ddd;width:14.2%;height:100px;vertical-align:top;position:relative;padding:0.25rem;transition:background 0.3s;}
        .calendar th{background:#fafafa;}
        .day-number{font-weight:bold;}
        .add-task{display:block;text-align:right;margin-top:-1.5rem;}
        .add-task button{background:#4A90E2;border:none;color:white;padding:0.25rem 0.5rem;border-radius:50%;cursor:pointer;font-size:0.8rem;transition:background 0.3s;}
        .add-task button:hover{background:#357ABD;}
        .task-list{margin-top:0.25rem;font-size:0.8rem;}
        .task-item{background:#e8f0fe;border-radius:4px;padding:0.2rem 0.4rem;margin:0.1rem 0;cursor:pointer;font-size:0.75rem;}
        .has-tasks{background-color:#d63384!important;color:white;}
        .holiday-badge{margin-top:2px;font-size:0.6rem;background:black;color:white;display:inline-block;padding:4px;border-radius:4px;}
        .task-time{display:inline-block;font-weight:bold;color:#4A90E2;margin-right:0.3rem;}
        .modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);justify-content:center;align-items:center;z-index:1000;}
        .modal-content{background:white;padding:1rem;border-radius:8px;max-width:400px;width:90%;}
        .modal-content input{width:calc(100% - 1rem);padding:0.5rem;margin:0.5rem 0;border:1px solid #ddd;border-radius:4px;}
        .input-group{display:flex;gap:0.5rem;align-items:center;}
        .input-group input[type="time"]{flex:0 0 120px;} .input-group input[type="text"]{flex:1;}
        .modal-actions{margin-top:1rem;text-align:right;}
        .modal-actions button{margin-left:0.5rem;padding:0.5rem 1rem;border:none;border-radius:4px;cursor:pointer;}
        .btn-save{background:#4A90E2;color:white;} .btn-delete{background:#e74c3c;color:white;} .btn-cancel{background:#bdc3c7;color:white;}
        .all-tasks-container{max-width:1000px;margin:0 auto;background:white;padding:1rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
        table.all-tasks{width:100%;border-collapse:collapse;}
        .all-tasks th,.all-tasks td{border:1px solid #ddd;padding:0.5rem;text-align:left;}
        .all-tasks th{background:#fafafa;}
        @media(max-width:600px){.calendar-container{padding:1rem .25rem;}.add-task button{padding:0.25rem;font-size:0.6rem;}.task-item{font-size:0.6rem;}}
      </style>
      <div class="calendar-container">
        <div class="calendar-header">
          <button id="prevMonth">◀ Prev</button>
          <h2 id="monthYear"></h2>
          <button id="nextMonth">Next ▶</button>
        </div>
        <table class="calendar"><thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead>
        <tbody id="calendarBody"></tbody></table>
      </div>
      <div class="all-tasks-container">
        <h2>📋 All Tasks</h2>
        <table class="all-tasks"><thead><tr><th>Date</th><th>Task</th></tr></thead><tbody id="allTasksBody"></tbody></table>
      </div>
      <div class="modal" id="taskModal">
        <div class="modal-content">
          <h3 id="modalTitle">Tasks</h3>
          <div id="taskList"></div>
          <div class="input-group">
            <input type="time" id="taskTimeInput">
            <input type="text" id="newTaskInput" placeholder="Task description (max 30 chars)..." maxlength="30">
          </div>
          <small style="color:#666;margin-bottom:0.5rem;display:block;">💡 Time is optional</small>
          <div class="modal-actions">
            <button class="btn-save" id="saveTaskBtn">Save</button>
            <button class="btn-delete" id="deleteTaskBtn">Delete</button>
            <button class="btn-cancel" id="cancelBtn">Cancel</button>
          </div>
        </div>
      </div>`;
  }
  _setupEventListeners(){
    const sr=this.shadowRoot;
    this._addListener(sr.getElementById("prevMonth"),"click",()=>{this.currentDate.setMonth(this.currentDate.getMonth()-1);this.loadCalendar(this.currentDate);});
    this._addListener(sr.getElementById("nextMonth"),"click",()=>{this.currentDate.setMonth(this.currentDate.getMonth()+1);this.loadCalendar(this.currentDate);});
    this._addListener(sr.getElementById("saveTaskBtn"),"click",()=>this.saveTask());
    this._addListener(sr.getElementById("deleteTaskBtn"),"click",()=>this.deleteTask());
    this._addListener(sr.getElementById("cancelBtn"),"click",()=>this.closeModal());
    this._addListener(document,"keydown",(e)=>{if(e.key==="Escape"&&sr.getElementById("taskModal").style.display==="flex")this.closeModal();});
  }
  async fetchTasks(){try{const res=await fetch("calendar-backend.php?action=load",{cache:"no-store"});this.allTasks=await res.json();}catch(e){console.error("Error fetching tasks:",e);this.allTasks={};}}
  loadCalendar(date){
    const year=date.getFullYear(),month=date.getMonth(),firstDay=new Date(year,month,1),lastDay=new Date(year,month+1,0);
    const startDay=firstDay.getDay(),totalDays=lastDay.getDate(),sr=this.shadowRoot;
    sr.getElementById("monthYear").textContent=date.toLocaleString("default",{month:"long",year:"numeric"});
    const calBody=sr.getElementById("calendarBody");calBody.innerHTML="";
    let day=1;
    for(let i=0;i<6;i++){
      const row=document.createElement("tr");
      for(let j=0;j<7;j++){
        const cell=document.createElement("td");
        if((i===0&&j<startDay)||day>totalDays){cell.innerHTML="";}
        else{
          const dateKey=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          cell.innerHTML=`<div class="day-number">${day}</div><div class="add-task"><button class="add-btn" data-date="${dateKey}">+</button></div><div class="task-list" id="tasks-${dateKey}"></div>`;
          if(this.holidays[dateKey])cell.innerHTML+=`<div class="holiday-badge">${this.holidays[dateKey]}</div>`;
          if(this.allTasks[dateKey]&&this.allTasks[dateKey].length>0)cell.classList.add("has-tasks");
          this.renderTasks(dateKey,cell);
          this._addListener(cell.querySelector(".add-btn"),"click",(e)=>{e.stopPropagation();this.openModal(dateKey);});
          this._addListener(cell.querySelector(".task-list"),"click",(e)=>{const ti=e.target.closest(".task-item");if(ti){e.stopPropagation();this.openModal(dateKey,parseInt(ti.dataset.originalIndex));}});
          day++;
        }
        row.appendChild(cell);
      }
      calBody.appendChild(row);
      if(day>totalDays)break;
    }
  }
  renderTasks(dateKey,cell){
    const tasks=this.allTasks[dateKey]||[];
    const container=cell.querySelector(`#tasks-${dateKey}`);if(!container)return;
    container.innerHTML="";
    tasks.map((t,i)=>({task:t,index:i}))
      .sort((a,b)=>{const ta=this.extractTime(a.task),tb=this.extractTime(b.task);if(!ta&&!tb)return 0;if(!ta)return 1;if(!tb)return-1;return ta.localeCompare(tb);})
      .forEach(({task,index})=>{
        const div=document.createElement("div");div.className="task-item";
        const{time,description}=this.parseTask(task);
        div.innerHTML=time?`<span class="task-time">${time}</span><span>${description}</span>`:`<span>${description}</span>`;
        div.dataset.originalIndex=index;container.appendChild(div);
      });
  }
  parseTask(t){const m=t.match(/^(\d{1,2}:\d{2})\s*[-:]?\s*(.*)$/);return m?{time:m[1],description:m[2]||"Task"}:{time:null,description:t};}
  extractTime(t){return this.parseTask(t).time;}
  formatTaskWithTime(time,desc){return time&&time.trim()?`${time} - ${desc}`:desc;}
  openModal(dateKey,taskIndex=null){
    this.selectedDateKey=dateKey;this.editingTaskIndex=taskIndex;
    const sr=this.shadowRoot;
    sr.getElementById("modalTitle").textContent="Tasks on "+dateKey;
    sr.getElementById("taskTimeInput").value="";sr.getElementById("newTaskInput").value="";
    const taskListDiv=sr.getElementById("taskList");taskListDiv.innerHTML="";
    const tasks=this.allTasks[dateKey]||[];
    tasks.forEach((task,i)=>{
      const d=document.createElement("div");const{time,description}=this.parseTask(task);
      d.innerHTML=time?`<span class="task-time">${time}</span><span>${description}</span>`:`<span>${description}</span>`;
      d.className="task-item";
      this._addListener(d,"click",()=>{this.editingTaskIndex=i;const{time:t2,description:desc2}=this.parseTask(tasks[i]);sr.getElementById("taskTimeInput").value=t2||"";sr.getElementById("newTaskInput").value=desc2;});
      taskListDiv.appendChild(d);
    });
    if(taskIndex!==null&&tasks[taskIndex]){const{time,description}=this.parseTask(tasks[taskIndex]);sr.getElementById("taskTimeInput").value=time||"";sr.getElementById("newTaskInput").value=description;}
    sr.getElementById("taskModal").style.display="flex";
    sr.getElementById("newTaskInput").focus();
  }
  closeModal(){this.shadowRoot.getElementById("taskModal").style.display="none";this.editingTaskIndex=null;this.shadowRoot.getElementById("taskTimeInput").value="";this.shadowRoot.getElementById("newTaskInput").value="";}
  async saveTask(){
    const taskText=this.shadowRoot.getElementById("newTaskInput").value.trim();
    const taskTime=this.shadowRoot.getElementById("taskTimeInput").value.trim();
    if(!taskText)return;
    const fullTask=this.formatTaskWithTime(taskTime,taskText);
    const action=this.editingTaskIndex!==null?"edit":"add";
    const fd=new FormData();
    fd.append("action",action);fd.append("date",this.selectedDateKey);fd.append("task",fullTask);
    if(this.editingTaskIndex!==null)fd.append("index",this.editingTaskIndex);
    try{await fetch("calendar-backend.php",{method:"POST",body:fd,cache:"no-store"});await this.refreshAll();this.closeModal();}
    catch(e){console.error("Error saving task:",e);}
  }
  async deleteTask(){
    if(this.editingTaskIndex!==null){
      const fd=new FormData();fd.append("action","delete");fd.append("date",this.selectedDateKey);fd.append("index",this.editingTaskIndex);
      try{await fetch("calendar-backend.php",{method:"POST",body:fd,cache:"no-store"});await this.refreshAll();this.closeModal();}
      catch(e){console.error("Error deleting task:",e);}
    }
  }
  renderAllTasksTable(){
    const body=this.shadowRoot.getElementById("allTasksBody");body.innerHTML="";
    Object.keys(this.allTasks).sort().forEach((date)=>{
      this.allTasks[date].slice().sort((a,b)=>{const ta=this.extractTime(a),tb=this.extractTime(b);if(!ta&&!tb)return 0;if(!ta)return 1;if(!tb)return-1;return ta.localeCompare(tb);})
      .forEach((task)=>{
        const row=document.createElement("tr");
        const td1=document.createElement("td");td1.textContent=date;
        const td2=document.createElement("td");const{time,description}=this.parseTask(task);
        td2.innerHTML=time?`<span class="task-time">${time}</span> ${description}`:description;
        row.appendChild(td1);row.appendChild(td2);body.appendChild(row);
      });
    });
  }
  refreshAll(){this.loadCalendar(this.currentDate);this.renderAllTasksTable();}
  async refreshAllWithBackend(){await this.fetchTasks();this.refreshAll();}
}

/* =============================================================================
   MEDIA
   ============================================================================= */

class MusicTag extends VDBaseElement {
  static get observedAttributes(){return["file","title","backgroundcolor","textcolor","bordercolor"];}
  connectedCallback(){this.render();}
  attributeChangedCallback(){if(this.isConnected)this.render();}
  render(){
    const file=this.getAttribute("file");
    const title=this.getAttribute("title")||"Brano";
    const bg=this.getAttribute("backgroundcolor")||"#222";
    const text=this.getAttribute("textcolor")||"#fff";
    const border=this.getAttribute("bordercolor")||"#555";
    if(!file){this.shadowRoot.innerHTML="<p style='color:red'>Errore: attributo file mancante</p>";return;}
    if(!/\.(mp3|ogg|wav)$/i.test(file)){this.shadowRoot.innerHTML="<p style='color:red'>Formato non supportato</p>";return;}
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:inline-block;background:${bg};color:${text};border:2px solid ${border};border-radius:10px;
              padding:15px;font-family:Arial,sans-serif;box-shadow:0 4px 10px rgba(0,0,0,0.3);width:320px;}
        h4{text-align:center;margin:4px;font-size:16px;}
        .controls{display:flex;justify-content:center;align-items:center;gap:10px;}
        button{background:${text};color:${bg};border:none;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;transition:all 0.3s;}
        button:hover{transform:scale(1.05);}
        input[type="range"]{flex:1;cursor:pointer;accent-color:${text};}
        .time{font-size:12px;min-width:45px;text-align:right;}
      </style>
      <h4>${VDUtils.sanitizeHTML(title)}</h4>
      <audio id="audio" src="${file}"></audio>
      <div class="controls">
        <button id="play">▶</button>
        <input id="seek" type="range" min="0" max="100" value="0">
        <div class="time" id="time">0:00</div>
      </div>`;
    const audio=this.shadowRoot.querySelector("#audio");
    const playBtn=this.shadowRoot.querySelector("#play");
    const seek=this.shadowRoot.querySelector("#seek");
    const timeLabel=this.shadowRoot.querySelector("#time");
    const fmt=(sec)=>{const m=Math.floor(sec/60),s=Math.floor(sec%60).toString().padStart(2,"0");return`${m}:${s}`;};
    this._addListener(playBtn,"click",()=>{if(audio.paused){audio.play();playBtn.textContent="⏸";}else{audio.pause();playBtn.textContent="▶";}});
    this._addListener(audio,"timeupdate",()=>{if(audio.duration){seek.value=(audio.currentTime/audio.duration)*100;timeLabel.textContent=fmt(audio.currentTime);}});
    this._addListener(seek,"input",()=>{audio.currentTime=(seek.value/100)*audio.duration;});
  }
}

class VideoTag extends VDBaseElement {
  static get observedAttributes(){return["file","title","backgroundcolor","textcolor","bordercolor","fullscreen"];}
  connectedCallback(){this.render();}
  attributeChangedCallback(name,oldValue,newValue){
    if(name==="fullscreen"){
      if(newValue==="true"&&this.isConnected)this.enterFullscreen();
      return;
    }
    if(this.isConnected)this.render();
  }
  render(){
    const file   = this.getAttribute("file");
    const title  = this.getAttribute("title")||"Video";
    const bg     = this.getAttribute("backgroundcolor")||"#000";
    const text   = this.getAttribute("textcolor")||"#fff";
    const border = this.getAttribute("bordercolor")||"#444";
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:block;max-width:480px;background:${bg};color:${text};border:2px solid ${border};border-radius:10px;padding:10px;font-family:sans-serif;}
        video{width:100%;border-radius:8px;background:#000;}
        .controls{display:flex;justify-content:center;gap:10px;align-items:center;margin-top:8px;}
        button{background:${text};color:${bg};border:none;border-radius:4px;padding:6px 10px;cursor:pointer;font-size:0.9rem;}
        button:hover{opacity:0.8;}
        input[type="range"]{flex:1;}
      </style>
      <h4>${VDUtils.sanitizeHTML(title)}</h4>
      <video id="vid" src="${file}" aria-label="${VDUtils.sanitizeHTML(title)}"></video>
      <div class="controls">
        <button id="play" aria-label="Play/Pause">&#9654;</button>
        <input id="seek" type="range" min="0" max="100" value="0" aria-label="Seek">
        <button id="fs" aria-label="Fullscreen" title="Fullscreen">&#x26F6;</button>
      </div>`;
    const video  = this.shadowRoot.querySelector("#vid");
    const playBtn= this.shadowRoot.querySelector("#play");
    const seek   = this.shadowRoot.querySelector("#seek");
    const fsBtn  = this.shadowRoot.querySelector("#fs");
    this._addListener(playBtn,"click",()=>{
      if(video.paused){video.play();playBtn.innerHTML="&#9646;&#9646;";}
      else{video.pause();playBtn.innerHTML="&#9654;";}
    });
    this._addListener(video,"timeupdate",()=>{seek.value=(video.currentTime/video.duration)*100||0;});
    this._addListener(seek,"input",()=>{video.currentTime=(seek.value/100)*video.duration;});
    this._addListener(video,"ended",()=>{playBtn.innerHTML="&#9654;";seek.value=0;});
    this._addListener(fsBtn,"click",()=>this.enterFullscreen());
  }
  /** Programmatically request fullscreen on the video element.
   *  Can also be triggered by setting the `fullscreen` attribute to "true". */
  enterFullscreen(){
    const video=this.shadowRoot&&this.shadowRoot.querySelector("#vid");
    if(!video)return;
    const req=video.requestFullscreen||video.webkitRequestFullscreen||video.mozRequestFullScreen||video.msRequestFullscreen;
    if(req){
      req.call(video).catch(()=>{});
      this.dispatchEvent(new CustomEvent("vd-fullscreen",{
        bubbles:true,composed:true,detail:{element:this}
      }));
    }
    // Reset attribute so it can be triggered again later
    if(this.getAttribute("fullscreen")==="true")
      setTimeout(()=>this.removeAttribute("fullscreen"),100);
  }
}

/* =============================================================================
   TABS
   ============================================================================= */

class VdTabControl extends VDBaseElement {
  static get observedAttributes(){return["width","backgroundcolor","textcolor","shadowcolor"];}
  connectedCallback(){this.render();}
  attributeChangedCallback(name,oldValue,newValue){
    if(!this.isConnected)return;
    if(name==="width")this.style.width=newValue;
    if(name==="backgroundcolor")this.style.backgroundColor=newValue;
    if(name==="textcolor")this.style.color=newValue;
    if(name==="shadowcolor")this.style.boxShadow=`0 4px 10px ${newValue}`;
  }
  render(){
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:block;border-radius:12px;height:auto;padding:8px;}
        .tabs{display:flex;border-bottom:2px solid var(--vd-border,lightgray);}
        ::slotted(vd-tab){flex:1;padding:10px;cursor:pointer;text-align:center;transition:background-color 0.3s;}
        ::slotted(vd-tab:hover){background-color:rgba(255,255,255,0.1);}
      </style>
      <div class="tabs" role="tablist" aria-label="Tabs"><slot></slot></div>
      <div class="content"><div class="inner-content" style="padding:10px;"></div></div>`;
    this._setTabListeners();
  }
  _setTabListeners(){
    const tabs=this.querySelectorAll("vd-tab");
    const contentDiv=this.shadowRoot.querySelector(".inner-content");
    tabs.forEach((tab,i)=>this._addListener(tab,"click",()=>this._activateTab(i,tabs,contentDiv)));
    const activeTab=Array.from(tabs).find((t)=>t.getAttribute("active")==="true");
    if(activeTab)this._activateTab(Array.from(tabs).indexOf(activeTab),tabs,contentDiv);
    else if(tabs.length>0)this._activateTab(0,tabs,contentDiv);
  }
  _activateTab(index,tabs,contentDiv){
    tabs.forEach((tab,i)=>{
      const isActive=i===index;
      tab.active=isActive;tab.setAttribute("active",isActive);
      if(isActive){contentDiv.innerHTML=tab.innerHTML;tab.style.backgroundColor=tab.getAttribute("backgroundcolor")||"white";tab.style.color=tab.getAttribute("textcolor")||"black";}
      else{tab.style.backgroundColor="black";tab.style.color="white";}
    });
  }
}

class VdTab extends VDBaseElement {
  static get observedAttributes(){return["title","backgroundcolor","textcolor","active"];}
  connectedCallback(){
    this.render();this._updateStyle();
    // Phase 3: ARIA
    this.setAttribute("role",          "tab");
    this.setAttribute("aria-selected", this.getAttribute("active")==="true" ? "true" : "false");
    this.setAttribute("tabindex",      this.getAttribute("active")==="true" ? "0" : "-1");
  }
  attributeChangedCallback(name,oldValue,newValue){
    if(!this.isConnected)return;
    if(name==="title"){const s=this.shadowRoot.querySelector("span");if(s)s.textContent=newValue;}
    else this._updateStyle();
  }
  _updateStyle(){
    const isActive=this.getAttribute("active")==="true";
    this.style.backgroundColor=isActive?(this.getAttribute("backgroundcolor")||"white"):"black";
    this.style.color=isActive?(this.getAttribute("textcolor")||"black"):"white";
    this.setAttribute("aria-selected", isActive ? "true" : "false");
    this.setAttribute("tabindex",      isActive ? "0" : "-1");
  }
  render(){
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:inline-block;border-radius:4px;padding:10px;cursor:pointer;transition:background-color 0.3s,color 0.3s;margin:8px 1px;border:none;}
        span{display:inline-block;text-align:center;}
      </style>
      <span>${VDUtils.sanitizeHTML(this.getAttribute("title")||"")}</span>`;
  }
}

/* =============================================================================
   CUSTOM ELEMENTS REGISTRATION
   ============================================================================= */
customElements.define("vd-timeline",      VdTimeline);
customElements.define("vd-timeline-item", VdTimelineItem);
customElements.define("vd-progresscircle",VdProgressCircle);
customElements.define("vd-countdown",     VdCountdown);
customElements.define("vd-chatbox",       VdChatbox);
customElements.define("vd-chatline",      VdChatline);
customElements.define("vd-carousel",      VdCarousel);
customElements.define("vd-inputbox",      VdInputBox);
customElements.define("vd-chatbot",       VdChatbot);
customElements.define("vd-dalle",         VdDalle);
customElements.define("vd-planner",       VdPlanner);
customElements.define("vd-music",         MusicTag);
customElements.define("vd-video",         VideoTag);
customElements.define("vd-tabcontrol",    VdTabControl);
customElements.define("vd-tab",           VdTab);
