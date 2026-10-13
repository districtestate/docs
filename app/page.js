import React, { useState, useRef, useEffect } from "react";

const GOLD = "#f5c542";
const COLORS = {
  bg: "#0b0b0b", card: "#111111", card2: "#161616", border: "#222222",
  gold: GOLD, text: "#e0e0e0", muted: "#777777", white: "#ffffff",
  danger: "#e74c3c", success: "#2ecc71", purple: "#8b5cf6"
};

function num(v) { return Number(v) || 0; }
function money(n) { return "$" + num(n).toLocaleString(); }

const DEMO_SUBS = [
  { id: "sub1", name: "Jaylen Carter", email: "jaylen@districtestate.com", password: "team123", role: "subadmin" },
  { id: "sub2", name: "Tiana Brooks", email: "tiana@districtestate.com", password: "team123", role: "subadmin" }
];

const DEMO_INV = [
  { id: "inv1", name: "Marcus Johnson", email: "marcus@email.com", password: "investor123", status: "approved", tier: "VIP", score: 92, dealsViewed: 14, offersSubmitted: 5, dealsClosed: 3 },
  { id: "inv2", name: "Sarah Williams", email: "sarah@email.com", password: "investor123", status: "pending", tier: "STANDARD", score: 45, dealsViewed: 3, offersSubmitted: 1, dealsClosed: 0 },
  { id: "inv3", name: "David Chen", email: "david@email.com", password: "investor123", status: "approved", tier: "JV PARTNER", score: 88, dealsViewed: 22, offersSubmitted: 8, dealsClosed: 5 }
];

function makeRepairs() {
  return [
    { name: "Entry / Painting", cost: 5000, details: "Interior and exterior painting, trim work, and touch-ups." },
    { name: "Flooring", cost: 8000, details: "Replace carpet and vinyl with luxury vinyl plank flooring throughout." },
    { name: "Kitchen", cost: 14000, details: "Full remodel: new cabinets, countertops, sink, faucet, stainless appliances, light fixtures." },
    { name: "Bathroom", cost: 6000, details: "Full renovation: new vanity, toilet, tub/shower surround, tile, fixtures." },
    { name: "HVAC", cost: 4500, details: "Service or replace HVAC system. New thermostat, sealed ductwork." },
    { name: "Plumbing", cost: 2500, details: "Fix leaks, replace fixtures, ensure proper drainage." },
    { name: "Electric", cost: 3500, details: "Update panel, replace wiring, GFCI outlets, new fixtures." },
    { name: "Windows", cost: 1500, details: "Repair or replace damaged windows, ensure sealing." },
    { name: "Miscellaneous", cost: 2000, details: "Landscaping, cleanup, dumpster, permits, contingency." }
  ];
}

const DEMO_DEALS = [
  {
    id: "d1", status: "active",
    subject: { address: "1234 Oak Street, Atlanta, GA 30301", beds: 2, baths: 1, sqft: 1185, yearBuilt: 1965 },
    comp: { address: "1240 Elm Ave, Atlanta, GA 30301", beds: 2, baths: 1, sqft: 1224, soldPrice: 100000, soldDate: "Jan 2025", distance: "0.8 mi" },
    repairs: makeRepairs(), adjustments: { size: 2000, condition: 5000, amenities: 3000 },
    askingPrice: 85000, wholesaleFee: 8000, netToSeller: 77000, estimatedRent: 1100,
    subjectImages: [], compImages: [], locked: false, lockedBy: null, lockExpires: null,
    offers: [{ investorId: "inv1", price: 82000, timeline: "14 days", notes: "Cash offer", status: "pending" }], views: 47
  },
  {
    id: "d2", status: "active",
    subject: { address: "5678 Pine Road, Decatur, GA 30030", beds: 3, baths: 2, sqft: 1450, yearBuilt: 1978 },
    comp: { address: "5690 Pine Road, Decatur, GA 30030", beds: 3, baths: 2, sqft: 1500, soldPrice: 165000, soldDate: "Mar 2025", distance: "0.3 mi" },
    repairs: makeRepairs().map(r => ({ ...r, cost: Math.round(r.cost * 1.2) })),
    adjustments: { size: 1500, condition: 8000, amenities: 2000 },
    askingPrice: 125000, wholesaleFee: 10000, netToSeller: 115000, estimatedRent: 1500,
    subjectImages: [], compImages: [], locked: false, lockedBy: null, lockExpires: null,
    offers: [], views: 23
  }
];

/* UI PRIMITIVES */

function FormInput({ label, value, onChange, type, prefix, small, textarea }) {
  const t = type || "text";
  const sBox = { width: "100%", padding: "10px 12px", paddingLeft: prefix ? 26 : 12, background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 6, color: COLORS.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: small ? 8 : 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, color: COLORS.muted, marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 10, top: textarea ? 12 : "50%", transform: textarea ? "none" : "translateY(-50%)", color: COLORS.muted, fontSize: 14 }}>{prefix}</span>}
        {textarea
          ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...sBox, resize: "vertical" }} />
          : <input type={t} value={value} onChange={e => onChange(e.target.value)} style={sBox} />
        }
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant, size, style: extraStyle, disabled }) {
  const v = variant || "gold";
  const sz = size || "md";
  const base = { border: "none", borderRadius: 6, cursor: disabled ? "default" : "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8 };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "14px 32px", fontSize: 16 } };
  const vars = {
    gold: { background: GOLD, color: "#000" },
    outline: { background: "transparent", color: GOLD, border: "1px solid " + GOLD },
    dark: { background: COLORS.card2, color: COLORS.text, border: "1px solid " + COLORS.border },
    danger: { background: COLORS.danger, color: "#fff" },
    success: { background: COLORS.success, color: "#fff" }
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[sz], ...vars[v], ...(extraStyle || {}) }}>
      {children}
    </button>
  );
}

