import { useState, useRef, useEffect } from "react";


// ─── Constants ────────────────────────────────────────────────────────────────

const GARMENT_CATEGORIES = [
  { id: "yttertoy",  label: "Outerwear",        sub: "Coats, parkas, puffers",
    path: "M20 7 C18 7 15 8 13 10 L9 14 L9 39 L31 39 L31 14 L27 10 C25 8 22 7 20 7 Z M20 7 L20 14 M13 10 L9 14 M27 10 L31 14 M16 8 C16 11 18 13 20 13 C22 13 24 11 24 8" },
  { id: "jakker",    label: "Jackets",          sub: "Blazers, bombers, denim",
    path: "M20 8 L13 11 L10 16 L10 38 L30 38 L30 16 L27 11 L20 8 M13 11 L10 16 M27 11 L30 16 M10 22 L15 22 M25 22 L30 22 M15 38 L15 27 L25 27 L25 38" },
  { id: "gensere",   label: "Sweaters",         sub: "Knits, sweatshirts, hoodies",
    path: "M20 8 C18 8 17 9 17 12 C14 10 11 14 11 20 L15 21 L15 39 L25 39 L25 21 L29 20 C29 14 26 10 23 12 C23 9 22 8 20 8 M17 12 C17 15 18 17 20 17 C22 17 23 15 23 12" },
  { id: "topper",    label: "Tops",             sub: "T-shirts, tanks, camisoles",
    path: "M14 9 L8 15 L13 17 L13 39 L27 39 L27 17 L32 15 L26 9 M14 9 C16 13 18 14 20 14 C22 14 24 13 26 9" },
  { id: "skjorter",  label: "Shirts/blouses",   sub: "Shirts and blouses",
    path: "M14 8 L8 14 L13 16 L13 40 L27 40 L27 16 L32 14 L26 8 M14 8 C16 12 18 13 20 13 C22 13 24 12 26 8 M20 13 L20 22 M17 16 L17 20 M23 16 L23 20" },
  { id: "bukser",    label: "Trousers",         sub: "All cuts and fabrics",
    path: "M12 8 L12 26 L18 40 L20 40 L20 26 M28 8 L28 26 L22 40 L20 40 M12 8 L28 8 M12 16 L28 16" },
  { id: "skjort",    label: "Skirts",           sub: "Midi, maxi, mini",
    path: "M13 9 L27 9 L27 12 L31 40 L9 40 L13 12 Z M16 9 L16 12 M24 9 L24 12" },
  { id: "kjoler",    label: "Dresses",          sub: "Dresses of all kinds",
    path: "M20 6 C18 6 16 7 16 10 C13 9 11 11 11 11 L9 40 L31 40 L29 11 C29 11 27 9 24 10 C24 7 22 6 20 6 M16 10 C16 13 18 15 20 15 C22 15 24 13 24 10 M13 26 L27 26" },
  { id: "sko",       label: "Shoes",            sub: "All types of footwear",
    path: "M17 22 L17 14 C17 11 18 9 20 9 C22 9 23 11 23 14 L23 22 M9 22 L31 22 C33 22 35 24 35 27 L35 30 L5 30 L5 27 C5 24 7 22 9 22" },
  { id: "vesker",    label: "Bags",             sub: "Bags and accessories",
    path: "M13 20 L11 40 L29 40 L27 20 Z M13 20 L27 20 M15 20 C15 14 17 11 20 11 C23 11 25 14 25 20 M11 29 L29 29" },
];

const PRESET_COLORS = [
  { name: "Black",         hex: "#111111" },
  { name: "Charcoal",      hex: "#3a3a3a" },
  { name: "Gray",          hex: "#6b7280" },
  { name: "Silver",        hex: "#9ca3af" },
  { name: "White",         hex: "#f4f4f6" },
  { name: "Parchment",     hex: "#f0e8dc" },
  { name: "Cream",         hex: "#e8e0d0" },
  { name: "Taupe",         hex: "#c4b49a" },
  { name: "Sand",          hex: "#d4c5a9" },
  { name: "Camel",         hex: "#b5833a" },
  { name: "Cognac",        hex: "#8b4513" },
  { name: "Midnight",      hex: "#0f1f3d" },
  { name: "Navy",          hex: "#1a1814" },
  { name: "Dusty blue",    hex: "#7a8fa0" },
  { name: "Light blue",    hex: "#b8ccd8" },
  { name: "Olive",         hex: "#4a5c3f" },
  { name: "Moss",          hex: "#6b7c5a" },
  { name: "Bottle green",  hex: "#2d4a3e" },
  { name: "Forest green",  hex: "#3a5c45" },
  { name: "Burgundy",      hex: "#7a2535" },
  { name: "Deep red",      hex: "#8b1a2a" },
  { name: "Rust",          hex: "#a0522d" },
  { name: "Terracotta",    hex: "#c1673a" },
  { name: "Dusty rose",    hex: "#c4a0a0" },
  { name: "Antique pink",  hex: "#d4a5a0" },
  { name: "Purple",        hex: "#7a6080" },
  { name: "Plum",          hex: "#5a3a5a" },
  { name: "Brown",         hex: "#6b4c3a" },
  { name: "Chocolate",     hex: "#3d2314" },
  { name: "Khaki",         hex: "#a0956b" },
  { name: "Beige",         hex: "#d4c5a0" },
];

// Migration maps — translate legacy Norwegian profile data on load
const COLOR_NAME_MIGRATION = {
  "Svart": "Black", "Kullgrå": "Charcoal", "Grå": "Gray", "Sølvgrå": "Silver",
  "Hvit": "White", "Kremhvit": "Cream", "Kamel": "Camel",
  "Midnattsblå": "Midnight", "Midnight blue": "Midnight", "Støvblå": "Dusty blue", "Lyseblå": "Light blue",
  "Olivengrønt": "Olive", "Mosegrønt": "Moss", "Flaskegrønt": "Bottle green",
  "Skogsgrønt": "Forest green", "Burgunder": "Burgundy", "Dyprød": "Deep red",
  "Terrakotta": "Terracotta", "Støvroset": "Dusty rose", "Gammelrosa": "Antique pink",
  "Lilla": "Purple", "Plomme": "Plum", "Brun": "Brown", "Sjokolade": "Chocolate",
};

const STYLE_REF_MIGRATION = {
  "Europeisk intellektuell": "European intellectual",
  "Klassisk og tidløs": "Classic and timeless",
  "Minimalistisk": "Minimalist",
  "Androgyn": "Androgynous",
  "Romantisk og feminin": "Romantic and feminine",
  "Skulpturelt og avant-garde": "Sculptural and avant-garde",
  "Casual og uformell": "Casual",
};

// When migrating old references → anchors, these items are really expressions
// (modal register), not anchors (identity). Move them out of anchors.
const EXPRESSION_FROM_LEGACY = {
  "Casual": "Casual",
  "Casual og uformell": "Casual",
};

const SK = { profile: "grd-profile", wardrobe: "grd-wardrobe", chat: "grd-chat" };

// ─── Styles ───────────────────────────────────────────────────────────────────

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Mono:wght@300;400;500&display=swap');`;

