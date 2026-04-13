import { useState, useEffect, useRef } from "react";

// ─── API endpoint — uses serverless proxy in production ─────────
const API = "/api/chat";

// ─── Persistent storage key ───────────────────────────────────────
const STORE = "garde_v2";

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; }
};
const save = (data) => localStorage.setItem(STORE, JSON.stringify(data));

const toB64 = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result.split(",")[1]);
  r.onerror = rej;
  r.readAsDataURL(file);
});

// ─── System prompt ────────────────────────────────────────────────
const buildSystem = (profile) => `Du er en personlig stylist ved navn Garde. Du er ikke en AI-assistent — du er en menneskelig stilrådgiver med en pågående relasjon til denne personen. Du husker alt dere har snakket om. Du stiller spørsmål. Du utfordrer. Du er direkte uten å være kald.

SLIK OPPFØRER DU DEG:
- Du snakker norsk, alltid
- Du gir aldri generiske svar. Alt er forankret i det du vet om denne personen
- Du forteller ikke bare hva de "bør" ha på. Du er nysgjerrig på dem og på hvorfor de tar valgene de tar
- Du husker tidligere samtaler og refererer til dem aktivt
- Du merker mønstre over tid og sier det høyt
- Du kan si "nei, det tror jeg ikke passer deg" — og forklare hvorfor
- Du er aldri sycophant. Du sier det som er sant
- Maks 120 ord per svar. Kortfattet og presist

PROFILEN DU HAR BYGGET OM DENNE PERSONEN:
${JSON.stringify(profile, null, 2)}

VIKTIG: Etter hvert svar, hvis du har lært noe nytt om personen — et plagg de eier, en preferanse, en beslutning — legg til en linje på slutten i dette formatet (skjult for brukeren, kun til deg):
[OPPDATERING: ...]

Eksempel: [OPPDATERING: Eier en navy wool blazer fra Rubinacci. Kjøpt i Napoli. Bruker den til formelle anledninger.]
[OPPDATERING: Liker ikke overdrevne logoer. Foretrekker subtil branding.]`;

