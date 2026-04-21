import { useState, useRef, useEffect } from "react";


// ─── Constants ────────────────────────────────────────────────────────────────

const GARMENT_CATEGORIES = [
  { id: "yttertoy",  label: "Yttertøy",       sub: "Frakker, kåper, dunjakker",
    path: "M20 7 C18 7 15 8 13 10 L9 14 L9 39 L31 39 L31 14 L27 10 C25 8 22 7 20 7 Z M20 7 L20 14 M13 10 L9 14 M27 10 L31 14 M16 8 C16 11 18 13 20 13 C22 13 24 11 24 8" },
  { id: "jakker",    label: "Jakker",          sub: "Blazere, bomberjakker, denim",
    path: "M20 8 L13 11 L10 16 L10 38 L30 38 L30 16 L27 11 L20 8 M13 11 L10 16 M27 11 L30 16 M10 22 L15 22 M25 22 L30 22 M15 38 L15 27 L25 27 L25 38" },
  { id: "gensere",   label: "Gensere",         sub: "Strikk, sweatere, collegegenser",
    path: "M20 8 C18 8 17 9 17 12 C14 10 11 14 11 20 L15 21 L15 39 L25 39 L25 21 L29 20 C29 14 26 10 23 12 C23 9 22 8 20 8 M17 12 C17 15 18 17 20 17 C22 17 23 15 23 12" },
  { id: "topper",    label: "Topper",          sub: "T-skjorter, linser, singlet",
    path: "M14 9 L8 15 L13 17 L13 39 L27 39 L27 17 L32 15 L26 9 M14 9 C16 13 18 14 20 14 C22 14 24 13 26 9" },
  { id: "skjorter",  label: "Skjorter/bluser", sub: "Skjorter og bluser",
    path: "M14 8 L8 14 L13 16 L13 40 L27 40 L27 16 L32 14 L26 8 M14 8 C16 12 18 13 20 13 C22 13 24 12 26 8 M20 13 L20 22 M17 16 L17 20 M23 16 L23 20" },
  { id: "bukser",    label: "Bukser",          sub: "Alle snitt og stoffer",
    path: "M12 8 L12 26 L18 40 L20 40 L20 26 M28 8 L28 26 L22 40 L20 40 M12 8 L28 8 M12 16 L28 16" },
  { id: "skjort",    label: "Skjørt",          sub: "Midi, maxi, mini",
    path: "M13 9 L27 9 L27 12 L31 40 L9 40 L13 12 Z M16 9 L16 12 M24 9 L24 12" },
  { id: "kjoler",    label: "Kjoler",          sub: "Heldresser av alle slag",
    path: "M20 6 C18 6 16 7 16 10 C13 9 11 11 11 11 L9 40 L31 40 L29 11 C29 11 27 9 24 10 C24 7 22 6 20 6 M16 10 C16 13 18 15 20 15 C22 15 24 13 24 10 M13 26 L27 26" },
  { id: "sko",       label: "Sko",             sub: "Alle typer fottøy",
    path: "M17 22 L17 14 C17 11 18 9 20 9 C22 9 23 11 23 14 L23 22 M9 22 L31 22 C33 22 35 24 35 27 L35 30 L5 30 L5 27 C5 24 7 22 9 22" },
  { id: "vesker",    label: "Vesker",          sub: "Vesker og accessories",
    path: "M13 20 L11 40 L29 40 L27 20 Z M13 20 L27 20 M15 20 C15 14 17 11 20 11 C23 11 25 14 25 20 M11 29 L29 29" },
];

const STYLE_REFERENCES = [
  "Europeisk intellektuell",
  "Klassisk og tidløs",
  "Minimalistisk",
  "Androgyn",
  "Romantisk og feminin",
  "Skulpturelt og avant-garde",
  "Casual og uformell",
];

const PRESET_COLORS = [
  { name: "Svart",        hex: "#111111" },
  { name: "Kullgrå",      hex: "#3a3a3a" },
  { name: "Grå",          hex: "#6b7280" },
  { name: "Sølvgrå",      hex: "#9ca3af" },
  { name: "Hvit",         hex: "#f4f4f6" },
  { name: "Kremhvit",     hex: "#e8e0d0" },
  { name: "Taupe",        hex: "#7a2535" },
  { name: "Sand",         hex: "#d4c5a9" },
  { name: "Kamel",        hex: "#b5833a" },
  { name: "Cognac",       hex: "#8b4513" },
  { name: "Midnattsblå",  hex: "#0f1f3d" },
  { name: "Navy",         hex: "#1a1814" },
  { name: "Støvblå",      hex: "#7a8fa0" },
  { name: "Lyseblå",      hex: "#b8ccd8" },
  { name: "Olivengrønt",  hex: "#4a5c3f" },
  { name: "Mosegrønt",    hex: "#6b7c5a" },
  { name: "Flaskegrønt",  hex: "#2d4a3e" },
  { name: "Skogsgrønt",   hex: "#3a5c45" },
  { name: "Burgunder",    hex: "#6b2737" },
  { name: "Dyprød",       hex: "#8b1a2a" },
  { name: "Rust",         hex: "#a0522d" },
  { name: "Terrakotta",   hex: "#c1673a" },
  { name: "Støvroset",    hex: "#c4a0a0" },
  { name: "Gammelrosa",   hex: "#d4a5a0" },
  { name: "Lilla",        hex: "#7a6080" },
  { name: "Plomme",       hex: "#5a3a5a" },
  { name: "Brun",         hex: "#6b4c3a" },
  { name: "Sjokolade",    hex: "#3d2314" },
  { name: "Khaki",        hex: "#a0956b" },
  { name: "Beige",        hex: "#d4c5a0" },
];