// Brand identity v1.0 — primary palette + extended editorial palette.
// Burgundy is the single accent; never compete with it.
const css = `
  :root {
    --bg:        #f4f4f6;
    --surface:   #fafafa;
    --ink:       #1a1814;
    --ink-mid:   #6b6560;
    --ink-muted: #9c9590;
    --hairline:  #e4e0da;
    --burgundy:  #7a2535;
    --blush:     #e8b4b8;
    --midnight:  #0f1f3d;
    --taupe:     #c4b49a;
    --olive:     #4a5c3f;
    --espresso:  #2a2420;
    --parchment: #f0e8dc;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: #1a1814; color: #f4f4f6; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d4cfc8; }
  html, body { background: #f4f4f6; color: #1a1814; }
  body { text-transform: lowercase; -webkit-font-smoothing: antialiased; font-feature-settings: "kern" 1, "liga" 1; }
  input, textarea, [data-preserve-case], [data-preserve-case] * { text-transform: none !important; }
  textarea, input { font-family: 'Fraunces', 'Times New Roman', Times, serif; font-weight: 300; }
  textarea:focus, input:focus { outline: none; }
  textarea { resize: none; }
  .tenue-mark { font-family: 'Fraunces', 'Times New Roman', Times, serif; font-weight: 300; letter-spacing: -0.01em; line-height: 1; }
  .tenue-display { font-family: 'Fraunces', 'Times New Roman', Times, serif; font-weight: 300; letter-spacing: -0.015em; line-height: 1.05; }
  .tenue-label { font-family: 'DM Mono', 'Courier New', monospace; font-weight: 300; letter-spacing: 0.16em; text-transform: lowercase; }
  .tenue-rule { height: 1px; background: var(--burgundy); border: 0; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dot {
    0%, 100% { opacity: 0.2; transform: translateY(0); }
    50%       { opacity: 1;   transform: translateY(-4px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

// ─── Storage ──────────────────────────────────────────────────────────────────
// Tries window.storage (Claude native) first, falls back to localStorage

async function save(key, value) {
  const str = JSON.stringify(value);
  try {
    if (window.storage?.set) { await window.storage.set(key, str); return; }
  } catch {}
  try { localStorage.setItem(key, str); } catch {}
}

async function load(key) {
  try {
    if (window.storage?.get) {
      const r = await window.storage.get(key);
      if (r?.value) return JSON.parse(r.value);
    }
  } catch {}
  try {
    const str = localStorage.getItem(key);
    if (str) return JSON.parse(str);
  } catch {}
  return null;
}

async function del(key) {
  try { if (window.storage?.delete) await window.storage.delete(key); } catch {}
  try { localStorage.removeItem(key); } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Compress image to JPEG via canvas — keeps files small enough for storage
function compressImage(file, maxPx = 480, quality = 0.72) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onerror = rej;
    reader.onload = e => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width  * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataURL = canvas.toDataURL("image/jpeg", quality);
        res({ dataURL, base64: dataURL.split(",")[1], mediaType: "image/jpeg" });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function b64url(base64, mt) { return `data:${mt};base64,${base64}`; }

// Per-category storage — avoids hitting 5MB single-key limit
function catKey(catId) { return `grd-cat-${catId}`; }

async function saveCategory(catId, items) {
  const toStore = items.map(({ preview: _, ...r }) => r);
  await save(catKey(catId), toStore);
}

async function loadCategory(catId) {
  const items = await load(catKey(catId));
  if (!Array.isArray(items)) return [];
  return items.map(item => ({ ...item, preview: b64url(item.base64, item.mediaType || "image/jpeg") }));
}

async function deleteAllCategories() {
  for (const cat of GARMENT_CATEGORIES) await del(catKey(cat.id));
}

// Migrate legacy Norwegian profile data to English names,
// and fold legacy `references` + `customRef` into the new `anchors` + `expressions` model.
function migrateProfile(p) {
  if (!p) return p;
  const migrated = { ...p };
  if (Array.isArray(p.colors)) {
    migrated.colors = p.colors.map(c => COLOR_NAME_MIGRATION[c] || c);
  }
  if (Array.isArray(p.references)) {
    migrated.references = p.references.map(r => STYLE_REF_MIGRATION[r] || r);
  }

  // Only auto-migrate if the new fields don't already exist (first load after upgrade).
  if (!Array.isArray(p.anchors)) {
    const legacyRefs = (Array.isArray(migrated.references) ? migrated.references : []);
    const legacyCustom = typeof p.customRef === "string" && p.customRef.trim() ? [p.customRef.trim()] : [];
    const all = [...legacyRefs, ...legacyCustom];
    // Anything mapped to an expression gets split out, not kept as an anchor.
    const pulledExpressions = [];
    const anchorsOnly = [];
    for (const item of all) {
      if (EXPRESSION_FROM_LEGACY[item]) {
        pulledExpressions.push(EXPRESSION_FROM_LEGACY[item]);
      } else {
        anchorsOnly.push(item);
      }
    }
    migrated.anchors = Array.from(new Set(anchorsOnly)).slice(0, 3);
    if (!Array.isArray(p.expressions)) {
      migrated.expressions = Array.from(new Set(pulledExpressions)).slice(0, 3);
    }
  }
  if (!Array.isArray(migrated.expressions)) migrated.expressions = [];

  return migrated;
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Mono({ children, style = {} }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      fontWeight: 300,
      fontSize: "0.58rem",
      letterSpacing: "0.16em",
      textTransform: "lowercase",
      ...style,
    }}>{children}</span>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, small = false }) {
  const s = {
    border: "none",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontWeight: 300,
    fontSize: small ? "0.55rem" : "0.6rem",
    letterSpacing: "0.18em",
    textTransform: "lowercase",
    cursor: disabled ? "default" : "pointer",
    padding: small ? "0.5rem 1rem" : "0.85rem 2rem",
    transition: "background 0.2s, color 0.2s, opacity 0.2s",
    opacity: disabled ? 0.45 : 1,
  };
  const v = {
    primary:  { background: "#1a1814", color: "#f4f4f6" },
    ghost:    { background: "transparent", color: "#1a1814", border: "1px solid #1a1814" },
    danger:   { background: "transparent", color: "#7a2535", border: "1px solid #d4cfc8" },
    accent:   { background: "#7a2535", color: "#f4f4f6" },
    muted:    { background: "transparent", color: "#9c9590", border: "1px solid #e4e0da" },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...s, ...v[variant] }}>{children}</button>;
}

function Spinner() {
  return (
    <div style={{
      width: "12px", height: "12px",
      border: "1.5px solid #d8d4ce", borderTopColor: "#1a1814",
      borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block",
    }} />
  );
}

// Render chat-style text: strip markdown bold (**...**), turn [text](url) and bare urls
// into proper anchor tags. Sentence casing preserved (caller wraps in data-preserve-case).
function RichText({ text }) {
  if (!text) return null;
  // 1. Drop ** wrappers around brand/product names — keep the inner text plain.
  let src = String(text).replace(/\*\*(.+?)\*\*/g, "$1");
  // 2. Tokenize: markdown links first, then bare URLs.
  const tokens = [];
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRe  = /\bhttps?:\/\/[^\s<>()"']+/g;
  let cursor = 0;
  // Pull out [text](url) first
  src.replace(linkRe, (match, label, url, idx) => {
    if (idx > cursor) tokens.push({ type: "text", value: src.slice(cursor, idx) });
    tokens.push({ type: "link", label, url });
    cursor = idx + match.length;
    return match;
  });
  if (cursor < src.length) tokens.push({ type: "text", value: src.slice(cursor) });
  // Then split text segments on bare URLs
  const final = [];
  for (const tok of tokens) {
    if (tok.type !== "text") { final.push(tok); continue; }
    let last = 0;
    const s = tok.value;
    s.replace(urlRe, (url, idx) => {
      if (idx > last) final.push({ type: "text", value: s.slice(last, idx) });
      // Trim trailing punctuation that shouldn't be part of the URL
      const trimmed = url.replace(/[.,;:!?)\]]+$/, "");
      const tail = url.slice(trimmed.length);
      final.push({ type: "link", label: trimmed, url: trimmed });
      if (tail) final.push({ type: "text", value: tail });
      last = idx + url.length;
      return url;
    });
    if (last < s.length) final.push({ type: "text", value: s.slice(last) });
  }
  return (
    <>
      {final.map((tok, i) => {
        if (tok.type === "link") {
          return (
            <a key={i} href={tok.url} target="_blank" rel="noopener noreferrer"
               style={{ color: "#7a2535", textDecoration: "underline", textUnderlineOffset: "2px", textDecorationThickness: "0.5px" }}>
              {tok.label}
            </a>
          );
        }
        return <span key={i}>{tok.value}</span>;
      })}
    </>
  );
}

function BackBtn({ onClick, label = "Back" }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", border: "none", cursor: "pointer",
      fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
      letterSpacing: "0.12em", color: "#9c9590", textTransform: "lowercase",
      display: "flex", alignItems: "center", gap: "0.4rem",
    }}>← {label}</button>
  );
}

// ─── Category Circle Button ───────────────────────────────────────────────────

function CategoryCircle({ cat, count, active, onClick }) {
  const [hover, setHover] = useState(false);
  const stroke = active ? "#1a1814" : hover ? "#6b6560" : "#9c9590";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "0.55rem", background: "transparent", border: "none",
        cursor: "pointer", padding: "0", flex: "0 0 auto",
      }}
    >
      <div style={{
        width: "68px", height: "68px", borderRadius: "50%",
        border: active ? "1px solid #1a1814" : hover ? "1px solid #9c9590" : "1px solid #d4cfc8",
        background: active ? "#1a1814" : "#fafafa",
        position: "relative",
        transition: "all 0.2s",
        transform: hover ? "scale(1.05)" : "scale(1)",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 44 48" width="32" height="32" stroke={active ? "#fafafa" : stroke} fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d={cat.path} />
        </svg>
        {count > 0 && (
          <div style={{
            position: "absolute", bottom: "0px", right: "0px",
            background: "#7a2535", color: "#f4f4f6",
            borderRadius: "50%", width: "16px", height: "16px",
            fontSize: "0.45rem", fontFamily: "'DM Mono', monospace",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{count}</div>
        )}
      </div>
      <Mono style={{
        color: active ? "#1a1814" : "#9c9590",
        fontSize: "0.5rem", lineHeight: 1,
        maxWidth: "68px", textAlign: "center",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{cat.label}</Mono>
    </button>
  );
}

// ─── Anchor Picker ───────────────────────────────────────────────────────────
// Anchors = who/what grounds your style. Can be an archetype (Academic, Diplomat)
// or a person (Alain Delon). Max 3 — forces signal over noise.

const ANCHOR_MAX = 3;

const ANCHOR_GROUPS = [
  { label: "Archetypes", refs: [
    "Academic", "Diplomat", "Architect", "Journalist",
    "Naval officer", "Italian industrialist", "Country gentleman",
    "European intellectual", "Minimalist", "Classic and timeless",
  ]},
  { label: "Icons", refs: [
    "Alain Delon", "JFK Jr", "Bryan Ferry", "Gianni Agnelli",
    "James Bond", "Steve McQueen",
  ]},
];

function AnchorPicker({ anchors, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(ANCHOR_GROUPS[0].label);
  const [draft, setDraft] = useState("");
  const count = anchors.length;
  const atMax = count >= ANCHOR_MAX;

  function toggle(a) {
    if (anchors.includes(a)) onChange(anchors.filter(x => x !== a));
    else if (!atMax) onChange([...anchors, a]);
  }
  function addCustom() {
    const v = draft.trim();
    if (!v || atMax || anchors.includes(v)) return;
    onChange([...anchors, v]);
    setDraft("");
  }
  function remove(a) { onChange(anchors.filter(x => x !== a)); }

  return (
    <div style={{ marginBottom: "1.75rem" }}>
      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${open ? "#1a1814" : "#7a2535"}`,
          padding: "0.5rem 0", cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <Mono style={{ color: "#6b6560", flexShrink: 0 }}>Anchors</Mono>
          {count > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "nowrap", overflow: "hidden" }}>
              {anchors.slice(0, 2).map(r => (
                <span key={r} data-preserve-case="true" style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.8rem", color: "#6b6560",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{r}</span>
              ))}
              {count > 2 && <Mono style={{ color: "#9c9590", fontSize: "0.45rem", flexShrink: 0 }}>+{count - 2}</Mono>}
            </div>
          )}
        </div>
        <Mono style={{ color: "#9c9590", fontSize: "0.55rem", flexShrink: 0 }}>
          {count}/{ANCHOR_MAX} {open ? "▲" : "▼"}
        </Mono>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ border: "1px solid #d4cfc8", borderTop: "none", background: "#fafafa", animation: "fadeUp 0.15s ease" }}>
          {/* Selected anchors row */}
          {count > 0 && (
            <div style={{ padding: "0.85rem 0.9rem 0", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {anchors.map(a => (
                <button key={a} onClick={() => remove(a)} data-preserve-case="true" style={{
                  border: "1px solid #1a1814", background: "#1a1814",
                  color: "#f4f4f6", padding: "0.35rem 0.75rem",
                  fontFamily: "'Fraunces', Georgia, serif", fontSize: "0.85rem",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "0.45rem",
                }}>
                  {a}
                  <span style={{ fontSize: "0.7rem", opacity: 0.75 }}>✕</span>
                </button>
              ))}
            </div>
          )}

          {/* Group tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #d4cfc8", marginTop: count > 0 ? "0.85rem" : 0 }}>
            {ANCHOR_GROUPS.map(g => (
              <button key={g.label} onClick={() => setActiveGroup(g.label)} style={{
                background: "transparent", border: "none",
                borderBottom: activeGroup === g.label ? "1.5px solid #1a1814" : "1.5px solid transparent",
                padding: "0.6rem 0.85rem", cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "'DM Mono', monospace", fontSize: "0.5rem",
                letterSpacing: "0.12em", textTransform: "lowercase",
                color: activeGroup === g.label ? "#1a1814" : "#9c9590",
                transition: "all 0.15s",
              }}>{g.label}</button>
            ))}
          </div>

          {/* Suggestion chips */}
          <div style={{ padding: "0.85rem 0.9rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {(ANCHOR_GROUPS.find(g => g.label === activeGroup)?.refs || []).map(r => {
              const on = anchors.includes(r);
              const disabled = !on && atMax;
              return (
                <button key={r} onClick={() => toggle(r)} disabled={disabled} data-preserve-case="true" style={{
                  border: `1px solid ${on ? "#1a1814" : "#7a2535"}`,
                  background: on ? "#1a1814" : "transparent",
                  color: on ? "#f4f4f6" : disabled ? "#c0beb9" : "#6b6560",
                  padding: "0.4rem 0.85rem",
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.9rem",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                  transition: "all 0.15s",
                }}>{r}</button>
              );
            })}
          </div>

          {/* Free text input */}
          <div style={{ padding: "0 0.9rem 0.85rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
              disabled={atMax}
              placeholder={atMax ? "Remove an anchor to add another" : "Add your own — e.g. 1970s academic"}
              style={{
                flex: 1, border: "none", borderBottom: "1px solid #d4cfc8",
                background: "transparent", padding: "0.45rem 0",
                fontSize: "0.95rem", color: "#1a1814",
                fontFamily: "'Fraunces', Georgia, serif",
                opacity: atMax ? 0.45 : 1,
              }}
            />
            <button
              onClick={addCustom}
              disabled={atMax || !draft.trim()}
              style={{
                border: "none", background: "transparent",
                fontFamily: "'DM Mono', monospace", fontSize: "0.55rem",
                letterSpacing: "0.12em", color: "#1a1814",
                cursor: (atMax || !draft.trim()) ? "not-allowed" : "pointer",
                opacity: (atMax || !draft.trim()) ? 0.3 : 1,
                padding: "0.3rem 0.5rem",
              }}
            >add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Expression Picker ───────────────────────────────────────────────────────
// Expressions = the modal register you operate in. Pick 1-3 defaults.

const EXPRESSION_MAX = 3;
const EXPRESSION_OPTIONS = [
  "Formal", "Smart-casual", "Casual", "Strict", "Relaxed", "Sporty",
];

function ExpressionPicker({ expressions, onChange }) {
  const [open, setOpen] = useState(false);
  const count = expressions.length;
  const atMax = count >= EXPRESSION_MAX;

  function toggle(e) {
    if (expressions.includes(e)) onChange(expressions.filter(x => x !== e));
    else if (!atMax) onChange([...expressions, e]);
  }

  return (
    <div style={{ marginBottom: "1.75rem" }}>
      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${open ? "#1a1814" : "#7a2535"}`,
          padding: "0.5rem 0", cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <Mono style={{ color: "#6b6560", flexShrink: 0 }}>Expressions</Mono>
          {count > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "nowrap", overflow: "hidden" }}>
              {expressions.slice(0, 3).map(r => (
                <span key={r} data-preserve-case="true" style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.8rem", color: "#6b6560",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{r}</span>
              ))}
            </div>
          )}
        </div>
        <Mono style={{ color: "#9c9590", fontSize: "0.55rem", flexShrink: 0 }}>
          {count}/{EXPRESSION_MAX} {open ? "▲" : "▼"}
        </Mono>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ border: "1px solid #d4cfc8", borderTop: "none", background: "#fafafa", animation: "fadeUp 0.15s ease" }}>
          <div style={{ padding: "0.85rem 0.9rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {EXPRESSION_OPTIONS.map(e => {
              const on = expressions.includes(e);
              const disabled = !on && atMax;
              return (
                <button key={e} onClick={() => toggle(e)} disabled={disabled} data-preserve-case="true" style={{
                  border: `1px solid ${on ? "#1a1814" : "#7a2535"}`,
                  background: on ? "#1a1814" : "transparent",
                  color: on ? "#f4f4f6" : disabled ? "#c0beb9" : "#6b6560",
                  padding: "0.4rem 0.85rem",
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.9rem",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                  transition: "all 0.15s",
                }}>{e}</button>
              );
            })}
          </div>
          <div style={{ padding: "0 0.9rem 0.85rem" }}>
            <Mono style={{ color: "#9c9590", fontSize: "0.48rem" }}>
              The modes you normally operate in. Pick 1–3.
            </Mono>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker ────────────────────────────────────────────────────────────

const COLOR_GROUPS = [
  { label: "Neutrals", colors: ["Black", "Charcoal", "Gray", "Silver", "White", "Cream"] },
  { label: "Earth & warm", colors: ["Taupe", "Sand", "Beige", "Camel", "Cognac", "Brown", "Chocolate", "Khaki"] },
  { label: "Blue & gray", colors: ["Midnight blue", "Navy", "Dusty blue", "Light blue"] },
  { label: "Green", colors: ["Olive", "Moss", "Forest green", "Bottle green"] },
  { label: "Red & warm", colors: ["Burgundy", "Deep red", "Rust", "Terracotta"] },
  { label: "Pink & purple", colors: ["Dusty rose", "Antique pink", "Purple", "Plum"] },
];

function ColorPicker({ selColors, onToggle }) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(COLOR_GROUPS[0].label);

  const selectedCount = selColors.length;

  return (
    <div style={{ marginBottom: "1.75rem" }}>
      {/* Header row */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${open ? "#1a1814" : "#7a2535"}`,
          padding: "0.5rem 0", cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Mono style={{ color: "#6b6560" }}>Color palette</Mono>
          {/* Selected swatches preview */}
          <div style={{ display: "flex", gap: "3px" }}>
            {selColors.slice(0, 8).map(name => {
              const c = PRESET_COLORS.find(p => p.name === name);
              return c ? (
                <div key={name} style={{
                  width: "10px", height: "10px", background: c.hex, flexShrink: 0,
                  border: (c.hex === "#f4f4f6" || c.hex === "#e8e0d0") ? "1px solid #c0beb9" : "none",
                }} />
              ) : null;
            })}
            {selColors.length > 8 && <Mono style={{ color: "#9c9590", fontSize: "0.45rem" }}>+{selColors.length - 8}</Mono>}
          </div>
        </div>
        <Mono style={{ color: "#9c9590", fontSize: "0.55rem" }}>
          {selectedCount > 0 ? `${selectedCount} selected` : ""}{" "}{open ? "▲" : "▼"}
        </Mono>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{ border: "1px solid #d4cfc8", borderTop: "none", background: "#fafafa", animation: "fadeUp 0.15s ease" }}>
          {/* Group tabs */}
          <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #d4cfc8" }}>
            {COLOR_GROUPS.map(g => (
              <button key={g.label} onClick={() => setActiveGroup(g.label)} style={{
                background: "transparent", border: "none",
                borderBottom: activeGroup === g.label ? "1.5px solid #1a1814" : "1.5px solid transparent",
                padding: "0.6rem 0.75rem", cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "'DM Mono', monospace", fontSize: "0.5rem",
                letterSpacing: "0.12em", textTransform: "lowercase",
                color: activeGroup === g.label ? "#1a1814" : "#9c9590",
                transition: "all 0.15s", flexShrink: 0,
              }}>{g.label}</button>
            ))}
          </div>

          {/* Color swatches for active group */}
          <div style={{ padding: "0.85rem 0.9rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {(COLOR_GROUPS.find(g => g.label === activeGroup)?.colors || []).map(name => {
              const c = PRESET_COLORS.find(p => p.name === name);
              if (!c) return null;
              const on = selColors.includes(name);
              return (
                <button key={name} onClick={() => onToggle(name)} style={{
                  display: "flex", alignItems: "center", gap: "0.45rem",
                  border: `1px solid ${on ? "#1a1814" : "#7a2535"}`,
                  background: on ? "#1a1814" : "transparent",
                  padding: "0.3rem 0.6rem", cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{
                    width: "12px", height: "12px", background: c.hex, flexShrink: 0,
                    border: (c.hex === "#f4f4f6" || c.hex === "#e8e0d0") ? "1px solid #c0beb9" : "none",
                  }} />
                  <Mono style={{ color: on ? "#f4f4f6" : "#9c9590", fontSize: "0.5rem" }}>{name}</Mono>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile Step ─────────────────────────────────────────────────────────────

function ProfileStep({ onComplete, existing }) {
  const [name, setName]           = useState(existing?.name || "");
  const [anchors, setAnchors]     = useState(Array.isArray(existing?.anchors) ? existing.anchors : []);
  const [expressions, setExpressions] = useState(Array.isArray(existing?.expressions) ? existing.expressions : []);
  const [selColors, setSelColors] = useState(existing?.colors || []);
  const [notes, setNotes]         = useState(existing?.notes || "");
  const [saving, setSaving]       = useState(false);

  const toggleColor = c => setSelColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const canGo = name.trim() && selColors.length > 0;

  async function go() {
    setSaving(true);
    const profile = {
      name: name.trim(),
      anchors: anchors.slice(0, ANCHOR_MAX),
      expressions: expressions.slice(0, EXPRESSION_MAX),
      // Keep legacy fields written as empty so old readers don't explode,
      // but new code paths read from anchors/expressions.
      references: [],
      customRef: "",
      colors: selColors,
      notes: notes.trim(),
    };
    await save(SK.profile, profile);
    setSaving(false);
    onComplete(profile);
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "2.5rem 1.5rem", animation: "fadeUp 0.5s ease" }}>
      <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.6rem" }}>
        {existing ? "edit" : "profile"}
      </Mono>
      <h1 style={{ fontFamily: "'Fraunces'", fontSize: "2.6rem", fontWeight: "300", color: "#1a1814", marginBottom: "0.3rem", letterSpacing: "0.01em" }}>
        Your style
      </h1>
      <p style={{ fontSize: "1.05rem", color: "#6b6560", marginBottom: "2.25rem", lineHeight: "1.65", fontFamily: "'Fraunces', Georgia, serif" }}>
        The expert needs to know you.
      </p>

      <label style={{ display: "block", marginBottom: "1.5rem" }}>
        <Mono style={{ color: "#6b6560", display: "block", marginBottom: "0.5rem" }}>Your name</Mono>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
          style={{ width: "100%", border: "none", borderBottom: "1px solid #dedad4", background: "transparent", padding: "0.6rem 0", fontSize: "1.1rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
      </label>

      <AnchorPicker anchors={anchors} onChange={setAnchors} />

      <ExpressionPicker expressions={expressions} onChange={setExpressions} />

      <ColorPicker selColors={selColors} onToggle={toggleColor} />

      <div style={{ marginBottom: "2rem" }}>
        <Mono style={{ color: "#6b6560", display: "block", marginBottom: "0.5rem" }}>
          Lifestyle / occasions / restrictions (optional)
        </Mono>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="E.g.: works in an office, travels a lot, avoids synthetic fabrics…"
          style={{ width: "100%", border: "1px solid #dedad4", background: "#fafafa", padding: "0.7rem 1rem", fontSize: "0.95rem", lineHeight: "1.6", color: "#1a1814" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Btn onClick={go} disabled={!canGo || saving}>
          {saving ? "Saving…" : "Save profile"}
        </Btn>
        {saving && <Spinner />}
      </div>
    </div>
  );
}

// ─── Garment Row ─────────────────────────────────────────────────────────────

function GarmentRow({ item, idx, onRemove, onUpdate, onAttachImage }) {
  const [expanded, setExpanded] = useState(!item.name);
  const imgRef = useRef();
  const hasImage = !!item.preview;

  return (
    <div style={{ background: "#fafafa", borderBottom: "1px solid #d4cfc8", overflow: "hidden" }}>
      {/* Collapsed header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0.9rem", cursor: "pointer" }}
        onClick={() => setExpanded(p => !p)}>
        <div style={{ width: "36px", height: "48px", flexShrink: 0, background: "#e8e8eb", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {hasImage
            ? <img src={item.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Mono style={{ color: "#b4b0a8", fontSize: "0.45rem" }}>{String(idx + 1).padStart(2, "0")}</Mono>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p {...(item.name ? { "data-preserve-case": "true" } : {})} style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem", fontWeight: "400", color: item.name ? "#1a1814" : "#9c9590", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.name || "unnamed item"}
          </p>
          {(item.color || item.brand || item.material) && (
            <Mono style={{ color: "#9c9590", fontSize: "0.5rem" }}><span data-preserve-case="true">{[item.color, item.brand, item.material].filter(Boolean).join(" · ")}</span></Mono>
          )}
        </div>
        <Mono style={{ color: "#9c9590", fontSize: "0.5rem", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</Mono>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div style={{ padding: "0 0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <input value={item.name} onChange={e => onUpdate("name", e.target.value)} placeholder="Name"
            onClick={e => e.stopPropagation()}
            style={{ border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.5rem 0", fontSize: "1.05rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif", width: "100%" }} />
          <div style={{ display: "flex", gap: "1rem" }}>
            <input value={item.color} onChange={e => onUpdate("color", e.target.value)} placeholder="Color"
              onClick={e => e.stopPropagation()}
              style={{ flex: 1, border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.4rem 0", fontSize: "0.9rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
            <input value={item.brand || ""} onChange={e => onUpdate("brand", e.target.value)} placeholder="Brand"
              onClick={e => e.stopPropagation()}
              style={{ flex: 1, border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.4rem 0", fontSize: "0.9rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
          </div>
          <input value={item.material || ""} onChange={e => onUpdate("material", e.target.value)} placeholder="Material"
            onClick={e => e.stopPropagation()}
            style={{ border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.4rem 0", fontSize: "0.9rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif", width: "100%" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "lowercase", color: hasImage ? "#7a2535" : "#9c9590", cursor: "pointer", borderBottom: "1px solid #d4cfc8", paddingBottom: "1px" }}>
              {hasImage ? "Change image" : "Upload image"}
              <input ref={imgRef} type="file" accept="image/*" hidden onChange={e => { if (e.target.files[0]) onAttachImage(e.target.files[0]); }} />
            </label>
            {hasImage && (
              <button onClick={e => { e.stopPropagation(); onUpdate("preview", null); onUpdate("base64", null); onUpdate("mediaType", null); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#9c9590", textTransform: "lowercase" }}>Remove image</button>
            )}
            <button onClick={e => { e.stopPropagation(); onRemove(); }}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#b08080", textTransform: "lowercase", marginLeft: "auto" }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Wardrobe Step ────────────────────────────────────────────────────────────

function WardrobeStep({ profile, onComplete, onBack, existing }) {
  const empty = Object.fromEntries(GARMENT_CATEGORIES.map(c => [c.id, []]));
  const [wardrobe, setWardrobe] = useState(existing || empty);
  const [activeCat, setActiveCat] = useState(null); // null = overview
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const total = Object.values(wardrobe).reduce((s, a) => s + a.length, 0);
  const cat = GARMENT_CATEGORIES.find(c => c.id === activeCat);

  async function handleFiles(files) {
    const newItems = await Promise.all(Array.from(files).map(async f => {
      const { dataURL, base64, mediaType } = await compressImage(f);
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, preview: dataURL, base64, mediaType, name: f.name, note: "" };
    }));
    setWardrobe(prev => {
      const updated = { ...prev, [activeCat]: [...prev[activeCat], ...newItems] };
      saveCategory(activeCat, updated[activeCat]);
      return updated;
    });
  }

  function removeItem(id) {
    setWardrobe(prev => {
      const updated = { ...prev, [activeCat]: prev[activeCat].filter(i => i.id !== id) };
      saveCategory(activeCat, updated[activeCat]);
      return updated;
    });
  }
  function setNote(id, note) {
    setWardrobe(prev => {
      const updated = { ...prev, [activeCat]: prev[activeCat].map(i => i.id === id ? { ...i, note } : i) };
      saveCategory(activeCat, updated[activeCat]);
      return updated;
    });
  }

  async function go() {
    setSaving(true);
    await save(SK.wardrobe, { saved: true });
    setSaving(false);
    onComplete(wardrobe);
  }

  // Add text item
  function addTextItem() {
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      preview: null, base64: null, mediaType: null,
      name: "", color: "", brand: "", material: "",
    };
    setWardrobe(prev => {
      const updated = { ...prev, [activeCat]: [...prev[activeCat], newItem] };
      saveCategory(activeCat, updated[activeCat]);
      return updated;
    });
  }

  function updateField(id, field, value) {
    setWardrobe(prev => {
      const updated = { ...prev, [activeCat]: prev[activeCat].map(i => i.id === id ? { ...i, [field]: value } : i) };
      saveCategory(activeCat, updated[activeCat]);
      return updated;
    });
  }

  async function attachImage(id, file) {
    const { dataURL, base64, mediaType } = await compressImage(file);
    setWardrobe(prev => {
      const updated = { ...prev, [activeCat]: prev[activeCat].map(i => i.id === id ? { ...i, preview: dataURL, base64, mediaType } : i) };
      saveCategory(activeCat, updated[activeCat]);
      return updated;
    });
  }

  // Category detail view — back button returns to category overview (not home)
  if (activeCat) {
    const items = wardrobe[activeCat] || [];
    return (
      <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1.5rem", animation: "slideIn 0.25s ease" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <BackBtn onClick={() => setActiveCat(null)} />
          </div>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.2rem" }}>
            <h2 style={{ fontFamily: "'Fraunces'", fontSize: "2rem", fontWeight: "300", color: "#1a1814", letterSpacing: "0.01em" }}>
              {cat.label}
            </h2>
            {items.length > 0 && <Mono style={{ color: "#7a2535" }}>{items.length} items</Mono>}
          </div>
          <p style={{ fontSize: "0.8rem", color: "#9c9590", marginBottom: "2rem", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>{cat.sub}</p>

          {/* Items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "1.25rem" }}>
            {items.map((item, idx) => (
              <GarmentRow
                key={item.id}
                item={item}
                idx={idx}
                onRemove={() => removeItem(item.id)}
                onUpdate={(field, val) => updateField(item.id, field, val)}
                onAttachImage={(file) => attachImage(item.id, file)}
              />
            ))}
          </div>

          {/* Add buttons */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={addTextItem} style={{
              border: "1px solid #d4cfc8", background: "transparent",
              padding: "0.65rem 1.25rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.14em", textTransform: "lowercase", color: "#6b6560",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.color = "#1a1814"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b6560"; }}
            >+ Add item</button>

            <label style={{
              border: "1px solid #d4cfc8", background: "transparent",
              padding: "0.65rem 1.25rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.14em", textTransform: "lowercase", color: "#6b6560",
              transition: "all 0.15s", display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.color = "#1a1814"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b6560"; }}
            >
              + Upload images
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={async e => {
                const files = Array.from(e.target.files);
                for (const f of files) {
                  const { dataURL, base64, mediaType } = await compressImage(f);
                  const newItem = {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    preview: dataURL, base64, mediaType,
                    name: f.name.replace(/\..*$/, ""), color: "", brand: "", material: "",
                  };
                  setWardrobe(prev => {
                    const updated = { ...prev, [activeCat]: [...prev[activeCat], newItem] };
                    saveCategory(activeCat, updated[activeCat]);
                    return updated;
                  });
                }
              }} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Overview with circles — back button returns to home
  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
        <BackBtn onClick={onBack} />
      </div>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.5rem", animation: "fadeUp 0.5s ease" }}>
        <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.6rem" }}>
          {existing ? "edit" : "wardrobe"}
        </Mono>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.3rem" }}>
          <h1 style={{ fontFamily: "'Fraunces'", fontSize: "2.6rem", fontWeight: "300", color: "#1a1814", letterSpacing: "0.01em" }}>
            Your items
          </h1>
          {total > 0 && <Mono style={{ color: "#7a2535" }}>{total} items</Mono>}
        </div>
        <p style={{ fontSize: "1.05rem", color: "#6b6560", marginBottom: "2.25rem", lineHeight: "1.65", fontFamily: "'Fraunces', Georgia, serif" }}>
          Select a category to upload to.
        </p>

        {/* Circle grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "1.5rem 1rem",
          marginBottom: "3rem",
        }}>
          {GARMENT_CATEGORIES.map(c => {
            const items = wardrobe[c.id] || [];
            return (
              <CategoryCircle
                key={c.id}
                cat={c}
                count={items.length}
                active={false}
                onClick={() => setActiveCat(c.id)}
              />
            );
          })}
        </div>

        <div style={{ borderTop: "1px solid #dedad4", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "#9c9590" }}>
            {total === 0 ? "You can continue without items." : `${total} items uploaded.`}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {saving && <Spinner />}
            <Btn onClick={go} disabled={saving}>
              {saving ? "Saving…" : "Save wardrobe"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Step ────────────────────────────────────────────────────────────────

// Build the persona line used across all prompts: anchors (who), expressions (how), colors, notes.
// Falls back to legacy references+customRef so profiles from before the anchors/expressions migration still work.
function profilePersona(profile) {
  const anchorsArr = Array.isArray(profile.anchors) && profile.anchors.length
    ? profile.anchors
    : [...(profile.references || []), ...(profile.customRef ? [profile.customRef] : [])];
  const expressionsArr = Array.isArray(profile.expressions) ? profile.expressions : [];
  const anchors = anchorsArr.join(", ") || "not specified";
  const expressions = expressionsArr.join(", ") || "not specified";
  const colors = (profile.colors || []).join(", ") || "not specified";
  return { anchors, expressions, colors, notes: profile.notes || "" };
}

function buildSystem(profile, wardrobe) {
  const { anchors, expressions, colors, notes } = profilePersona(profile);

  const lines = wardrobe ? GARMENT_CATEGORIES.flatMap(cat => {
    const items = (wardrobe[cat.id] || []);
    if (!items.length) return [];
    return items.map(item => {
      const parts = [item.color, item.name, item.brand, item.material].filter(Boolean).join(", ");
      return cat.label + ": " + (parts || "unnamed");
    });
  }) : [];

  const wardrobeSummary = lines.length ? lines.join("\n") : "No items registered";

  const base = "You are tenue — a personal style consultant for the considered wardrobe. European in spirit, precise in opinion, never showy. Direct and considered, never chatty. Quality-obsessed but not elitist. Honest about what doesn't work. You favor second-hand first and reference Vestiaire Collective and European quality brands.";
  const personaBlock =
    "User: " + (profile.name || "unknown") + "\n" +
    "Anchors (identity — archetype and/or icons that ground the style): " + anchors + "\n" +
    "Expressions (default modal register — e.g. formal, smart-casual, casual): " + expressions + ". " +
    "If the user specifies an occasion, let that override the default expression.\n" +
    "Color palette: " + colors +
    (notes ? "\nNotes: " + notes : "");
  const formatBlock =
    "Formatting rules:\n" +
    "- Use normal sentence capitalization. Capitalise the first letter of sentences and proper nouns. Use full stops.\n" +
    "- Do NOT wrap brand names, product names, or anything else in markdown bold (** **). Write brand names plainly.\n" +
    "- When you reference a brand, retailer, or website that exists online, include a link in markdown format: [Brand name](https://example.com). Use the official site (e.g. https://www.vestiairecollective.com, https://www.mrporter.com, https://www.cos.com, https://www.uniqlo.com, https://www.massimodutti.com, https://www.arket.com, https://www.zara.com, https://www.matchesfashion.com, https://www.farfetch.com). If you don't know the exact URL, omit the link rather than guess.\n" +
    "- No emoji, no exclamation marks. Be specific, not vague.";
  return base + "\n\n" + personaBlock + "\nWardrobe:\n" + wardrobeSummary + "\n\n" + formatBlock + "\n\nGive concrete, direct advice in English. No empty compliments.";
}


function WardrobePicker({ wardrobe, selected, onToggle }) {
  const [openCat, setOpenCat] = useState(null);
  const allItems = GARMENT_CATEGORIES.flatMap(cat => (wardrobe[cat.id] || []).map(i => ({ ...i, category: cat.label })));

  return (
    <div style={{ borderTop: "1px solid #dedad4", background: "#fafafa", padding: "1rem 1.25rem", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
        <Mono style={{ color: "#6b6560" }}>Select items</Mono>
        {selected.length > 0 && <Mono style={{ color: "#1a1814" }}>{selected.length} selected</Mono>}
      </div>

      {/* Category circles — horizontal scroll */}
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.75rem" }}>
        {GARMENT_CATEGORIES.map(cat => {
          const items = wardrobe[cat.id] || [];
          if (!items.length) return null;
          const isOpen = openCat === cat.id;
          return (
            <CategoryCircle
              key={cat.id}
              cat={cat}
              count={items.length}
              active={isOpen}
              onClick={() => setOpenCat(isOpen ? null : cat.id)}
            />
          );
        })}
      </div>

      {/* Items in selected category */}
      {openCat && (wardrobe[openCat] || []).length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "0.75rem", animation: "fadeUp 0.2s ease" }}>
          {(wardrobe[openCat] || []).map(item => {
            const sel = selected.includes(item.id);
            const hasImg = !!(item.preview || item.base64);
            const src = hasImg ? (item.preview || b64url(item.base64, item.mediaType || "image/jpeg")) : null;
            return (
              <div key={item.id} onClick={() => hasImg && onToggle(item.id)} style={{
                cursor: hasImg ? "pointer" : "default", position: "relative",
                outline: sel ? "1.5px solid #1a1814" : "1.5px solid transparent", outlineOffset: "1px",
              }}>
                {hasImg ? (
                  <img src={src} alt="" style={{ width: "52px", height: "68px", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "52px", height: "68px", background: "#efefef", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                    <Mono style={{ color: "#9c9590", fontSize: "0.38rem", textAlign: "center", lineHeight: 1.4, wordBreak: "break-word" }}>
                      <span data-preserve-case="true">{item.name || "—"}</span>
                    </Mono>
                  </div>
                )}
                {sel && (
                  <div style={{ position: "absolute", top: "2px", right: "2px", background: "#1a1814", color: "#f4f4f6", width: "14px", height: "14px", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChatStep({ profile: profileProp, wardrobe, onBack, onEditProfile, onEditWardrobe, onReset }) {
  const profile = profileProp || { name: "", colors: [], anchors: [], expressions: [], references: [], customRef: "", notes: "" };
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [selected, setSelected]         = useState([]);
  const [showMenu, setShowMenu]         = useState(false);
  const [savingChat, setSavingChat]     = useState(false);
  const [uploadedImgs, setUploadedImgs] = useState([]);
  const bottomRef = useRef();
  const chatUploadRef = useRef();
  const system = buildSystem(profile, wardrobe);

  const allItems = GARMENT_CATEGORIES.flatMap(cat =>
    (wardrobe[cat.id] || []).map(item => ({ ...item, category: cat.label }))
  );

  useEffect(() => {
    (async () => {
      const saved = await load(SK.chat);
      if (!Array.isArray(saved) || saved.length === 0) return;
      // Restore messages and rehydrate the display block for ones missing it
      const valid = saved
        .filter(m => m && m.role && (typeof m.content === "string" || Array.isArray(m.content)))
        .map(m => {
          if (m.display && typeof m.display === "object") return m;
          // Backfill display.text from content so the message renders
          let text = "";
          if (typeof m.content === "string") text = m.content;
          else if (Array.isArray(m.content)) {
            const t = m.content.find(b => b && b.type === "text");
            text = t?.text || "";
          }
          return { ...m, display: { text, images: [] } };
        });
      setMessages(valid);
    })();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const t = setTimeout(async () => {
      setSavingChat(true);
      // Strip base64 image blobs before storing — text only.
      // Content may be a string (text-only) or an array (with images) — handle both.
      const toStore = messages.map(m => {
        let content;
        if (typeof m.content === "string") {
          content = m.content;
        } else if (Array.isArray(m.content)) {
          const textBlocks = m.content.filter(b => b && b.type === "text");
          content = textBlocks.length === 1 ? textBlocks[0].text : textBlocks;
        } else {
          content = String(m.content || "");
        }
        const display = m.display ? { ...m.display, images: [] } : { text: typeof content === "string" ? content : "", images: [] };
        return { role: m.role, content, display };
      });
      await save(SK.chat, toStore);
      setSavingChat(false);
    }, 600);
    return () => clearTimeout(t);
  }, [messages]);

  function toggle(id) { setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

  async function attachImage(file) {
    if (!file) return;
    try {
      const { dataURL, base64, mediaType } = await compressImage(file, 1024, 0.82);
      setUploadedImgs(p => [...p, {
        id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        dataURL, base64, mediaType,
      }]);
    } catch (e) {
      console.error("upload failed:", e);
    }
  }
  function removeUploaded(id) { setUploadedImgs(p => p.filter(u => u.id !== id)); }

  async function send() {
    const text = input.trim();
    if (!text && selected.length === 0 && uploadedImgs.length === 0) return;

    const parts = [];
    const dispImgs = [];

    if (selected.length > 0) {
      const items = allItems.filter(i => selected.includes(i.id));
      for (const item of items) {
        const mt = item.mediaType || "image/jpeg";
        parts.push({ type: "image", source: { type: "base64", media_type: mt, data: item.base64 } });
        const label = [item.category, item.name, item.color, item.material].filter(Boolean).join(" — ");
        parts.push({ type: "text", text: `[${label}]` });
        dispImgs.push({ id: item.id, preview: item.preview || b64url(item.base64, mt) });
      }
    }
    if (uploadedImgs.length > 0) {
      for (const up of uploadedImgs) {
        parts.push({ type: "image", source: { type: "base64", media_type: up.mediaType, data: up.base64 } });
        parts.push({ type: "text", text: "[uploaded image]" });
        dispImgs.push({ id: up.id, preview: up.dataURL });
      }
    }
    if (text) parts.push({ type: "text", text });

    // API requires content to be a string when there are no images
    const apiContent = parts.length === 1 && parts[0].type === "text"
      ? parts[0].text
      : parts;

    const userMsg = { role: "user", content: apiContent, display: { images: dispImgs, text } };

    function normalizeContent(c) {
      if (typeof c === "string" && c.trim()) return c;
      if (Array.isArray(c)) {
        const valid = c.filter(b => b?.type === "text" || b?.type === "image");
        if (!valid.length) return null;
        if (valid.length === 1 && valid[0].type === "text") return valid[0].text;
        return valid;
      }
      const s = String(c || "").trim();
      return s || null;
    }

    const apiMsgs = [...messages, userMsg]
      .map(m => {
        const c = normalizeContent(m.content);
        return c !== null ? { role: m.role, content: c } : null;
      })
      .filter(Boolean);
    setMessages(p => [...p, userMsg]);
    setInput(""); setSelected([]); setUploadedImgs([]); setShowWardrobe(false); setLoading(true);

    try {
      const payload = {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: String(system || "You are a fashion expert. Respond in English."),
        messages: apiMsgs,
      };


      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try { data = await res.json(); } catch(e) {
        throw new Error("Could not read server response");
      }
      if (!res.ok) throw new Error(data?.error?.message || "Server error " + res.status);
      const txt = data.content?.find(b => b.type === "text")?.text || "";
      setMessages(p => [...p, { role: "assistant", content: txt, display: { text: txt, images: [] } }]);
    } catch (err) {
      const errMsg = "Error: " + (err?.message || String(err));
      console.error("SEND ERROR:", errMsg);
      setMessages(p => [...p, { role: "assistant", content: errMsg, display: { text: errMsg, images: [] } }]);
    }
    setLoading(false);
  }

  async function clearChat() { setMessages([]); await del(SK.chat); setShowMenu(false); }
  function onKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f4f4f6" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #dedad4", padding: "0.75rem 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fafafa", flexShrink: 0, gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", minWidth: 0 }}>
          {onBack && <BackBtn onClick={onBack} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div>
                <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: "300", letterSpacing: "0.18em", textTransform: "lowercase", color: "#1a1814" }}>tenue</span>
                <span data-preserve-case="true" style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "0.85rem", color: "#9c9590", marginLeft: "0.75rem" }}>{profile?.name || ""}</span>
              </div>
              <Mono style={{ color: "#7a2535" }}>·</Mono>
              <Mono style={{ color: "#9c9590" }}>{allItems.length} items</Mono>
              {savingChat && <Spinner />}
            </div>
            <div style={{ display: "flex", gap: "4px", marginTop: "3px" }}>
              {profile.colors?.slice(0, 6).map(n => {
                const c = PRESET_COLORS.find(p => p.name === n);
                return c ? (
                  <div key={n} title={n} style={{
                    width: "10px", height: "10px", background: c.hex, flexShrink: 0,
                    border: (c.hex === "#f4f4f6" || c.hex === "#e8e0d0") ? "1px solid #c0beb9" : "none",
                  }} />
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowMenu(p => !p)} style={{
            background: "transparent", border: "1px solid #dedad4",
            padding: "0.4rem 0.65rem", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
            color: "#6b6560", letterSpacing: "0.1em",
          }}>⋯</button>
          {showMenu && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 6px)",
              background: "#fafafa", border: "1px solid #dedad4",
              zIndex: 100, minWidth: "170px", animation: "fadeUp 0.15s ease",
            }}>
              {[
                { label: "Edit profile",         action: () => { setShowMenu(false); onEditProfile(); } },
                { label: "Edit wardrobe",        action: () => { setShowMenu(false); onEditWardrobe(); } },
                { label: "Clear chat history",   action: clearChat, danger: true },
                { label: "Start over",           action: onReset,   danger: true },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "transparent", border: "none", borderBottom: "1px solid #eae6de",
                  padding: "0.6rem 0.85rem", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                  letterSpacing: "0.1em", textTransform: "lowercase",
                  color: item.danger ? "#9a3a3a" : "#6b7280", transition: "background 0.1s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#efefef"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >{item.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem 0", animation: "fadeUp 0.6s ease" }}>
            <p style={{ color: "#6b6560", fontSize: "1rem", lineHeight: "1.8", marginBottom: "1.5rem" }}>
              hi, <span data-preserve-case="true">{profile?.name || "there"}</span>. i know your wardrobe.<br />what would you like to discuss today?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
              {[
                "What can I put together for the office tomorrow?",
                "Is there anything I should get rid of?",
                "What am I missing?",
                "Put together your favorite outfit from what I have",
              ].map(q => (
                <button key={q} onClick={() => setInput(q)} style={{
                  background: "transparent", border: "1px solid #dedad4",
                  padding: "0.45rem 0.85rem", cursor: "pointer",
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.85rem", color: "#6b6560", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.target.style.borderColor = "#1a1814"; e.target.style.color = "#1a1814"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#7a2535"; e.target.style.color = "#7a7874"; }}
                >{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: "stretch",
            animation: "fadeUp 0.3s ease",
            maxWidth: "640px", width: "100%", margin: "0 auto",
          }}>
            <Mono style={{
              color: m.role === "user" ? "#1a1814" : "#7a2535",
              marginBottom: "0.4rem",
              fontSize: "0.5rem",
            }}>
              {m.role === "user"
                ? <span data-preserve-case="true">{profile.name || "you"}</span>
                : "tenue"}
            </Mono>
            {m.display?.images?.length > 0 && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                {m.display.images.map((img, idx) => (
                  <img key={idx} src={img.preview} alt="" style={{ width: "72px", height: "96px", objectFit: "cover" }} />
                ))}
              </div>
            )}
            {m.display?.text && (
              <div data-preserve-case="true" style={{
                color: "#1a1814",
                fontSize: "1rem", lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
                fontWeight: 300,
              }}>
                <RichText text={m.display.text} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "5px", paddingLeft: "4px", alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: "5px", height: "5px", background: "#7a2535",
                animation: `dot 1.2s ease ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Wardrobe picker */}
      {showWardrobe && (
        <WardrobePicker wardrobe={wardrobe} selected={selected} onToggle={toggle} />
      )}

      {/* Input */}
      <div style={{ borderTop: "1px solid #dedad4", padding: "0.85rem 1.25rem", background: "#fafafa", flexShrink: 0 }}>
        {(selected.length > 0 || uploadedImgs.length > 0) && (
          <div style={{ display: "flex", gap: "4px", marginBottom: "0.6rem", flexWrap: "wrap" }}>
            {allItems.filter(i => selected.includes(i.id)).map(item => {
              const src = item.preview || b64url(item.base64, item.mediaType || "image/jpeg");
              return (
                <div key={item.id} style={{ position: "relative" }}>
                  <img src={src} alt="" style={{ width: "36px", height: "48px", objectFit: "cover" }} />
                  <button onClick={() => toggle(item.id)} style={{
                    position: "absolute", top: "-4px", right: "-4px",
                    background: "#1a1814", color: "#f4f4f6", border: "none",
                    width: "14px", height: "14px", cursor: "pointer", fontSize: "0.5rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>×</button>
                </div>
              );
            })}
            {uploadedImgs.map(up => (
              <div key={up.id} style={{ position: "relative" }}>
                <img src={up.dataURL} alt="" style={{ width: "36px", height: "48px", objectFit: "cover", border: "1px dashed #7a2535" }} />
                <button onClick={() => removeUploaded(up.id)} style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#1a1814", color: "#f4f4f6", border: "none",
                  width: "14px", height: "14px", cursor: "pointer", fontSize: "0.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>×</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          {allItems.length > 0 && (
            <button onClick={() => setShowWardrobe(p => !p)} title="Open wardrobe" style={{
              border: `1px solid ${showWardrobe ? "#1a1814" : "#7a2535"}`,
              background: showWardrobe ? "#1a1814" : "transparent",
              color: showWardrobe ? "#f4f4f6" : "#6b7280",
              padding: "0.6rem 0.75rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.1em", transition: "all 0.15s", height: "44px",
            }}>▤</button>
          )}
          <button onClick={() => chatUploadRef.current?.click()} title="Upload image" style={{
            border: "1px solid #7a2535", background: "transparent", color: "#6b7280",
            padding: "0.6rem 0.75rem", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "0.9rem",
            letterSpacing: "0.1em", transition: "all 0.15s", height: "44px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
          <input
            ref={chatUploadRef} type="file" accept="image/*" hidden
            onChange={e => { const f = e.target.files[0]; if (f) attachImage(f); e.target.value = ""; }}
          />
          <textarea
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder="Ask about your wardrobe, outfits, purchases…" rows={1}
            style={{
              flex: 1, border: "1px solid #dedad4", background: "#fafafa",
              padding: "0.65rem 0.9rem", fontSize: "0.95rem", color: "#1a1814",
              lineHeight: "1.5", minHeight: "44px", maxHeight: "110px", overflow: "auto",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
            }}
          />
          <button
            onClick={send}
            disabled={loading || (!input.trim() && selected.length === 0 && uploadedImgs.length === 0)}
            style={{
              background: (!input.trim() && selected.length === 0 && uploadedImgs.length === 0) || loading ? "#7a2535" : "#1a1814",
              color: "#f4f4f6", border: "none", padding: "0 1.25rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.12em", textTransform: "lowercase",
              height: "44px", whiteSpace: "nowrap", transition: "background 0.2s",
            }}
          >Send</button>
        </div>
      </div>
    </div>
  );
}


// ─── Outfit Rating ────────────────────────────────────────────────────────────
function OutfitRating({ profile: profileProp, wardrobe, onBack }) {
  const profile = profileProp || { name: "", colors: [], anchors: [], expressions: [], references: [], customRef: "", notes: "" };
  const [image, setImage]       = useState(null);
  const [base64, setBase64]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [viewing, setViewing]   = useState(null); // history entry in full-view
  const [followupMessages, setFollowupMessages] = useState([]);
  const [followupInput, setFollowupInput] = useState("");
  const [followupLoading, setFollowupLoading] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const cameraRef = useRef();
  const galleryRef = useRef();
  const followupBottomRef = useRef();

  // Load history on mount
  useEffect(() => {
    (async () => {
      const saved = await load("tenue-outfit-history");
      if (Array.isArray(saved)) setHistory(saved);
    })();
  }, []);

  useEffect(() => {
    followupBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [followupMessages, followupLoading]);

  async function handleFile(file) {
    // Higher resolution for outfit photos than for wardrobe (user sees it again + Claude analyzes it)
    const { dataURL, base64: b64, mediaType } = await compressImage(file, 1280, 0.88);
    setImage({ dataURL, base64: b64, mediaType });
    setResult(null);
    setError(null);
  }

  // Save review to history after successful analysis
  async function saveToHistory(entry) {
    const next = [entry, ...history].slice(0, 30); // keep last 30
    setHistory(next);
    await save("tenue-outfit-history", next);
  }

  async function deleteHistoryEntry(id) {
    const next = history.filter(h => h.id !== id);
    setHistory(next);
    await save("tenue-outfit-history", next);
    if (viewing?.id === id) setViewing(null);
  }

  async function updateHistoryEntry(id, patch) {
    const next = history.map(h => h.id === id ? { ...h, ...patch } : h);
    setHistory(next);
    await save("tenue-outfit-history", next);
  }

  async function sendFollowup() {
    const text = followupInput.trim();
    if (!text || !image || !result) return;
    const userMsg = { role: "user", content: text };
    const nextMsgs = [...followupMessages, userMsg];
    setFollowupMessages(nextMsgs);
    setFollowupInput("");
    setFollowupLoading(true);
    try {
      // The model returns BOTH a chat reply and an updated structured review,
      // so corrections to the image read (fabric, fit, occasion, colour) flow
      // back into the score / strengths / weaknesses / suggestions card.
      const systemPrompt =
        "You are tenue — a personal style consultant. You already reviewed the outfit in the image. Current review state:\n" +
        "- Score: " + result.score + "/10\n" +
        "- Strengths: " + (result.strengths || []).join("; ") + "\n" +
        "- Weaknesses: " + (result.weaknesses || []).join("; ") + "\n" +
        "- Suggestions: " + (result.suggestions || []).join("; ") + "\n\n" +
        "The user may now correct details (fabric, fit, occasion, colors) the image got wrong, or ask follow-up questions. " +
        "When new information justifies it, update the review. Otherwise leave the review unchanged.\n\n" +
        "RESPOND WITH VALID JSON ONLY — no prose outside the JSON, no code fences. Schema:\n" +
        "{\n" +
        "  \"reply\": \"your conversational reply, 2-4 sentences. Use normal sentence capitalization. Do NOT use ** around brand names. Reference brands as markdown links like [Brand](https://example.com) when you know the URL.\",\n" +
        "  \"updated\": true | false,\n" +
        "  \"review\": { \"score\": number 1-10, \"strengths\": [strings], \"weaknesses\": [strings], \"suggestions\": [strings] }\n" +
        "}\n\n" +
        "Set updated=false and copy the existing review verbatim when the user just asked a question. " +
        "Set updated=true only when a correction or new context shifts your read — explain the shift in `reply`. " +
        "Direct and considered, never chatty. Strict but fair. No emoji, no exclamation marks.";
      // First message includes the image; subsequent text-only
      const apiMsgs = nextMsgs.map((m, idx) => {
        if (idx === 0 && m.role === "user") {
          return {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
              { type: "text", text: m.content },
            ],
          };
        }
        return { role: m.role, content: m.content };
      });
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          messages: apiMsgs,
        }),
      });
      let data;
      try { data = await res.json(); } catch (e) { throw new Error("Could not read server response"); }
      if (!res.ok) throw new Error(data?.error?.message || "Server error " + res.status);
      const txt = data.content?.find(b => b.type === "text")?.text || "";

      // Try to parse as JSON; fall back to plain text if the model went freeform
      let reply = txt;
      let nextReview = null;
      try {
        const cleaned = txt.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed && typeof parsed.reply === "string") reply = parsed.reply;
        if (parsed && parsed.updated && parsed.review && typeof parsed.review.score === "number") {
          nextReview = {
            score: parsed.review.score,
            strengths:   Array.isArray(parsed.review.strengths)   ? parsed.review.strengths   : (result.strengths   || []),
            weaknesses:  Array.isArray(parsed.review.weaknesses)  ? parsed.review.weaknesses  : (result.weaknesses  || []),
            suggestions: Array.isArray(parsed.review.suggestions) ? parsed.review.suggestions : (result.suggestions || []),
          };
        }
      } catch (_) { /* stick with plain text reply */ }

      const updated = [...nextMsgs, { role: "assistant", content: reply }];
      setFollowupMessages(updated);
      if (nextReview) {
        setResult(nextReview);
        if (currentReviewId) {
          updateHistoryEntry(currentReviewId, { ...nextReview, followupMessages: updated });
        }
      } else if (currentReviewId) {
        updateHistoryEntry(currentReviewId, { followupMessages: updated });
      }
    } catch (err) {
      setFollowupMessages(p => [...p, { role: "assistant", content: "Error: " + (err?.message || String(err)) }]);
    }
    setFollowupLoading(false);
  }

  function onFollowupKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFollowup(); }
  }

  function resetReview() {
    setImage(null);
    setResult(null);
    setFollowupMessages([]);
    setCurrentReviewId(null);
  }

  async function analyse() {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);

    const wardrobeSummary = wardrobe ? GARMENT_CATEGORIES.flatMap(cat => {
      const items = wardrobe[cat.id] || [];
      return items.map(item =>
        [cat.label, item.color, item.name, item.brand, item.material].filter(Boolean).join(", ")
      );
    }).join("\n") : "";

    const { anchors, expressions, colors } = profilePersona(profile);

    const systemPrompt = "You are a fashion expert specializing in balanced silhouettes and good color combinations. You are strict but fair, encouraging a modern European aesthetic — structured, quality over quantity. You favor second-hand and reference Vestiaire and European quality brands. The user's name is " + profile.name + ". Anchors (identity): " + anchors + ". Expressions (default modal register): " + expressions + ". Color palette: " + colors + ". Wardrobe:\n" + wardrobeSummary + "\n\nEvaluate the outfit in the image against the user's anchors and expressions. Respond ONLY with valid JSON and nothing else:\n{\"score\": [number 1-10],\"strengths\": [list of 2-3 short bullets],\"weaknesses\": [list of 1-2 short bullets],\"suggestions\": [list of 1-2 concrete improvement suggestions]}\n\nIMPORTANT: all string values (strengths, weaknesses, suggestions) MUST be in lowercase only. No capital letters anywhere in the text.";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: systemPrompt,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
              { type: "text", text: "Evaluate this outfit." }
            ]
          }]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Unknown error");
      const txt = data.content?.find(b => b.type === "text")?.text || "";
      const clean = txt.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      // Safety net: lowercase all string arrays in case the model forgets
      const lc = arr => (Array.isArray(arr) ? arr.map(s => typeof s === "string" ? s.toLowerCase() : s) : []);
      const normalized = {
        score: parsed.score,
        strengths: lc(parsed.strengths),
        weaknesses: lc(parsed.weaknesses),
        suggestions: lc(parsed.suggestions),
      };
      setResult(normalized);
      // Save to history — provides revealed-preference data over time
      const newId = `outfit-${Date.now()}`;
      setCurrentReviewId(newId);
      setFollowupMessages([]);
      saveToHistory({
        id: newId,
        date: new Date().toISOString(),
        base64: image.base64,
        mediaType: image.mediaType,
        score: normalized.score,
        strengths: normalized.strengths,
        weaknesses: normalized.weaknesses,
        suggestions: normalized.suggestions,
        followupMessages: [],
      });
    } catch (err) {
      setError("Something went wrong: " + err.message);
    }
    setLoading(false);
  }

  const scoreColor = result ? (result.score >= 8 ? "#4a5c3f" : result.score >= 6 ? "#7a2535" : "#8a3030") : "#1a1814";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto", fontFamily: "'Fraunces', Georgia, serif" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #d4cfc8", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
        <BackBtn onClick={onBack} />
        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: "300", letterSpacing: "0.18em", textTransform: "lowercase", color: "#1a1814" }}>tenue</span>
        <div style={{ width: "60px" }} />
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.5rem" }}>Today's outfit</Mono>
        <h1 style={{ fontSize: "2.4rem", fontWeight: "300", color: "#1a1814", marginBottom: "2rem", letterSpacing: "0.01em" }}>Get a review</h1>

        {/* Upload area */}
        {!image ? (
          <div
            style={{
              border: "1px dashed #d4cfc8", background: "#fafafa",
              aspectRatio: "3/4", maxHeight: "420px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "1.25rem", padding: "1.5rem",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#9c9590" strokeWidth="1.2" strokeLinecap="round">
              <rect x="4" y="6" width="24" height="20" rx="1"/>
              <circle cx="16" cy="16" r="5"/>
              <circle cx="24" cy="10" r="1.5" fill="#9c9590" stroke="none"/>
            </svg>
            <Mono style={{ color: "#9c9590", textAlign: "center" }}>Add outfit</Mono>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => cameraRef.current.click()}
                style={{
                  border: "none", background: "#1a1814", color: "#f4f4f6",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.18em", textTransform: "lowercase",
                  padding: "0.75rem 1.25rem", cursor: "pointer",
                }}
              >Take photo</button>
              <button
                onClick={() => galleryRef.current.click()}
                style={{
                  border: "1px solid #1a1814", background: "transparent", color: "#1a1814",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.18em", textTransform: "lowercase",
                  padding: "0.75rem 1.25rem", cursor: "pointer",
                }}
              >From gallery</button>
            </div>
            <input ref={cameraRef}  type="file" accept="image/*" capture="environment" hidden onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            <input ref={galleryRef} type="file" accept="image/*" hidden onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <img src={image.dataURL} alt="Outfit" style={{ width: "100%", maxHeight: "480px", objectFit: "contain", display: "block", background: "#e8e8eb" }} />
            <button onClick={resetReview} style={{
              position: "absolute", top: "8px", right: "8px",
              background: "#1a1814", color: "#f4f4f6", border: "none",
              width: "28px", height: "28px", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
        )}

        {/* Analyse button */}
        {image && !result && (
          <div style={{ marginTop: "1.25rem" }}>
            <Btn onClick={analyse} disabled={loading}>
              {loading ? "Analyzing…" : "Review the outfit"}
            </Btn>
            {loading && (
              <div style={{ display: "flex", gap: "5px", marginTop: "1.25rem", alignItems: "center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: "5px", height: "5px", background: "#7a2535", animation: `dot 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && <p style={{ color: "#8a3030", fontSize: "0.9rem", marginTop: "1rem" }}>{error}</p>}

        {/* Result */}
        {result && (
          <div style={{ marginTop: "1.75rem", animation: "fadeUp 0.4s ease" }}>

            {/* Score */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.75rem", borderBottom: "1px solid #d4cfc8", paddingBottom: "1.25rem" }}>
              <span style={{ fontSize: "4rem", fontWeight: "300", color: scoreColor, lineHeight: 1 }}>{result.score}</span>
              <span style={{ fontSize: "1.5rem", color: "#9c9590", fontWeight: "300" }}>/10</span>
            </div>

            {/* Strengths */}
            <div style={{ marginBottom: "1.5rem" }}>
              <Mono style={{ color: "#4a5c3f", display: "block", marginBottom: "0.75rem" }}>Strengths</Mono>
              {(result.strengths || []).map((s, i) => (
                <p key={i} style={{ fontSize: "1rem", color: "#1a1814", lineHeight: "1.6", marginBottom: "0.4rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #4a5c3f" }}>{s}</p>
              ))}
            </div>

            {/* Weaknesses */}
            <div style={{ marginBottom: "1.5rem" }}>
              <Mono style={{ color: "#8a3030", display: "block", marginBottom: "0.75rem" }}>Weaknesses</Mono>
              {(result.weaknesses || []).map((s, i) => (
                <p key={i} style={{ fontSize: "1rem", color: "#1a1814", lineHeight: "1.6", marginBottom: "0.4rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8a3030" }}>{s}</p>
              ))}
            </div>

            {/* Suggestions */}
            <div style={{ marginBottom: "2rem" }}>
              <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.75rem" }}>Suggestions</Mono>
              {(result.suggestions || []).map((s, i) => (
                <p key={i} style={{ fontSize: "1rem", color: "#1a1814", lineHeight: "1.6", marginBottom: "0.4rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8c7c6c" }}>{s}</p>
              ))}
            </div>

            {/* Follow-up chat — corrections re-grade the outfit */}
            <div style={{ marginTop: "1.75rem", borderTop: "1px solid #d4cfc8", paddingTop: "1.5rem" }}>
              <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.4rem" }}>Correct or elaborate</Mono>
              {followupMessages.length === 0 && !followupLoading && (
                <p data-preserve-case="true" style={{
                  fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
                  color: "#6b6560", fontSize: "0.93rem", lineHeight: 1.7, marginBottom: "0.85rem",
                }}>
                  Photos misread fabric, fit and occasion all the time. Tell tenue what's actually going on and the score will update.
                </p>
              )}

              {followupMessages.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "0.85rem" }}>
                  {followupMessages.map((m, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                      <Mono style={{
                        color: m.role === "user" ? "#1a1814" : "#7a2535",
                        marginBottom: "0.3rem", fontSize: "0.5rem",
                      }}>
                        {m.role === "user"
                          ? <span data-preserve-case="true">{profile.name || "you"}</span>
                          : "tenue"}
                      </Mono>
                      <div data-preserve-case="true" style={{
                        color: "#1a1814",
                        fontSize: "0.95rem", lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
                        fontWeight: 300,
                      }}>
                        <RichText text={m.content} />
                      </div>
                    </div>
                  ))}
                  {followupLoading && (
                    <div style={{ display: "flex", gap: "5px", paddingLeft: "4px", alignItems: "center" }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: "5px", height: "5px", background: "#7a2535",
                          animation: `dot 1.2s ease ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  )}
                  <div ref={followupBottomRef} />
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                <textarea
                  value={followupInput}
                  onChange={e => setFollowupInput(e.target.value)}
                  onKeyDown={onFollowupKey}
                  placeholder="e.g. The trousers are linen, not cotton."
                  data-preserve-case="true"
                  rows={1}
                  style={{
                    flex: 1, border: "1px solid #e4e0da", background: "#fafafa",
                    padding: "0.55rem 0.8rem", fontSize: "0.92rem", color: "#1a1814",
                    lineHeight: 1.5, minHeight: "40px", maxHeight: "110px", overflow: "auto",
                    fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
                  }}
                  onInput={e => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
                  }}
                />
                <button onClick={sendFollowup} disabled={followupLoading || !followupInput.trim()} style={{
                  background: followupLoading || !followupInput.trim() ? "#9c9590" : "#1a1814",
                  color: "#f4f4f6", border: "none", padding: "0 1rem", cursor: "pointer",
                  fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "0.58rem",
                  letterSpacing: "0.18em", textTransform: "lowercase",
                  height: "40px", whiteSpace: "nowrap",
                  opacity: followupLoading || !followupInput.trim() ? 0.6 : 1,
                }}>send</button>
              </div>
            </div>

            {/* Try again */}
            <button onClick={resetReview} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.14em", color: "#9c9590", textTransform: "lowercase",
              borderBottom: "1px solid #d4cfc8", paddingBottom: "2px",
            }}>New outfit</button>
          </div>
        )}

        {/* History strip */}
        {history.length > 0 && !viewing && (
          <div style={{ marginTop: "3rem", borderTop: "1px solid #d4cfc8", paddingTop: "1.5rem" }}>
            <Mono style={{ color: "#9c9590", display: "block", marginBottom: "1rem" }}>Previous outfits</Mono>
            <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {history.map(h => {
                const score = h.score ?? h.karakter;
                return (
                  <div
                    key={h.id}
                    onClick={() => setViewing(h)}
                    style={{
                      flex: "0 0 auto", width: "90px", cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <img
                      src={b64url(h.base64, h.mediaType || "image/jpeg")}
                      alt="Previous outfit"
                      style={{ width: "90px", height: "120px", objectFit: "cover", display: "block", background: "#e8e8eb" }}
                    />
                    {score != null && (
                      <div style={{
                        position: "absolute", bottom: "4px", right: "4px",
                        background: "rgba(26,24,20,0.85)", color: "#f4f4f6",
                        fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                        padding: "2px 6px", letterSpacing: "0.04em",
                      }}>{score}/10</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full-view of history entry */}
      {viewing && (() => {
        const vScore = viewing.score ?? viewing.karakter;
        const vStrengths = viewing.strengths ?? viewing.styrker ?? [];
        const vWeaknesses = viewing.weaknesses ?? viewing.svakheter ?? [];
        const vSuggestions = viewing.suggestions ?? viewing.forslag ?? [];
        return (
          <div
            onClick={() => setViewing(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(26,24,20,0.92)",
              zIndex: 50, overflowY: "auto", padding: "2rem 1.5rem",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: "520px", margin: "0 auto", background: "#f4f4f6", padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <Mono style={{ color: "#9c9590" }}>
                  {new Date(viewing.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </Mono>
                <button onClick={() => setViewing(null)} style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontSize: "1rem", color: "#1a1814",
                }}>×</button>
              </div>
              <img
                src={b64url(viewing.base64, viewing.mediaType || "image/jpeg")}
                alt="Outfit"
                style={{ width: "100%", maxHeight: "480px", objectFit: "contain", display: "block", background: "#e8e8eb", marginBottom: "1.25rem" }}
              />
              {vScore != null && (
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #d4cfc8", paddingBottom: "1rem" }}>
                  <span style={{ fontSize: "3rem", fontWeight: "300", color: vScore >= 8 ? "#4a5c3f" : vScore >= 6 ? "#7a2535" : "#8a3030", lineHeight: 1 }}>{vScore}</span>
                  <span style={{ fontSize: "1.2rem", color: "#9c9590", fontWeight: "300" }}>/10</span>
                </div>
              )}
              {vStrengths.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <Mono style={{ color: "#4a5c3f", display: "block", marginBottom: "0.5rem" }}>Strengths</Mono>
                  {vStrengths.map((s, i) => (
                    <p key={i} style={{ fontSize: "0.95rem", color: "#1a1814", lineHeight: "1.5", marginBottom: "0.3rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #4a5c3f" }}>{s}</p>
                  ))}
                </div>
              )}
              {vWeaknesses.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <Mono style={{ color: "#8a3030", display: "block", marginBottom: "0.5rem" }}>Weaknesses</Mono>
                  {vWeaknesses.map((s, i) => (
                    <p key={i} style={{ fontSize: "0.95rem", color: "#1a1814", lineHeight: "1.5", marginBottom: "0.3rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8a3030" }}>{s}</p>
                  ))}
                </div>
              )}
              {vSuggestions.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.5rem" }}>Suggestions</Mono>
                  {vSuggestions.map((s, i) => (
                    <p key={i} style={{ fontSize: "0.95rem", color: "#1a1814", lineHeight: "1.5", marginBottom: "0.3rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8c7c6c" }}>{s}</p>
                  ))}
                </div>
              )}
              {Array.isArray(viewing.followupMessages) && viewing.followupMessages.length > 0 && (
                <div style={{ marginBottom: "1.25rem", borderTop: "1px solid #d4cfc8", paddingTop: "1rem" }}>
                  <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.6rem" }}>Conversation</Mono>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {viewing.followupMessages.map((m, i) => (
                      <div key={i}
                        {...(m.role === "user" ? { "data-preserve-case": "true" } : {})}
                        style={{
                          alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                          maxWidth: "90%",
                          background: m.role === "user" ? "#1a1814" : "#fafafa",
                          color: m.role === "user" ? "#f4f4f6" : "#1a1a1a",
                          padding: "0.6rem 0.85rem", fontSize: "0.88rem", lineHeight: 1.55,
                          border: m.role === "assistant" ? "1px solid #dedad4" : "none",
                          whiteSpace: "pre-wrap", fontFamily: "'Fraunces', Georgia, serif",
                        }}>{m.content}</div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => deleteHistoryEntry(viewing.id)} style={{
                background: "transparent", border: "1px solid #c4a0a0", color: "#8a3030",
                fontFamily: "'DM Mono', monospace", fontSize: "0.55rem",
                letterSpacing: "0.14em", textTransform: "lowercase",
                padding: "0.6rem 1.2rem", cursor: "pointer", marginTop: "0.5rem",
              }}>Delete from history</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


// ─── Wishlist ─────────────────────────────────────────────────────────────────

// ─── Wishlist ─────────────────────────────────────────────────────────────────
// Each item carries its own chat thread. Default view: items only. Tap an item →
// inline chat opens for that piece. Tap again to hide; thread persists per item.

const wishItemKey = id => "tenue-wish-chat-" + id;

function WishlistItem({ item, profile, wardrobe, isOpen, onOpen, onClose, onUpdate, onRemove }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef();

  // Lazy-load the per-item thread the first time the item opens
  useEffect(() => {
    if (!isOpen || hydrated) return;
    (async () => {
      const saved = await load(wishItemKey(item.id));
      if (Array.isArray(saved)) setMessages(saved);
      setHydrated(true);
    })();
  }, [isOpen, hydrated, item.id]);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, chatLoading, isOpen]);

  useEffect(() => {
    if (!hydrated) return;
    save(wishItemKey(item.id), messages);
  }, [messages, hydrated, item.id]);

  async function clearThread() {
    setMessages([]);
    await del(wishItemKey(item.id));
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { role: "user", content: text };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setChatInput("");
    setChatLoading(true);
    try {
      const wardrobeLines = wardrobe
        ? GARMENT_CATEGORIES.flatMap(cat => {
            const its = wardrobe[cat.id] || [];
            return its.map(it => cat.label + ": " + [it.color, it.name, it.brand].filter(Boolean).join(", "));
          }).join("\n") || "(no items registered)"
        : "(unknown)";
      const { anchors, expressions, colors } = profilePersona(profile || {});
      const itemLabel = [item.name, item.brand].filter(Boolean).join(" — ") || "(unnamed wishlist item)";
      const systemPrompt =
        "You are tenue — a personal style consultant for the considered wardrobe. " +
        "European in spirit, precise in opinion, never showy. Direct and considered, never chatty. " +
        "Quality-obsessed but not elitist. Honest about what doesn't work. Favor second-hand first; reference Vestiaire Collective and European quality brands.\n\n" +
        "The user is considering this single wishlist item — focus your advice on it specifically.\n" +
        "Wishlist item: " + itemLabel + "\n" +
        (item.note ? "Note: " + item.note + "\n" : "") +
        (item.url ? "Link: " + item.url + "\n" : "") +
        "\n" +
        "User: " + (profile?.name || "unknown") + "\n" +
        "Anchors (identity): " + anchors + "\n" +
        "Expressions (default modal register): " + expressions + "\n" +
        "Color palette: " + colors + "\n\n" +
        "Existing wardrobe (so you don't suggest duplicates):\n" + wardrobeLines + "\n\n" +
        "Help them decide: does this fit their core? what does it pair with? are there better versions? would second-hand work? " +
        "Keep replies tight — 2–4 sentences unless asked for more.\n\n" +
        "Formatting rules:\n" +
        "- Use normal sentence capitalization. Capitalise the first letter of sentences and proper nouns.\n" +
        "- Do NOT use markdown bold (** **) around brand names — write them plainly.\n" +
        "- When you reference a brand or retailer with a known site, include a markdown link [Brand](https://example.com). Use the official site (e.g. https://www.vestiairecollective.com, https://www.mrporter.com, https://www.cos.com, https://www.uniqlo.com, https://www.massimodutti.com, https://www.arket.com, https://www.matchesfashion.com, https://www.farfetch.com). If you're not sure of the URL, omit the link.\n" +
        "- No emoji, no exclamation marks.";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          messages: nextMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      let data;
      try { data = await res.json(); } catch (e) { throw new Error("Could not read server response"); }
      if (!res.ok) throw new Error(data?.error?.message || "Server error " + res.status);
      const txt = data.content?.find(b => b.type === "text")?.text || "";
      setMessages(p => [...p, { role: "assistant", content: txt }]);
    } catch (err) {
      setMessages(p => [...p, { role: "assistant", content: "Error: " + (err?.message || String(err)) }]);
    }
    setChatLoading(false);
  }

  function onChatKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); }
  }

  const summary = [item.name, item.brand].filter(Boolean).join(" — ") || "untitled item";
  const hasThread = messages.length > 0 || hydrated && false; // hide marker until hydrated

  return (
    <div style={{
      borderBottom: "1px solid #e4e0da",
      background: "transparent",
    }}>
      {/* Summary row — click to open chat */}
      <button
        onClick={() => isOpen ? onClose() : onOpen()}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center", gap: "0.75rem",
          width: "100%", textAlign: "left",
          background: "transparent", border: "none",
          padding: "1.05rem 0", cursor: "pointer",
          color: "#1a1814",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div data-preserve-case="true" style={{
            fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
            fontWeight: 300, fontSize: "1.1rem", color: "#1a1814",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{summary}</div>
          {item.note && !isOpen && (
            <div data-preserve-case="true" style={{
              fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
              fontWeight: 300, fontSize: "0.88rem", color: "#6b6560",
              marginTop: "2px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{item.note}</div>
          )}
        </div>
        <span className="tenue-label" style={{
          fontSize: "0.5rem",
          color: isOpen ? "#7a2535" : "#9c9590",
          letterSpacing: "0.18em",
        }}>{isOpen ? "hide ▴" : "open ▾"}</span>
      </button>

      {/* Editor + thread — only when open */}
      {isOpen && (
        <div style={{
          padding: "0.4rem 0 1.4rem",
          animation: "fadeUp 0.18s ease",
        }}>
          {/* Editable fields */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <input value={item.name} onChange={e => onUpdate("name", e.target.value)}
              placeholder="Name" data-preserve-case="true"
              style={{
                border: "none", borderBottom: "1px solid #e4e0da",
                background: "transparent", padding: "0.4rem 0",
                fontSize: "1rem", color: "#1a1814",
                fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
              }} />
            <input value={item.brand} onChange={e => onUpdate("brand", e.target.value)}
              placeholder="Brand" data-preserve-case="true"
              style={{
                border: "none", borderBottom: "1px solid #e4e0da",
                background: "transparent", padding: "0.4rem 0",
                fontSize: "1rem", color: "#1a1814",
                fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
              }} />
          </div>
          <input value={item.url || ""} onChange={e => onUpdate("url", e.target.value)}
            placeholder="https://…" data-preserve-case="true"
            style={{
              width: "100%",
              border: "none", borderBottom: "1px solid #e4e0da",
              background: "transparent", padding: "0.4rem 0", marginBottom: "0.5rem",
              fontSize: "0.9rem", color: "#6b6560",
              fontFamily: "'DM Mono', 'Courier New', monospace", fontWeight: 300,
            }} />
          <input value={item.note} onChange={e => onUpdate("note", e.target.value)}
            placeholder="Note" data-preserve-case="true"
            style={{
              width: "100%",
              border: "none", borderBottom: "1px solid #e4e0da",
              background: "transparent", padding: "0.4rem 0", marginBottom: "0.85rem",
              fontSize: "0.95rem", color: "#6b6560",
              fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
            }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                   className="tenue-label"
                   style={{ fontSize: "0.5rem", color: "#7a2535", textDecoration: "underline", textUnderlineOffset: "2px", textDecorationThickness: "0.5px" }}>
                  view product ↗
                </a>
              )}
              {messages.length > 0 && (
                <button onClick={clearThread} style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "0.5rem",
                  letterSpacing: "0.18em", color: "#9c9590", textTransform: "lowercase",
                }}>clear thread</button>
              )}
            </div>
            <button onClick={onRemove} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "0.5rem",
              letterSpacing: "0.18em", color: "#9c9590", textTransform: "lowercase",
            }}>delete item</button>
          </div>

          {/* Thread */}
          {messages.length === 0 && !chatLoading && (
            <div style={{ marginBottom: "0.9rem" }}>
              <p data-preserve-case="true" style={{
                fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
                color: "#6b6560", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "0.7rem",
              }}>
                Ask tenue whether this piece earns its place. Suggestions, second-hand, alternatives.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {[
                  "Does this fit my core?",
                  "Find a second-hand version.",
                  "What does this pair with?",
                  "Is there a better alternative?",
                ].map(q => (
                  <button key={q} onClick={() => setChatInput(q)} data-preserve-case="true" style={{
                    background: "transparent", border: "1px solid #d4cfc8",
                    padding: "0.4rem 0.8rem", cursor: "pointer",
                    fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
                    fontWeight: 300, fontSize: "0.85rem", color: "#6b6560",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a1814"; e.currentTarget.style.color = "#1a1814"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#d4cfc8"; e.currentTarget.style.color = "#6b6560"; }}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "1rem" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <Mono style={{
                    color: m.role === "user" ? "#1a1814" : "#7a2535",
                    fontSize: "0.5rem", marginBottom: "0.3rem",
                  }}>
                    {m.role === "user"
                      ? <span data-preserve-case="true">{profile?.name || "you"}</span>
                      : "tenue"}
                  </Mono>
                  <div data-preserve-case="true" style={{
                    color: "#1a1814",
                    fontSize: "0.97rem", lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
                    fontWeight: 300,
                  }}>
                    <RichText text={m.content} />
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", gap: "5px", paddingLeft: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "5px", height: "5px", background: "#7a2535",
                      animation: "dot 1.2s ease " + (i * 0.2) + "s infinite",
                    }} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Composer */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", marginTop: "0.4rem" }}>
            <textarea
              value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={onChatKey}
              placeholder="Ask tenue about this piece…" rows={1} data-preserve-case="true"
              style={{
                flex: 1, border: "1px solid #e4e0da", background: "#fafafa",
                padding: "0.6rem 0.85rem", fontSize: "0.95rem", color: "#1a1814",
                lineHeight: 1.5, minHeight: "42px", maxHeight: "110px", overflow: "auto",
                fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
              }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
              }}
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{
              background: chatLoading || !chatInput.trim() ? "#9c9590" : "#1a1814",
              color: "#f4f4f6", border: "none", padding: "0 1.1rem", cursor: "pointer",
              fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "0.6rem",
              letterSpacing: "0.18em", textTransform: "lowercase",
              height: "42px", whiteSpace: "nowrap", transition: "background 0.2s",
              opacity: chatLoading || !chatInput.trim() ? 0.6 : 1,
            }}>send</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Wishlist({ profile, wardrobe, onBack }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await load("tenue-wishlist");
      if (Array.isArray(saved)) setItems(saved);
      setLoaded(true);
    })();
  }, []);

  async function addItem() {
    const newItem = { id: "wish-" + Date.now(), name: "", brand: "", url: "", note: "" };
    const updated = [...items, newItem];
    setItems(updated);
    setOpenId(newItem.id);
    await save("tenue-wishlist", updated);
  }

  async function updateItem(id, field, value) {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    await save("tenue-wishlist", updated);
  }

  async function removeItem(id) {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    await save("tenue-wishlist", updated);
    await del(wishItemKey(id));
    if (openId === id) setOpenId(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", fontFamily: "'Fraunces', 'Times New Roman', Times, serif" }}>
      {/* Header */}
      <div style={{
        padding: "1.1rem 1.5rem 0", maxWidth: "640px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <BackBtn onClick={onBack} />
        <span className="tenue-mark" style={{ fontSize: "1.05rem", color: "#1a1814" }}>tenue</span>
        <div style={{ width: "60px" }} />
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2.2rem 1.5rem 3rem" }}>
        <span className="tenue-label" style={{ fontSize: "0.5rem", color: "#9c9590", display: "block", marginBottom: "0.5rem" }}>
          02 — wishlist
        </span>
        <h1 className="tenue-display" data-preserve-case="true" style={{
          fontSize: "clamp(2rem, 6.5vw, 2.8rem)", color: "#1a1814",
          margin: "0 0 0.7rem",
        }}>Items you want.</h1>
        <p data-preserve-case="true" style={{
          fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
          color: "#6b6560", fontSize: "0.95rem", lineHeight: 1.6,
          maxWidth: "44ch", marginBottom: "2rem",
        }}>
          Each piece has its own thread — open one to ask tenue whether it earns its place.
        </p>

        <hr className="tenue-rule" style={{ margin: "0 0 0.5rem" }} />

        {/* Items list — closed by default; click to open chat */}
        {items.map(item => (
          <WishlistItem
            key={item.id}
            item={item}
            profile={profile}
            wardrobe={wardrobe}
            isOpen={openId === item.id}
            onOpen={() => setOpenId(item.id)}
            onClose={() => setOpenId(null)}
            onUpdate={(field, value) => updateItem(item.id, field, value)}
            onRemove={() => removeItem(item.id)}
          />
        ))}

        {items.length === 0 && loaded && (
          <p data-preserve-case="true" style={{
            fontFamily: "'Fraunces', 'Times New Roman', Times, serif", fontWeight: 300,
            color: "#9c9590", fontSize: "0.95rem", lineHeight: 1.7,
            padding: "1.5rem 0", borderBottom: "1px solid #e4e0da",
          }}>
            Nothing here yet. Add the first piece you're considering.
          </p>
        )}

        {loaded && (
          <button onClick={addItem} style={{
            marginTop: "1.5rem",
            border: "1px solid #1a1814", background: "transparent",
            padding: "0.7rem 1.4rem", cursor: "pointer",
            fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "0.58rem",
            letterSpacing: "0.18em", textTransform: "lowercase", color: "#1a1814",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a1814"; e.currentTarget.style.color = "#f4f4f6"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1814"; }}
          >+ add item</button>
        )}
      </div>
    </div>
  );
}



function NavRow({ label, onClick, locked, index }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={locked ? undefined : onClick} style={{
      display: "grid", gridTemplateColumns: "2.4rem 1fr auto", alignItems: "center",
      background: "transparent", border: "none",
      borderBottom: "1px solid #e4e0da",
      padding: "1.15rem 0", cursor: locked ? "default" : "pointer",
      width: "100%", textAlign: "left", transition: "color 0.18s, opacity 0.18s",
      opacity: locked ? 0.32 : 1,
      color: hover && !locked ? "#7a2535" : "#1a1814",
    }}
      onMouseEnter={() => { if (!locked) setHover(true); }}
      onMouseLeave={() => setHover(false)}
    >
      <span className="tenue-label" style={{
        fontSize: "0.5rem", letterSpacing: "0.18em",
        color: "#9c9590",
      }}>{String(index ?? 0).padStart(2, "0")}</span>
      <span className="tenue-label" style={{
        fontSize: "0.78rem", letterSpacing: "0.14em",
        color: "inherit",
      }}>{label}</span>
      <span className="tenue-label" style={{
        fontSize: "0.6rem", letterSpacing: "0.1em",
        color: hover && !locked ? "#7a2535" : "#9c9590",
        transform: hover && !locked ? "translateX(4px)" : "translateX(0)",
        transition: "transform 0.18s, color 0.18s",
      }}>→</span>
    </button>
  );
}

function HomeScreen({ profile, wardrobe, onGoProfile, onGoWardrobe, onGoChat, onGoOutfit, onGoWishlist, onReset }) {
  const hasProfile = !!profile?.name;

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f4f6",
      display: "flex", flexDirection: "column",
      fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
    }}>
      <div style={{
        padding: "1.1rem 1.5rem 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0,
      }}>
        <span className="tenue-label" style={{ fontSize: "0.5rem", color: "#9c9590" }}>
          tenue — v1.0
        </span>
        {hasProfile && (
          <button onClick={onReset} style={{
            background: "transparent", border: "none", cursor: "pointer",
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: "0.5rem", letterSpacing: "0.18em",
            color: "#9c9590", textTransform: "lowercase",
          }}>reset</button>
        )}
      </div>

      <div style={{
        padding: "3.2rem 1.5rem 2.4rem",
        maxWidth: "640px", width: "100%", margin: "0 auto",
        flexShrink: 0,
      }}>
        <h1 className="tenue-mark" style={{
          fontSize: "clamp(3.2rem, 12vw, 5rem)",
          color: "#1a1814",
          margin: 0,
        }}>tenue</h1>

        <hr className="tenue-rule" style={{ margin: "0.9rem 0 1.1rem" }} />

        <p className="tenue-display" style={{
          fontSize: "clamp(1.35rem, 4.6vw, 1.85rem)",
          color: "#1a1814",
          maxWidth: "30ch",
        }}>your style, considered.</p>

        <p style={{
          marginTop: "0.9rem",
          fontFamily: "'Fraunces', 'Times New Roman', Times, serif",
          fontWeight: 300,
          fontSize: "0.95rem",
          lineHeight: 1.55,
          color: "#6b6560",
          maxWidth: "44ch",
        }}>
          a personal style consultant for the considered wardrobe. european in spirit. precise in opinion. never showy.
        </p>

        {hasProfile && (
          <p data-preserve-case="true" className="tenue-label" style={{
            marginTop: "1.6rem",
            fontSize: "0.55rem",
            color: "#9c9590",
          }}>
            consulting — {profile.name.toLowerCase()}
          </p>
        )}
      </div>

      <div style={{
        padding: "0 1.5rem",
        maxWidth: "640px", width: "100%", margin: "0 auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.9rem",
          paddingBottom: "0.6rem",
          borderBottom: "1px solid #d4cfc8",
        }}>
          <span className="tenue-label" style={{ fontSize: "0.5rem", color: "#9c9590" }}>
            01 — sections
          </span>
        </div>
      </div>

      <div style={{
        padding: "0.4rem 1.5rem 2rem",
        maxWidth: "640px", width: "100%", margin: "0 auto",
        flex: 1,
      }}>
        <NavRow index={1} label="profile"            onClick={onGoProfile}  locked={false} />
        <NavRow index={2} label="wardrobe"           onClick={onGoWardrobe} locked={false} />
        <NavRow index={3} label="wishlist"           onClick={onGoWishlist} locked={false} />
        <NavRow index={4} label="consultation"       onClick={onGoChat}     locked={false} />
        <NavRow index={5} label="outfit of the day"  onClick={onGoOutfit}   locked={false} />

        {profile?.colors?.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <p className="tenue-label" style={{
              fontSize: "0.5rem", color: "#9c9590",
              marginBottom: "0.6rem",
            }}>your palette</p>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {profile.colors.map(n => {
                const c = PRESET_COLORS.find(p => p.name === n);
                return c ? (
                  <div key={n} title={n} style={{
                    width: "14px", height: "14px", background: c.hex,
                    border: (c.hex === "#f4f4f6" || c.hex === "#fafafa") ? "1px solid #d4cfc8" : "none",
                  }} />
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{
        padding: "1.4rem 1.5rem",
        maxWidth: "640px", width: "100%", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        gap: "1rem",
        flexShrink: 0,
      }}>
        <span className="tenue-mark" style={{
          fontSize: "1.4rem", color: "#1a1814",
        }}>tenue</span>
        <div style={{ textAlign: "right" }}>
          <p className="tenue-label" style={{ fontSize: "0.48rem", color: "#9c9590", lineHeight: 1.7 }}>
            personal style, considered.
          </p>
          <p className="tenue-label" style={{ fontSize: "0.48rem", color: "#9c9590", lineHeight: 1.7 }}>
            f4f4f6 · 1a1814 · 7a2535
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [wardrobe, setWardrobe] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await load(SK.profile);
      const wardrobeMeta = await load(SK.wardrobe);
      if (wardrobeMeta) {
        const entries = await Promise.all(
          GARMENT_CATEGORIES.map(async cat => [cat.id, await loadCategory(cat.id)])
        );
        setWardrobe(Object.fromEntries(entries));
      } else {
        setWardrobe(Object.fromEntries(GARMENT_CATEGORIES.map(c => [c.id, []])));
      }
      if (p) setProfile(migrateProfile(p));
      setView("home");
    })();
  }, []);

  async function reset() {
    await del(SK.profile); await del(SK.wardrobe); await del(SK.chat);
    await deleteAllCategories();
    setProfile(null);
    setWardrobe(Object.fromEntries(GARMENT_CATEGORIES.map(c => [c.id, []])));
    setView("home");
  }

  if (view === null) return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{FONTS + css}</style>
      <Spinner />
    </div>
  );

  return (
    <>
      <style>{FONTS + css}</style>

      {view === "home" && (
        <HomeScreen
          profile={profile}
          wardrobe={wardrobe}
          onGoProfile={() => setView("profile")}
          onGoWardrobe={() => setView("wardrobe")}
          onGoChat={() => setView("chat")}
          onGoOutfit={() => setView("outfit")}
          onGoWishlist={() => setView("wishlist")}
          onReset={reset}
        />
      )}

      {view === "profile" && (
        <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
            <BackBtn onClick={() => setView("home")} />
          </div>
          <ProfileStep
            existing={profile}
            onComplete={p => { setProfile(p); setView("home"); }}
          />
        </div>
      )}

      {view === "wardrobe" && (
        <WardrobeStep
          profile={profile}
          existing={wardrobe}
          onBack={() => setView("home")}
          onComplete={w => { setWardrobe(w); setView("home"); }}
        />
      )}

      {view === "chat" && (
        <ChatStep
          profile={profile}
          wardrobe={wardrobe}
          onBack={() => setView("home")}
          onEditProfile={() => setView("profile")}
          onEditWardrobe={() => setView("wardrobe")}
          onReset={reset}
        />
      )}

      {view === "outfit" && (
        <OutfitRating
          profile={profile}
          wardrobe={wardrobe}
          onBack={() => setView("home")}
        />
      )}

      {view === "wishlist" && (
        <Wishlist profile={profile} wardrobe={wardrobe} onBack={() => setView("home")} />
      )}
    </>
  );
}
v>
    </div>
  );
}

export default function App() {
  const [view, setView]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [wardrobe, setWardrobe] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await load(SK.profile);
      const wardrobeMeta = await load(SK.wardrobe);
      if (wardrobeMeta) {
        const entries = await Promise.all(
          GARMENT_CATEGORIES.map(async cat => [cat.id, await loadCategory(cat.id)])
        );
        setWardrobe(Object.fromEntries(entries));
      } else {
        setWardrobe(Object.fromEntries(GARMENT_CATEGORIES.map(c => [c.id, []])));
      }
      if (p) setProfile(migrateProfile(p));
      setView("home");
    })();
  }, []);

  async function reset() {
    await del(SK.profile); await del(SK.wardrobe); await del(SK.chat);
    await deleteAllCategories();
    setProfile(null);
    setWardrobe(Object.fromEntries(GARMENT_CATEGORIES.map(c => [c.id, []])));
    setView("home");
  }

  if (view === null) return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{FONTS + css}</style>
      <Spinner />
    </div>
  );

  return (
    <>
      <style>{FONTS + css}</style>

      {view === "home" && (
        <HomeScreen
          profile={profile}
          wardrobe={wardrobe}
          onGoProfile={() => setView("profile")}
          onGoWardrobe={() => setView("wardrobe")}
          onGoChat={() => setView("chat")}
          onGoOutfit={() => setView("outfit")}
          onGoWishlist={() => setView("wishlist")}
          onReset={reset}
        />
      )}

      {view === "profile" && (
        <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
            <BackBtn onClick={() => setView("home")} />
          </div>
          <ProfileStep
            existing={profile}
            onComplete={p => { setProfile(p); setView("home"); }}
          />
        </div>
      )}

      {view === "wardrobe" && (
        <WardrobeStep
          profile={profile}
          existing={wardrobe}
          onBack={() => setView("home")}
          onComplete={w => { setWardrobe(w); setView("home"); }}
        />
      )}

      {view === "chat" && (
        <ChatStep
          profile={profile}
          wardrobe={wardrobe}
          onBack={() => setView("home")}
          onEditProfile={() => setView("profile")}
          onEditWardrobe={() => setView("wardrobe")}
          onReset={reset}
        />
      )}

      {view === "outfit" && (
        <OutfitRating
          profile={profile}
          wardrobe={wardrobe}
          onBack={() => setView("home")}
        />
      )}

      {view === "wishlist" && (
        <Wishlist profile={profile} wardrobe={wardrobe} onBack={() => setView("home")} />
      )}
    </>
  );
}
