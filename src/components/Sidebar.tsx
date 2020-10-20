import "./Sidebar.css";

export function Sidebar({ children = null }) {
  return (
    <div className="sidebar">
      {children}
    </div>
  );
}

export function SidebarSection({ children = null }) {
  return (
    <section className="sidebar-section">
      {children}
    </section>
  );
}

export function SidebarTabs({ children = null }) {
  return (
    <nav className="sidebar-tabs">
      {children}
    </nav>
  );
}

export function SidebarTab({ children = null }) {
  return (
    <a href="#" className="sidebar-tab">
      <button className="sidebar-tab-button">
        {children}
      </button>
    </a>
  );
}

export function SidebarDivider() {
  return (
    <hr className="sidebar-divider" />
  );
}

export function SidebarSectionHeader({ children = null }) {
  return (
    <header className="sidebar-section-header">
      {children}
    </header>
  );
}
