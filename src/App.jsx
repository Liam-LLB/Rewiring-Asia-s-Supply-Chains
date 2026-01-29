import React, { Suspense, useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import EarthGlobe from "./components/EarthGlobe";
import SEAMap3D from "./components/SEAMap3D";
import Timeline3DNew from "./components/Timeline3DNew";
import SupplyChain3D from "./components/SupplyChain3D";

// Theme context for dynamic colors
const ThemeContext = createContext();

const themes = {
  home: { primary: "#ef4444", secondary: "#3b82f6", accent: "#fbbf24", bg: "from-slate-950 via-slate-900 to-slate-950" },
  context: { primary: "#8b5cf6", secondary: "#ec4899", accent: "#f59e0b", bg: "from-purple-950 via-slate-900 to-slate-950" },
  history: { primary: "#f59e0b", secondary: "#ef4444", accent: "#10b981", bg: "from-amber-950 via-slate-900 to-slate-950" },
  regional: { primary: "#10b981", secondary: "#3b82f6", accent: "#fbbf24", bg: "from-emerald-950 via-slate-900 to-slate-950" },
  global: { primary: "#3b82f6", secondary: "#8b5cf6", accent: "#ef4444", bg: "from-blue-950 via-slate-900 to-slate-950" },
  political: { primary: "#ec4899", secondary: "#8b5cf6", accent: "#10b981", bg: "from-pink-950 via-slate-900 to-slate-950" },
  conclusion: { primary: "#fbbf24", secondary: "#ef4444", accent: "#3b82f6", bg: "from-yellow-950 via-slate-900 to-slate-950" },
};

function ThemeProvider({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState(themes.home);

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    const themeMap = {
      '': 'home',
      'context': 'context',
      'history': 'history',
      'regional': 'regional',
      'global': 'global',
      'political': 'political',
      'conclusion': 'conclusion',
    };
    setTheme(themes[themeMap[path] || 'home']);
  }, [location]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white transition-all duration-1000`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

export default function App() {
  return (
    <BrowserRouter basename="/Rewiring-Asia-s-Supply-Chains">
      <ThemeProvider>
        <div className="min-h-screen antialiased">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/context" element={<Context />} />
              <Route path="/history" element={<History />} />
              <Route path="/regional" element={<Regional />} />
              <Route path="/global" element={<Global />} />
              <Route path="/political" element={<Political />} />
              <Route path="/conclusion" element={<Conclusion />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

/* ==================== NAVBAR ==================== */
function Navbar() {
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/context", label: "Context" },
    { to: "/history", label: "History" },
    { to: "/regional", label: "Regional" },
    { to: "/global", label: "Global" },
    { to: "/political", label: "Political" },
    { to: "/conclusion", label: "Conclusion" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                 style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
              <span className="text-white font-bold text-lg">JS</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">JS-SEZ</span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`
                }
                style={({ isActive }) => isActive ? { background: `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}40)` } : {}}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="h-px w-full transition-all duration-500"
           style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}50, ${theme.secondary}50, transparent)` }} />
    </header>
  );
}

/* ==================== SHARED COMPONENTS ==================== */
function Container({ children, className = "" }) {
  return <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>;
}

function Section({ children, className = "" }) {
  return <section className={`py-20 ${className}`}><Container>{children}</Container></section>;
}

function GradientText({ children, className = "" }) {
  const theme = useTheme();
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${className}`}
          style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
      {children}
    </span>
  );
}