function Badge({ children, color }) {
  const c = color || GOLD;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1, background: c + "22", color: c, textTransform: "uppercase" }}>{children}</span>;
}

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: COLORS.bg, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 28, width: "100%", maxWidth: wide ? 700 : 480, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: COLORS.white }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 22, cursor: "pointer" }}>&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "1px solid " + COLORS.border, overflowX: "auto" }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: "10px 16px", background: "none", border: "none",
          borderBottom: active === t ? "2px solid " + GOLD : "2px solid transparent",
          color: active === t ? GOLD : COLORS.muted, fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap"
        }}>{t}</button>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "18px 20px", flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: GOLD }}>{value}</div>
    </div>
  );
}

/* CHANGE PASSWORD */
function ChangePwModal({ open, onClose, onChangePw }) {
  const [cur, setCur] = useState("");
  const [np, setNp] = useState("");
  const [cf, setCf] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function go() {
    setErr(""); setOk("");
    if (!cur || !np || !cf) { setErr("All fields required."); return; }
    if (np.length < 6) { setErr("Min 6 characters."); return; }
    if (np !== cf) { setErr("Passwords don't match."); return; }
    if (onChangePw(cur, np)) {
      setOk("Updated!");
      setCur(""); setNp(""); setCf("");
      setTimeout(() => { onClose(); setOk(""); }, 1200);
    } else {
      setErr("Current password incorrect.");
    }
  }

  function handleClose() { onClose(); setErr(""); setOk(""); setCur(""); setNp(""); setCf(""); }

  return (
    <Modal open={open} onClose={handleClose} title="Change Password">
      {ok && <div style={{ padding: "10px 14px", background: COLORS.success + "22", color: COLORS.success, borderRadius: 6, fontSize: 13, marginBottom: 14 }}>{ok}</div>}
      {err && <div style={{ padding: "10px 14px", background: COLORS.danger + "22", color: COLORS.danger, borderRadius: 6, fontSize: 13, marginBottom: 14 }}>{err}</div>}
      <FormInput label="Current Password" value={cur} onChange={setCur} type="password" />
      <FormInput label="New Password" value={np} onChange={setNp} type="password" />
      <FormInput label="Confirm" value={cf} onChange={setCf} type="password" />
      <Btn onClick={go} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Update Password</Btn>
    </Modal>
  );
}

