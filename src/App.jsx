import React, { Suspense, useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import RealGlobe from "./components/RealGlobe";
import RealSEAMap from "./components/RealSEAMap";
import Timeline3DNew from "./components/Timeline3DNew";
import SupplyChain3D from "./components/SupplyChain3D";

// ============================================================
// THEME SYSTEM - Colors change based on current page
// ============================================================
const ThemeContext = createContext();

const themes = {
  home: {
    primary: "#0ea5e9",
    secondary: "#6366f1",
    accent: "#f59e0b",
    bg: "from-slate-950 via-slate-900 to-slate-950",
    name: "Sky & Indigo"
  },
  about: {
    primary: "#8b5cf6",
    secondary: "#ec4899",
    accent: "#10b981",
    bg: "from-violet-950 via-slate-900 to-slate-950",
    name: "Violet & Pink"
  },
  timeline: {
    primary: "#f59e0b",
    secondary: "#ef4444",
    accent: "#10b981",
    bg: "from-amber-950 via-slate-900 to-slate-950",
    name: "Amber & Red"
  },
  regional: {
    primary: "#10b981",
    secondary: "#06b6d4",
    accent: "#f59e0b",
    bg: "from-emerald-950 via-slate-900 to-slate-950",
    name: "Emerald & Cyan"
  },
  global: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#ef4444",
    bg: "from-blue-950 via-slate-900 to-slate-950",
    name: "Blue & Violet"
  },
  analysis: {
    primary: "#ec4899",
    secondary: "#f59e0b",
    accent: "#10b981",
    bg: "from-pink-950 via-slate-900 to-slate-950",
    name: "Pink & Amber"
  },
};

