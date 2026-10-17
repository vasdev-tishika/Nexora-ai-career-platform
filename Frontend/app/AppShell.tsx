
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Atom,
  Bell,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  FileUser,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Network,
  Search,
  Sparkles,
  FolderKanban,
  Target,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    heading: "COMMAND CENTER",
    items: [
      { label: "Command Center", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    heading: "LEARNING & SKILLS",
    items: [
      { label: "Learning Universe", href: "/learning", icon: GraduationCap },
      { label: "Skill Matrix", href: "/skills", icon: Network },
      { label: "Project Lab", href: "/projects", icon: FolderKanban },
    ],
  },
  {
    heading: "CAREER INTELLIGENCE",
    items: [
      { label: "Career Explorer", href: "/careers", icon: Compass },
      { label: "Resume Studio", href: "/resume", icon: FileUser },
      { label: "Interview Arena", href: "/interview", icon: Target },
    ],
  },
  {
    heading: "AI WORKSPACE",
    items: [
      { label: "AI Mentor", href: "/mentor", icon: BrainCircuit },
    ],
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentPage =
    navigation.flatMap((group) => group.items).find(
      (item) => item.href === pathname
    )?.label ?? "Workspace";

  return (
    <div className="nexora-app">
      {mobileOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <Link
          href="/"
          className="brand"
          onClick={() => setMobileOpen(false)}
        >
          <span className="brand-mark">
            <Atom size={25} />
          </span>
          <span className="brand-copy">
            <strong>NEXORA<span>.</span></strong>
            <small>CAREER INTELLIGENCE OS</small>
          </span>
          <button
            className="sidebar-close"
            aria-label="Close menu"
            onClick={(event) => {
              event.preventDefault();
              setMobileOpen(false);
            }}
          >
            <X size={18} />
          </button>
        </Link>

        <div className="workspace-switcher">
          <span className="workspace-icon">
  <BrainCircuit size={18} color="#D5B17A" />
          </span>
          <span className="workspace-copy">
            <small>YOUR WORKSPACE</small>
            <strong>Career Command</strong>
          </span>
          <ChevronDown size={15} className="muted-icon" />
        </div>

        <div className="sidebar-section-label">YOUR UNIVERSE</div>

        <nav className="navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.heading}>
              <div className="nav-heading">{group.heading}</div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link ${active ? "nav-link-active" : ""}`}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    {active && <span className="nav-active-dot" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="level-card">
            <div className="level-card-top">
              <span className="level-symbol">
                <Zap size={17} />
              </span>
              <span className="level-info">
                <strong>Your learning journey</strong>
                <small>Every step moves you forward</small>
              </span>
            </div>
            <div className="level-progress-label">
              <span>Workspace setup</span>
              <span>In progress</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "35%" }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span>WORKSPACE</span>
              <span className="breadcrumb-divider">/</span>
              <strong>{currentPage}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your universe..."
                aria-label="Search"
              />
              <kbd>⌘ K</kbd>
            </label>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              title="Notifications"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("nexora:notifications")
                )
              }
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            <div className="topbar-divider" />

            <div className="system-status">
              <span className="status-light" />
              LOCAL WORKSPACE
            </div>
          </div>
        </header>

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div className="page-content">{children}</div>

        <footer className="app-footer">
          <span><Activity size={13} /> NEXORA WORKSPACE</span>
          <span>BUILD YOUR NEXT CHAPTER <Sparkles size={13} /></span>
        </footer>
      </main>
    </div>
  );
}