/* LOGIN */
function LoginPage({ onLogin, investors, subadmins, onRegister }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function login() {
    setErr("");
    if (email === "amari@districtestate.com" && pw === "admin123") { onLogin({ role: "admin", name: "Amari", email: email, password: "admin123" }); return; }
    var s = subadmins.find(function(x) { return x.email === email && x.password === pw; });
    if (s) { onLogin({ ...s, role: "subadmin" }); return; }
    var inv = investors.find(function(i) { return i.email === email && i.password === pw; });
    if (!inv) { setErr("Invalid credentials"); return; }
    if (inv.status === "pending") { setErr("Account pending admin approval."); return; }
    if (inv.status === "rejected") { setErr("Account has been rejected."); return; }
    if (inv.tier === "SUB-ADMIN") { onLogin({ ...inv, role: "subadmin" }); return; }
    onLogin({ role: "investor", ...inv });
  }

  function reg() {
    if (!name || !email || !pw) { setErr("All fields required"); return; }
    onRegister({ id: "inv" + Date.now(), name: name, email: email, password: pw, status: "pending", tier: "STANDARD", score: 0, dealsViewed: 0, offersSubmitted: 0, dealsClosed: 0 });
    setOk("Registration submitted! Await admin approval.");
    setMode("login"); setName(""); setEmail(""); setPw(""); setErr("");
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ color: GOLD, fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>DISTRICT ESTATE LLC</div>
          <div style={{ color: COLORS.muted, fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Private Investor Platform</div>
        </div>
        <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 32 }}>
          <TabBar tabs={["Login", "Register"]} active={mode === "login" ? "Login" : "Register"} onChange={function(t) { setMode(t === "Login" ? "login" : "register"); setErr(""); setOk(""); }} />
          {ok && <div style={{ padding: "10px 14px", background: COLORS.success + "22", color: COLORS.success, borderRadius: 6, fontSize: 13, marginBottom: 14 }}>{ok}</div>}
          {err && <div style={{ padding: "10px 14px", background: COLORS.danger + "22", color: COLORS.danger, borderRadius: 6, fontSize: 13, marginBottom: 14 }}>{err}</div>}
          {mode === "register" && <FormInput label="Full Name" value={name} onChange={setName} />}
          <FormInput label="Email" value={email} onChange={setEmail} type="email" />
          <FormInput label="Password" value={pw} onChange={setPw} type="password" />
          <Btn onClick={mode === "login" ? login : reg} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            {mode === "login" ? "Sign In" : "Request Access"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* DEAL EDITOR */
function DealEditor({ deal, onSave, onCancel }) {
  const [d, setD] = useState(JSON.parse(JSON.stringify(deal)));
  const subRef = useRef(null);
  const compRef = useRef(null);
  const [tab, setTab] = useState("Property");

  function up(path, val) {
    setD(function(prev) {
      var next = JSON.parse(JSON.stringify(prev));
      var keys = path.split(".");
      var obj = next;
      for (var i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  }

  function upR(idx, f, val) {
    setD(function(prev) {
      var next = JSON.parse(JSON.stringify(prev));
      next.repairs[idx][f] = f === "cost" ? (Number(val) || 0) : val;
      return next;
    });
  }

  function handleImg(e, key) {
    var urls = Array.from(e.target.files).map(function(f) { return URL.createObjectURL(f); });
    setD(function(prev) { return { ...prev, [key]: [...(prev[key] || []), ...urls] }; });
    e.target.value = "";
  }

  var totalR = d.repairs.reduce(function(s, r) { return s + num(r.cost); }, 0);

  return (
    <div>
      <TabBar tabs={["Property", "Comp", "Repairs", "Financials", "Images"]} active={tab} onChange={setTab} />

      {tab === "Property" && (
        <div>
          <FormInput label="Address" value={d.subject.address} onChange={function(v) { up("subject.address", v); }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <FormInput label="Beds" value={d.subject.beds} onChange={function(v) { up("subject.beds", Number(v) || 0); }} type="number" />
            <FormInput label="Baths" value={d.subject.baths} onChange={function(v) { up("subject.baths", Number(v) || 0); }} type="number" />
            <FormInput label="Sq Ft" value={d.subject.sqft} onChange={function(v) { up("subject.sqft", Number(v) || 0); }} type="number" />
          </div>
          <FormInput label="Year Built" value={d.subject.yearBuilt} onChange={function(v) { up("subject.yearBuilt", v); }} />
        </div>
      )}

      {tab === "Comp" && (
        <div>
          <FormInput label="Comp Address" value={d.comp.address} onChange={function(v) { up("comp.address", v); }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <FormInput label="Beds" value={d.comp.beds} onChange={function(v) { up("comp.beds", Number(v) || 0); }} type="number" />
            <FormInput label="Baths" value={d.comp.baths} onChange={function(v) { up("comp.baths", Number(v) || 0); }} type="number" />
            <FormInput label="Sq Ft" value={d.comp.sqft} onChange={function(v) { up("comp.sqft", Number(v) || 0); }} type="number" />
          </div>
          <FormInput label="Sold Price" value={d.comp.soldPrice} onChange={function(v) { up("comp.soldPrice", Number(v) || 0); }} type="number" prefix="$" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormInput label="Sold Date" value={d.comp.soldDate} onChange={function(v) { up("comp.soldDate", v); }} />
            <FormInput label="Distance" value={d.comp.distance} onChange={function(v) { up("comp.distance", v); }} />
          </div>
        </div>
      )}

      {tab === "Repairs" && (
        <div>
          {d.repairs.map(function(r, i) {
            return (
              <div key={i} style={{ background: COLORS.card2, border: "1px solid " + COLORS.border, borderRadius: 8, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}><FormInput label="Item" value={r.name} onChange={function(v) { upR(i, "name", v); }} small /></div>
                  <div style={{ width: 120 }}><FormInput label="Cost" value={r.cost} onChange={function(v) { upR(i, "cost", v); }} type="number" prefix="$" small /></div>
                  <button onClick={function() { setD(function(prev) { return { ...prev, repairs: prev.repairs.filter(function(_, j) { return j !== i; }) }; }); }} style={{ background: "none", border: "none", color: COLORS.danger, cursor: "pointer", fontSize: 18, marginTop: 18 }}>&#x2715;</button>
                </div>
                <FormInput label="Details" value={r.details} onChange={function(v) { upR(i, "details", v); }} textarea small />
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <Btn variant="outline" size="sm" onClick={function() { setD(function(prev) { return { ...prev, repairs: [...prev.repairs, { name: "New Item", cost: 0, details: "" }] }; }); }}>+ Add Repair</Btn>
            <span style={{ color: GOLD, fontWeight: 700 }}>{money(totalR)}</span>
          </div>
        </div>
      )}

      {tab === "Financials" && (
        <div>
          <FormInput label="Asking Price" value={d.askingPrice} onChange={function(v) { up("askingPrice", Number(v) || 0); }} type="number" prefix="$" />
          <FormInput label="Wholesale Fee" value={d.wholesaleFee} onChange={function(v) { up("wholesaleFee", Number(v) || 0); }} type="number" prefix="$" />
          <FormInput label="Net to Seller" value={d.netToSeller} onChange={function(v) { up("netToSeller", Number(v) || 0); }} type="number" prefix="$" />
          <FormInput label="Estimated Rent" value={d.estimatedRent} onChange={function(v) { up("estimatedRent", Number(v) || 0); }} type="number" prefix="$" />
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}><strong>Adjustments</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
            <FormInput label="Size" value={d.adjustments.size} onChange={function(v) { up("adjustments.size", Number(v) || 0); }} type="number" prefix="$" />
            <FormInput label="Condition" value={d.adjustments.condition} onChange={function(v) { up("adjustments.condition", Number(v) || 0); }} type="number" prefix="$" />
            <FormInput label="Amenities" value={d.adjustments.amenities} onChange={function(v) { up("adjustments.amenities", Number(v) || 0); }} type="number" prefix="$" />
          </div>
        </div>
      )}

      {tab === "Images" && (
        <div>
          {[["subjectImages", "Subject Property", subRef], ["compImages", "Comp Property", compRef]].map(function(item) {
            var key = item[0]; var label = item[1]; var ref = item[2];
            return (
              <div key={key} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 10 }}>{label} Photos</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(d[key] || []).map(function(src, i) {
                    return (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={src} style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6, border: "1px solid " + COLORS.border }} />
                        <button onClick={function() { setD(function(prev) { return { ...prev, [key]: prev[key].filter(function(_, j) { return j !== i; }) }; }); }} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.8)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 10, cursor: "pointer" }}>&#x2715;</button>
                      </div>
                    );
                  })}
                  <button onClick={function() { if (ref.current) ref.current.click(); }} style={{ width: 100, height: 70, background: COLORS.card2, border: "2px dashed " + COLORS.border, borderRadius: 6, color: COLORS.muted, cursor: "pointer", fontSize: 22 }}>+</button>
                </div>
                <input ref={ref} type="file" accept="image/*" multiple onChange={function(e) { handleImg(e, key); }} style={{ display: "none" }} />
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <Btn variant="dark" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={function() { onSave(d); }}>Save Deal</Btn>
      </div>
    </div>
  );
}

/* ADMIN DASHBOARD */
function AdminDash({ deals, setDeals, investors, setInvestors, onViewDeal, onLogout, user, onChangePw }) {
  const [tab, setTab] = useState("Deals");
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showPw, setShowPw] = useState(false);
  var isAdmin = user.role === "admin";
  var totalOffers = deals.reduce(function(s, d) { return s + d.offers.length; }, 0);
  var totalViews = deals.reduce(function(s, d) { return s + d.views; }, 0);
  var avgProfit = deals.length > 0 ? deals.reduce(function(s, d) {
    var tr = d.repairs.reduce(function(a, r) { return a + num(r.cost); }, 0);
    var arv = num(d.comp.soldPrice) + num(d.adjustments.size) + num(d.adjustments.condition) + num(d.adjustments.amenities);
    return s + (arv - num(d.askingPrice) - tr);
  }, 0) / deals.length : 0;

  function save(d) {
    if (editing) { setDeals(function(prev) { return prev.map(function(x) { return x.id === d.id ? d : x; }); }); }
    else { d.id = "d" + Date.now(); d.views = 0; d.offers = []; d.locked = false; setDeals(function(prev) { return [...prev, d]; }); }
    setEditing(null); setShowNew(false);
  }

  function updateInv(id, upd) { setInvestors(function(prev) { return prev.map(function(inv) { return inv.id === id ? { ...inv, ...upd } : inv; }); }); }

  function offerAction(dealId, oi, action) {
    setDeals(function(prev) { return prev.map(function(d) { if (d.id !== dealId) return d; var o = [...d.offers]; o[oi] = { ...o[oi], status: action }; return { ...d, offers: o }; }); });
  }

  var newTpl = { status: "active", subject: { address: "", beds: 0, baths: 0, sqft: 0, yearBuilt: "" }, comp: { address: "", beds: 0, baths: 0, sqft: 0, soldPrice: 0, soldDate: "", distance: "" }, repairs: makeRepairs(), adjustments: { size: 0, condition: 0, amenities: 0 }, askingPrice: 0, wholesaleFee: 0, netToSeller: 0, estimatedRent: 0, subjectImages: [], compImages: [], locked: false, lockedBy: null, lockExpires: null, offers: [], views: 0 };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ background: COLORS.card, borderBottom: "1px solid " + COLORS.border, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ color: GOLD, fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>DISTRICT ESTATE &mdash; {isAdmin ? "ADMIN" : "TEAM"}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge color={isAdmin ? GOLD : COLORS.purple}>{isAdmin ? "ADMIN" : "SUB-ADMIN"}</Badge>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>{user.name}</span>
          <Btn variant="dark" size="sm" onClick={function() { setShowPw(true); }}>&#x1F511;</Btn>
          <Btn variant="dark" size="sm" onClick={onLogout}>Logout</Btn>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="Active Deals" value={deals.filter(function(d) { return d.status === "active"; }).length} />
          <StatCard label="Total Offers" value={totalOffers} />
          <StatCard label="Deal Views" value={totalViews} />
          <StatCard label="Avg Profit" value={money(Math.round(avgProfit))} />
        </div>

        <TabBar tabs={["Deals", "Investors", "Offers"]} active={tab} onChange={setTab} />

        {tab === "Deals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: COLORS.white, fontSize: 18 }}>All Deals</h3>
              <Btn size="sm" onClick={function() { setEditing(null); setShowNew(true); }}>+ New Deal</Btn>
            </div>
            {deals.map(function(d) {
              var arv = num(d.comp.soldPrice) + num(d.adjustments.size) + num(d.adjustments.condition) + num(d.adjustments.amenities);
              return (
                <div key={d.id} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 18, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 15 }}>{d.subject.address || "No address"}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{d.subject.beds}bd / {d.subject.baths}ba | {num(d.subject.sqft).toLocaleString()} sqft | Ask: {money(d.askingPrice)} | ARV: {money(arv)}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <Badge>{d.status}</Badge>
                      {d.locked && <Badge color={COLORS.danger}>LOCKED</Badge>}
                      <Badge color={COLORS.muted}>{d.offers.length} offers</Badge>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="outline" size="sm" onClick={function() { onViewDeal(d); }}>View</Btn>
                    <Btn variant="dark" size="sm" onClick={function() { setEditing(d); setShowNew(true); }}>Edit</Btn>
                    {isAdmin && <Btn variant="danger" size="sm" onClick={function() { setDeals(function(prev) { return prev.filter(function(x) { return x.id !== d.id; }); }); }}>Delete</Btn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "Investors" && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: COLORS.white, fontSize: 18 }}>Investor Management</h3>
            {investors.map(function(inv) {
              return (
                <div key={inv.id} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 18, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ color: COLORS.white, fontWeight: 600 }}>{inv.name}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{inv.email}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <Badge color={inv.status === "approved" ? COLORS.success : inv.status === "pending" ? GOLD : COLORS.danger}>{inv.status}</Badge>
                      <Badge>{inv.tier}</Badge>
                      <Badge color={inv.score >= 80 ? COLORS.success : inv.score >= 50 ? GOLD : COLORS.danger}>Score: {inv.score}</Badge>
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 6 }}>{inv.dealsViewed} viewed | {inv.offersSubmitted} offers | {inv.dealsClosed} closed</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {isAdmin && inv.status === "pending" && (
                      <React.Fragment>
                        <Btn variant="success" size="sm" onClick={function() { updateInv(inv.id, { status: "approved" }); }}>Approve</Btn>
                        <Btn variant="danger" size="sm" onClick={function() { updateInv(inv.id, { status: "rejected" }); }}>Reject</Btn>
                      </React.Fragment>
                    )}
                    {isAdmin && inv.status === "approved" && (
                      <Btn variant="danger" size="sm" onClick={function() { updateInv(inv.id, { status: "rejected" }); }}>Kick</Btn>
                    )}
                    {isAdmin && inv.status === "rejected" && (
                      <Btn variant="success" size="sm" onClick={function() { updateInv(inv.id, { status: "approved" }); }}>Reinstate</Btn>
                    )}
                    {isAdmin ? (
                      <select value={inv.tier} onChange={function(e) { updateInv(inv.id, { tier: e.target.value }); }} style={{ padding: "6px 10px", background: COLORS.card2, border: "1px solid " + COLORS.border, borderRadius: 6, color: COLORS.text, fontSize: 12 }}>
                        <option value="STANDARD">Standard</option>
                        <option value="VIP">VIP</option>
                        <option value="JV PARTNER">JV Partner</option>
                        <option value="SUB-ADMIN">Sub-Admin</option>
                      </select>
                    ) : (
                      <Badge>{inv.tier}</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "Offers" && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: COLORS.white, fontSize: 18 }}>All Offers</h3>
            {deals.filter(function(d) { return d.offers.length > 0; }).map(function(d) {
              return (
                <div key={d.id} style={{ marginBottom: 20 }}>
                  <div style={{ color: GOLD, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{d.subject.address}</div>
                  {d.offers.map(function(o, oi) {
                    var inv = investors.find(function(i) { return i.id === o.investorId; });
                    return (
                      <div key={oi} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 8, padding: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ color: COLORS.white, fontSize: 14 }}>{inv ? inv.name : "Unknown"} &mdash; <span style={{ color: GOLD, fontWeight: 700 }}>{money(o.price)}</span></div>
                          <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>Close in {o.timeline} | {o.notes}</div>
                          <Badge color={o.status === "accepted" ? COLORS.success : o.status === "rejected" ? COLORS.danger : GOLD}>{o.status}</Badge>
                        </div>
                        {o.status === "pending" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <Btn variant="success" size="sm" onClick={function() { offerAction(d.id, oi, "accepted"); }}>Accept</Btn>
                            <Btn variant="danger" size="sm" onClick={function() { offerAction(d.id, oi, "rejected"); }}>Reject</Btn>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showNew} onClose={function() { setShowNew(false); setEditing(null); }} title={editing ? "Edit Deal" : "Create New Deal"} wide>
        <DealEditor deal={editing || newTpl} onSave={save} onCancel={function() { setShowNew(false); setEditing(null); }} />
      </Modal>
      <ChangePwModal open={showPw} onClose={function() { setShowPw(false); }} onChangePw={onChangePw} />
    </div>
  );
}

/* DEAL PRESENTATION */
var SECTS = ["SUBJECT", "STRONGEST COMP", "REPAIRS", "APPRAISAL RULES", "COMPARISON", "ARV", "ASKING PRICE"];

function DealView({ deal, onBack, user, onSubmitOffer }) {
  var d = deal;
  const [active, setActive] = useState(0);
  const [selR, setSelR] = useState(2);
  const [aTab, setATab] = useState("Requirements");
  const [showOffer, setShowOffer] = useState(false);
  const [oPrice, setOPrice] = useState("");
  const [oTime, setOTime] = useState("14 days");
  const [oNotes, setONotes] = useState("");
  const [hIdx, setHIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const refs = useRef([]);

  var totalR = d.repairs.reduce(function(s, r) { return s + num(r.cost); }, 0);
  var adjCV = num(d.comp.soldPrice) + num(d.adjustments.size) + num(d.adjustments.condition) + num(d.adjustments.amenities);
  var arv = adjCV;
  var mao = arv * 0.7 - totalR;
  var profit = arv - num(d.askingPrice) - totalR;
  var roi = num(d.askingPrice) > 0 ? ((profit / num(d.askingPrice)) * 100).toFixed(1) : 0;

  useEffect(function() {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx = refs.current.indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    }, { threshold: 0.25 });
    refs.current.forEach(function(r) { if (r) obs.observe(r); });
    return function() { obs.disconnect(); };
  }, []);

  function scrollTo(i) { if (refs.current[i]) refs.current[i].scrollIntoView({ behavior: "smooth" }); }

  function HeroImg({ images, idx, setIdx }) {
    if (!images || images.length === 0) return <div style={{ width: "100%", height: 200, background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted, marginBottom: 12 }}>No photos</div>;
    return (
      <div style={{ position: "relative", marginBottom: 8 }}>
        <img src={images[idx] || images[0]} style={{ width: "100%", maxHeight: 340, objectFit: "cover", borderRadius: 8 }} />
        {images.length > 1 && (
          <React.Fragment>
            <button onClick={function() { setIdx(Math.max(0, idx - 1)); }} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>{"<"}</button>
            <button onClick={function() { setIdx(Math.min(images.length - 1, idx + 1)); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>{">"}</button>
          </React.Fragment>
        )}
      </div>
    );
  }

  function Thumbs({ images, idx, setIdx }) {
    if (!images || images.length <= 1) return null;
    return (
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
        {images.map(function(src, i) {
          return <img key={i} src={src} onClick={function() { setIdx(i); }} style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 4, border: i === idx ? "2px solid " + GOLD : "1px solid " + COLORS.border, cursor: "pointer", opacity: i === idx ? 1 : 0.6 }} />;
        })}
      </div>
    );
  }

  function PropStats({ beds, baths, sqft }) {
    return (
      <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#ccc", marginBottom: 10 }}>
        <span style={{ color: GOLD }}>&#x1F6CF;</span><span>{beds} Beds</span>
        <span style={{ borderLeft: "1px solid " + COLORS.border, paddingLeft: 20 }}><span style={{ color: GOLD }}>&#x1F6C1;</span> {baths} Bath</span>
        <span style={{ borderLeft: "1px solid " + COLORS.border, paddingLeft: 20 }}><span style={{ color: GOLD }}>&#x1F4D0;</span> {num(sqft).toLocaleString()} Sq Ft</span>
      </div>
    );
  }

  var bdr = "1px solid " + COLORS.border;
  var sectStyle = { padding: "48px 0 40px", borderTop: bdr };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh", fontFamily: "'Georgia', serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: COLORS.card, borderBottom: bdr, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 18 }}>{"<-"}</button>
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>District Estate LLC</span>
        </div>
        {user && user.name && <span style={{ color: COLORS.muted, fontSize: 12 }}>{user.name}</span>}
      </div>

      <div style={{ display: "flex", maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          <section ref={function(el) { refs.current[0] = el; }} style={{ padding: "48px 0 40px" }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>Subject</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>Under-market investment property analyzed.</p>
            <HeroImg images={d.subjectImages} idx={hIdx} setIdx={setHIdx} />
            <PropStats beds={d.subject.beds} baths={d.subject.baths} sqft={d.subject.sqft} />
            <Thumbs images={d.subjectImages} idx={hIdx} setIdx={setHIdx} />
            <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{d.subject.address}</div>
          </section>

          <section ref={function(el) { refs.current[1] = el; }} style={sectStyle}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>Strongest Comp</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>Most comparable fully renovated property sold nearby.</p>
            <HeroImg images={d.compImages} idx={cIdx} setIdx={setCIdx} />
            <PropStats beds={d.comp.beds} baths={d.comp.baths} sqft={d.comp.sqft} />
            <Thumbs images={d.compImages} idx={cIdx} setIdx={setCIdx} />
            <p style={{ fontSize: 14 }}>
              <span style={{ color: GOLD }}>Sold: {money(d.comp.soldPrice)}</span>
              <span style={{ color: COLORS.muted }}> &mdash; Sold Date: </span>
              <span style={{ color: GOLD }}>{d.comp.soldDate}</span>
            </p>
          </section>

          <section ref={function(el) { refs.current[2] = el; }} style={sectStyle}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>Repairs</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>Detailed scope of work required to reach market value.</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ minWidth: 220 }}>
                {d.repairs.map(function(r, i) {
                  var isSel = i === selR;
                  return (
                    <button key={i} onClick={function() { setSelR(i); }} style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 14px", background: "transparent", border: isSel ? "1px solid " + GOLD : "1px solid transparent", borderBottom: bdr, color: isSel ? GOLD : "#ccc", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                      <span>{r.name}</span>
                      <span>{money(r.cost)}{isSel ? " >" : ""}</span>
                    </button>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderTop: "2px solid " + GOLD, fontWeight: 700, color: GOLD }}>
                  <span>Total</span><span>{money(totalR)}</span>
                </div>
              </div>
              {selR !== null && d.repairs[selR] && (
                <div style={{ flex: 1, minWidth: 240, background: "#faf8f0", color: "#1a1a1a", borderRadius: 8, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{d.repairs[selR].name}</h3>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{money(d.repairs[selR].cost)}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-line", color: "#333", margin: 0 }}>{d.repairs[selR].details}</p>
                </div>
              )}
            </div>
          </section>

          <section ref={function(el) { refs.current[3] = el; }} style={sectStyle}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>Appraisal Rules</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>Public valuation standards from recognized authority.</p>
            <div style={{ background: "#faf8f0", color: "#1a1a1a", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #e0d9c8", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#b8860b", fontWeight: 600, fontSize: 14 }}>Official Appraisal Rules</span>
                <span style={{ color: "#888", fontSize: 12 }}>Published: 2021</span>
              </div>
              <div style={{ display: "flex", borderBottom: "1px solid #e0d9c8" }}>
                {["Requirements", "Methods", "FAQs"].map(function(t) {
                  return <button key={t} onClick={function() { setATab(t); }} style={{ padding: "8px 16px", background: aTab === t ? "#1a1a1a" : "transparent", color: aTab === t ? "#fff" : "#666", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{t}</button>;
                })}
              </div>
              <div style={{ padding: "18px 22px", fontSize: 13, lineHeight: 1.8 }}>
                {aTab === "Requirements" && (
                  <div>
                    <p style={{ fontWeight: 700, margin: "0 0 6px" }}>1. Comparable Sale Selection:</p>
                    <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
                      <li>Adjustments should be based on recent sales of similar properties within the same neighborhood.</li>
                      <li>Comparable properties should be similar in size, age, condition, and amenities.</li>
                    </ul>
                    <p style={{ fontWeight: 700, margin: "0 0 6px" }}>2. Standardized Adjustments:</p>
                    <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
                      <li>$20 to $30 per square foot for differences in size.</li>
                      <li>$25,000 for an additional bedroom.</li>
                      <li>$15,000 for the presence of a garage.</li>
                      <li>Adjust for major condition variances based on renovation level.</li>
                    </ul>
                  </div>
                )}
                {aTab === "Methods" && <p>The Sales Comparison Approach selects recent comparable sales and makes dollar adjustments for differences in size, condition, amenities, and location.</p>}
                {aTab === "FAQs" && <p><strong>Q: How many comps?</strong><br />A: At least 3, within 0.5-1 mile, sold within 6 months.</p>}
              </div>
              <div style={{ padding: "8px 22px 12px", borderTop: "1px solid #e0d9c8", fontSize: 11, color: "#b8860b" }}>Source: U.S. Real Estate Appraisal Authority</div>
            </div>
          </section>

          <section ref={function(el) { refs.current[4] = el; }} style={sectStyle}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>Subject vs Comp</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>Direct comparison of subject property and renovated comp.</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: bdr }}>
                  {["Feature", "Subject", "Comp", "Adjustment"].map(function(h) {
                    return <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: COLORS.muted, fontSize: 11, letterSpacing: 1, fontWeight: 600 }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Beds", s: d.subject.beds, c: d.comp.beds, a: "" },
                  { f: "Baths", s: d.subject.baths, c: d.comp.baths, a: "" },
                  { f: "Sq Ft", s: num(d.subject.sqft).toLocaleString(), c: num(d.comp.sqft).toLocaleString(), a: money(d.adjustments.size) },
                  { f: "Condition", s: "Needs Reno", c: "Fully Renovated", a: money(d.adjustments.condition) },
                  { f: "Amenities", s: "-", c: "-", a: money(d.adjustments.amenities) }
                ].map(function(r, i) {
                  return (
                    <tr key={i} style={{ borderBottom: bdr }}>
                      <td style={{ padding: "10px 12px", color: "#ccc" }}>{r.f}</td>
                      <td style={{ padding: "10px 12px", color: "#ccc" }}>{r.s}</td>
                      <td style={{ padding: "10px 12px", color: "#ccc" }}>{r.c}</td>
                      <td style={{ padding: "10px 12px", color: r.a ? GOLD : "#555" }}>{r.a || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 12px", borderTop: "2px solid " + GOLD, marginTop: 8 }}>
              <span style={{ color: GOLD, fontWeight: 600 }}>Adjusted Comp Value</span>
              <span style={{ color: GOLD, fontWeight: 700, fontSize: 18 }}>{money(adjCV)}</span>
            </div>
          </section>

          <section ref={function(el) { refs.current[5] = el; }} style={sectStyle}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>ARV</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>After Repair Value based on adjusted comparable sale.</p>
            <div style={{ background: COLORS.card, border: bdr, borderRadius: 8, padding: 28, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, flexWrap: "wrap", fontSize: 16, color: "#ccc", marginBottom: 22 }}>
                <span>{money(d.comp.soldPrice)}</span>
                <span style={{ color: "#555" }}>+</span>
                <div><div>{money(d.adjustments.size)}</div><div style={{ color: GOLD, fontSize: 10 }}>Size</div></div>
                <span style={{ color: "#555" }}>+</span>
                <div><div>{money(d.adjustments.condition)}</div><div style={{ color: GOLD, fontSize: 10 }}>Condition</div></div>
                <span style={{ color: "#555" }}>+</span>
                <div><div>{money(d.adjustments.amenities)}</div><div style={{ color: GOLD, fontSize: 10 }}>Amenities</div></div>
                <span style={{ color: "#555" }}>=</span>
                <span style={{ fontWeight: 700 }}>ARV</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ background: "#1e1e1e", border: bdr, borderRadius: 8, padding: "12px 24px" }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Adjusted Comparable Value</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white }}>{money(adjCV)}</div>
                </div>
                <div style={{ background: GOLD, color: "#000", borderRadius: 8, padding: "12px 24px", fontWeight: 700 }}>
                  <div style={{ fontSize: 11, marginBottom: 4 }}>ARV</div>
                  <div style={{ fontSize: 22 }}>{money(arv)}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <StatCard label="MAO (70%)" value={money(Math.round(mao))} />
              <StatCard label="Profit Spread" value={money(profit)} />
              <StatCard label="Est. ROI" value={roi + "%"} />
            </div>
          </section>

          <section ref={function(el) { refs.current[6] = el; }} style={{ padding: "48px 0 80px", borderTop: bdr }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: COLORS.white }}>Asking Price</h1>
            <p style={{ color: COLORS.muted, fontSize: 15, margin: "6px 0 20px" }}>Investment opportunity priced below adjusted value.</p>
            <div style={{ background: COLORS.card, border: bdr, borderRadius: 8, padding: "40px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: GOLD, marginBottom: 24 }}>{money(d.askingPrice)}</div>
              <Btn size="lg" onClick={function() { setShowOffer(true); }} style={{ boxShadow: "0 4px 20px rgba(245,197,66,0.3)" }}>Make Offer</Btn>
            </div>
          </section>
        </div>

        <div className="de-sn" style={{ width: 160, flexShrink: 0, paddingTop: 56, paddingLeft: 24 }}>
          <div style={{ position: "sticky", top: 70 }}>
            {SECTS.map(function(s, i) {
              var isActive = i === active;
              return (
                <button key={s} onClick={function() { scrollTo(i); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: isActive ? GOLD : COLORS.muted, cursor: "pointer", padding: "5px 0", fontSize: 11, letterSpacing: 1.5, fontWeight: isActive ? 700 : 400, fontFamily: "inherit", textAlign: "left", width: "100%" }}>
                  {isActive && <span style={{ width: 3, height: 14, background: GOLD, borderRadius: 2, flexShrink: 0 }} />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Modal open={showOffer} onClose={function() { setShowOffer(false); }} title="Submit Offer">
        <FormInput label="Offer Price" value={oPrice} onChange={setOPrice} type="number" prefix="$" />
        <FormInput label="Closing Timeline" value={oTime} onChange={setOTime} />
        <FormInput label="Notes" value={oNotes} onChange={setONotes} textarea />
        <Btn onClick={function() { onSubmitOffer(d.id, { investorId: user.id, price: Number(oPrice), timeline: oTime, notes: oNotes, status: "pending" }); setShowOffer(false); setOPrice(""); setONotes(""); }} style={{ width: "100%", justifyContent: "center", marginTop: 12 }} size="lg">Submit Offer</Btn>
      </Modal>

      <style>{".de-sn{display:none}@media(min-width:768px){.de-sn{display:block!important}}"}</style>
    </div>
  );
}

/* INVESTOR DASHBOARD */
function InvestorDash({ deals, user, onViewDeal, onLogout, onChangePw }) {
  const [showPw, setShowPw] = useState(false);
  var visible = deals.filter(function(d) { return d.status === "active"; });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ background: COLORS.card, borderBottom: "1px solid " + COLORS.border, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ color: GOLD, fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>DISTRICT ESTATE LLC</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge>{user.tier}</Badge>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>{user.name}</span>
          <Btn variant="dark" size="sm" onClick={function() { setShowPw(true); }}>&#x1F511;</Btn>
          <Btn variant="dark" size="sm" onClick={onLogout}>Logout</Btn>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
        <h2 style={{ color: COLORS.white, margin: "0 0 6px", fontSize: 24 }}>Available Deals</h2>
        <p style={{ color: COLORS.muted, fontSize: 14, margin: "0 0 24px" }}>Browse investment opportunities below.</p>

        {visible.map(function(d) {
          var tr = d.repairs.reduce(function(s, r) { return s + num(r.cost); }, 0);
          var arv = num(d.comp.soldPrice) + num(d.adjustments.size) + num(d.adjustments.condition) + num(d.adjustments.amenities);
          var profit = arv - num(d.askingPrice) - tr;
          var roiV = num(d.askingPrice) > 0 ? ((profit / num(d.askingPrice)) * 100).toFixed(0) : 0;
          return (
            <div key={d.id} onClick={function() { onViewDeal(d); }} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 20, marginBottom: 14, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 16 }}>{d.subject.address}</div>
                  <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{d.subject.beds}bd / {d.subject.baths}ba | {num(d.subject.sqft).toLocaleString()} sqft</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: GOLD, fontSize: 22, fontWeight: 700 }}>{money(d.askingPrice)}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>ARV: {money(arv)}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Badge color={COLORS.success}>ROI: {roiV}%</Badge>
                <Badge>Profit: {money(profit)}</Badge>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", padding: 60 }}>No deals available right now.</div>}
      </div>

      <ChangePwModal open={showPw} onClose={function() { setShowPw(false); }} onChangePw={onChangePw} />
    </div>
  );
}

/* MAIN APP */
export default function App() {
  const [user, setUser] = useState(null);
  const [deals, setDeals] = useState(DEMO_DEALS);
  const [investors, setInvestors] = useState(DEMO_INV);
  const [subadmins] = useState(DEMO_SUBS);
  const [viewDeal, setViewDeal] = useState(null);
  const [adminPw, setAdminPw] = useState("admin123");

  function handleReg(inv) { setInvestors(function(prev) { return [...prev, inv]; }); }

  function handleOffer(dealId, offer) {
    setDeals(function(prev) { return prev.map(function(d) { return d.id === dealId ? { ...d, offers: [...d.offers, offer] } : d; }); });
  }

  function handleChangePw(cur, np) {
    if (!user) return false;
    if (user.role === "admin") {
      if (cur !== adminPw) return false;
      setAdminPw(np); setUser(function(p) { return { ...p, password: np }; }); return true;
    }
    if (user.role === "investor") {
      var inv = investors.find(function(i) { return i.id === user.id; });
      if (!inv || cur !== inv.password) return false;
      setInvestors(function(p) { return p.map(function(i) { return i.id === user.id ? { ...i, password: np } : i; }); });
      setUser(function(p) { return { ...p, password: np }; }); return true;
    }
    return false;
  }

  function logout() { setUser(null); setViewDeal(null); }

  if (!user) return <LoginPage onLogin={setUser} investors={investors} subadmins={subadmins} onRegister={handleReg} />;
  if (viewDeal) return <DealView deal={viewDeal} onBack={function() { setViewDeal(null); }} user={user} onSubmitOffer={handleOffer} />;
  if (user.role === "admin" || user.role === "subadmin") return <AdminDash deals={deals} setDeals={setDeals} investors={investors} setInvestors={setInvestors} onViewDeal={setViewDeal} onLogout={logout} user={user} onChangePw={handleChangePw} />;
  return <InvestorDash deals={deals} user={user} onViewDeal={setViewDeal} onLogout={logout} onChangePw={handleChangePw} />;
}
