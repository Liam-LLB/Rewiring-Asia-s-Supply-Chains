import React from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";

/*
  Full multi-page replica (single-file preview)
  - React + Tailwind (canvas loads Tailwind automatically)
  - React Router for navigation
  - Gamma-like dark UI
  - All pages defined below in one file so you can preview here
*/

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b0f19] text-white antialiased">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/context" element={<Context />} />
            <Route path="/china" element={<China />} />
            <Route path="/resilience" element={<Resilience />} />
            <Route path="/china-plus-one" element={<ChinaPlusOne />} />
            <Route path="/sovereignty" element={<Sovereignty />} />
            <Route path="/chokepoints" element={<Chokepoints />} />
            <Route path="/critical-perspectives" element={<Critical />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/conclusion" element={<Conclusion />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

/* ---------------- NAV + LAYOUT ---------------- */
function Navbar() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/context", label: "Context" },
    { to: "/china", label: "China" },
    { to: "/resilience", label: "Resilience" },
    { to: "/china-plus-one", label: "China+1" },
    { to: "/sovereignty", label: "Sovereignty" },
    { to: "/chokepoints", label: "Chokepoints" },
    { to: "/critical-perspectives", label: "Critical" },
    { to: "/case-studies", label: "Case Studies" },
    { to: "/conclusion", label: "Conclusion" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <NavLink to="/" className="font-semibold tracking-tight">Rewiring Asia</NavLink>
        <nav className="hidden lg:flex gap-2 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl transition ${
                  isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}

function Container({ children }) {
  return <div className="max-w-6xl mx-auto px-5">{children}</div>;
}
function Section({ children }) {
  return (
    <section className="border-t border-white/10 py-14">
      <Container>{children}</Container>
    </section>
  );
}
function H1({ children }) { return <h1 className="text-4xl md:text-6xl font-bold leading-tight">{children}</h1>; }
function H2({ children }) { return <h2 className="text-2xl md:text-3xl font-semibold">{children}</h2>; }
function Eyebrow({ children }) { return <p className="uppercase tracking-wide text-xs text-white/60 mb-2">{children}</p>; }
function P({ children }) { return <p className="text-white/80 max-w-3xl">{children}</p>; }
function Card({ children, className = "" }) { return <div className={`rounded-2xl bg-white/5 border border-white/10 p-5 ${className}`}>{children}</div>; }
function Stat({ v, l }) { return (
  <div className="rounded-2xl bg-white/5 p-5 text-center">
    <div className="text-3xl font-bold">{v}</div>
    <div className="text-xs text-white/70">{l}</div>
  </div>
); }
function PrimaryBtn({ to, children }) {
  return (
    <NavLink to={to} className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20">
      {children}
    </NavLink>
  );
}
function GhostBtn({ to, children }) {
  return (
    <NavLink to={to} className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5">
      {children}
    </NavLink>
  );
}

/* ---------------- HOME ---------------- */
function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Container>
          <div className="py-16 md:py-20">
            <H1>Rewiring Asia's Supply Chains<br/>Under US–China Rivalry</H1>
            <P className="mt-4" />
            <p className="mt-4 text-lg text-white/80 max-w-2xl">From “Just‑in‑Time” to “China+1” and the New Geography of Corporate Sovereignty.</p>
            <div className="mt-8 flex gap-3">
              <PrimaryBtn to="/context">Explore the Context</PrimaryBtn>
              <GhostBtn to="/conclusion">View Analysis</GhostBtn>
            </div>
          </div>
        </Container>
        {/* Soft background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-36 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>
      <Section>
        <Eyebrow>Quick Access</Eyebrow>
        <div className="grid md:grid-cols-3 gap-4">
          <Card><H2>Context</H2><P>Geopolitical shift, Thucydides' Trap, end of pure JIT globalization.</P><div className="mt-4"><PrimaryBtn to="/context">Open</PrimaryBtn></div></Card>
          <Card><H2>China Hub</H2><P>Central node: 33% output, 94% Fortune 1000 reach, 15% exports.</P><div className="mt-4"><PrimaryBtn to="/china">Open</PrimaryBtn></div></Card>
          <Card><H2>Case Studies</H2><P>Semiconductors, EV batteries, Pharma, Rare Earths.</P><div className="mt-4"><PrimaryBtn to="/case-studies">Open</PrimaryBtn></div></Card>
        </div>
      </Section>
    </>
  );
}

/* ---------------- CONTEXT ---------------- */
function Context() {
  const nav = useNavigate();
  return (
    <Section>
      <Eyebrow>Context and Theoretical Framework</Eyebrow>
      <H2>Understanding the Geopolitical Shift</H2>
      <P>
        The intensifying US–China rivalry is reshaping globalization, injecting geopolitics into supply‑chain decisions once driven purely by efficiency. Policymakers increasingly frame this relationship through the Thucydides' Trap.
      </P>
      <P>
        Global logistics networks — once optimized for cost and speed — are now viewed through a national security prism. Supply routes, ports, and chokepoints are strategic assets or vulnerabilities.
      </P>
      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <Card><p className="font-medium">Strategic Competition</p><p className="text-white/70 text-sm">Geopolitics in every supply‑chain decision</p></Card>
        <Card><p className="font-medium">Fragmentation</p><p className="text-white/70 text-sm">Decoupling & regionalization</p></Card>
        <Card><p className="font-medium">Securitization</p><p className="text-white/70 text-sm">Logistics as national security</p></Card>
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/china">Next: China</PrimaryBtn>
        <button onClick={()=>nav(-1)} className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5">Back</button>
      </div>
    </Section>
  );
}

/* ---------------- CHINA ---------------- */
function China() {
  return (
    <Section>
      <H2>China: The Central Node of Global Manufacturing</H2>
      <P>China ~33% of global manufacturing, ~15% of world exports; ~94% of Fortune 1000 have Tier‑1/2 suppliers in China.</P>
      <div className="grid md:grid-cols-2 gap-8 items-start mt-6">
        <Card className="aspect-video flex items-center justify-center">
          <SVGChina />
        </Card>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat v="33%" l="Manufacturing Output" />
          <Stat v="94%" l="Fortune 1000 Reach" />
          <Stat v="15%" l="World Exports" />
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/resilience">Next: Resilience</PrimaryBtn>
        <GhostBtn to="/">Home</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- RESILIENCE ---------------- */
function Resilience() {
  const items = [
    { period: "2018–2019", text: "Trade War Era: tariffs expose vulnerability" },
    { period: "2020–2021", text: "COVID‑19: collapse of global chains" },
    { period: "2022", text: "Ukraine: energy/commodities disrupt" },
    { period: "2023–2024", text: "Friend‑shoring & regional hubs" },
  ];
  return (
    <Section>
      <H2>The Resilience Imperative: JIT → JIC</H2>
      <P>Crises exposed fragility of hyper‑efficient networks; new mantra: build slack, redundancy, buffers.</P>
      <Card className="mt-6">
        <svg viewBox="0 0 860 150" className="w-full h-32">
          <line x1="40" y1="80" x2="820" y2="80" stroke="#64748b" strokeWidth="2" />
          {items.map((it,i)=> (
            <g key={i} transform={`translate(${120 + i*200},0)`}>
              <circle cx="0" cy="80" r="10" fill="#e5e7eb" />
              <text x="0" y="60" textAnchor="middle" fontSize="12" fill="white">{it.period}</text>
              <text x="0" y="110" textAnchor="middle" fontSize="12" fill="#d1d5db">{it.text}</text>
            </g>
          ))}
        </svg>
      </Card>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/china-plus-one">Next: China+1</PrimaryBtn>
        <GhostBtn to="/china">Back: China</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- CHINA+1 ---------------- */
function ChinaPlusOne() {
  return (
    <Section>
      <H2>Geopolitical Reconfiguration in Asia — “China+1”</H2>
      <P>Maintain China, add at least one alternate Asian location; SEA benefits (Vietnam, Thailand, Indonesia).</P>
      <div className="grid sm:grid-cols-3 gap-3 mt-6 text-sm">
        <Card><p className="font-semibold">Vietnam</p><p className="text-white/70">Electronics & textiles; strong FDI</p></Card>
        <Card><p className="font-semibold">Thailand</p><p className="text-white/70">Automotive & EV batteries</p></Card>
        <Card><p className="font-semibold">Indonesia</p><p className="text-white/70">Critical minerals & consumer</p></Card>
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/sovereignty">Next: Sovereignty</PrimaryBtn>
        <GhostBtn to="/resilience">Back: Resilience</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- SOVEREIGNTY ---------------- */
function Sovereignty() {
  return (
    <Section>
      <H2>Corporate Sovereignty vs State Sovereignty</H2>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card><p className="font-semibold">Corporate Logic</p><p className="text-white/80 text-sm mt-1">Efficiency, profit, market access</p></Card>
        <Card><p className="font-semibold">Geopolitical Mandates</p><p className="text-white/80 text-sm mt-1">National security, autonomy, alliances</p></Card>
        <Card><p className="font-semibold">New Equilibrium</p><p className="text-white/80 text-sm mt-1">Flex within strategic guardrails</p></Card>
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/chokepoints">Next: Chokepoints</PrimaryBtn>
        <GhostBtn to="/china-plus-one">Back: China+1</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- CHOKEPOINTS ---------------- */
function Chokepoints() {
  return (
    <Section>
      <H2>Strategic Chokepoints</H2>
      <P>~80% of China’s oil via Malacca; ~25% global trade; ~15M barrels/day — second to Hormuz.</P>
      <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat v="80%" l="Malacca dependency" />
          <Stat v="25%" l="Global trade" />
          <Stat v="15M" l="Barrels/day" />
        </div>
        <Card className="flex items-center justify-center">
          <svg viewBox="0 0 220 140" className="w-full h-32">
            <path d="M40 90 A60 60 0 1 1 160 90" stroke="#374151" strokeWidth="10" fill="none" />
            <path d="M40 90 A60 60 0 0 1 136 40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
            <text x="110" y="120" textAnchor="middle" fontSize="14" fill="#fff">~80%</text>
          </svg>
        </Card>
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/critical-perspectives">Next: Critical</PrimaryBtn>
        <GhostBtn to="/sovereignty">Back: Sovereignty</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- CRITICAL PERSPECTIVES ---------------- */
function Critical() {
  return (
    <Section>
      <H2>Critical Geopolitics: Narratives & Soft Power</H2>
      <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
        <Card><p className="font-semibold">Securitizing Supply Chains</p><p className="text-white/80 mt-1">Leaders frame dependence as existential; subsidies & blocs.</p></Card>
        <Card><p className="font-semibold">Geo‑economic Narratives</p><p className="text-white/80 mt-1">Friend‑shoring among allies; risk of rival blocs.</p></Card>
        <Card><p className="font-semibold">Questioning Power</p><p className="text-white/80 mt-1">Whose interests do these narratives serve?</p></Card>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm">
        <Card>
          <p className="font-semibold">The Thucydides’ Trap in Economic Logistics</p>
          <p className="text-white/80 mt-2">Security dilemma → logistics divide: parallel systems aligned to rival spheres (Chip 4, Made in China 2025, stockpiles).</p>
        </Card>
        <Card>
          <p className="font-semibold">Spheres Snapshot</p>
          <ul className="list-disc list-inside text-white/80 mt-2">
            <li>US/Allied: integrated corridors, trusted standards, diversified partners</li>
            <li>China/Aligned: integrated corridors, regional ties, alternative standards</li>
          </ul>
        </Card>
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/case-studies">Next: Case Studies</PrimaryBtn>
        <GhostBtn to="/chokepoints">Back: Chokepoints</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- CASE STUDIES ---------------- */
function CaseStudies() {
  const cases = [
    { t: "Semiconductors: The New Oil", d: "Taiwan (TSMC) ~60% semis, ~90% advanced chips; export bans & CHIPS Act." },
    { t: "EV Batteries: Critical Minerals Control", d: "China leads refining & cell manufacturing; allies push mining, recycling, alt chemistries." },
    { t: "Pharmaceuticals: Health Security", d: "Large share of APIs from China; pandemic spurred regionalization." },
    { t: "Rare Earths: Weaponized Resources", d: "Export curbs drove alternate sources (Australia, Mountain Pass) & recycling." },
  ];
  return (
    <Section>
      <H2>Case Studies of Strategic Industries</H2>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {cases.map((c) => (
          <Card key={c.t}>
            <p className="font-semibold text-lg">{c.t}</p>
            <p className="text-white/80 text-sm mt-2">{c.d}</p>
            <svg viewBox="0 0 200 70" className="w-full h-16 mt-3">
              <polyline points="0,60 200,60" stroke="#374151" strokeWidth="2" fill="none" />
              <polyline points="0,50 40,30 80,45 120,25 160,35 200,20" stroke="#e5e7eb" strokeWidth="3" fill="none" />
            </svg>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <PrimaryBtn to="/conclusion">Next: Conclusion</PrimaryBtn>
        <GhostBtn to="/critical-perspectives">Back: Critical</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- CONCLUSION ---------------- */
function Conclusion() {
  const keys = [
    ["01", "From Integration to Fragmentation", "Deliberate decoupling & parallel systems"],
    ["02", "From Efficiency to Resilience", "JIC buffers, redundancy, stockpiles"],
    ["03", "From Globalization to Regionalization", "Regional blocs & hubs"],
    ["04", "From Market to Security Logic", "State mandates constrain firms"],
  ];
  return (
    <Section>
      <H2>Conclusion: Toward a Geopoliticized Supply Chain Order</H2>
      <P>Efficiency now coexists with geopolitical risk at every decision point. The 2020s playbook plans for worst‑case scenarios, not just optimization.</P>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {keys.map(([n,t,d]) => (
          <Card key={n}><p className="text-xs text-white/60">{n}</p><p className="font-medium">{t}</p><p className="text-white/70 text-sm">{d}</p></Card>
        ))}
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Card><p className="font-semibold">Asia’s Evolving Role</p><p className="text-white/80 mt-1">Manufacturing remains centered in Asia, but capacity rewires into a multipolar map (China, SEA, South Asia).</p></Card>
        <Card><p className="font-semibold">Corporate Sovereignty Redefined</p><p className="text-white/80 mt-1">High‑stakes sectors operate under state mandates; resilience becomes core.</p></Card>
        <Card><p className="font-semibold">Strategic Imperatives</p><ul className="list-disc list-inside text-white/80 mt-1 text-sm"><li>Build geopolitical risk capabilities</li><li>Redundant multi‑regional suppliers</li><li>Relationships across regions</li><li>Prepare for decoupling/disruption</li></ul></Card>
      </div>
      <div className="mt-8 flex gap-3">
        <GhostBtn to="/case-studies">Back: Case Studies</GhostBtn>
        <GhostBtn to="/">Home</GhostBtn>
      </div>
    </Section>
  );
}

/* ---------------- VISUALS ---------------- */
function SVGChina(){
  return (
    <svg viewBox="0 0 600 340" className="w-full h-full">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="600" height="340" fill="url(#g)" />
      {Array.from({length:160}).map((_,i)=> (
        <circle key={i} cx={(i*37)%600} cy={(i*53)%340} r={(i%5===0)?2.2:1.2} fill="#a3a3a3" opacity="0.45" />
      ))}
      <circle cx="430" cy="135" r="9" fill="#e5e7eb" />
      <text x="445" y="130" fill="#fff" fontSize="12">China</text>
    </svg>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-white/10">
      <Container>
        <div className="py-8 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2025 Rewiring Asia (educational replica)</p>
          <div className="flex gap-4">
            <NavLink to="/" className="hover:text-white">Home</NavLink>
            <NavLink to="/conclusion" className="hover:text-white">Conclusion</NavLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}
