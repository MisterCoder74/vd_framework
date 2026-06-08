<!DOCTYPE html>
<html lang="it">
<head>
  <!-- META BASE -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CertainThing: trasforma idee in applicazioni funzionanti tramite conversazione AI. Vibe Coding con reasoning real-time, input multimodale e deploy istantaneo.">
  <meta name="keywords" content="AI coding, vibe coding, conversational programming, AI app builder, no-code development, AI-powered development, visual programming">
  <meta name="author" content="Vivacity Design AI Division">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/promo.php">

  <!-- OPEN GRAPH -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="CertainThing">
  <meta property="og:title" content="CertainThing - Piattaforma AI per Vibe Coding">
  <meta property="og:description" content="Crea applicazioni parlando con l'AI. Reasoning trasparente, input multimodale (immagini, PDF, URL) e deploy con un click. Coding alla velocità del pensiero.">
  <meta property="og:url" content="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/promo.php">
  <meta property="og:image" content="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/certainthing_05-20-2026_01.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Interfaccia CertainThing AI Vibe Coding">
  <meta property="og:locale" content="it_IT">

  <!-- TWITTER CARD -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="CertainThing - AI-Powered Vibe Coding">
  <meta name="twitter:description" content="Trasforma conversazioni in applicazioni funzionanti. Reasoning real-time, multimodale, deploy istantaneo.">
  <meta name="twitter:image" content="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/certainthing_05-20-2026_01.jpg">
  <meta name="twitter:image:alt" content="Anteprima Piattaforma CertainThing">

  <title>CertainThing - Piattaforma AI per Vibe Coding | Vivacity Design</title>

  <!-- JSON-LD STRUCTURED DATA -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CertainThing",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "4.99",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "description": "Beta — €4.99/mese + costo API OpenAI a consumo"
    },
    "description": "Piattaforma AI per Vibe Coding: crea applicazioni tramite conversazione naturale con reasoning trasparente, input multimodale e deploy istantaneo.",
    "url": "https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/promo.php",
    "image": "https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/certainthing_05-20-2026_01.jpg",
    "publisher": { "@type": "Organization", "name": "Vivacity Design AI Division" },
    "featureList": [
      "Interfaccia Chat Conversazionale","Reasoning Pane in Tempo Reale",
      "Input Multimodale (Immagini, PDF, URL)","Deploy con Un Click",
      "Push to GitHub nativo","Website Analyzer","Live Preview in sandbox"
    ]
  }
  </script>

  <!-- =====================================================================
       MINIMAL CUSTOM CSS
       Only for what no component covers:
       - body / page shell
       - hero section  → vd-hero ✅ Phase 6
       - feature-grid  (CSS layout wrapper)
       - btn-cta       → vd-button ✅ Phase 6
       - section shell (semantic wrapper + h2 styling)
       ===================================================================== -->
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 100%);
      color: #e0e0e0;
      min-height: 100vh;
    }

    /* ---- Page sections ---- */
    .page-section {
      max-width: 1100px;
      margin: 0 auto;
      padding: 80px 2rem;
    }
    .page-section h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.75rem;
    }
    .page-section > p {
      color: #aaa;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    /* ---- Hero CSS — replaced by vd-hero in Phase 6 (kept for reference) ---- */
    .hero-wrap {
      text-align: center;
      padding: 100px 2rem 60px;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-eyebrow { font-size: 0.9rem; color: #888; margin-bottom: 1.2rem; letter-spacing: 0.04em; }
    .hero-title   { font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 1.5rem; }
    .hero-title em { color: #667eea; font-style: normal; }
    .hero-sub     { font-size: 1.1rem; color: #aaa; max-width: 640px; margin: 0 auto 2rem; line-height: 1.75; }
    .hero-badges  { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-bottom: 2rem; }
    /* vd-badge doesn't exist yet — hand-coded */
    .hero-badge   { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
                    color: #ccc; padding: 0.35rem 0.9rem; border-radius: 20px; font-size: 0.88rem; }
    .hero-img     { width: 100%; max-width: 820px; border-radius: 14px; margin-top: 3rem;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.6); }

    /* ---- CTA buttons (no vd-button component) ---- */
    .btn-cta {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      padding: 0.9rem 2.4rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.05rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.5); }
    .btn-secondary {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
    }
    .btn-secondary:hover { background: rgba(102,126,234,0.12); }

    /* ---- Feature grid layout ---- */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    /* ---- Pricing ---- */
    .price-tag      { font-size: 5rem; font-weight: 900; color: #fff; line-height: 1; }
    .price-tag sup  { font-size: 2rem; vertical-align: top; margin-top: 1rem; display: inline-block; }
    .price-tag sub  { font-size: 1.2rem; }
    .price-note     { color: #888; font-size: 0.9rem; margin: 0.6rem 0 0; }
    .trust-row      { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-top: 1.5rem; }
    .trust-logo     { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
                      border-radius: 6px; padding: 0.35rem 0.9rem; color: #ccc; font-size: 0.85rem; font-weight: 700; }

    /* ---- Join ---- */
    .early-badge    { display: inline-block; background: rgba(102,126,234,0.15);
                      border: 1px solid #667eea; color: #667eea;
                      border-radius: 20px; padding: 0.3rem 1rem; font-size: 0.82rem; margin-bottom: 1rem; }

    /* ---- vd-popnav sticky ---- */
    vd-popnav { position: sticky; top: 0; z-index: 100; }
  </style>
</head>
<body>

  <!-- ================================================================
       NAVIGATION — vd-popnav + vd-poplink
       ================================================================ -->
  <vd-popnav backgroundcolor="#0d0d1a" shadowcolor="rgba(0,0,0,0.6)" align="center">
    <vd-poplink url="#filosofia"      backgroundcolor="transparent" textcolor="#aaa" hovercolor="#667eea">Filosofia</vd-poplink>
    <vd-poplink url="#caratteristiche" backgroundcolor="transparent" textcolor="#aaa" hovercolor="#667eea">Caratteristiche</vd-poplink>
    <vd-poplink url="#prezzi"         backgroundcolor="transparent" textcolor="#aaa" hovercolor="#667eea">Prezzi</vd-poplink>
    <vd-poplink url="#demo"           backgroundcolor="transparent" textcolor="#aaa" hovercolor="#667eea">Demo</vd-poplink>
    <vd-poplink url="#documentazione" backgroundcolor="transparent" textcolor="#aaa" hovercolor="#667eea">Docs</vd-poplink>
    <vd-poplink url="#faq"            backgroundcolor="transparent" textcolor="#aaa" hovercolor="#667eea">FAQ</vd-poplink>
    <vd-poplink url="#join"           backgroundcolor="#667eea"     textcolor="#fff"  hovercolor="#764ba2">Join</vd-poplink>
  </vd-popnav>

  <!-- ================================================================
       HERO — vd-hero (Phase 6) ✅
       ================================================================ -->
  <vd-hero id="hero"
    title="Da Idea ad App Live in *60 Secondi*"
    subtitle="Descrivi la tua applicazione a parole. CertainThing scrive il codice, te lo mostra in anteprima in tempo reale e lo pubblica online. Tutto in un minuto — senza toccare un terminale."
    eyebrow="🇮🇹 Concepito in Italia — pensato per il mondo"
    imgsrc="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/certainthing_05-20-2026_01.jpg"
    imgalt="Anteprima interfaccia CertainThing — vibe coding AI tool italiano"
    backgroundcolor="transparent"
    textcolor="#fff"
    accentcolor="#667eea"
    padding="80px 2rem 60px">
    <vd-chip slot="badges" label="♾️ Token Illimitati" backgroundcolor="rgba(255,255,255,0.07)" textcolor="#e0e0e0" bordercolor="rgba(255,255,255,0.15)"></vd-chip>
    <vd-chip slot="badges" label="⚡ Deploy Istantaneo" backgroundcolor="rgba(255,255,255,0.07)" textcolor="#e0e0e0" bordercolor="rgba(255,255,255,0.15)"></vd-chip>
    <vd-chip slot="badges" label="💰 Solo €4.99/mese" backgroundcolor="rgba(255,255,255,0.07)" textcolor="#e0e0e0" bordercolor="rgba(255,255,255,0.15)"></vd-chip>
    <vd-chip slot="badges" label="🤖 Modelli OpenAI" backgroundcolor="rgba(255,255,255,0.07)" textcolor="#e0e0e0" bordercolor="rgba(255,255,255,0.15)"></vd-chip>
    <vd-chip slot="badges" label="🐙 GitHub Integrato" backgroundcolor="rgba(255,255,255,0.07)" textcolor="#e0e0e0" bordercolor="rgba(255,255,255,0.15)"></vd-chip>
    <vd-button slot="cta"
      label="Inizia Gratis — 7 Giorni di Prova"
      href="https://www.vivacitydesign.net/certainThing/v1.2/certainthing/register.php"
      target="_blank"
      variant="primary"
      size="lg"
      backgroundcolor="#667eea"
      hovercolor="#764ba2">
    </vd-button>
  </vd-hero>

  <!-- ================================================================
       FILOSOFIA — vd-colorcard
       ================================================================ -->
  <vd-section id="filosofia" title="Filosofia" backgroundcolor="transparent" textcolor="#aaa" padding="80px 2rem" maxwidth="1100px">
    <!-- h2 "Filosofia" now rendered by vd-section[title] -->
    <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#aaa" shadowcolor="rgba(102,126,234,0.25)" width="100%">
      <p>CertainThing nasce dalla convinzione che programmare dovrebbe essere naturale come una conversazione.
         Lo chiamiamo <strong style="color:#fff;">Vibe Coding</strong>: il tuo intento creativo è il motore,
         l'AI gestisce il lavoro pesante. Niente scaffolding, niente configurazioni oscure, niente attese.
         Hai un'idea? Descrivila. L'app esiste.</p>
      <p style="margin-top:1rem;">Costruito in Italia, con un occhio all'utenza internazionale — perché le buone idee
         non hanno frontiere, ma meritano strumenti all'altezza.</p>
      <p style="margin-top:1.8rem;">
        <vd-button href="./nascita_di_certainthing.html" target="_blank" variant="secondary" backgroundcolor="#667eea" size="md" label="Scopri come CertainThing è nato in 3 giorni →"></vd-button>
      </p>
    </vd-colorcard>
  </vd-section>

  <!-- ================================================================
       CARATTERISTICHE — 8× vd-colorcard in feature-grid
       ================================================================ -->
  <vd-section id="caratteristiche" title="Caratteristiche" backgroundcolor="transparent" textcolor="#aaa" padding="80px 2rem" maxwidth="1100px">
    <!-- h2 "Caratteristiche" now rendered by vd-section[title] -->
    <p>Una suite completa per trasformare conversazioni in software funzionante — dal primo prompt al repo GitHub, senza mai lasciare il browser.</p>
    <div class="feature-grid">

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">💬</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Chat Conversazionale</strong>
        <p>Descrivi la tua app in linguaggio naturale, senza vincoli di sintassi o struttura. L'AI capisce il contesto e costruisce di conseguenza.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">🧠</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Reasoning Pane</strong>
        <p>Guarda l'AI pianificare ogni passo in tempo reale. Totale trasparenza su decisioni architetturali, scelte tecnologiche e implementazione.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">🖼️</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Input Multimodale</strong>
        <p>Carica immagini, file di testo o incolla un URL. CertainThing analizza il contesto visivo e testuale per generazioni più precise.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">👁️</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Live Preview</strong>
        <p>Rendering immediato in sandbox isolata. Vedi esattamente quello che stai costruendo, aggiornamento dopo aggiornamento.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">🚀</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Deploy con Un Click</strong>
        <p>Dal concept all'app online in un istante grazie al Deploy Manager integrato. Nessuna pipeline CI/CD, nessuna configurazione server.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">📦</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Download ZIP</strong>
        <p>Scarica il tuo intero progetto in un archivio ZIP con un click. Il codice è tuo — portalo dove vuoi, quando vuoi.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">🐙</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Push to GitHub</strong>
        <p>Condividi il tuo progetto su un repository GitHub in un istante grazie all'integrazione nativa. Dal vibe al repo, in un click.</p>
      </vd-colorcard>

      <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#bbb" shadowcolor="rgba(102,126,234,0.2)" width="100%">
        <p style="font-size:2rem;margin-bottom:0.5rem;">🔍</p>
        <strong style="color:#fff;display:block;margin-bottom:0.5rem;">Website Analyzer</strong>
        <p>Analizza siti esistenti per estrarre contesto e ispirazione. Passa un URL, ottieni comprensione profonda della struttura e del design.</p>
      </vd-colorcard>

    </div>
  </vd-section>

  <!-- ================================================================
       PREZZI — vd-colorcard + vd-sp (per gli highlight item)
       ================================================================ -->
  <!-- ================================================================
       PREZZI — vd-pricingcard (Phase 6) ✅
       ================================================================ -->
  <vd-section id="prezzi"
    title="Prezzi"
    subtitle="Un modello di pricing pensato per essere onesto: niente crediti che finiscono all'improvviso, niente trasformazioni opache. Paghi la piattaforma, i token li paghi direttamente a OpenAI."
    backgroundcolor="transparent"
    textcolor="#aaa"
    padding="80px 2rem"
    maxwidth="1100px"
    align="center">
    <vd-pricingcard
      title="Beta Access"
      price="4.99"
      currency="€"
      period="/mese"
      note="+ costo API OpenAI a tuo consumo — mediamente $0.25(*) per 1 milione di token"
      description="Il prezzo di un cappuccino e un cornetto. Per costruire applicazioni reali."
      backgroundcolor="#1a1a2e"
      textcolor="#aaa"
      shadowcolor="rgba(102,126,234,0.3)"
      accentcolor="#667eea"
      featured
      featuredlabel="🚀 Early Access — Posti Limitati"
      ctalabel="Inizia Gratis — 7 Giorni di Prova"
      ctahref="https://www.vivacitydesign.net/certainThing/v1.2/certainthing/register.php"
      ctatarget="_blank">
      <li>♾️ <strong>Token illimitati</strong> — nessun gioco di crediti che finiscono all'improvviso</li>
      <li>👁️ <strong>Costo trasparente</strong> — paghi esattamente quello che usi, niente di più</li>
      <li>🏗️ <strong>Stack Vanilla</strong> — PHP + HTML + JS, qualsiasi hosting, anche gratuito</li>
      <li>🔒 <strong>Tre garanzie</strong> — OpenAI per l'AI, GitHub per il codice, Stripe per i pagamenti</li>
      <li>💡 Costruire questa pagina con CertainThing è costato <strong style="color:#667eea;">$0.0003</strong></li>
    </vd-pricingcard>
  </vd-section>

  <!-- ================================================================
       DEMO — 2× vd-colorcard wrapping native <video>
       Note: video-tag has a max-width:480px limitation and custom controls
             that don't suit full-width promo embeds — see missing components report.
       ================================================================ -->
  <vd-section id="demo" title="Demo" backgroundcolor="transparent" textcolor="#aaa" padding="80px 2rem" maxwidth="1100px">
  
    <!-- h2 "Demo" now rendered by vd-section[title] -->
    <p>Parole convincono, ma i numeri — e i video — dimostrano. Guarda CertainThing in azione.</p>

    <vd-colorcard backgroundcolor="#0d0d1a" textcolor="#aaa" shadowcolor="rgba(102,126,234,0.3)" width="100%">
      <video width="100%" controls style="border-radius:8px;background:#000;">
        <source src="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/certainthing.mp4" type="video/mp4">
        Il tuo browser non supporta il tag <code>video</code>.
      </video>
      <p style="margin-top:0.75rem;font-size:0.9rem;color:#666;">Demo 1 — Da un prompt semplice a un'app multi-pagina live in 1 minuto.</p>
    </vd-colorcard>

    <vd-colorcard backgroundcolor="#0d0d1a" textcolor="#aaa" shadowcolor="rgba(102,126,234,0.3)" width="100%" style="margin-top:1.5rem;">
      <video width="100%" controls style="border-radius:8px;background:#000;">
        <source src="https://www.vivacitydesign.net/vd_ai_division/vd-ai-certainthing/certainthing_demo_002.mp4" type="video/mp4">
        Il tuo browser non supporta il tag <code>video</code>.
      </video>
      <p style="margin-top:0.75rem;font-size:0.9rem;color:#666;">Demo 2 — Dal prompt dettagliato a GitHub: dal vibe al repo in 60 secondi.</p>
    </vd-colorcard>
  </vd-section>

  <!-- ================================================================
       DOCUMENTAZIONE — vd-accordion
       ================================================================ -->
  <vd-section id="documentazione" title="Documentazione" backgroundcolor="transparent" textcolor="#aaa" padding="80px 2rem" maxwidth="1100px">
    <!-- h2 "Documentazione" now rendered by vd-section[title] -->
    <vd-accordion title="Documentazione Tecnica" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%">
      <p>La documentazione tecnica copre tutto ciò che serve: struttura delle cartelle, prompt engineering,
         use case reali e workflow tipici. Trovi anche come usare il <strong>Website Analyzer</strong>
         per analizzare siti esistenti e ottenere contesto, e come gestire le sessioni con il layer di
         persistenza basato su JSON — senza database, senza dipendenze esterne.</p>
      <p style="margin-top:1rem;">
        <a href="doc.html" target="_blank" style="color:#667eea;">Esplora la documentazione completa →</a>
      </p>
    </vd-accordion>
  </vd-section>

  <!-- ================================================================
       FAQ — 8× vd-accordion
       ================================================================ -->
  <vd-section id="faq" title="Domande Frequenti" backgroundcolor="transparent" textcolor="#aaa" padding="80px 2rem" maxwidth="1100px">
    <!-- h2 "Domande Frequenti" now rendered by vd-section[title] -->

    <vd-accordion title="Cos'è il Vibe Coding?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%">
      <p>Vibe Coding è un approccio allo sviluppo software dove l'intento creativo guida la creazione.
         Descrivi la tua app in linguaggio naturale e l'AI traduce la conversazione in codice funzionante,
         gestendo l'implementazione tecnica mentre tu ti concentri sulla visione.</p>
    </vd-accordion>

    <vd-accordion title="Come funzionano i crediti di CertainThing?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>Con CertainThing dimentichi i crediti che si esauriscono nel momento sbagliato. Colleghi la tua
         API Key OpenAI — gratuita e pronta in pochi minuti — e hai accesso illimitato a un costo
         trasparente: appena 0,25 dollari(*) per 1 milione di token, pagati direttamente a OpenAI a consumo.</p>
      <p style="margin-top:0.75rem;">Un dato reale: costruire questa intera pagina promozionale con CertainThing ci è costata
         <strong style="color:#667eea;">0,0003 dollari</strong>.</p>
    </vd-accordion>

    <vd-accordion title="Che tipo di input supporta CertainThing?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>CertainThing è multimodale: accetta testo naturale, immagini, documenti (no PDF, al momento) e URL.
         Puoi caricare uno screenshot di un design, un file di testo o di codice con specifiche
         o l'URL di un sito esistente per fornire contesto all'AI.</p>
    </vd-accordion>

    <vd-accordion title="Come funziona il Reasoning Pane?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>Il Reasoning Pane mostra in tempo reale come l'AI pianifica e struttura il tuo progetto.
         Vedi ogni decisione architettonica, scelta tecnologica e step di implementazione
         per piena trasparenza e controllo sul processo.</p>
    </vd-accordion>

    <vd-accordion title="Posso pubblicare subito l'applicazione?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>Sì. CertainThing offre deploy con un click: passi da concept a applicazione live istantaneamente,
         senza configurazioni server, pipeline CI/CD o deployment manuale.</p>
    </vd-accordion>

    <vd-accordion title="Come vengono salvati i dati?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>CertainThing usa un sistema di persistenza basato su JSON per le sessioni.
         Non servono database esterni: ogni progetto mantiene il proprio stato
         in formato leggibile e facilmente modificabile.</p>
    </vd-accordion>

    <vd-accordion title="CertainThing è già disponibile?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>Sì, CertainThing è attualmente in early access beta. Puoi registrarti gratuitamente per essere
         tra i primi a sperimentare la piattaforma per 7 giorni e influenzarne lo sviluppo con il tuo feedback.</p>
    </vd-accordion>

    <vd-accordion title="Perché scegliere CertainThing?" backgroundcolor="#1a1a2e" textcolor="#ccc" width="100%" style="margin-top:0.75rem;">
      <p>È legittimo porsi questa domanda, considerando la presenza di numerosi strumenti di Vibe Coding.
         Tuttavia, CertainThing si distingue per tre aspetti fondamentali:</p>
      <vd-sp bordercolor="#667eea" style="margin-top:0.75rem;">
        <p><strong style="color:#fff;">Nessuna configurazione</strong> — niente CLI, niente integrazioni complesse.
           Apri il browser, descrivi l'app e la ottieni in un minuto.</p>
      </vd-sp>
      <vd-sp bordercolor="#764ba2" style="margin-top:0.75rem;">
        <p><strong style="color:#fff;">Stack Vanilla</strong> — niente framework, niente macchine virtuali.
           Compatibile con qualsiasi hosting che supporti PHP, inclusi quelli gratuiti.</p>
      </vd-sp>
      <vd-sp bordercolor="#667eea" style="margin-top:0.75rem;">
        <p><strong style="color:#fff;">Prezzo trasparente</strong> — mentre la maggior parte degli strumenti
           costa tra 19 e 49 euro al mese con crediti opachi, CertainThing è disponibile a soli
           <strong style="color:#667eea;">4,99 €/mese</strong>. Con la tua API Key OpenAI paghi esclusivamente
           a consumo: 0,25 dollari(*) per 1 milione di token, senza sorprese.</p>
      </vd-sp>
      <p style="margin-top:0.75rem;font-size:0.75rem;color:#555;">
        (*) Il costo di $0.25/1M token è calcolato come media tra i prezzi dichiarati da OpenAI per input
        e output token, e potrebbe variare leggermente a seconda dell'operazione svolta.
      </p>
    </vd-accordion>
  </vd-section>

  <!-- ================================================================
       JOIN / CTA — vd-colorcard
       ================================================================ -->
  <vd-section id="join" title="Entra nella Beta" backgroundcolor="transparent" textcolor="#aaa" padding="80px 2rem" maxwidth="1100px">
  
    <vd-colorcard backgroundcolor="#1a1a2e" textcolor="#aaa" shadowcolor="rgba(102,126,234,0.35)" width="100%">
      <vd-center>
        <div class="early-badge">🚀 Early Access — Ora Disponibile</div>
        <h2 style="color:#fff;font-size:1.8rem;margin:1rem 0;">Unisciti alla Beta</h2>
        <p style="max-width:580px;margin:0 auto;line-height:1.7;">
          CertainThing è ora in early access. Sii tra i primi a costruire con il futuro dello sviluppo
          assistito dall'AI — <strong style="color:#fff;">7 giorni di prova gratuita</strong>, senza carta di credito.
        </p>
        <p style="max-width:580px;margin:1rem auto 0;line-height:1.7;">
          RICORDA: per utilizzare CertainThing sarà necessario prima
          <a href="https://platform.openai.com/login?next=%2Fsettings%2Forganization%2Fapi-keys"
             target="_blank" style="color:#667eea;">creare una API Key presso OpenAI</a>.
        </p>
        <p style="margin-top:2rem;">
          <vd-button href="https://www.vivacitydesign.net/certainThing/v1.2/certainthing/register.php"
             target="_blank" label="Crea il Tuo Account Gratuito →" variant="primary" size="lg" backgroundcolor="#667eea" hovercolor="#764ba2"></vd-button>
        </p>
      </vd-center>
    </vd-colorcard>
  </vd-section>

  <!-- ================================================================
       FOOTER — vd-colorcard + vd-center
       ================================================================ -->
  <vd-colorcard backgroundcolor="#070710" textcolor="#555" shadowcolor="none" width="100%" style="border-radius:0;margin-top:2rem;">
    <vd-center>
      <div style="color:#fff;font-weight:700;letter-spacing:0.12em;font-size:0.9rem;margin-bottom:0.5rem;">
        VIVACITY DESIGN <span style="color:#667eea;">AI DIVISION</span>
      </div>
      <p>Eccellenza digitale e Intelligenza Artificiale integrata.</p>
      <p style="margin-top:0.75rem;">
        <a href="https://www.vivacitydesign.net/vd_ai_division/" style="color:#667eea;">
          Torna a Vivacity Design AI Division →
        </a>
      </p>
      <p style="margin-top:1.5rem;font-size:0.75rem;opacity:0.45;">
        <script type="text/javascript" src="https://www.vivacitydesign.net/counter/counter.php?page=certainthingpromocount"></script><br>
        © <?php echo Date('Y'); ?> — Vivacity Design AI Division. All Rights Reserved.
      </p>
    </vd-center>
  </vd-colorcard>

  <!-- =====================================================================
       VD FRAMEWORK 4 — scripts loaded at end of body so full DOM is parsed
       before custom elements are upgraded (fixes this.innerHTML in connectedCallback)
       ===================================================================== -->
  <script src="vd_framework_utils.js?v=<?php echo time(); ?>"></script>
  <script src="vd_framework_theme.js?v=<?php echo time(); ?>"></script>
  <script src="vd_framework_global.js?v=<?php echo time(); ?>"></script>
  <script src="vd_framework_macrocomponents.js?v=<?php echo time(); ?>"></script>

</body>
</html>