const SK = { profile: "grd-profile", wardrobe: "grd-wardrobe", chat: "grd-chat" };

// ─── Styles ───────────────────────────────────────────────────────────────────

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Mono:wght@300;400;500&display=swap');`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: #1a1814; color: #e8e4dc; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #b8a898; }
  body { background: #f4f4f6; }
  textarea, input { font-family: 'Fraunces', Georgia, serif; }
  textarea:focus, input:focus { outline: none; }
  textarea { resize: none; }
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

// ─── UI primitives ────────────────────────────────────────────────────────────

function Mono({ children, style = {} }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "0.58rem",
      letterSpacing: "0.18em",
      textTransform: "none",
      letterSpacing: "0.08em",
      ...style,
    }}>{children}</span>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, small = false }) {
  const s = {
    border: "none",
    fontFamily: "'DM Mono', monospace",
    fontSize: small ? "0.55rem" : "0.6rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    cursor: disabled ? "default" : "pointer",
    padding: small ? "0.5rem 1rem" : "0.85rem 2rem",
    transition: "background 0.2s, color 0.2s, opacity 0.2s",
    opacity: disabled ? 0.45 : 1,
  };
  const v = {
    primary: { background: "#1a1814", color: "#f4f4f6" },
    ghost:   { background: "transparent", color: "#1a1814", border: "1px solid #1a1814" },
    danger:  { background: "transparent", color: "#8a3030", border: "1px solid #c4a0a0" },
    muted:   { background: "#7a2535", color: "#6b6560" },
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

// ─── Style Picker ────────────────────────────────────────────────────────────

const STYLE_GROUPS = [
  { label: "Estetikk", refs: ["Europeisk intellektuell", "Minimalistisk", "Klassisk og tidløs", "Skulpturelt og avant-garde"] },
  { label: "Uttrykk", refs: ["Androgyn", "Romantisk og feminin", "Casual og uformell"] },
];

function StylePicker({ selRefs, onToggle, customRef, onCustomRef }) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(STYLE_GROUPS[0].label);
  const selectedCount = selRefs.length;
  const hasCustom = customRef.trim().length > 0;

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <Mono style={{ color: "#6b6560", flexShrink: 0 }}>Stilreferanser</Mono>
          {(selectedCount > 0 || hasCustom) && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "nowrap", overflow: "hidden" }}>
              {selRefs.slice(0, 2).map(r => (
                <span key={r} style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.8rem", color: "#6b6560",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{r}</span>
              ))}
              {selRefs.length > 2 && <Mono style={{ color: "#9c9590", fontSize: "0.45rem", flexShrink: 0 }}>+{selRefs.length - 2}</Mono>}
              {hasCustom && selRefs.length === 0 && (
                <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "0.8rem", color: "#6b6560", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{customRef}</span>
              )}
            </div>
          )}
        </div>
        <Mono style={{ color: "#9c9590", fontSize: "0.55rem", flexShrink: 0 }}>
          {selectedCount > 0 ? `${selectedCount} valgt ` : ""}{open ? "▲" : "▼"}
        </Mono>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ border: "1px solid #d4cfc8", borderTop: "none", background: "#fafafa", animation: "fadeUp 0.15s ease" }}>
          {/* Group tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #d4cfc8" }}>
            {STYLE_GROUPS.map(g => (
              <button key={g.label} onClick={() => setActiveGroup(g.label)} style={{
                background: "transparent", border: "none",
                borderBottom: activeGroup === g.label ? "1.5px solid #1a1814" : "1.5px solid transparent",
                padding: "0.6rem 0.85rem", cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "'DM Mono', monospace", fontSize: "0.5rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: activeGroup === g.label ? "#1a1814" : "#9c9590",
                transition: "all 0.15s",
              }}>{g.label}</button>
            ))}
          </div>

          {/* Options */}
          <div style={{ padding: "0.85rem 0.9rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {(STYLE_GROUPS.find(g => g.label === activeGroup)?.refs || []).map(r => {
              const on = selRefs.includes(r);
              return (
                <button key={r} onClick={() => onToggle(r)} style={{
                  border: `1px solid ${on ? "#1a1814" : "#7a2535"}`,
                  background: on ? "#1a1814" : "transparent",
                  color: on ? "#f4f4f6" : "#6b6560",
                  padding: "0.4rem 0.85rem",
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.9rem",
                  cursor: "pointer", transition: "all 0.15s",
                }}>{r}</button>
              );
            })}
          </div>

          {/* Free text */}
          <div style={{ padding: "0 0.9rem 0.85rem" }}>
            <input
              value={customRef}
              onChange={e => onCustomRef(e.target.value)}
              placeholder="Spesifikke referanser — personer, filmer, merkevarer… (valgfritt)"
              style={{
                width: "100%", border: "none", borderBottom: "1px solid #d4cfc8",
                background: "transparent", padding: "0.45rem 0",
                fontSize: "0.95rem", color: "#1a1814",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker ────────────────────────────────────────────────────────────

const COLOR_GROUPS = [
  { label: "Nøytraler", colors: ["Svart", "Kullgrå", "Grå", "Sølvgrå", "Hvit", "Kremhvit"] },
  { label: "Jord & varmt", colors: ["Taupe", "Sand", "Beige", "Kamel", "Cognac", "Brun", "Sjokolade", "Khaki"] },
  { label: "Blå & grå", colors: ["Midnattsblå", "Navy", "Støvblå", "Lyseblå"] },
  { label: "Grønt", colors: ["Olivengrønt", "Mosegrønt", "Skogsgrønt", "Flaskegrønt"] },
  { label: "Rødt & varmt", colors: ["Burgunder", "Dyprød", "Rust", "Terrakotta"] },
  { label: "Rosa & lilla", colors: ["Støvroset", "Gammelrosa", "Lilla", "Plomme"] },
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
          <Mono style={{ color: "#6b6560" }}>Fargepalett</Mono>
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
          {selectedCount > 0 ? `${selectedCount} valgt` : ""}{" "}{open ? "▲" : "▼"}
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
                letterSpacing: "0.12em", textTransform: "uppercase",
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
  const [selRefs, setSelRefs]     = useState(existing?.references || []);
  const [customRef, setCustomRef] = useState(existing?.customRef || "");
  const [selColors, setSelColors] = useState(existing?.colors || []);
  const [notes, setNotes]         = useState(existing?.notes || "");
  const [saving, setSaving]       = useState(false);

  const toggleRef   = r => setSelRefs(p  => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);
  const toggleColor = c => setSelColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const canGo = name.trim() && selColors.length > 0;

  async function go() {
    setSaving(true);
    const refs = selRefs.filter(r => r !== "Annet (beskriv selv)");
    const profile = {
      name: name.trim(),
      references: refs,
      customRef: customRef.trim(),
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
        {existing ? "rediger" : "profil"}
      </Mono>
      <h1 style={{ fontFamily: "'Fraunces'", fontSize: "2.6rem", fontWeight: "300", color: "#1a1814", marginBottom: "0.3rem", letterSpacing: "0.01em" }}>
        Din stil
      </h1>
      <p style={{ fontSize: "1.05rem", color: "#6b6560", marginBottom: "2.25rem", lineHeight: "1.65", fontFamily: "'Fraunces', Georgia, serif" }}>
        Eksperten trenger å kjenne deg.
      </p>

      <label style={{ display: "block", marginBottom: "1.5rem" }}>
        <Mono style={{ color: "#6b6560", display: "block", marginBottom: "0.5rem" }}>Ditt navn</Mono>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Skriv inn ditt navn"
          style={{ width: "100%", border: "none", borderBottom: "1px solid #dedad4", background: "transparent", padding: "0.6rem 0", fontSize: "1.1rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
      </label>

      <StylePicker selRefs={selRefs} onToggle={toggleRef} customRef={customRef} onCustomRef={setCustomRef} />

      <ColorPicker selColors={selColors} onToggle={toggleColor} />

      <div style={{ marginBottom: "2rem" }}>
        <Mono style={{ color: "#6b6560", display: "block", marginBottom: "0.5rem" }}>
          Livsstil / anledninger / restriksjoner (valgfritt)
        </Mono>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="F.eks: jobber på kontor, reiser mye, unngår syntetiske stoffer…"
          style={{ width: "100%", border: "1px solid #dedad4", background: "#fafafa", padding: "0.7rem 1rem", fontSize: "0.95rem", lineHeight: "1.6", color: "#1a1814" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Btn onClick={go} disabled={!canGo || saving}>
          {saving ? "Lagrer…" : "Lagre profil"}
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
          <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem", fontWeight: "400", color: item.name ? "#1a1814" : "#9c9590", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.name || "Navnløst plagg"}
          </p>
          {(item.color || item.brand || item.material) && (
            <Mono style={{ color: "#9c9590", fontSize: "0.5rem" }}>{[item.color, item.brand, item.material].filter(Boolean).join(" · ")}</Mono>
          )}
        </div>
        <Mono style={{ color: "#9c9590", fontSize: "0.5rem", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</Mono>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div style={{ padding: "0 0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <input value={item.name} onChange={e => onUpdate("name", e.target.value)} placeholder="Navn"
            onClick={e => e.stopPropagation()}
            style={{ border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.5rem 0", fontSize: "1.05rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif", width: "100%" }} />
          <div style={{ display: "flex", gap: "1rem" }}>
            <input value={item.color} onChange={e => onUpdate("color", e.target.value)} placeholder="Farge"
              onClick={e => e.stopPropagation()}
              style={{ flex: 1, border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.4rem 0", fontSize: "0.9rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
            <input value={item.brand || ""} onChange={e => onUpdate("brand", e.target.value)} placeholder="Merke"
              onClick={e => e.stopPropagation()}
              style={{ flex: 1, border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.4rem 0", fontSize: "0.9rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
          </div>
          <input value={item.material || ""} onChange={e => onUpdate("material", e.target.value)} placeholder="Materiale"
            onClick={e => e.stopPropagation()}
            style={{ border: "none", borderBottom: "1px solid #d4cfc8", background: "transparent", padding: "0.4rem 0", fontSize: "0.9rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif", width: "100%" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: hasImage ? "#7a2535" : "#9c9590", cursor: "pointer", borderBottom: "1px solid #d4cfc8", paddingBottom: "1px" }}>
              {hasImage ? "Bytt bilde" : "Last opp bilde"}
              <input ref={imgRef} type="file" accept="image/*" hidden onChange={e => { if (e.target.files[0]) onAttachImage(e.target.files[0]); }} />
            </label>
            {hasImage && (
              <button onClick={e => { e.stopPropagation(); onUpdate("preview", null); onUpdate("base64", null); onUpdate("mediaType", null); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#9c9590", textTransform: "uppercase" }}>Fjern bilde</button>
            )}
            <button onClick={e => { e.stopPropagation(); onRemove(); }}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#b08080", textTransform: "uppercase", marginLeft: "auto" }}>Slett</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Wardrobe Step ────────────────────────────────────────────────────────────

function WardrobeStep({ profile, onComplete, existing }) {
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

  // Category detail view
  if (activeCat) {
    const items = wardrobe[activeCat] || [];
    return (
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1.5rem", animation: "slideIn 0.25s ease" }}>
        <button onClick={() => setActiveCat(null)} style={{
          background: "transparent", border: "none", cursor: "pointer",
          fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
          letterSpacing: "0.12em", color: "#9c9590", textTransform: "uppercase",
          marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "0.4rem",
        }}>← Tilbake</button>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.2rem" }}>
          <h2 style={{ fontFamily: "'Fraunces'", fontSize: "2rem", fontWeight: "300", color: "#1a1814", letterSpacing: "0.01em" }}>
            {cat.label}
          </h2>
          {items.length > 0 && <Mono style={{ color: "#7a2535" }}>{items.length} plagg</Mono>}
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
            letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6560",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.color = "#1a1814"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b6560"; }}
          >+ Legg til plagg</button>

          <label style={{
            border: "1px solid #d4cfc8", background: "transparent",
            padding: "0.65rem 1.25rem", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6560",
            transition: "all 0.15s", display: "inline-block",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.color = "#1a1814"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b6560"; }}
          >
            + Last opp bilder
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
    );
  }

  // Overview with circles
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.5rem", animation: "fadeUp 0.5s ease" }}>
      <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.6rem" }}>
        {existing ? "rediger" : "garderobe"}
      </Mono>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <h1 style={{ fontFamily: "'Fraunces'", fontSize: "2.6rem", fontWeight: "300", color: "#1a1814", letterSpacing: "0.01em" }}>
          Dine plagg
        </h1>
        {total > 0 && <Mono style={{ color: "#7a2535" }}>{total} plagg</Mono>}
      </div>
      <p style={{ fontSize: "1.05rem", color: "#6b6560", marginBottom: "2.25rem", lineHeight: "1.65", fontFamily: "'Fraunces', Georgia, serif" }}>
        Velg en kategori for å laste opp.
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
          {total === 0 ? "Du kan gå videre uten plagg." : `${total} plagg lastet opp.`}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {saving && <Spinner />}
          <Btn onClick={go} disabled={saving}>
            {saving ? "Lagrer…" : "Lagre garderobe"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Step ────────────────────────────────────────────────────────────────

function buildSystem(profile, wardrobe) {
  const refs = [
    ...(profile.references || []),
    ...(profile.customRef ? [profile.customRef] : []),
  ].join(", ") || "ikke spesifisert";
  const colors = (profile.colors || []).join(", ")     || "ikke spesifisert";
  const notes  = profile.notes || "";

  const lines = wardrobe ? GARMENT_CATEGORIES.flatMap(cat => {
    const items = (wardrobe[cat.id] || []);
    if (!items.length) return [];
    return items.map(item => {
      const parts = [item.color, item.name, item.brand, item.material].filter(Boolean).join(", ");
      return cat.label + ": " + (parts || "navnløst");
    });
  }) : [];

  const wardrobeSummary = lines.length ? lines.join("\n") : "Ingen plagg registrert";
  const profileLine = [profile.name, refs, colors, notes].filter(Boolean).join(" | ");

  const base = "Du er en moteekspert som er spesialisert på balanserte silhuetter og gode fargekombinasjoner. Du er streng men rettferdig, og oppmuntrer til en moderne europeisk estetikk — strukturert, god kvalitet over mengde og alltid litt noe som løfter outfiten uten at det blir prangende. Du er glad i gjenbruk og henviser til Vestiaire og lignende apper, eller europeiske merker med fokus på god kvalitet.";
  return base + "\n\nBruker: " + profileLine + "\nGarderobe:\n" + wardrobeSummary + "\nGi konkrete, direkte råd på norsk. Ingen tomme komplimenter.";
}


function WardrobePicker({ wardrobe, selected, onToggle }) {
  const [openCat, setOpenCat] = useState(null);
  const allItems = GARMENT_CATEGORIES.flatMap(cat => (wardrobe[cat.id] || []).map(i => ({ ...i, category: cat.label })));

  return (
    <div style={{ borderTop: "1px solid #dedad4", background: "#fafafa", padding: "1rem 1.25rem", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
        <Mono style={{ color: "#6b6560" }}>Velg plagg</Mono>
        {selected.length > 0 && <Mono style={{ color: "#1a1814" }}>{selected.length} valgt</Mono>}
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
                      {item.name || "—"}
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

function ChatStep({ profile, wardrobe, onEditProfile, onEditWardrobe, onReset }) {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [selected, setSelected]         = useState([]);
  const [showMenu, setShowMenu]         = useState(false);
  const [savingChat, setSavingChat]     = useState(false);
  const bottomRef = useRef();
  const system = buildSystem(profile, wardrobe);

  const allItems = GARMENT_CATEGORIES.flatMap(cat =>
    (wardrobe[cat.id] || []).map(item => ({ ...item, category: cat.label }))
  );

  useEffect(() => {
    (async () => {
      const saved = await load(SK.chat);
      if (Array.isArray(saved) && saved.length > 0) {
        // Only restore messages that have valid string or array content
        const valid = saved.filter(m =>
          m && m.role && m.display &&
          (typeof m.content === "string" || Array.isArray(m.content))
        );
        setMessages(valid);
      }
    })();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (messages.length === 0) return;
    const t = setTimeout(async () => {
      setSavingChat(true);
      // Strip base64 image blobs before storing — text only
      const toStore = messages.map(m => ({
        ...m,
        content: m.content.filter(b => b.type === "text"),
        display: { ...m.display, images: [] },
      }));
      await save(SK.chat, toStore);
      setSavingChat(false);
    }, 800);
    return () => clearTimeout(t);
  }, [messages]);

  function toggle(id) { setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

  async function send() {
    const text = input.trim();
    if (!text && selected.length === 0) return;

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
    setInput(""); setSelected([]); setShowWardrobe(false); setLoading(true);

    try {
      const payload = {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: String(system || "Du er en moteekspert. Svar på norsk."),
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
        throw new Error("Kunne ikke lese svar fra server");
      }
      if (!res.ok) throw new Error(data?.error?.message || "Serverfeil " + res.status);
      const txt = data.content?.find(b => b.type === "text")?.text || "";
      setMessages(p => [...p, { role: "assistant", content: txt, display: { text: txt, images: [] } }]);
    } catch (err) {
      const errMsg = "Feil: " + (err?.message || String(err));
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
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: "300", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a1814" }}>tenue</span>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "0.85rem", color: "#9c9590", marginLeft: "0.75rem" }}>{profile.name}</span>
            </div>
            <Mono style={{ color: "#7a2535" }}>·</Mono>
            <Mono style={{ color: "#9c9590" }}>{allItems.length} plagg</Mono>
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
                { label: "Rediger profil",       action: () => { setShowMenu(false); onEditProfile(); } },
                { label: "Rediger garderobe",    action: () => { setShowMenu(false); onEditWardrobe(); } },
                { label: "Tøm samtalehistorikk", action: clearChat, danger: true },
                { label: "Start helt på nytt",  action: onReset,   danger: true },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "transparent", border: "none", borderBottom: "1px solid #eae6de",
                  padding: "0.6rem 0.85rem", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
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
              Hei, {profile.name}. Jeg kjenner garderoben din.<br />Hva vil du snakke om i dag?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
              {[
                "Hva kan jeg sette sammen til kontor i morgen?",
                "Er det noe jeg bør kvitte meg med?",
                "Hva mangler jeg?",
                "Sett sammen din favorittoutfit fra det jeg har",
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
            alignItems: m.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeUp 0.3s ease",
          }}>
            {m.display?.images?.length > 0 && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end", marginBottom: "0.4rem", maxWidth: "75%" }}>
                {m.display.images.map((img, idx) => (
                  <img key={idx} src={img.preview} alt="" style={{ width: "72px", height: "96px", objectFit: "cover", border: "1px solid #dedad4" }} />
                ))}
              </div>
            )}
            {m.display?.text && (
              <div style={{
                maxWidth: "78%",
                background: m.role === "user" ? "#1a1814" : "#f4f4f6",
                color: m.role === "user" ? "#f4f4f6" : "#1a1a1a",
                padding: "0.9rem 1.1rem", fontSize: "0.95rem", lineHeight: "1.75",
                border: m.role === "assistant" ? "1px solid #dedad4" : "none",
                whiteSpace: "pre-wrap", fontFamily: "'Fraunces', Georgia, serif",
              }}>{m.display.text}</div>
            )}
            <Mono style={{ color: "#9c9590", marginTop: "0.3rem" }}>
              {m.role === "user" ? profile.name : "Ekspert"}
            </Mono>
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
        {selected.length > 0 && (
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
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          {allItems.length > 0 && (
            <button onClick={() => setShowWardrobe(p => !p)} title="Åpne garderobe" style={{
              border: `1px solid ${showWardrobe ? "#1a1814" : "#7a2535"}`,
              background: showWardrobe ? "#1a1814" : "transparent",
              color: showWardrobe ? "#f4f4f6" : "#6b7280",
              padding: "0.6rem 0.75rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.1em", transition: "all 0.15s", height: "44px",
            }}>▤</button>
          )}
          <textarea
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder="Spør om garderoben, outfits, kjøp…" rows={1}
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
            disabled={loading || (!input.trim() && selected.length === 0)}
            style={{
              background: (!input.trim() && selected.length === 0) || loading ? "#7a2535" : "#1a1814",
              color: "#f4f4f6", border: "none", padding: "0 1.25rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              height: "44px", whiteSpace: "nowrap", transition: "background 0.2s",
            }}
          >Send</button>
        </div>
      </div>
    </div>
  );
}


// ─── Outfit Rating ────────────────────────────────────────────────────────────
function OutfitRating({ profile, wardrobe, onBack }) {
  const [image, setImage]       = useState(null);
  const [base64, setBase64]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [viewing, setViewing]   = useState(null); // historikk-entry som vises i full-view
  const cameraRef = useRef();
  const galleryRef = useRef();

  // Last historikk ved mount
  useEffect(() => {
    (async () => {
      const saved = await load("tenue-outfit-history");
      if (Array.isArray(saved)) setHistory(saved);
    })();
  }, []);

  async function handleFile(file) {
    // Høyere oppløsning for outfit-bilder enn for garderoben (brukeren ser bildet igjen + Claude analyserer det)
    const { dataURL, base64: b64, mediaType } = await compressImage(file, 1280, 0.88);
    setImage({ dataURL, base64: b64, mediaType });
    setResult(null);
    setError(null);
  }

  // Lagre vurdering til historikk etter vellykket analyse
  async function saveToHistory(entry) {
    const next = [entry, ...history].slice(0, 30); // behold siste 30
    setHistory(next);
    await save("tenue-outfit-history", next);
  }

  async function deleteHistoryEntry(id) {
    const next = history.filter(h => h.id !== id);
    setHistory(next);
    await save("tenue-outfit-history", next);
    if (viewing?.id === id) setViewing(null);
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

    const refs = [...(profile.references || []), profile.customRef].filter(Boolean).join(", ") || "ikke spesifisert";
    const colors = (profile.colors || []).join(", ") || "ikke spesifisert";

    const systemPrompt = "Du er en moteekspert som er spesialisert på balanserte silhuetter og gode fargekombinasjoner. Du er streng men rettferdig, og oppmuntrer til en moderne europeisk estetikk — strukturert, god kvalitet over mengde. Du er glad i gjenbruk og henviser til Vestiaire og europeiske kvalitetsmerker. Brukeren heter " + profile.name + ". Stilreferanser: " + refs + ". Fargepalett: " + colors + ". Garderobe:\n" + wardrobeSummary + "\n\nVurder antrekket i bildet. Svar KUN med gyldig JSON og ingenting annet:\n{\"karakter\": [tall 1-10],\"styrker\": [liste med 2-3 korte punkter],\"svakheter\": [liste med 1-2 korte punkter],\"forslag\": [liste med 1-2 konkrete forbedringsforslag]}";

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
              { type: "text", text: "Vurder dette antrekket." }
            ]
          }]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Ukjent feil");
      const txt = data.content?.find(b => b.type === "text")?.text || "";
      const clean = txt.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      // Lagre til historikk — gir kompasset revealed-preference-data over tid
      saveToHistory({
        id: `outfit-${Date.now()}`,
        date: new Date().toISOString(),
        base64: image.base64,
        mediaType: image.mediaType,
        karakter: parsed.karakter,
        styrker: parsed.styrker || [],
        svakheter: parsed.svakheter || [],
        forslag: parsed.forslag || [],
      });
    } catch (err) {
      setError("Noe gikk galt: " + err.message);
    }
    setLoading(false);
  }

  const scoreColor = result ? (result.karakter >= 8 ? "#4a5c3f" : result.karakter >= 6 ? "#7a2535" : "#8a3030") : "#1a1814";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto", fontFamily: "'Fraunces', Georgia, serif" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #d4cfc8", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#9c9590", textTransform: "uppercase" }}>← Tilbake</button>
        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: "300", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a1814" }}>tenue</span>
        <div style={{ width: "60px" }} />
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.5rem" }}>Dagens antrekk</Mono>
        <h1 style={{ fontSize: "2.4rem", fontWeight: "300", color: "#1a1814", marginBottom: "2rem", letterSpacing: "0.01em" }}>Få en vurdering</h1>

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
            <Mono style={{ color: "#9c9590", textAlign: "center" }}>Legg til antrekk</Mono>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => cameraRef.current.click()}
                style={{
                  border: "none", background: "#1a1814", color: "#f4f4f6",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "0.75rem 1.25rem", cursor: "pointer",
                }}
              >Ta bilde</button>
              <button
                onClick={() => galleryRef.current.click()}
                style={{
                  border: "1px solid #1a1814", background: "transparent", color: "#1a1814",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "0.75rem 1.25rem", cursor: "pointer",
                }}
              >Fra galleri</button>
            </div>
            <input ref={cameraRef}  type="file" accept="image/*" capture="environment" hidden onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            <input ref={galleryRef} type="file" accept="image/*" hidden onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <img src={image.dataURL} alt="Antrekk" style={{ width: "100%", maxHeight: "480px", objectFit: "contain", display: "block", background: "#e8e8eb" }} />
            <button onClick={() => { setImage(null); setResult(null); }} style={{
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
              {loading ? "Analyserer…" : "Vurder antrekket"}
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
              <span style={{ fontSize: "4rem", fontWeight: "300", color: scoreColor, lineHeight: 1 }}>{result.karakter}</span>
              <span style={{ fontSize: "1.5rem", color: "#9c9590", fontWeight: "300" }}>/10</span>
            </div>

            {/* Styrker */}
            <div style={{ marginBottom: "1.5rem" }}>
              <Mono style={{ color: "#4a5c3f", display: "block", marginBottom: "0.75rem" }}>Styrker</Mono>
              {(result.styrker || []).map((s, i) => (
                <p key={i} style={{ fontSize: "1rem", color: "#1a1814", lineHeight: "1.6", marginBottom: "0.4rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #4a5c3f" }}>{s}</p>
              ))}
            </div>

            {/* Svakheter */}
            <div style={{ marginBottom: "1.5rem" }}>
              <Mono style={{ color: "#8a3030", display: "block", marginBottom: "0.75rem" }}>Svakheter</Mono>
              {(result.svakheter || []).map((s, i) => (
                <p key={i} style={{ fontSize: "1rem", color: "#1a1814", lineHeight: "1.6", marginBottom: "0.4rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8a3030" }}>{s}</p>
              ))}
            </div>

            {/* Forslag */}
            <div style={{ marginBottom: "2rem" }}>
              <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.75rem" }}>Forslag</Mono>
              {(result.forslag || []).map((s, i) => (
                <p key={i} style={{ fontSize: "1rem", color: "#1a1814", lineHeight: "1.6", marginBottom: "0.4rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8c7c6c" }}>{s}</p>
              ))}
            </div>

            {/* Try again */}
            <button onClick={() => { setImage(null); setResult(null); }} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.14em", color: "#9c9590", textTransform: "uppercase",
              borderBottom: "1px solid #d4cfc8", paddingBottom: "2px",
            }}>Nytt antrekk</button>
          </div>
        )}

        {/* Historikk-strip */}
        {history.length > 0 && !viewing && (
          <div style={{ marginTop: "3rem", borderTop: "1px solid #d4cfc8", paddingTop: "1.5rem" }}>
            <Mono style={{ color: "#9c9590", display: "block", marginBottom: "1rem" }}>Tidligere antrekk</Mono>
            <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {history.map(h => (
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
                    alt="Tidligere antrekk"
                    style={{ width: "90px", height: "120px", objectFit: "cover", display: "block", background: "#e8e8eb" }}
                  />
                  <div style={{
                    position: "absolute", bottom: "4px", right: "4px",
                    background: "rgba(26,24,20,0.85)", color: "#f4f4f6",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                    padding: "2px 6px", letterSpacing: "0.04em",
                  }}>{h.karakter}/10</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-view av historikk-entry */}
      {viewing && (
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
                {new Date(viewing.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })}
              </Mono>
              <button onClick={() => setViewing(null)} style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "'DM Mono', monospace", fontSize: "1rem", color: "#1a1814",
              }}>×</button>
            </div>
            <img
              src={b64url(viewing.base64, viewing.mediaType || "image/jpeg")}
              alt="Antrekk"
              style={{ width: "100%", maxHeight: "480px", objectFit: "contain", display: "block", background: "#e8e8eb", marginBottom: "1.25rem" }}
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #d4cfc8", paddingBottom: "1rem" }}>
              <span style={{ fontSize: "3rem", fontWeight: "300", color: viewing.karakter >= 8 ? "#4a5c3f" : viewing.karakter >= 6 ? "#7a2535" : "#8a3030", lineHeight: 1 }}>{viewing.karakter}</span>
              <span style={{ fontSize: "1.2rem", color: "#9c9590", fontWeight: "300" }}>/10</span>
            </div>
            {viewing.styrker?.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <Mono style={{ color: "#4a5c3f", display: "block", marginBottom: "0.5rem" }}>Styrker</Mono>
                {viewing.styrker.map((s, i) => (
                  <p key={i} style={{ fontSize: "0.95rem", color: "#1a1814", lineHeight: "1.5", marginBottom: "0.3rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #4a5c3f" }}>{s}</p>
                ))}
              </div>
            )}
            {viewing.svakheter?.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <Mono style={{ color: "#8a3030", display: "block", marginBottom: "0.5rem" }}>Svakheter</Mono>
                {viewing.svakheter.map((s, i) => (
                  <p key={i} style={{ fontSize: "0.95rem", color: "#1a1814", lineHeight: "1.5", marginBottom: "0.3rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8a3030" }}>{s}</p>
                ))}
              </div>
            )}
            {viewing.forslag?.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.5rem" }}>Forslag</Mono>
                {viewing.forslag.map((s, i) => (
                  <p key={i} style={{ fontSize: "0.95rem", color: "#1a1814", lineHeight: "1.5", marginBottom: "0.3rem", paddingLeft: "0.75rem", borderLeft: "1.5px solid #8c7c6c" }}>{s}</p>
                ))}
              </div>
            )}
            <button onClick={() => deleteHistoryEntry(viewing.id)} style={{
              background: "transparent", border: "1px solid #c4a0a0", color: "#8a3030",
              fontFamily: "'DM Mono', monospace", fontSize: "0.55rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "0.6rem 1.2rem", cursor: "pointer", marginTop: "0.5rem",
            }}>Slett fra historikk</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Wishlist ─────────────────────────────────────────────────────────────────

function Wishlist({ onBack }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await load("tenue-wishlist");
      if (Array.isArray(saved)) setItems(saved);
      setLoaded(true);
    })();
  }, []);

  async function addItem() {
    const newItem = { id: `wish-${Date.now()}`, name: "", brand: "", url: "", note: "" };
    const updated = [...items, newItem];
    setItems(updated);
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
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f6", fontFamily: "'Fraunces', Georgia, serif" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #7a2535", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#9c9590", textTransform: "uppercase" }}>← Tilbake</button>
        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: "300", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a1814" }}>tenue</span>
        <div style={{ width: "60px" }} />
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <Mono style={{ color: "#7a2535", display: "block", marginBottom: "0.5rem" }}>Ønskeliste</Mono>
        <h1 style={{ fontSize: "2.4rem", fontWeight: "300", color: "#1a1814", marginBottom: "2rem", letterSpacing: "0.01em" }}>Plagg du vil ha</h1>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "1.25rem" }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ background: "#fafafa", borderBottom: "1px solid #7a2535" }}>
              <div style={{ padding: "0.85rem 0.9rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)}
                    placeholder="Navn"
                    style={{ flex: 2, border: "none", borderBottom: "1px solid #7a2535", background: "transparent", padding: "0.35rem 0", fontSize: "1rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
                  <input value={item.brand} onChange={e => updateItem(item.id, "brand", e.target.value)}
                    placeholder="Merke"
                    style={{ flex: 1, border: "none", borderBottom: "1px solid #7a2535", background: "transparent", padding: "0.35rem 0", fontSize: "1rem", color: "#1a1814", fontFamily: "'Fraunces', Georgia, serif" }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                  <input value={item.note} onChange={e => updateItem(item.id, "note", e.target.value)}
                    placeholder="Notat"
                    style={{ flex: 1, border: "none", borderBottom: "1px solid #7a2535", background: "transparent", padding: "0.35rem 0", fontSize: "0.9rem", color: "#6b6560", fontFamily: "'Fraunces', Georgia, serif" }} />
                  <button onClick={() => removeItem(item.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "#9c9590", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>Slett</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loaded && (
          <button onClick={addItem} style={{
            border: "1px solid #7a2535", background: "transparent",
            padding: "0.65rem 1.25rem", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a2535",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#7a2535"; e.currentTarget.style.color = "#fafafa"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7a2535"; }}
          >+ Legg til</button>
        )}
      </div>
    </div>
  );
}



function NavRow({ label, onClick, locked }) {
  return (
    <button onClick={locked ? undefined : onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "transparent", border: "none", borderBottom: "1px solid #7a2535",
      padding: "1.1rem 0", cursor: locked ? "default" : "pointer",
      width: "100%", textAlign: "left", transition: "opacity 0.15s",
      opacity: locked ? 0.28 : 1,
    }}
      onMouseEnter={e => { if (!locked) e.currentTarget.style.opacity = "0.55"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = locked ? "0.28" : "1"; }}
    >
      <Mono style={{ color: "#1a1814", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "none" }}>{label}</Mono>
      <Mono style={{ color: "#7a2535", fontSize: "0.6rem" }}>→</Mono>
    </button>
  );
}

function HomeScreen({ profile, wardrobe, onGoProfile, onGoWardrobe, onGoChat, onGoOutfit, onGoWishlist, onReset }) {
  const hasProfile = profile?.name;
  const canChat = !!hasProfile;

  return (
    <div style={{
      height: "100vh", background: "#f4f4f6",
      display: "flex", flexDirection: "column",
      fontFamily: "'Fraunces', Georgia, serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "1.75rem 1.5rem 1.25rem",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        borderBottom: "1px solid #7a2535",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "2rem", fontWeight: "300",
            color: "#1a1814", letterSpacing: "0.18em",
            lineHeight: 1,
          }}>tenue</h1>
          {hasProfile && (
            <p style={{ fontSize: "0.85rem", color: "#9c9590", marginTop: "3px" }}>{profile.name}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {hasProfile && (
            <button onClick={onReset} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "#9c9590" }}>nullstill</button>
          )}
        </div>
      </div>

      {/* Nav — slightly above centre */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "4vh" }}>
        <div style={{ width: "100%", maxWidth: "520px", padding: "0 1.5rem" }}>
          <NavRow label="profil"          onClick={onGoProfile}  locked={false} />
          <NavRow label="garderobe"       onClick={onGoWardrobe} locked={false} />
          <NavRow label="ønskeliste"      onClick={onGoWishlist} locked={!canChat} />
          <NavRow label="konsultasjon"    onClick={onGoChat}     locked={!canChat} />
          <NavRow label="dagens antrekk" onClick={onGoOutfit}   locked={!canChat} />

          {/* Colour palette */}
          {profile?.colors?.length > 0 && (
            <div style={{ display: "flex", gap: "3px", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {profile.colors.map(n => {
                const c = PRESET_COLORS.find(p => p.name === n);
                return c ? (
                  <div key={n} title={n} style={{
                    width: "13px", height: "13px", background: c.hex,
                    border: (c.hex === "#f4f4f6" || c.hex === "#fafafa") ? "1px solid #c8c0b4" : "none",
                  }} />
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      <p style={{ textAlign: "center", padding: "1.25rem", fontFamily: "'DM Mono', monospace", fontSize: "0.48rem", color: "#9c9590", letterSpacing: "0.2em", flexShrink: 0 }}>
        tenue
      </p>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView]         = useState(null); // null=loading, "home","profile","wardrobe","chat","outfit","wishlist"
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
      if (p) setProfile(p);
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
            <button onClick={() => setView("home")} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
              letterSpacing: "0.12em", color: "#9c9590", textTransform: "uppercase",
            }}>← Tilbake</button>
          </div>
          <ProfileStep
            existing={profile}
            onComplete={p => { setProfile(p); setView("home"); }}
          />
        </div>
      )}

      {view === "wardrobe" && (
        <div style={{ minHeight: "100vh", background: "#f4f4f6", overflowY: "auto" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
            <button onClick={() => setView("home")} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
              letterSpacing: "0.12em", color: "#9c9590", textTransform: "uppercase",
            }}>← Tilbake</button>
          </div>
          <WardrobeStep
            profile={profile}
            existing={wardrobe}
            onComplete={w => { setWardrobe(w); setView("home"); }}
          />
        </div>
      )}

      {view === "chat" && (
        <ChatStep
          profile={profile}
          wardrobe={wardrobe}
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
        <Wishlist onBack={() => setView("home")} />
      )}
    </>
  );
}
