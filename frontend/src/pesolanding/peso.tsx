import { useState, useEffect, useRef } from "react";
import pesoLogo from "/assets/peso-logo.png";
import heroBg from "/assets/bg.jpg";
import { useNavigate } from "react-router-dom";

// ── Types ────────────────────────────────────────────────────────────────────

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
}

interface Program {
  num: string;
  title: string;
  description: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: ServiceCard[] = [
  { icon: "💼", title: "Job Placement", description: "Matching qualified applicants with local and national employers through our extensive job referral network." },
  { icon: "✈️", title: "Overseas Employment", description: "Facilitation and pre-departure orientation for Filipinos seeking opportunities abroad through legal channels." },
  { icon: "📋", title: "Job Fairs", description: "Regular job fair events bringing together hundreds of employers and thousands of job seekers in one venue." },
  { icon: "🎓", title: "Skills Training", description: "Coordination with TESDA and other agencies to provide vocational and technical training for improved employability." },
  { icon: "🤝", title: "Career Counseling", description: "One-on-one guidance for job seekers on career choices, resume writing, and interview preparation." },
  { icon: "📊", title: "Labor Market Info", description: "Providing up-to-date labor market information to help job seekers make informed career decisions." },
];

const SERVICE_IMAGES: Record<string, string> = {
  "Job Placement":       "/assets/Job_Placement.png",
  "Overseas Employment": "/assets/Overseas_Employment.png",
  "Job Fairs":           "/assets/Job_Fairs.png",
  "Skills Training":     "/assets/Skills_Training.png",
  "Career Counseling":   "/assets/Career_Counseling.png",
  "Labor Market Info":   "/assets/Labor_Market_Info.png",
};

const PROGRAMS: Program[] = [
  { num: "01", title: "TUPAD – Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers", description: "Community-based package of assistance for informal economy workers, displaced or underemployed individuals." },
  { num: "02", title: "SPES – Special Program for Employment of Students", description: "Helping poor but deserving students by providing temporary employment during summer or Christmas break." },
  { num: "03", title: "Government Internship Program (GIP)", description: "Providing college students with government internship experience and exposure to public service." },
  { num: "04", title: "Livelihood and Self-Employment Assistance", description: "Supporting displaced workers and underprivileged community members with livelihood kits and financial assistance." },
];

const MARQUEE_ITEMS = [
  "Job Placement Assistance", "Livelihood Programs", "Overseas Employment",
  "Skills Training", "Job Fairs", "Makakahanap Ng Trabaho",
  "Special Hiring", "Career Counseling",
];

const LABOR_MARKET_DROPDOWN = [
  { label: "Monthly Report",   icon: "📅", href: "#monthly-report"   },
  { label: "Quarterly Report", icon: "📆", href: "#quarterly-report" },
  { label: "Annual Report",    icon: "📊", href: "#annual-report"    },
];

const CAREER_DEVELOPMENT_DROPDOWN = [
  { label: "Schedule", icon: "🗓️", href: "#schedule" },
];

const DOLE_PROGRAMS_DROPDOWN = [
  { label: "Job Fair",                    icon: "🏢", href: "#job-fair"                    },
  { label: "Special Recruitment Activity",icon: "📋", href: "#special-recruitment-activity" },
  { label: "SPES",                        icon: "🎓", href: "#spes"                        },
  { label: "GIP",                         icon: "🏛️", href: "#gip"                         },
  { label: "JobStart",                    icon: "🚀", href: "#jobstart"                    },
];

// NAV_LINKS — hasDropdown marks entries that render a dropdown; dropdownItems supplies their items
const NAV_LINKS: { href: string; label: string; hasDropdown?: boolean; dropdownItems?: { label: string; icon: string; href: string }[] }[] = [
  { href: "#",         label: "HOME" },
  { href: "#services", label: "Referral and Placement" },
  { href: "#about",    label: "Labor Market Information",   hasDropdown: true, dropdownItems: LABOR_MARKET_DROPDOWN },
  { href: "#programs", label: "Career Development Support", hasDropdown: true, dropdownItems: CAREER_DEVELOPMENT_DROPDOWN },
  { href: "#programs", label: "DOLE Implemented Programs", hasDropdown: true, dropdownItems: DOLE_PROGRAMS_DROPDOWN },
  { href: "/contact",  label: "Contact Us" },
];

const FEATURED_VIDEOS = [
  {
    embedSrc: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4299528403639822%2F&show_text=false&width=267&t=0",
    url: "https://www.facebook.com/reel/4299528403639822/",
    title: "PESO Roxas City Reel",
    description: "Employment services and community programs.",
  },
  {
    embedSrc: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F908486105525091%2F&show_text=false&width=267&t=0",
    url: "https://www.facebook.com/reel/908486105525091/",
    title: "Employment Highlights",
    description: "Connecting job seekers with opportunities across Capiz.",
  },
  {
    embedSrc: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F844936451407285%2F&show_text=false&width=267&t=0",
    url: "https://www.facebook.com/reel/844936451407285/",
    title: "Community Programs",
    description: "DOLE programs supporting displaced and disadvantaged workers.",
  },
];

const LOGO_ELEMENTS = [
  { icon: "⚙️", color: "#c0151a", title: "THE GEAR (RED)", desc: "Represents industry, labor, and economic activity. It signifies that employment is the engine that drives progress." },
  { icon: "🤲", color: "#1a1d5e", title: "THE HANDS", desc: "Symbolizes support, care, and guidance. It shows that PESO is here to help and protect every worker." },
  { icon: "☀️", color: "#e8a800", title: "THE SUN (YELLOW)", desc: "From the Philippine flag, it symbolizes hope, optimism, and new opportunities for a brighter future." },
  { icon: "⭕", color: "#1a1d5e", title: "THE CIRCLE", desc: "Signifies unity, cooperation, and continuous service. PESO's commitment to employment is ongoing." },
  { icon: "👥", color: "#1a1d5e", title: "THE PEOPLE", desc: "Represents job seekers, workers, and the community. PESO is for everyone — inclusive and people-centered." },
  { icon: "🏷️", color: "#c0151a", title: "P.E.S.O.", desc: "Stands for Public Employment Service Office — your partner in finding opportunities and building better lives." },
];

// ── Mobile Drawer ─────────────────────────────────────────────────────────────

function MobileDrawer({
  open, onClose, onLoginClick, onRegisterClick,
}: {
  open: boolean; onClose: () => void; onLoginClick: () => void; onRegisterClick: () => void;
}) {
  const [activeLink, setActiveLink] = useState("HOME");
  const [lmiOpen, setLmiOpen] = useState(false);
  const [cdsOpen, setCdsOpen] = useState(false);
  const [doleOpen, setDoleOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 200, width: "min(300px, 85vw)", background: "#1a1d5e", boxShadow: "-6px 0 40px rgba(0,0,0,0.45)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ background: "#c0151a", padding: "0 16px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={pesoLogo} alt="PESO" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: "0.9rem", letterSpacing: 1 }}>P.E.S.O.</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.52rem", letterSpacing: 0.8, textTransform: "uppercase" }}>Roxas City</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close menu" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: "1rem" }}>✕</button>
        </div>
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV_LINKS.map(({ href, label, hasDropdown, dropdownItems }) => {
            const isActive = activeLink === label;
            if (hasDropdown && dropdownItems) {
              const isLmiLabel = label === "Labor Market Information";
              const isCdsLabel = label === "Career Development Support";
              const drawerOpen = isLmiLabel ? lmiOpen : isCdsLabel ? cdsOpen : doleOpen;
              const setDrawerItemOpen = isLmiLabel ? setLmiOpen : isCdsLabel ? setCdsOpen : setDoleOpen;
              return (
                <div key={label}>
                  <button
                    onClick={() => setDrawerItemOpen(p => !p)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "15px 24px", color: isActive ? "#f5c842" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "0.95rem", fontWeight: isActive ? 700 : 400, background: isActive ? "rgba(245,200,66,0.08)" : "transparent", borderLeft: isActive ? "3px solid #f5c842" : "3px solid transparent", borderBottom: "1px solid rgba(255,255,255,0.05)", letterSpacing: 0.2, border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    <span>{label}</span>
                    <span style={{ fontSize: "0.7rem", transition: "transform 0.2s", transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▼</span>
                  </button>
                  {drawerOpen && (
                    <div style={{ background: "rgba(0,0,0,0.2)" }}>
                      {dropdownItems.map(item => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => { setActiveLink(label); onClose(); }}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px 12px 36px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.88rem", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "color 0.15s" }}
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <a key={label} href={href} onClick={() => { setActiveLink(label); onClose(); }} style={{ display: "flex", alignItems: "center", padding: "15px 24px", color: isActive ? "#f5c842" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "0.95rem", fontWeight: isActive ? 700 : 400, background: isActive ? "rgba(245,200,66,0.08)" : "transparent", borderLeft: isActive ? "3px solid #f5c842" : "3px solid transparent", borderBottom: "1px solid rgba(255,255,255,0.05)", letterSpacing: 0.2, transition: "all 0.15s" }}>{label}</a>
            );
          })}
        </nav>
        <div style={{ padding: "20px 20px 36px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }}>
          <button onClick={() => { onClose(); onLoginClick(); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.35)", background: "transparent", color: "white", fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", letterSpacing: 0.3, fontFamily: "'Source Sans 3', sans-serif" }}>Log In</button>
          <button onClick={() => { onClose(); onRegisterClick(); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#f5c842", color: "#1a1d5e", fontSize: "0.92rem", fontWeight: 800, cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 2px 12px rgba(245,200,66,0.4)", fontFamily: "'Source Sans 3', sans-serif" }}>Register</button>
        </div>
      </div>
    </>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ onLoginClick, onRegisterClick }: { onLoginClick: () => void; onRegisterClick: () => void }) {
  const [activeLink, setActiveLink] = useState("HOME");
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, fontFamily: "'Source Sans 3', sans-serif", transition: "all 0.3s ease" }}>
        <div style={{ background: scrolled ? "rgba(192,21,26,0.97)" : "#c0151a", backdropFilter: scrolled ? "blur(10px)" : "none", boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.2)", transition: "all 0.3s ease" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "stretch", height: 58, padding: "0 16px", gap: 8 }}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", padding: isMobile ? "0 12px 0 4px" : "0 20px 0 4px", borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>
              <img src={pesoLogo} alt="PESO" style={{ width: 40, height: 40, objectFit: "contain", display: "block", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.35))" }} />
              <div>
                <div style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", letterSpacing: 1, lineHeight: 1.1 }}>P.E.S.O.</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.56rem", letterSpacing: 0.8, textTransform: "uppercase", lineHeight: 1 }}>Roxas City</div>
              </div>
            </a>
            {!isMobile && (
              <ul style={{ display: "flex", alignItems: "stretch", listStyle: "none", margin: 0, padding: 0, flex: 1, overflowX: "auto" }}>
                {NAV_LINKS.map(({ href, label, hasDropdown, dropdownItems }) =>
                  hasDropdown
                    ? <NavItemDropdown key={label} label={label} active={activeLink === label} onActivate={() => setActiveLink(label)} dropdownItems={dropdownItems!} />
                    : <NavItem key={label} href={href} label={label} active={activeLink === label} onClick={() => setActiveLink(label)} />
                )}
              </ul>
            )}
            {isMobile && <div style={{ flex: 1 }} />}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 0 0 12px", borderLeft: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>
                <button onClick={onLoginClick} style={{ display: "flex", alignItems: "center", gap: 6, color: "white", background: "transparent", fontSize: "0.8rem", fontWeight: 600, padding: "6px 14px", borderRadius: 6, border: "1.5px solid rgba(255,255,255,0.45)", letterSpacing: 0.3, transition: "all 0.2s", whiteSpace: "nowrap", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}>Log In</button>
                <button onClick={onRegisterClick} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f5c842", color: "#1a1d5e", border: "1.5px solid transparent", fontSize: "0.8rem", fontWeight: 800, padding: "6px 16px", borderRadius: 6, letterSpacing: 0.3, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "all 0.2s", whiteSpace: "nowrap", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.background = "#ffe066"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "#f5c842"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>Register</button>
              </div>
            )}
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 8, width: 42, height: 42, alignSelf: "center", cursor: "pointer", flexShrink: 0, gap: 0, padding: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[0, 1, 2].map(i => (<span key={i} style={{ display: "block", width: 20, height: 2, background: "white", borderRadius: 2 }} />))}
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
    </>
  );
}

function NavItem({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li style={{ display: "flex", alignItems: "stretch" }}>
      <a href={href} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "flex", alignItems: "center", padding: "0 13px", color: hovered ? "white" : "rgba(255,255,255,0.88)", textDecoration: "none", fontSize: "0.8rem", fontWeight: active ? 700 : 500, whiteSpace: "nowrap", position: "relative", background: hovered ? "rgba(255,255,255,0.12)" : "transparent", transition: "all 0.2s", letterSpacing: 0.2 }}>
        {label}
        {active && (<span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#f5c842", borderRadius: "2px 2px 0 0" }} />)}
      </a>
    </li>
  );
}

// ── Dropdown Nav Item ─────────────────────────────────────────────────────────

function NavItemDropdown({ label, active, onActivate, dropdownItems }: { label: string; active: boolean; onActivate: () => void; dropdownItems: { label: string; icon: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLLIElement>(null);

  // Measure button position so the fixed dropdown aligns correctly
  const calcCoords = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 4, left: r.left + r.width / 2 });
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Recompute on scroll/resize so it stays aligned
  useEffect(() => {
    if (!open) return;
    const update = () => calcCoords();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  return (
    <li ref={ref} style={{ display: "flex", alignItems: "stretch", position: "relative" }}>
      <button
        ref={btnRef}
        onClick={() => { calcCoords(); setOpen(p => !p); onActivate(); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "0 13px",
          color: hovered || open ? "white" : "rgba(255,255,255,0.88)",
          background: hovered || open ? "rgba(255,255,255,0.12)" : "transparent",
          border: "none", cursor: "pointer",
          fontSize: "0.8rem", fontWeight: active ? 700 : 500,
          whiteSpace: "nowrap", position: "relative",
          transition: "all 0.2s", letterSpacing: 0.2,
          fontFamily: "'Source Sans 3', sans-serif",
          height: "100%",
        }}
      >
        {label}
        <span style={{
          fontSize: "0.55rem",
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          marginTop: open ? -1 : 1,
        }}>▼</span>
        {active && (
          <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#f5c842", borderRadius: "2px 2px 0 0" }} />
        )}
      </button>

      {/* Dropdown panel — fixed so it escapes the navbar's stacking context */}
      <div style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: open ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-6px)",
        minWidth: 210,
        background: "white",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(26,29,94,0.22), 0 2px 8px rgba(0,0,0,0.10)",
        overflow: "hidden",
        zIndex: 9999,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.18s ease, transform 0.18s ease",
      } as React.CSSProperties}>
        {/* Little triangle arrow */}
        <div style={{
          position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "8px solid white",
        }} />

        <div style={{ padding: "6px 0" }}>
          {dropdownItems.map((item, i) => (
            <DropdownItem key={item.label} item={item} isLast={i === LABOR_MARKET_DROPDOWN.length - 1} onClose={() => setOpen(false)} />
          ))}
        </div>
      </div>
    </li>
  );
}

function DropdownItem({ item, isLast, onClose }: { item: typeof LABOR_MARKET_DROPDOWN[0]; isLast: boolean; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={item.href}
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 20px",
        textDecoration: "none",
        background: hovered ? "#f4f4f8" : "transparent",
        borderBottom: isLast ? "none" : "1px solid rgba(26,29,94,0.07)",
        transition: "background 0.15s",
      }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        background: hovered ? "#c0151a" : "rgba(192,21,26,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.9rem",
        transition: "background 0.15s",
        flexShrink: 0,
      }}>{item.icon}</span>
      <span style={{
        color: hovered ? "#c0151a" : "#1a1d5e",
        fontSize: "0.85rem", fontWeight: 600,
        letterSpacing: 0.2,
        transition: "color 0.15s",
        whiteSpace: "nowrap",
      }}>{item.label}</span>
    </a>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ marginTop: 58, minHeight: "calc(100vh - 56px)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <img src={heroBg} alt="PESO Office" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", zIndex: 2 }} />
      <div style={{ position: "relative", zIndex: 3, maxWidth: 1100, margin: "0 auto", padding: "60px 32px", display: "flex", alignItems: "center", gap: 60, width: "100%", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ flexShrink: 0, animation: "fadeIn 0.8s ease both" }}>
          <img src={pesoLogo} alt="PESO Official Seal" style={{ width: 300, height: 300, objectFit: "contain", display: "block", filter: "drop-shadow(0 0 30px rgba(255,255,255,0.3)) drop-shadow(0 4px 20px rgba(0,0,0,0.6))", animation: "pulseGlow 4s ease-in-out infinite" }} />
        </div>
        <div style={{ flex: 1, minWidth: 280, maxWidth: 620, textAlign: "center", animation: "fadeUp 0.9s ease 0.2s both" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "white", lineHeight: 1, marginBottom: 28, textShadow: "0 2px 20px rgba(0,0,0,0.5)", letterSpacing: 2 }}>PESO</h1>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(0.92rem, 1.5vw, 1.08rem)", lineHeight: 1.85, fontWeight: 300, margin: "0 auto", maxWidth: 560, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
            The Public Employment Service Office (PESO) is a non-fee charging multi-employment service facility or entity established or accredited pursuant to Republic Act No. 8759, otherwise known as the PESO Act of 1999. The Act provides that in order to carry out full employment and equality of employment opportunities for all, and to strengthen and expand the existing employment facilitation service machinery of the government particularly at the local levels, there shall be established in all capital towns of provinces, key cities, and other strategic areas a Public Employment Service Office.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────