// ─── CSS ─────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --paper: #f5f0e8;
    --ink: #1a1814;
    --ink2: #4a453d;
    --ink3: #8a837a;
    --rule: #d8d0c4;
    --accent: #8b4513;
    --accent2: #c4813a;
    --surface: #ede8df;
  }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Libre Baskerville', serif;
    min-height: 100vh;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    min-height: 100vh;
    max-width: 1100px;
    margin: 0 auto;
  }

  @media (max-width: 720px) {
    .layout { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .sidebar.open { display: flex; position: fixed; inset: 0; z-index: 100; background: var(--paper); }
  }

  .main {
    border-right: 1px solid var(--rule);
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;
  }

  .topbar {
    padding: 28px 36px 20px;
    border-bottom: 1px solid var(--rule);
    display: flex;
    align-items: baseline;
    gap: 16px;
  }

  .wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--ink);
    letter-spacing: 0.02em;
  }

  .wordmark em {
    font-style: italic;
    color: var(--accent);
  }

  .tagline {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink3);
  }

  .sidebar-toggle {
    margin-left: auto;
    background: none;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink3);
    cursor: pointer;
    display: none;
  }

  @media (max-width: 720px) { .sidebar-toggle { display: block; } }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    scroll-behavior: smooth;
  }

  .msg-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .msg-label {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 6px;
  }

  .msg-bubble {
    font-size: 14px;
    line-height: 1.75;
    color: var(--ink);
    max-width: 520px;
  }

  .msg-bubble.user {
    color: var(--ink2);
    font-style: italic;
    font-family: 'Playfair Display', serif;
    font-size: 15px;
  }

  .msg-bubble.garde {
    color: var(--ink);
  }

  .msg-image {
    max-width: 180px;
    max-height: 180px;
    object-fit: cover;
    border: 1px solid var(--rule);
    display: block;
    margin-bottom: 10px;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 0;
  }

  .typing-dot {
    width: 5px; height: 5px;
    background: var(--ink3);
    border-radius: 50%;
    animation: blink 1.4s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,100%{opacity:.2} 50%{opacity:.9} }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 48px;
    opacity: 0;
    animation: fadein 0.8s 0.3s forwards;
  }

  @keyframes fadein { to { opacity: 1; } }

  .empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 400;
    font-style: italic;
    color: var(--ink);
  }

  .empty-sub {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink3);
    max-width: 280px;
    line-height: 1.8;
  }

  .starters {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .starter {
    background: transparent;
    border: 1px solid var(--rule);
    color: var(--ink2);
    padding: 10px 20px;
    font-family: 'Libre Baskerville', serif;
    font-size: 12px;
    font-style: italic;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .starter:hover {
    background: var(--surface);
    border-color: var(--accent2);
    color: var(--ink);
  }

  .input-section {
    border-top: 1px solid var(--rule);
    padding: 20px 36px 28px;
    background: var(--paper);
  }

  .img-preview-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 12px;
  }

  .img-preview {
    max-height: 80px;
    max-width: 120px;
    object-fit: cover;
    border: 1px solid var(--rule);
    display: block;
  }

  .img-preview-remove {
    position: absolute;
    top: -7px; right: -7px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 18px; height: 18px;
    font-size: 11px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }

  .input-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .input-row textarea {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--rule);
    color: var(--ink);
    padding: 10px 0;
    font-family: 'Libre Baskerville', serif;
    font-size: 14px;
    font-style: italic;
    outline: none;
    resize: none;
    min-height: 40px;
    max-height: 120px;
    transition: border-color 0.2s;
    line-height: 1.6;
  }

  .input-row textarea:focus { border-bottom-color: var(--accent); }
  .input-row textarea::placeholder { color: var(--ink3); }

  .btn-send {
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 10px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .btn-send:hover { background: var(--accent); }
  .btn-send:disabled { opacity: 0.3; cursor: default; background: var(--ink); }

  .btn-cam {
    background: transparent;
    border: 1px solid var(--rule);
    color: var(--ink3);
    padding: 9px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    line-height: 1;
  }

  .btn-cam:hover { border-color: var(--accent2); color: var(--accent); }

  .sidebar {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
    padding: 36px 28px;
    gap: 0;
    background: var(--paper);
  }

  .sidebar-section {
    padding: 20px 0;
    border-bottom: 1px solid var(--rule);
  }

  .sidebar-section:last-child { border-bottom: none; }

  .sidebar-title {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 16px;
  }

  .profile-empty {
    font-size: 11px;
    color: var(--ink3);
    font-style: italic;
    line-height: 1.6;
  }

  .wardrobe-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--rule);
  }

  .wardrobe-item:last-child { border-bottom: none; }

  .wi-thumb {
    width: 32px; height: 32px;
    object-fit: cover;
    border: 1px solid var(--rule);
    flex-shrink: 0;
  }

  .wi-ph {
    width: 32px; height: 32px;
    border: 1px solid var(--rule);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    background: var(--surface);
    color: var(--ink3);
  }

  .wi-info { flex: 1; }
  .wi-name { font-size: 11px; color: var(--ink); line-height: 1.3; }
  .wi-meta { font-size: 10px; color: var(--ink3); font-style: italic; }

  .insight-item {
    font-size: 11px;
    color: var(--ink2);
    line-height: 1.6;
    padding: 6px 0;
    border-bottom: 1px solid var(--rule);
    font-style: italic;
  }

  .insight-item:last-child { border-bottom: none; }

  .insight-date {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    color: var(--ink3);
    font-style: normal;
    letter-spacing: 0.1em;
    margin-top: 2px;
  }

  .reset-btn {
    background: transparent;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink3);
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
    margin-top: 8px;
  }

  .reset-btn:hover { color: var(--accent); }

  .onboarding {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    background: var(--paper);
  }

  .onb-inner {
    max-width: 520px;
    width: 100%;
    opacity: 0;
    animation: fadein 0.6s forwards;
  }

  .onb-wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 400;
    font-style: italic;
    color: var(--ink);
    margin-bottom: 8px;
  }

  .onb-wordmark span { color: var(--accent); }

  .onb-sub {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 48px;
  }

  .onb-rule { height: 1px; background: var(--rule); margin: 32px 0; }

  .onb-q {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .onb-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--rule);
    color: var(--ink);
    padding: 12px 0;
    font-family: 'Libre Baskerville', serif;
    font-size: 15px;
    font-style: italic;
    outline: none;
    transition: border-color 0.2s;
  }

  .onb-input:focus { border-bottom-color: var(--accent); }
  .onb-input::placeholder { color: var(--ink3); }

  .onb-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }

  .onb-btn {
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 14px 32px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }

  .onb-btn:hover { background: var(--accent); }
  .onb-btn:disabled { opacity: 0.3; cursor: default; background: var(--ink); }

  .onb-skip {
    background: transparent;
    border: 1px solid var(--rule);
    color: var(--ink3);
    padding: 14px 24px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .onb-skip:hover { border-color: var(--ink3); color: var(--ink); }

  .pbar { height: 1px; background: var(--rule); margin-bottom: 40px; overflow: hidden; }
  .pfill { height: 100%; background: var(--accent); transition: width 0.4s; }
`;

// ─── Onboarding questions ─────────────────────────────────────────
const ONB_QUESTIONS = [
  { id: "name", q: "Hva heter du?", placeholder: "Fornavn" },
  { id: "style", q: "Hvordan vil du beskrive stilen din i dag — eller stilen du ønsker å ha?", placeholder: "Beskriv med egne ord..." },
  { id: "brands", q: "Er det noen merker eller designere du allerede er glad i?", placeholder: "f.eks. Our Legacy, Loro Piana, ingenting spesielt..." },
  { id: "frustration", q: "Hva er det største problemet du har med garderoben din akkurat nå?", placeholder: "Vær ærlig..." },
];

// ─── Starter messages ─────────────────────────────────────────────
const STARTERS = [
  "Jeg trenger hjelp til å finne ut hva som mangler i garderoben min.",
  "Jeg vurderer å kjøpe noe — kan jeg vise deg?",
  "Hva skulle du ha sagt til meg om kjøpene jeg har gjort det siste året?",
  "Jeg skal på middag i helgen. Hva har jeg å rutte med?",
];

export default function App() {
  const stored = load();
  const [phase, setPhase] = useState(stored.onboarded ? "chat" : "onboarding");
  const [onbStep, setOnbStep] = useState(0);
  const [onbAnswers, setOnbAnswers] = useState({});
  const [onbInput, setOnbInput] = useState("");

  const [profile, setProfile] = useState(stored.profile || {
    name: "", style: "", brands: "", frustration: "",
    wardrobe: [], insights: [], sessionCount: 0,
  });

  const [messages, setMessages] = useState(stored.messages || []);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, loading]);

  const persist = (p, m) => save({ onboarded: true, profile: p, messages: m });

  // Parse updates from AI response
  const parseUpdates = (text, currentProfile) => {
    const updates = [...text.matchAll(/\[OPPDATERING: ([^\]]+)\]/g)].map(m => m[1]);
    if (!updates.length) return { cleanText: text, updatedProfile: currentProfile };

    const cleanText = text.replace(/\[OPPDATERING: [^\]]+\]/g, "").trim();
    const now = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long" });

    const newInsights = updates.map(u => ({ text: u, date: now }));
    const updatedProfile = {
      ...currentProfile,
      insights: [...(currentProfile.insights || []), ...newInsights].slice(-30),
    };

    return { cleanText, updatedProfile };
  };

  const send = async (overrideText) => {
    const text = overrideText || input;
    if ((!text.trim() && !image) || loading) return;

    const userMsg = { role: "user", text, image, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setImage(null);
    setLoading(true);

    const apiMessages = newMessages.map(m => ({
      role: m.role === "garde" ? "assistant" : "user",
      content: m.role === "user"
        ? [
            ...(m.image ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: m.image } }] : []),
            { type: "text", text: m.text || "Se på dette bildet." },
          ]
        : m.text,
    }));

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystem(profile),
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Beklager, noe gikk galt.";
      const { cleanText, updatedProfile } = parseUpdates(raw, profile);

      const gardeMsg = { role: "garde", text: cleanText, ts: Date.now() };
      const finalMessages = [...newMessages, gardeMsg];

      setMessages(finalMessages);
      setProfile(updatedProfile);
      persist(updatedProfile, finalMessages);
    } catch {
      const errMsg = { role: "garde", text: "Kunne ikke koble til. Prøv igjen.", ts: Date.now() };
      const finalMessages = [...newMessages, errMsg];
      setMessages(finalMessages);
      persist(profile, finalMessages);
    }
    setLoading(false);
  };

  // ─── Onboarding ───────────────────────────────────────────────
  const handleOnbNext = () => {
    const q = ONB_QUESTIONS[onbStep];
    const updated = { ...onbAnswers, [q.id]: onbInput };
    setOnbAnswers(updated);
    setOnbInput("");

    if (onbStep < ONB_QUESTIONS.length - 1) {
      setOnbStep(s => s + 1);
    } else {
      const p = {
        name: updated.name || "",
        style: updated.style || "",
        brands: updated.brands || "",
        frustration: updated.frustration || "",
        wardrobe: [],
        insights: [],
        sessionCount: 1,
      };
      setProfile(p);
      setPhase("chat");

      const intro = [
        updated.name ? `${updated.name}.` : "Hei.",
        updated.frustration
          ? `Du nevnte at problemet er: \u201c${updated.frustration}\u201d. Det er et godt sted å starte.`
          : "Fortell meg hva du trenger hjelp med.",
        "Hva har du på kroppen akkurat nå?",
      ].join(" ");

      const openMsg = { role: "garde", text: intro, ts: Date.now() };
      setMessages([openMsg]);
      persist(p, [openMsg]);
    }
  };

  const reset = () => {
    localStorage.removeItem(STORE);
    setPhase("onboarding");
    setOnbStep(0);
    setOnbAnswers({});
    setOnbInput("");
    setProfile({ name: "", style: "", brands: "", frustration: "", wardrobe: [], insights: [], sessionCount: 0 });
    setMessages([]);
  };

  // ─── Onboarding UI ───────────────────────────────────────────
  if (phase === "onboarding") {
    const q = ONB_QUESTIONS[onbStep];
    return (
      <>
        <style>{css}</style>
        <div className="onboarding">
          <div className="onb-inner">
            {onbStep === 0 && (
              <>
                <div className="onb-wordmark">G<span>a</span>rde</div>
                <div className="onb-sub">Din personlige stylist</div>
                <div className="onb-rule" />
                <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.8, marginBottom: 32, fontStyle: "italic" }}>
                  Garde er ikke en app som forteller deg hva du skal ha på. Det er en relasjon — en stylist som lærer seg hvem du er over tid, og som husker alt dere snakker om.
                </p>
              </>
            )}
            <div className="pbar">
              <div className="pfill" style={{ width: `${((onbStep) / ONB_QUESTIONS.length) * 100}%` }} />
            </div>
            <div className="onb-q">{q.q}</div>
            <input
              className="onb-input"
              placeholder={q.placeholder}
              value={onbInput}
              autoFocus
              onChange={e => setOnbInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && onbInput.trim()) handleOnbNext(); }}
            />
            <div className="onb-actions">
              <button className="onb-btn" disabled={!onbInput.trim()} onClick={handleOnbNext}>
                {onbStep < ONB_QUESTIONS.length - 1 ? "Neste \u2192" : "Start \u2192"}
              </button>
              {onbStep > 0 && (
                <button className="onb-skip" onClick={() => { setOnbInput(""); handleOnbNext(); }}>Hopp over</button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Chat UI ─────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
        onChange={async e => { if (e.target.files[0]) { setImage(await toB64(e.target.files[0])); } }} />

      <div className="layout">
        <div className="main">
          <div className="topbar">
            <div>
              <div className="wordmark">G<em>a</em>rde</div>
            </div>
            {profile.name && <div className="tagline">{profile.name}s stylist</div>}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)}>
              {sidebarOpen ? "Lukk" : "Profil"}
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">Hva tenker du på?</div>
              <div className="empty-sub">Fortell meg om et plagg, en anledning, eller noe du lurer på.</div>
              <div className="starters">
                {STARTERS.map(s => (
                  <button key={s} className="starter" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages" ref={messagesRef}>
              {messages.map((m, i) => (
                <div key={i} className="msg-group">
                  <div className="msg-label">{m.role === "user" ? (profile.name || "Deg") : "Garde"}</div>
                  {m.image && <img src={`data:image/jpeg;base64,${m.image}`} className="msg-image" alt="" />}
                  <div className={`msg-bubble ${m.role}`}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="msg-group">
                  <div className="msg-label">Garde</div>
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="input-section">
            {image && (
              <div className="img-preview-wrap">
                <img src={`data:image/jpeg;base64,${image}`} className="img-preview" alt="" />
                <button className="img-preview-remove" onClick={() => setImage(null)}>\u00d7</button>
              </div>
            )}
            <div className="input-row">
              <button className="btn-cam" onClick={() => { fileRef.current.value = ""; fileRef.current.click(); }}>📷</button>
              <textarea
                ref={textareaRef}
                placeholder="Skriv til Garde..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
              />
              <button className="btn-send" onClick={() => send()} disabled={loading || (!input.trim() && !image)}>Send</button>
            </div>
          </div>
        </div>

        <div className={`sidebar${sidebarOpen ? " open" : ""}`}>
          {sidebarOpen && (
            <button className="reset-btn" style={{ alignSelf: "flex-end", marginBottom: 16 }} onClick={() => setSidebarOpen(false)}>× Lukk</button>
          )}

          <div className="sidebar-section">
            <div className="sidebar-title">Om deg</div>
            {profile.name ? (
              <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.8 }}>
                {profile.name && <div><strong>{profile.name}</strong></div>}
                {profile.style && <div style={{ fontStyle: "italic", marginTop: 4 }}>{`\u201c${profile.style}\u201d`}</div>}
                {profile.brands && <div style={{ color: "var(--ink3)", marginTop: 4, fontSize: 11 }}>{profile.brands}</div>}
              </div>
            ) : (
              <div className="profile-empty">Ingenting ennå. Begynn å prate med Garde.</div>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Garde husker</div>
            {profile.insights?.length > 0 ? (
              profile.insights.slice(-10).reverse().map((ins, i) => (
                <div key={i} className="insight-item">
                  {ins.text}
                  {ins.date && <div className="insight-date">{ins.date}</div>}
                </div>
              ))
            ) : (
              <div className="profile-empty">Garde bygger seg opp et bilde av deg over tid.</div>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Garderoben</div>
            {profile.wardrobe?.length > 0 ? (
              profile.wardrobe.map((item, i) => (
                <div key={i} className="wardrobe-item">
                  {item.image ? <img src={`data:image/jpeg;base64,${item.image}`} className="wi-thumb" alt="" /> : <div className="wi-ph">·</div>}
                  <div className="wi-info">
                    <div className="wi-name">{item.name}</div>
                    {item.notes && <div className="wi-meta">{item.notes}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="profile-empty">Nevn plagg i samtalen — Garde noterer det.</div>
            )}
          </div>

          <div className="sidebar-section">
            <button className="reset-btn" onClick={reset}>Nullstill alt og start på nytt</button>
          </div>
        </div>
      </div>
    </>
  );
}