function Card({ children, className = "", hover = true }) {
  const theme = useTheme();
  return (
    <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${hover ? 'hover:scale-[1.02] hover:border-white/30' : ''} ${className}`}
         style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
      {children}
    </div>
  );
}

function StatCard({ value, label, icon }) {
  const theme = useTheme();
  return (
    <Card className="text-center">
      <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>{value}</div>
      <div className="text-white/70 text-sm">{label}</div>
    </Card>
  );
}

function Button({ to, children, variant = "primary" }) {
  const theme = useTheme();
  const baseClasses = "px-6 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2";

  if (variant === "primary") {
    return (
      <NavLink to={to} className={`${baseClasses} text-white hover:scale-105`}
               style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        {children}
      </NavLink>
    );
  }

  return (
    <NavLink to={to} className={`${baseClasses} border border-white/20 hover:bg-white/10 text-white`}>
      {children}
    </NavLink>
  );
}

function Loading3D() {
  const theme = useTheme();
  return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin w-12 h-12 rounded-full border-4 border-white/20"
           style={{ borderTopColor: theme.primary }} />
    </div>
  );
}

/* ==================== HOME PAGE ==================== */
function Home() {
  const theme = useTheme();

  const locations = [
    { lat: 1.3521, lng: 103.8198, label: "Singapore", color: "#ef4444" },
    { lat: 1.4927, lng: 103.7414, label: "Johor Bahru", color: "#3b82f6" },
    { lat: 3.139, lng: 101.6869, label: "Kuala Lumpur", color: "#fbbf24" },
    { lat: 13.7563, lng: 100.5018, label: "Bangkok", color: "#10b981" },
    { lat: 21.0285, lng: 105.8542, label: "Hanoi", color: "#8b5cf6" },
    { lat: -6.2088, lng: 106.8456, label: "Jakarta", color: "#ec4899" },
    { lat: 31.2304, lng: 121.4737, label: "Shanghai", color: "#f59e0b" },
    { lat: 22.3193, lng: 114.1694, label: "Hong Kong", color: "#06b6d4" },
  ];

  const connections = [
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: 1.4927, lng: 103.7414 }, color: "#fbbf24" },
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: 3.139, lng: 101.6869 }, color: "#3b82f6" },
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: 31.2304, lng: 121.4737 }, color: "#ef4444" },
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: -6.2088, lng: 106.8456 }, color: "#10b981" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center pt-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>
                  Johor-Singapore Special Economic Zone
                </p>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <GradientText>Rewiring</GradientText>
                  <br />
                  Asia's Supply
                  <br />
                  Chains
                </h1>
              </div>
              <p className="text-xl text-white/70 max-w-lg">
                Exploring the transformative impact of the JS-SEZ on Southeast Asia's competitiveness in global value chains.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button to="/context">Explore the Context</Button>
                <Button to="/conclusion" variant="outline">View Analysis</Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.primary }}>$26B</div>
                  <div className="text-white/50 text-sm">Projected Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.secondary }}>20K+</div>
                  <div className="text-white/50 text-sm">Jobs Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.accent }}>11</div>
                  <div className="text-white/50 text-sm">Target Sectors</div>
                </div>
              </div>
            </div>

            <div className="h-[500px] lg:h-[600px]">
              <Suspense fallback={<Loading3D />}>
                <EarthGlobe
                  locations={locations}
                  connections={connections}
                  height="100%"
                  showStars={true}
                />
              </Suspense>
            </div>
          </div>
        </Container>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse"
               style={{ background: `${theme.primary}20` }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse"
               style={{ background: `${theme.secondary}20`, animationDelay: '1s' }} />
        </div>
      </section>

      {/* Interactive Map Section */}
      <Section>
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Interactive Map</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            <GradientText>Southeast Asia</GradientText> Economic Corridor
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            The JS-SEZ creates the deepest economic integration between Singapore and Malaysia since their separation in 1965.
          </p>
        </div>

        <div className="h-[500px] rounded-3xl overflow-hidden border border-white/10">
          <Suspense fallback={<Loading3D />}>
            <SEAMap3D height="500px" showTradeRoutes={true} />
          </Suspense>
        </div>
      </Section>

      {/* Key Features */}
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Streamlined Customs", desc: "QR passport-free clearance at checkpoints", icon: "🛃" },
            { title: "Joint Infrastructure", desc: "RTS Link connecting both nations", icon: "🚄" },
            { title: "Investment Hub", desc: "One-stop facilitation center in Johor", icon: "💰" },
            { title: "Talent Mobility", desc: "Simplified cross-border work permits", icon: "👥" },
          ].map((feature, i) => (
            <Card key={i} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Navigation Cards */}
      <Section className="pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Explore the <GradientText>Full Analysis</GradientText></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Historical Context", desc: "Timeline from 1965 to present day", to: "/history", color: "#f59e0b" },
            { title: "Regional Effects", desc: "ASEAN integration and dynamics", to: "/regional", color: "#10b981" },
            { title: "Global Impact", desc: "Value chains and US-China context", to: "/global", color: "#3b82f6" },
          ].map((card, i) => (
            <Card key={i} className="group cursor-pointer" onClick={() => {}}>
              <div className="h-2 w-20 rounded-full mb-6" style={{ background: card.color }} />
              <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
              <p className="text-white/60 mb-6">{card.desc}</p>
              <Button to={card.to} variant="outline">Explore</Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ==================== CONTEXT PAGE ==================== */
function Context() {
  const theme = useTheme();

  return (
    <>
      <section className="pt-32 pb-20">
        <Container>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Why This Topic?</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Understanding the <GradientText>Geopolitical Shift</GradientText>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            The JS-SEZ emerges at a critical moment when companies are diversifying production from concentrated locations.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Regional Significance", desc: "A major initiative transforming economic and political relations between two key Southeast Asian nations.", color: theme.primary },
            { title: "Timely & Relevant", desc: "A current, real-world project being developed right now, making it practical and meaningful to study.", color: theme.secondary },
            { title: "Geopolitical Insight", desc: "Explores how diplomacy, policy, and economics interact to shape regional cooperation and stability.", color: theme.accent },
          ].map((item, i) => (
            <Card key={i}>
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
                   style={{ background: `${item.color}30` }}>
                <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">What is the <GradientText>JS-SEZ</GradientText>?</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-white/80 text-lg">
              The JS-SEZ represents the deepest economic integration between Singapore and Malaysia since their separation in 1965. Officially launched in January 2025, it creates a unified economic zone spanning both nations.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Streamlined customs", icon: "🛃" },
                { label: "Joint infrastructure", icon: "🏗️" },
                { label: "Investment facilitation", icon: "💼" },
                { label: "Talent mobility", icon: "🚶" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10">
            <Suspense fallback={<Loading3D />}>
              <SupplyChain3D variant="detailed" height="400px" />
            </Suspense>
          </div>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/" variant="outline">Back to Home</Button>
          <Button to="/history">Next: Historical Timeline</Button>
        </div>
      </Section>
    </>
  );
}

/* ==================== HISTORY PAGE ==================== */
function History() {
  const theme = useTheme();
  const [activeEvent, setActiveEvent] = useState(null);

  const events = [
    { year: "1800s", title: "British Rule", description: "Colonial administration of Malaya and Singapore", color: "#6b7280" },
    { year: "1946", title: "Separation", description: "Singapore becomes a separate Crown colony", color: "#6b7280" },
    { year: "1957", title: "Independence", description: "Malaya gains independence from Britain", color: "#f59e0b" },
    { year: "1963", title: "Merger", description: "Singapore joins the Federation of Malaysia", color: "#3b82f6" },
    { year: "1965", title: "Split", description: "Singapore separates from Malaysia", color: "#ef4444" },
    { year: "2006", title: "Iskandar", description: "Iskandar Malaysia development launched", color: "#8b5cf6" },
    { year: "2024", title: "JS-SEZ", description: "Special Economic Zone agreement signed", color: "#10b981" },
    { year: "2027", title: "RTS Link", description: "Rapid Transit System begins operations", color: "#fbbf24" },
  ];

  return (
    <>
      <section className="pt-32 pb-20">
        <Container>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Historical Context</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            <GradientText>Timeline</GradientText> of Relations
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            From colonial separation to modern integration, the journey of Malaysia-Singapore relations.
          </p>
        </Container>
      </section>

      <Section>
        <div className="h-[450px] rounded-3xl overflow-hidden border border-white/10 mb-12">
          <Suspense fallback={<Loading3D />}>
            <Timeline3DNew
              events={events}
              height="450px"
              activeEvent={activeEvent}
              onEventClick={setActiveEvent}
            />
          </Suspense>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.slice(-4).map((event, i) => (
            <Card key={i} className={activeEvent === events.indexOf(event) ? 'ring-2' : ''}
                  style={{ ringColor: event.color }}>
              <div className="text-sm font-bold mb-2" style={{ color: event.color }}>{event.year}</div>
              <h3 className="font-bold mb-2">{event.title}</h3>
              <p className="text-white/60 text-sm">{event.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold mb-8">Key Historical Moments</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>The 1965 Separation</h3>
            <p className="text-white/70">
              The separation resulted from deep political and economic differences and rising racial tensions. While Singapore's leaders felt marginalized in the Malaysian federal government, Malaysians resented Singapore's thriving economy.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.secondary }}>Water Agreements (1961-2061)</h3>
            <p className="text-white/70">
              Singapore purchases raw water from Johor under long-term contracts for decades. The 1962 agreement allows Singapore to draw up to 250 million gallons daily from the Johor River.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/context" variant="outline">Back: Context</Button>
          <Button to="/regional">Next: Regional Effects</Button>
        </div>
      </Section>
    </>
  );
}

/* ==================== REGIONAL PAGE ==================== */
function Regional() {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <>
      <section className="pt-32 pb-20">
        <Container>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Regional Effects</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            <GradientText>ASEAN</GradientText> Integration
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            How the JS-SEZ influences regional dynamics and Southeast Asian competitiveness.
          </p>
        </Container>
      </section>

      <Section>
        <div className="h-[500px] rounded-3xl overflow-hidden border border-white/10 mb-8">
          <Suspense fallback={<Loading3D />}>
            <SEAMap3D
              height="500px"
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
            />
          </Suspense>
        </div>

        <p className="text-center text-white/50 text-sm">Click on countries to explore their role in regional trade</p>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold mb-8">Competitive Dynamics</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>Competition with Other SEZs</h3>
            <p className="text-white/70 mb-4">
              The JS-SEZ competes with other special zones in Southeast Asia, including Thailand's Eastern Economic Corridor and Vietnam's special zones.
            </p>
            <div className="space-y-2">
              {["Thailand EEC", "Vietnam SEZs", "Indonesia Special Zones"].map((zone, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ background: theme.secondary }} />
                  <span className="text-white/60">{zone}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.secondary }}>Benefits for Partners</h3>
            <p className="text-white/70 mb-4">
              Cross-border integration of industries and value chains improves productivity and innovation of the regional cluster.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold" style={{ color: theme.primary }}>SG</div>
                <div className="text-white/50 text-xs">Finance & Tech</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold" style={{ color: theme.secondary }}>MY</div>
                <div className="text-white/50 text-xs">Land & Labor</div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/history" variant="outline">Back: History</Button>
          <Button to="/global">Next: Global Effects</Button>
        </div>
      </Section>
    </>
  );
}

/* ==================== GLOBAL PAGE ==================== */
function Global() {
  const theme = useTheme();

  const globalLocations = [
    { lat: 1.3521, lng: 103.8198, label: "Singapore", color: "#ef4444" },
    { lat: 39.9042, lng: 116.4074, label: "Beijing", color: "#fbbf24" },
    { lat: 38.9072, lng: -77.0369, label: "Washington DC", color: "#3b82f6" },
    { lat: 51.5074, lng: -0.1278, label: "London", color: "#8b5cf6" },
    { lat: 35.6762, lng: 139.6503, label: "Tokyo", color: "#10b981" },
    { lat: 28.6139, lng: 77.2090, label: "New Delhi", color: "#ec4899" },
  ];

  const globalConnections = [
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: 39.9042, lng: 116.4074 }, color: "#fbbf24" },
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: 38.9072, lng: -77.0369 }, color: "#3b82f6" },
    { from: { lat: 1.3521, lng: 103.8198 }, to: { lat: 35.6762, lng: 139.6503 }, color: "#10b981" },
  ];

  return (
    <>
      <section className="pt-32 pb-20">
        <Container>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Global Effects</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            <GradientText>Global Value Chain</GradientText> Positioning
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            How the JS-SEZ positions itself in the context of US-China competition and global supply chain restructuring.
          </p>
        </Container>
      </section>

      <Section>
        <div className="h-[500px] rounded-3xl overflow-hidden border border-white/10">
          <Suspense fallback={<Loading3D />}>
            <EarthGlobe
              locations={globalLocations}
              connections={globalConnections}
              height="500px"
              autoRotate={true}
            />
          </Suspense>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold mb-8">US-China Decoupling Context</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Friend-Shoring", desc: "Businesses exist in a deliberately neutral area, gaining operational stability", color: theme.primary },
            { title: "Supply Chain Resilience", desc: "Alternative path for production and investment amid trade disputes", color: theme.secondary },
            { title: "Market Access", desc: "Access to numerous FTAs, reaching various markets easily", color: theme.accent },
          ].map((item, i) => (
            <Card key={i}>
              <div className="h-1 w-16 rounded-full mb-6" style={{ background: item.color }} />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold mb-8">Strategic Industries</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Semiconductors", desc: "Critical technology sector with global supply chain implications" },
            { title: "EV Batteries", desc: "Green technology and critical minerals processing" },
            { title: "Digital Services", desc: "Data centers, AI, and digital economy infrastructure" },
            { title: "Pharmaceuticals", desc: "Healthcare manufacturing and API production" },
          ].map((item, i) => (
            <Card key={i}>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/regional" variant="outline">Back: Regional</Button>
          <Button to="/political">Next: Political</Button>
        </div>
      </Section>
    </>
  );
}

/* ==================== POLITICAL PAGE ==================== */
function Political() {
  const theme = useTheme();

  return (
    <>
      <section className="pt-32 pb-20">
        <Container>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Political Effects</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            <GradientText>Political</GradientText> Implications
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Navigating the complex political landscape of Malaysia-Singapore relations and regional dynamics.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primary }}>Malaysia</h2>
            <div className="space-y-4">
              {[
                { title: "Political Instability", desc: "Multiple leadership changes since 2018 create policy uncertainty" },
                { title: "Ethnic Politics", desc: "Bumiputera policies balance inclusiveness and competitiveness" },
                { title: "Federal-State Relations", desc: "Johor's autonomy and Sultan's role add complexity" },
              ].map((item, i) => (
                <Card key={i} hover={false}>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: theme.secondary }}>Singapore</h2>
            <div className="space-y-4">
              {[
                { title: "Labor Concerns", desc: "Cross-border mobility raises competition and wage pressure fears" },
                { title: "Political Management", desc: "PAP navigates increasingly polarized political landscape" },
                { title: "Business Dynamics", desc: "MNCs see opportunities while SMEs worry about competition" },
              ].map((item, i) => (
                <Card key={i} hover={false}>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold mb-8">Geopolitical Considerations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Great Power Competition</h3>
            <p className="text-white/70 mb-4">
              The JS-SEZ matures when the world is being reshaped by increasingly competitive relations between China and the United States. Southeast Asia has become a key battleground of economic statecraft.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl mb-2">🇺🇸</div>
                <div className="text-sm text-white/60">US/Allied Sphere</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl mb-2">🌏</div>
                <div className="text-sm text-white/60">ASEAN Neutrality</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl mb-2">🇨🇳</div>
                <div className="text-sm text-white/60">China/BRI Sphere</div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="flex justify-between items-center">
          <Button to="/global" variant="outline">Back: Global</Button>
          <Button to="/conclusion">Next: Conclusion</Button>
        </div>
      </Section>
    </>
  );
}

/* ==================== CONCLUSION PAGE ==================== */
function Conclusion() {
  const theme = useTheme();

  return (
    <>
      <section className="pt-32 pb-20">
        <Container>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: theme.primary }}>Conclusion</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            <GradientText>Strategic</GradientText> Imperatives
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            The JS-SEZ offers a major opportunity for Malaysia-Singapore to deepen cooperation and strengthen ASEAN integration.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { num: "01", title: "Economic Diversification", desc: "Combining strengths for high-value growth" },
            { num: "02", title: "Social Inclusion", desc: "Ensuring benefits reach all communities" },
            { num: "03", title: "Binding Agreements", desc: "Mitigating political instability risks" },
            { num: "04", title: "Regional Model", desc: "Scalable example for ASEAN cooperation" },
          ].map((item, i) => (
            <Card key={i}>
              <div className="text-4xl font-bold mb-4" style={{ color: theme.primary }}>{item.num}</div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="text-center py-12" hover={false}>
          <h2 className="text-3xl font-bold mb-6">Key Takeaway</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            The JS-SEZ has the potential to redefine Malaysia-Singapore's relationship and serve as a scalable model for ASEAN, exemplifying realistic and geopolitically astute cooperation in an increasingly complex global environment.
          </p>
          <div className="flex justify-center gap-4">
            <Button to="/">Back to Home</Button>
            <Button to="/context" variant="outline">Start Over</Button>
          </div>
        </Card>
      </Section>

      <Section className="pb-32">
        <h2 className="text-2xl font-bold mb-6 text-center">Presented By</h2>
        <p className="text-center text-white/60">
          Samarah Piyush, Saanvi Bagaria, Naisha, Kashvi Tanwar, Liam Leclaircie-Bardon & Basile Echene
        </p>
      </Section>
    </>
  );
}

/* ==================== FOOTER ==================== */
function Footer() {
  const theme = useTheme();

  return (
    <footer className="border-t border-white/10 py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
              <span className="text-white font-bold">JS</span>
            </div>
            <span className="text-white/60">JS-SEZ Analysis 2025</span>
          </div>
          <nav className="flex gap-6 text-sm text-white/60">
            <NavLink to="/" className="hover:text-white transition-colors">Home</NavLink>
            <NavLink to="/context" className="hover:text-white transition-colors">Context</NavLink>
            <NavLink to="/conclusion" className="hover:text-white transition-colors">Conclusion</NavLink>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