function MarqueeBar() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ background: "#e8a800", padding: "12px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", animation: "marquee 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1d5e", letterSpacing: 1, textTransform: "uppercase", padding: "0 32px" }}>★&nbsp;&nbsp;{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Services (Full-image Carousel) ────────────────────────────────────────────

function Services() {
  const [current, setCurrent] = useState(0);
  const total = SERVICES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 7000);
    return () => clearInterval(timer);
  }, [current, total]);

  const prev = () => setCurrent(p => (p - 1 + total) % total);
  const next = () => setCurrent(p => (p + 1) % total);

  const service = SERVICES[current];
  const imgSrc = SERVICE_IMAGES[service.title];

  return (
    <section id="services" style={{ padding: "90px 24px", background: "white" }}>
      <div style={container}>
        <span style={sectionLabel}>What We Offer</span>
        <h2 style={sectionTitle}>Our Core Services</h2>
        <p style={sectionSub}>We provide a comprehensive range of employment facilitation services to help every Filipino find decent and productive work.</p>

        <div style={{ marginTop: 52, position: "relative" }}>
          <div
            key={current}
            style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 8px 40px rgba(26,29,94,0.18)",
              maxWidth: 800, margin: "0 auto",
              animation: "carouselFade 0.5s ease both",
              aspectRatio: "16/9", background: "#1a1d5e",
            }}
          >
            <img src={imgSrc} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>

          <button onClick={prev} aria-label="Previous service" style={{ position: "absolute", top: "50%", left: -20, transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "#c0151a", border: "none", color: "white", fontSize: "1.6rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(192,21,26,0.45)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, transform 0.15s", zIndex: 10 }} onMouseEnter={e => { e.currentTarget.style.background = "#a01015"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "#c0151a"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}>‹</button>
          <button onClick={next} aria-label="Next service" style={{ position: "absolute", top: "50%", right: -20, transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "#c0151a", border: "none", color: "white", fontSize: "1.6rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(192,21,26,0.45)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, transform 0.15s", zIndex: 10 }} onMouseEnter={e => { e.currentTarget.style.background = "#a01015"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "#c0151a"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}>›</button>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {SERVICES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} style={{ width: i === current ? 28 : 10, height: 10, borderRadius: 5, border: "none", background: i === current ? "#c0151a" : "rgba(26,29,94,0.18)", cursor: "pointer", padding: 0, transition: "width 0.35s ease, background 0.25s" }} />
            ))}
          </div>

          <div style={{ maxWidth: 800, margin: "14px auto 0", height: 3, background: "rgba(26,29,94,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div key={`bar-${current}`} style={{ height: "100%", background: "linear-gradient(90deg, #c0151a, #e8a800)", borderRadius: 2, animation: "progressBar 7s linear forwards" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Trivia ────────────────────────────────────────────────────────────────────

function TriviaSection() {
  return (
    <section style={{ padding: "90px 24px", background: "linear-gradient(160deg, #0f1240 0%, #1a1d5e 60%, #0f1240 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ ...container, position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "flex-start", marginBottom: 52 }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5c842", fontSize: "1.3rem", fontStyle: "italic", fontWeight: 400, marginBottom: 4 }}>Trivia about the</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 5rem)", color: "white", lineHeight: 1, marginBottom: 20, letterSpacing: 1 }}>PESO</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>Every element in the PESO logo represents the office's commitment to public service and employment for all.</p>
          </div>
          <div style={{ background: "#1a1d5e", border: "2px solid rgba(232,168,0,0.4)", borderRadius: 14, padding: "24px 28px", display: "flex", gap: 18, alignItems: "flex-start", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(232,168,0,0.15)", border: "2px solid rgba(232,168,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>💡</div>
            <div>
              <p style={{ color: "#f5c842", fontWeight: 700, fontSize: "0.9rem", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>TRIVIA!</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", lineHeight: 1.7, margin: 0 }}>The <strong style={{ color: "#f5c842" }}>"O"</strong> in PESO is intentionally emphasized — it resembles a <strong style={{ color: "#f5c842" }}>coin</strong>, symbolizing livelihood, value, and the goal of providing decent work and income.</p>
            </div>
          </div>
        </div>
        <div style={{ border: "2px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#1a1d5e", borderBottom: "2px solid rgba(232,168,0,0.4)", padding: "14px 24px", textAlign: "center" }}>
            <span style={{ color: "#f5c842", fontWeight: 700, fontSize: "0.85rem", letterSpacing: 3, textTransform: "uppercase" }}>WHAT EACH ELEMENT MEANS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", background: "rgba(255,255,255,0.03)" }}>
            {LOGO_ELEMENTS.map((el, i) => (
              <div key={el.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "22px 24px", borderBottom: i < LOGO_ELEMENTS.length - 2 ? "1px solid rgba(255,255,255,0.07)" : "none", borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${el.color}22`, border: `2px solid ${el.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{el.icon}</div>
                <div>
                  <p style={{ color: el.color === "#e8a800" ? "#f5c842" : el.color === "#c0151a" ? "#e05560" : "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: 0.5, marginBottom: 5 }}>{el.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>{el.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 28, background: "#1a1d5e", border: "2px solid rgba(232,168,0,0.35)", borderRadius: 12, padding: "18px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: "1.4rem" }}>⭐</span>
            <span style={{ fontFamily: "'Playfair Display', serif", color: "#f5c842", fontSize: "1.2rem", fontStyle: "italic" }}>In short:</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>The PESO logo represents a simple but powerful mission: <strong style={{ color: "#f5c842" }}>Connecting people to jobs, supporting their growth, and building a stronger community.</strong></p>
        </div>
      </div>
    </section>
  );
}

// ── Featured Videos ───────────────────────────────────────────────────────────

function FeaturedVideos() {
  return (
    <section id="videos" style={{ padding: "90px 24px", background: "#f4f4f6" }}>
      <div style={container}>
        <span style={sectionLabel}>On Social Media</span>
        <h2 style={sectionTitle}>Featured Videos</h2>
        <p style={sectionSub}>Watch our latest reels directly from our Facebook page — no redirect needed.</p>
        <div style={{ display: "flex", gap: 28, marginTop: 48, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start" }}>
          {FEATURED_VIDEOS.map((video, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(26,29,94,0.10)", width: 267, flexShrink: 0 }}>
              <iframe src={video.embedSrc} width="267" height="476" style={{ border: "none", overflow: "hidden", display: "block" }} scrolling="no" frameBorder={0} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" />
              <div style={{ padding: "14px 16px 16px", width: "100%" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.98rem", color: "#1a1d5e", marginBottom: 4 }}>{video.title}</h3>
                <p style={{ color: "#5a5a7a", fontSize: "0.82rem", lineHeight: 1.55, margin: "0 0 10px" }}>{video.description}</p>
                <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#1877f2", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#1877f2", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900, flexShrink: 0 }}>f</span>
                  Open on Facebook ↗
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a href="https://www.facebook.com/PESOCapiz" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#1877f2", color: "white", padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 4px 16px rgba(24,119,242,0.35)", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = "#1464d8")} onMouseLeave={e => (e.currentTarget.style.background = "#1877f2")}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.85rem" }}>f</span>
            Follow Us on Facebook
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Programs ──────────────────────────────────────────────────────────────────

function Programs() {
  return (
    <section id="programs" style={{ padding: "90px 24px", background: "#f4f4f6" }}>
      <div style={container}>
        <span style={sectionLabel}>Government Programs</span>
        <h2 style={sectionTitle}>Special Employment Programs</h2>
        <p style={sectionSub}>We implement various DOLE programs designed to address specific employment needs across different sectors.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 52 }}>
          {PROGRAMS.map((p) => (<ProgramItem key={p.num} {...p} />))}
        </div>
      </div>
    </section>
  );
}

function ProgramItem({ num, title, description }: Program) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "flex", alignItems: "flex-start", gap: 18, background: "white", borderRadius: 10, padding: 24, borderLeft: "4px solid #c0151a", boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 0.25s" }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "rgba(192,21,26,0.15)", lineHeight: 1, minWidth: 42 }}>{num}</span>
      <div>
        <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1a1d5e", marginBottom: 6 }}>{title}</h4>
        <p style={{ fontSize: "0.88rem", color: "#5a5a7a", lineHeight: 1.6, margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTA({ onRegisterClick }: { onRegisterClick: () => void }) {
  return (
    <section id="contact" style={{ background: "#c0151a", textAlign: "center", padding: "80px 24px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "white", marginBottom: 14 }}>Ready to Find Your Next Opportunity?</h2>
      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.05rem", marginBottom: 32, fontWeight: 300 }}>Visit your nearest PESO office or register online to access our full range of employment services — free of charge.</p>
      <button onClick={onRegisterClick} style={{ background: "white", color: "#c0151a", padding: "14px 32px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = "#fdf8f0")} onMouseLeave={e => (e.currentTarget.style.background = "white")}>
        Register as Job Seeker
      </button>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="about" style={{ background: "#1a1d5e", color: "rgba(255,255,255,0.6)", padding: "48px 24px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <img src={pesoLogo} alt="PESO" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "1rem", lineHeight: 1.3 }}>Public Employment<br />Service Office</div>
          </div>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.75, maxWidth: 260 }}>Serving the Filipino workforce with integrity, dedication, and compassion. A service under the Department of Labor and Employment.</p>
        </div>
        <div>
          <h5 style={{ fontSize: "0.78rem", letterSpacing: 3, textTransform: "uppercase", color: "#f5c842", marginBottom: 14 }}>Quick Links</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {["Job Search", "Register as Employer", "Upcoming Job Fairs", "DOLE Programs", "TESDA Courses"].map(link => (
              <li key={link}><a href="#" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.9rem" }} onMouseEnter={e => (e.currentTarget.style.color = "white")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>{link}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 style={{ fontSize: "0.78rem", letterSpacing: 3, textTransform: "uppercase", color: "#f5c842", marginBottom: 14 }}>Contact</h5>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
            Roxas City, Capiz<br />Philippines 5800<br /><br />
            📞 (036) 620 3550<br />✉️ pesocapiz@gmail.com<br />🕐 Mon–Fri, 8:00 AM – 5:00 PM
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: "0.82rem" }}>© 2026 Public Employment Service Office – Roxas City. All rights reserved.</p>
        <p style={{ fontSize: "0.82rem" }}>Department of Labor and Employment</p>
      </div>
    </footer>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const container: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const sectionLabel: React.CSSProperties = { display: "inline-block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#c0151a", marginBottom: 12 };
const sectionTitle: React.CSSProperties = { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#1a1d5e", lineHeight: 1.2, marginBottom: 16 };
const sectionSub: React.CSSProperties = { color: "#5a5a7a", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 560, fontWeight: 300, margin: 0 };

// ── Root ──────────────────────────────────────────────────────────────────────

export default function PesoLanding() {
  const navigate = useNavigate();
  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 4px 20px rgba(0,0,0,0.6)); }
          50%       { filter: drop-shadow(0 0 40px rgba(255,255,255,0.55)) drop-shadow(0 4px 20px rgba(0,0,0,0.6)); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes carouselFade {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Sans 3', sans-serif; background: #fdf8f0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c0151a; border-radius: 3px; }
      `}</style>

      <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <Hero />
      <MarqueeBar />
      <Services />
      <TriviaSection />
      <FeaturedVideos />
      <Programs />
      <CTA onRegisterClick={handleRegisterClick} />
      <Footer />
    </>
  );
}