function ThemeProvider({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState(themes.home);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    const themeMap = {
      '': 'home', 'about': 'about', 'timeline': 'timeline',
      'regional': 'regional', 'global': 'global', 'analysis': 'analysis',
    };

    setIsTransitioning(true);
    setTimeout(() => {
      setTheme(themes[themeMap[path] || 'home']);
      setIsTransitioning(false);
    }, 150);
  }, [location]);

  return (
    <ThemeContext.Provider value={{ ...theme, isTransitioning }}>
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-700`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  return (
    <BrowserRouter basename="/Rewiring-Asia-s-Supply-Chains">
      <ThemeProvider>
        <div className="min-h-screen text-white antialiased">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/regional" element={<Regional />} />
            <Route path="/global" element={<Global />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// ============================================================
// NAVIGATION
// ============================================================
function Navbar() {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/timeline", label: "Timeline" },
    { to: "/regional", label: "Regional" },
    { to: "/global", label: "Global" },
    { to: "/analysis", label: "Analysis" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            >
              <span className="text-white font-bold text-sm">SN</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight">Strait Nexus</span>
              <span className="text-white/40 text-xs block -mt-1">JS-SEZ Explorer</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? 'text-white bg-white/10' : 'text-white/50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// ============================================================
// UI COMPONENTS
// ============================================================
function Container({ children, className = "" }) {
  return <div className={`max-w-7xl mx-auto px-6 lg:px-8 ${className}`}>{children}</div>;
}

function Section({ children, className = "", id }) {
  return <section id={id} className={`py-24 lg:py-32 ${className}`}><Container>{children}</Container></section>;
}

function SectionLabel({ children }) {
  const theme = useTheme();
  return (
    <span
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: theme.primary }}
    >
      {children}
    </span>
  );
}

function Heading({ children, size = "lg" }) {
  const sizes = {
    xl: "text-5xl md:text-6xl lg:text-7xl",
    lg: "text-4xl md:text-5xl",
    md: "text-3xl md:text-4xl",
    sm: "text-2xl md:text-3xl"
  };
  return <h2 className={`${sizes[size]} font-bold tracking-tight`}>{children}</h2>;
}

function GradientText({ children }) {
  const theme = useTheme();
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "", interactive = true }) {
  return (
    <div className={`
      rounded-2xl p-6 lg:p-8
      bg-white/[0.03] backdrop-blur-sm
      border border-white/[0.05]
      ${interactive ? 'hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

function Button({ to, children, variant = "primary", size = "md" }) {
  const theme = useTheme();
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3", lg: "px-8 py-4 text-lg" };

  if (variant === "primary") {
    return (
      <NavLink
        to={to}
        className={`${sizes[size]} rounded-xl font-medium transition-all duration-300 hover:scale-105 inline-flex items-center gap-2`}
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        {children}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      className={`${sizes[size]} rounded-xl font-medium border border-white/20 hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2`}
    >
      {children}
    </NavLink>
  );
}

function Loader() {
  const theme = useTheme();
  return (
    <div className="h-full flex items-center justify-center">
      <div
        className="w-10 h-10 rounded-full border-2 border-white/10 animate-spin"
        style={{ borderTopColor: theme.primary }}
      />
    </div>
  );
}

function StatNumber({ value, label }) {
  const theme = useTheme();
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold" style={{ color: theme.primary }}>{value}</div>
      <div className="text-white/40 text-sm mt-1">{label}</div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function Home() {
  const theme = useTheme();

  const locations = [
    { lat: 1.35, lng: 103.82, label: "Singapore", color: "#ef4444" },
    { lat: 1.49, lng: 103.74, label: "Johor Bahru", color: "#3b82f6" },
    { lat: 3.14, lng: 101.69, label: "Kuala Lumpur", color: "#f59e0b" },
    { lat: 13.76, lng: 100.50, label: "Bangkok", color: "#8b5cf6" },
    { lat: 21.03, lng: 105.85, label: "Hanoi", color: "#10b981" },
    { lat: -6.21, lng: 106.85, label: "Jakarta", color: "#ec4899" },
    { lat: 31.23, lng: 121.47, label: "Shanghai", color: "#06b6d4" },
  ];

  const connections = [
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: 1.49, lng: 103.74 }, color: "#fbbf24" },
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: 3.14, lng: 101.69 }, color: "#3b82f6" },
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: 31.23, lng: 121.47 }, color: "#ef4444" },
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: -6.21, lng: 106.85 }, color: "#10b981" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <SectionLabel>Johor-Singapore Special Economic Zone</SectionLabel>
                <Heading size="xl">
                  <GradientText>Strait Nexus</GradientText>
                </Heading>
                <p className="text-xl lg:text-2xl text-white/60 font-light">
                  Exploring Asia's most ambitious cross-border economic integration.
                </p>
              </div>

              <p className="text-white/50 max-w-lg leading-relaxed">
                Discover how the JS-SEZ is reshaping Southeast Asia's competitiveness
                in global value chains through interactive visualizations and in-depth analysis.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button to="/about">Start Exploring</Button>
                <Button to="/analysis" variant="outline">View Analysis</Button>
              </div>

              <div className="flex gap-12 pt-4">
                <StatNumber value="$26B" label="Investment" />
                <StatNumber value="20K+" label="Jobs" />
                <StatNumber value="11" label="Sectors" />
              </div>
            </div>

            <div className="h-[450px] lg:h-[550px]">
              <Suspense fallback={<Loader />}>
                <RealGlobe
                  locations={locations}
                  connections={connections}
                  height="100%"
                  showStars={true}
                />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Map Preview */}
      <Section>
        <div className="text-center mb-16">
          <SectionLabel>Interactive Experience</SectionLabel>
          <Heading size="md" className="mt-4">
            Explore the <GradientText>Economic Corridor</GradientText>
          </Heading>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            Navigate through Southeast Asia's interconnected economies with our 3D visualization.
          </p>
        </div>

        <div className="h-[500px] rounded-3xl overflow-hidden border border-white/5">
          <Suspense fallback={<Loader />}>
            <RealSEAMap height="500px" showRoutes={true} />
          </Suspense>
        </div>

        <p className="text-center text-white/30 text-sm mt-4">
          Click and drag to explore • Scroll to zoom • Hover over countries for details
        </p>
      </Section>

      {/* Features Grid */}
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🛃", title: "Streamlined Customs", desc: "QR passport-free clearance" },
            { icon: "🚄", title: "RTS Link 2027", desc: "5-minute cross-border transit" },
            { icon: "💼", title: "Investment Hub", desc: "One-stop facilitation center" },
            { icon: "🌐", title: "11 Key Sectors", desc: "From tech to tourism" },
          ].map((f, i) => (
            <Card key={i}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Navigation Cards */}
      <Section className="pb-32">
        <div className="text-center mb-16">
          <SectionLabel>Explore More</SectionLabel>
          <Heading size="md" className="mt-4">Deep Dive into the <GradientText>Analysis</GradientText></Heading>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Historical Context", desc: "From 1965 separation to modern integration", to: "/timeline", color: "#f59e0b" },
            { title: "Regional Impact", desc: "ASEAN dynamics and competition", to: "/regional", color: "#10b981" },
            { title: "Global Position", desc: "US-China context and value chains", to: "/global", color: "#3b82f6" },
          ].map((card, i) => (
            <Card key={i} className="group">
              <div className="h-1 w-12 rounded-full mb-6" style={{ background: card.color }} />
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-white/50 mb-6">{card.desc}</p>
              <NavLink
                to={card.to}
                className="text-sm font-medium inline-flex items-center gap-2 transition-all group-hover:gap-3"
                style={{ color: card.color }}
              >
                Explore
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </NavLink>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function About() {
  const theme = useTheme();

  return (
    <>
      <Section className="pt-32">
        <div className="max-w-3xl">
          <SectionLabel>About the Project</SectionLabel>
          <Heading size="lg" className="mt-4">
            What is <GradientText>JS-SEZ</GradientText>?
          </Heading>
          <p className="text-white/60 text-xl mt-6 leading-relaxed">
            The Johor-Singapore Special Economic Zone represents the deepest economic
            integration between Singapore and Malaysia since their separation in 1965.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "Regional Significance",
              desc: "A major initiative transforming economic and political relations between two key Southeast Asian nations.",
              icon: "🌏"
            },
            {
              title: "Timely & Relevant",
              desc: "A current, real-world project being developed right now, making it practical and meaningful to study.",
              icon: "⏱️"
            },
            {
              title: "Geopolitical Insight",
              desc: "Explores how diplomacy, policy, and economics interact to shape regional cooperation.",
              icon: "🔗"
            },
          ].map((item, i) => (
            <Card key={i}>
              <div className="text-4xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Key Features</SectionLabel>
            <Heading size="sm" className="mt-4">The Four Pillars</Heading>

            <div className="mt-8 space-y-6">
              {[
                { title: "Streamlined Customs", desc: "QR passport-free clearance at all checkpoints", icon: "🛃" },
                { title: "Joint Infrastructure", desc: "RTS Link connecting both nations by 2027", icon: "🚄" },
                { title: "Investment Facilitation", desc: "One-stop center in Johor for investors", icon: "💰" },
                { title: "Talent Mobility", desc: "Simplified cross-border work permits", icon: "👥" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden border border-white/5">
            <Suspense fallback={<Loader />}>
              <SupplyChain3D variant="detailed" height="400px" />
            </Suspense>
          </div>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/" variant="outline">← Back to Home</Button>
          <Button to="/timeline">Next: Timeline →</Button>
        </div>
      </Section>
    </>
  );
}

// ============================================================
// TIMELINE PAGE
// ============================================================
function Timeline() {
  const theme = useTheme();
  const [activeEvent, setActiveEvent] = useState(null);

  const events = [
    { year: "1965", title: "Independence", description: "Singapore separates from Malaysia", color: "#ef4444" },
    { year: "1962", title: "Water Agreement", description: "Long-term water supply contract signed", color: "#3b82f6" },
    { year: "2006", title: "Iskandar Malaysia", description: "Economic corridor launched", color: "#8b5cf6" },
    { year: "2024", title: "JS-SEZ Signed", description: "Special Economic Zone agreement", color: "#10b981" },
    { year: "2027", title: "RTS Link", description: "Rapid Transit System opens", color: "#f59e0b" },
  ];

  return (
    <>
      <Section className="pt-32">
        <SectionLabel>Historical Context</SectionLabel>
        <Heading size="lg" className="mt-4">
          The <GradientText>Journey</GradientText> of Relations
        </Heading>
        <p className="text-white/60 text-xl mt-6 max-w-2xl">
          From colonial separation to modern integration—the evolution of Malaysia-Singapore relations.
        </p>
      </Section>

      <Section>
        <div className="h-[450px] rounded-3xl overflow-hidden border border-white/5 mb-8">
          <Suspense fallback={<Loader />}>
            <Timeline3DNew
              events={events}
              height="450px"
              activeEvent={activeEvent}
              onEventClick={setActiveEvent}
            />
          </Suspense>
        </div>
        <p className="text-center text-white/30 text-sm">Click on events to learn more</p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <Card interactive={false}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>The 1965 Separation</h3>
            <p className="text-white/60 leading-relaxed">
              The separation resulted from deep political and economic differences. While Singapore's leaders
              felt marginalized, Malaysians resented Singapore's thriving economy. Despite this, both nations
              maintained crucial bilateral arrangements.
            </p>
          </Card>
          <Card interactive={false}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.secondary }}>Water Agreements</h3>
            <p className="text-white/60 leading-relaxed">
              The 1962 agreement allows Singapore to draw up to 250 million gallons daily from the Johor River.
              This arrangement demonstrates that clear contracts and fair processes can sustain long-term partnerships.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/about" variant="outline">← About</Button>
          <Button to="/regional">Regional Impact →</Button>
        </div>
      </Section>
    </>
  );
}

// ============================================================
// REGIONAL PAGE
// ============================================================
function Regional() {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <>
      <Section className="pt-32">
        <SectionLabel>Regional Effects</SectionLabel>
        <Heading size="lg" className="mt-4">
          <GradientText>ASEAN</GradientText> Integration
        </Heading>
        <p className="text-white/60 text-xl mt-6 max-w-2xl">
          How the JS-SEZ influences regional dynamics and Southeast Asian competitiveness.
        </p>
      </Section>

      <Section>
        <div className="h-[500px] rounded-3xl overflow-hidden border border-white/5 mb-4">
          <Suspense fallback={<Loader />}>
            <RealSEAMap
              height="500px"
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              showRoutes={true}
            />
          </Suspense>
        </div>
        <p className="text-center text-white/30 text-sm">Hover over countries to see their role in regional trade</p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primary }}>Competition with Other SEZs</h3>
            <p className="text-white/60 mb-6">
              The JS-SEZ competes with other special zones in Southeast Asia for investment and talent.
            </p>
            <div className="space-y-3">
              {["Thailand EEC", "Vietnam SEZs", "Indonesia Special Zones"].map((zone, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: theme.secondary }} />
                  <span className="text-white/70">{zone}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.secondary }}>Partner Benefits</h3>
            <p className="text-white/60 mb-6">
              Cross-border integration improves productivity and innovation for both partners.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold" style={{ color: theme.primary }}>SG</div>
                <div className="text-white/40 text-xs">Finance & Tech</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold" style={{ color: theme.secondary }}>MY</div>
                <div className="text-white/40 text-xs">Land & Labor</div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/timeline" variant="outline">← Timeline</Button>
          <Button to="/global">Global Position →</Button>
        </div>
      </Section>
    </>
  );
}

// ============================================================
// GLOBAL PAGE
// ============================================================
function Global() {
  const theme = useTheme();

  const globalLocations = [
    { lat: 1.35, lng: 103.82, label: "Singapore", color: "#ef4444" },
    { lat: 39.90, lng: 116.41, label: "Beijing", color: "#f59e0b" },
    { lat: 38.91, lng: -77.04, label: "Washington DC", color: "#3b82f6" },
    { lat: 51.51, lng: -0.13, label: "London", color: "#8b5cf6" },
    { lat: 35.68, lng: 139.65, label: "Tokyo", color: "#10b981" },
  ];

  const globalConnections = [
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: 39.90, lng: 116.41 }, color: "#f59e0b" },
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: 38.91, lng: -77.04 }, color: "#3b82f6" },
    { from: { lat: 1.35, lng: 103.82 }, to: { lat: 35.68, lng: 139.65 }, color: "#10b981" },
  ];

  return (
    <>
      <Section className="pt-32">
        <SectionLabel>Global Effects</SectionLabel>
        <Heading size="lg" className="mt-4">
          <GradientText>Value Chain</GradientText> Positioning
        </Heading>
        <p className="text-white/60 text-xl mt-6 max-w-2xl">
          How the JS-SEZ positions itself in the US-China competition and global supply chain restructuring.
        </p>
      </Section>

      <Section>
        <div className="h-[500px] rounded-3xl overflow-hidden border border-white/5">
          <Suspense fallback={<Loader />}>
            <RealGlobe
              locations={globalLocations}
              connections={globalConnections}
              height="500px"
              autoRotate={true}
            />
          </Suspense>
        </div>
      </Section>

      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Friend-Shoring", desc: "Neutral positioning gains operational stability", color: theme.primary },
            { title: "Supply Resilience", desc: "Alternative path amid trade disputes", color: theme.secondary },
            { title: "Market Access", desc: "Numerous FTAs enable easy market reach", color: theme.accent },
          ].map((item, i) => (
            <Card key={i}>
              <div className="h-1 w-12 rounded-full mb-6" style={{ background: item.color }} />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionLabel>Strategic Industries</SectionLabel>
        <Heading size="sm" className="mt-4">Key Sectors</Heading>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {[
            { title: "Semiconductors", desc: "Critical technology with global supply chain implications" },
            { title: "EV Batteries", desc: "Green technology and critical minerals processing" },
            { title: "Digital Services", desc: "Data centers, AI, and digital infrastructure" },
            { title: "Pharmaceuticals", desc: "Healthcare manufacturing and API production" },
          ].map((item, i) => (
            <Card key={i}>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/regional" variant="outline">← Regional</Button>
          <Button to="/analysis">Final Analysis →</Button>
        </div>
      </Section>
    </>
  );
}

// ============================================================
// ANALYSIS PAGE
// ============================================================
function Analysis() {
  const theme = useTheme();

  return (
    <>
      <Section className="pt-32">
        <SectionLabel>Conclusion</SectionLabel>
        <Heading size="lg" className="mt-4">
          <GradientText>Strategic</GradientText> Imperatives
        </Heading>
        <p className="text-white/60 text-xl mt-6 max-w-2xl">
          The JS-SEZ offers a major opportunity for Malaysia-Singapore to deepen cooperation
          and strengthen ASEAN integration.
        </p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Diversification", desc: "Combining strengths for high-value growth" },
            { num: "02", title: "Inclusion", desc: "Ensuring benefits reach all communities" },
            { num: "03", title: "Stability", desc: "Binding agreements mitigate risks" },
            { num: "04", title: "Model", desc: "Scalable example for ASEAN" },
          ].map((item, i) => (
            <Card key={i}>
              <div className="text-4xl font-bold mb-4" style={{ color: theme.primary }}>{item.num}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="text-center py-16" interactive={false}>
          <Heading size="sm">Key Takeaway</Heading>
          <p className="text-white/60 text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
            The JS-SEZ has the potential to redefine Malaysia-Singapore's relationship and serve as
            a scalable model for ASEAN, exemplifying realistic and geopolitically astute cooperation
            in an increasingly complex global environment.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button to="/">Explore Again</Button>
            <Button to="/about" variant="outline">Start Over</Button>
          </div>
        </Card>
      </Section>

      <Section className="pb-32">
        <div className="text-center">
          <SectionLabel>Research Team</SectionLabel>
          <p className="text-white/50 mt-4">
            Samarah Piyush, Saanvi Bagaria, Naisha, Kashvi Tanwar,<br />
            Liam Leclaircie-Bardon & Basile Echene
          </p>
        </div>
      </Section>
    </>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const theme = useTheme();

  return (
    <footer className="border-t border-white/5 py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            >
              <span className="text-white font-bold text-xs">SN</span>
            </div>
            <span className="text-white/40 text-sm">Strait Nexus © 2025</span>
          </div>

          <nav className="flex gap-6 text-sm text-white/40">
            <NavLink to="/" className="hover:text-white transition-colors">Home</NavLink>
            <NavLink to="/about" className="hover:text-white transition-colors">About</NavLink>
            <NavLink to="/analysis" className="hover:text-white transition-colors">Analysis</NavLink>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
