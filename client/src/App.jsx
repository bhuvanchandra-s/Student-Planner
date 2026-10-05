import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, CalendarDays, CheckSquare, ChevronLeft, FileText,
  Home, LayoutTemplate, Menu, Plus, Search, Settings, Trash2,
  X, Clock3, BarChart3
} from "lucide-react";
import { defaultPages, initialTasks, subjects, templates } from "./data/templates";

const STORAGE = "student-planner-v1";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { pages: defaultPages, tasks: initialTasks };
}

function App() {
  const [state, setState] = useState(loadState);
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }, [state]);

  const createPage = (template = null) => {
    const newPage = template
      ? {
          id: crypto.randomUUID(),
          title: template.title,
          icon: template.icon,
          template: template.id,
          blocks: template.blocks.map(b => ({ ...b }))
        }
      : {
          id: crypto.randomUUID(),
          title: "Untitled",
          icon: "📄",
          template: "blank",
          blocks: [{ type: "text", content: "Start writing..." }]
        };

    setState(s => ({ ...s, pages: [...s.pages, newPage] }));
    setActive(`page:${newPage.id}`);
    setShowTemplates(false);
  };

  const updatePage = (id, patch) => {
    setState(s => ({
      ...s,
      pages: s.pages.map(p => p.id === id ? { ...p, ...patch } : p)
    }));
  };

  const deletePage = (id) => {
    setState(s => ({ ...s, pages: s.pages.filter(p => p.id !== id) }));
    setActive("dashboard");
  };

  const toggleTask = (id) => {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addBlock = (page) => {
    updatePage(page.id, {
      blocks: [...page.blocks, { type: "text", content: "New block..." }]
    });
  };

  const updateBlock = (page, index, patch) => {
    const blocks = page.blocks.map((b, i) => i === index ? { ...b, ...patch } : b);
    updatePage(page.id, { blocks });
  };

  const visiblePages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.pages.filter(p => !q || p.title.toLowerCase().includes(q));
  }, [state.pages, query]);

  const pageId = active.startsWith("page:") ? active.slice(5) : null;
  const activePage = pageId ? state.pages.find(p => p.id === pageId) : null;

  const navigate = (item) => {
    setActive(item);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>Student Planner</strong>
            <span>Academic workspace</span>
          </div>
          <button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)}><X size={18}/></button>
        </div>

        <div className="search-box">
          <Search size={16}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pages..." />
        </div>

        <nav>
          <NavItem icon={<Home size={18}/>} label="Dashboard" active={active === "dashboard"} onClick={() => navigate("dashboard")} />
          <NavItem icon={<FileText size={18}/>} label="My Pages" active={active === "pages"} onClick={() => navigate("pages")} />
          <NavItem icon={<BookOpen size={18}/>} label="Subjects" active={active === "subjects"} onClick={() => navigate("subjects")} />
          <NavItem icon={<CalendarDays size={18}/>} label="Calendar" active={active === "calendar"} onClick={() => navigate("calendar")} />
          <NavItem icon={<LayoutTemplate size={18}/>} label="Templates" active={active === "templates"} onClick={() => navigate("templates")} />
        </nav>

        <div className="sidebar-section">
          <div className="sidebar-label">Quick Pages</div>
          {visiblePages.slice(0, 5).map(page => (
            <button className="page-link" key={page.id} onClick={() => navigate(`page:${page.id}`)}>
              <span>{page.icon}</span>{page.title}
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <button className="new-page-btn" onClick={() => createPage()}>
            <Plus size={18}/> New Page
          </button>
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div className="breadcrumb">
            <span>Student Planner</span>
            <ChevronLeft size={14} className="crumb-arrow"/>
            <strong>{activePage?.title || labelFor(active)}</strong>
          </div>
          <button className="profile">B</button>
        </header>

        <div className="content">
          {active === "dashboard" && <Dashboard state={state} onTask={toggleTask} onNavigate={navigate} />}
          {active === "pages" && <Pages pages={visiblePages} onOpen={navigate} onNew={() => createPage()} />}
          {active === "subjects" && <Subjects />}
          {active === "calendar" && <Calendar tasks={state.tasks} />}
          {active === "templates" && <Templates onSelect={createPage} />}
          {activePage && (
            <PageEditor
              page={activePage}
              onUpdate={updatePage}
              onDelete={deletePage}
              onAddBlock={addBlock}
              onUpdateBlock={updateBlock}
            />
          )}
        </div>
      </main>

      {showTemplates && <TemplatesModal templates={templates} onSelect={createPage} onClose={() => setShowTemplates(false)} />}
    </div>
  );
}

function labelFor(active) {
  return ({
    dashboard: "Dashboard",
    pages: "My Pages",
    subjects: "Subjects",
    calendar: "Calendar",
    templates: "Templates"
  })[active] || "Page";
}

function NavItem({ icon, label, active, onClick }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function Dashboard({ state, onTask, onNavigate }) {
  const pending = state.tasks.filter(t => !t.completed).length;
  const completed = state.tasks.filter(t => t.completed).length;
  const studyProgress = 72;

  return (
    <div className="page-wrap">
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Good afternoon, Bhuv <span>👋</span></h1>
          <p className="muted">Keep your classes, notes and deadlines in one focused place.</p>
        </div>
        <button className="primary-btn" onClick={() => onNavigate("templates")}><Plus size={18}/> Use a template</button>
      </section>

      <div className="stats-grid">
        <Stat icon={<CheckSquare/>} label="Pending tasks" value={pending} />
        <Stat icon={<CalendarDays/>} label="Upcoming" value="3" />
        <Stat icon={<Clock3/>} label="Study hours" value="12h" />
        <Stat icon={<BarChart3/>} label="Progress" value={`${studyProgress}%`} />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head"><div><h2>Today's plan</h2><p className="muted">Your immediate priorities</p></div><button className="text-btn" onClick={() => onNavigate("pages")}>View pages</button></div>
          <div className="task-list">
            {state.tasks.map(task => (
              <label className={`task-row ${task.completed ? "done" : ""}`} key={task.id}>
                <input type="checkbox" checked={task.completed} onChange={() => onTask(task.id)} />
                <span className="task-main"><strong>{task.title}</strong><small>{task.subject} · {task.due}</small></span>
                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><div><h2>Subjects</h2><p className="muted">Semester overview</p></div><button className="text-btn" onClick={() => onNavigate("subjects")}>View all</button></div>
          <div className="subject-list">
            {subjects.slice(0, 4).map(s => (
              <div className="subject-row" key={s.id}>
                <span className="subject-icon">{s.icon}</span>
                <div className="subject-info"><strong>{s.short}</strong><div className="progress"><span style={{width: `${s.progress}%`}}/></div></div>
                <span>{s.progress}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel recent">
        <div className="panel-head"><div><h2>Recent pages</h2><p className="muted">Jump back into your workspace</p></div></div>
        <div className="page-cards">
          {state.pages.slice(0, 4).map(page => (
            <button className="page-card" key={page.id} onClick={() => onNavigate(`page:${page.id}`)}>
              <span className="big-icon">{page.icon}</span><strong>{page.title}</strong><small>Open page</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function Pages({ pages, onOpen, onNew }) {
  return <div className="page-wrap">
    <section className="section-title"><div><p className="eyebrow">WORKSPACE</p><h1>My Pages</h1><p className="muted">Your personal academic pages.</p></div><button className="primary-btn" onClick={onNew}><Plus size={18}/> New page</button></section>
    <div className="page-grid">{pages.map(p => <button className="large-page-card" key={p.id} onClick={() => onOpen(`page:${p.id}`)}><span>{p.icon}</span><strong>{p.title}</strong><small>{p.template === "blank" ? "Custom page" : `${p.template} template`}</small></button>)}</div>
  </div>;
}

function Templates({ onSelect }) {
  return <div className="page-wrap">
    <section className="section-title"><div><p className="eyebrow">START FASTER</p><h1>Templates</h1><p className="muted">Predefined structures for common student workflows.</p></div></section>
    <div className="template-grid">{templates.map(t => <TemplateCard key={t.id} template={t} onClick={() => onSelect(t)} />)}</div>
  </div>;
}

function TemplateCard({ template, onClick }) {
  return <button className="template-card" onClick={onClick}><span className="template-icon">{template.icon}</span><strong>{template.title}</strong><p>{template.description}</p><span className="use-template">Use template <span>→</span></span></button>;
}

function TemplatesModal({ templates, onSelect, onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-head"><div><h2>Choose a template</h2><p className="muted">Start with a useful structure.</p></div><button className="icon-btn" onClick={onClose}><X/></button></div><div className="template-grid">{templates.map(t => <TemplateCard key={t.id} template={t} onClick={() => onSelect(t)} />)}</div></div></div>;
}

function PageEditor({ page, onUpdate, onDelete, onAddBlock, onUpdateBlock }) {
  return <div className="editor-wrap">
    <div className="editor-actions"><span className="muted">{page.template === "blank" ? "Custom page" : `${page.template} template`}</span><button className="danger-btn" onClick={() => onDelete(page.id)}><Trash2 size={16}/> Delete</button></div>
    <div className="editor">
      <div className="title-row">
        <input className="page-icon-input" value={page.icon} onChange={e => onUpdate(page.id, {icon: e.target.value.slice(0,2)})} />
        <input className="page-title-input" value={page.title} onChange={e => onUpdate(page.id, {title: e.target.value})} />
      </div>
      <div className="blocks">
        {page.blocks.map((block, index) => (
          <Block key={index} block={block} onChange={patch => onUpdateBlock(page, index, patch)} />
        ))}
        <button className="add-block" onClick={() => onAddBlock(page)}><Plus size={16}/> Add block</button>
      </div>
    </div>
  </div>;
}

function Block({ block, onChange }) {
  if (block.type === "heading") return <input className="block-heading" value={block.content} onChange={e => onChange({content: e.target.value})} />;
  if (block.type === "checkbox") return <label className="editor-check"><input type="checkbox" checked={!!block.completed} onChange={e => onChange({completed: e.target.checked})}/><input value={block.content} onChange={e => onChange({content: e.target.value})}/></label>;
  if (block.type === "bullet") return <div className="editor-bullet"><span>•</span><input value={block.content} onChange={e => onChange({content: e.target.value})}/></div>;
  return <textarea className="block-text" value={block.content} onChange={e => onChange({content: e.target.value})} rows={Math.max(1, Math.ceil(block.content.length / 90))} />;
}

function Subjects() {
  return <div className="page-wrap"><section className="section-title"><div><p className="eyebrow">ACADEMICS</p><h1>Subjects</h1><p className="muted">Your current academic subjects.</p></div></section><div className="subject-grid">{subjects.map(s => <div className="subject-card" key={s.id}><span>{s.icon}</span><h3>{s.name}</h3><p>{s.short}</p><div className="progress"><span style={{width: `${s.progress}%`}}/></div><strong>{s.progress}% complete</strong></div>)}</div></div>;
}

function Calendar({ tasks }) {
  return <div className="page-wrap"><section className="section-title"><div><p className="eyebrow">SCHEDULE</p><h1>Calendar</h1><p className="muted">A simple academic deadline view for the MVP.</p></div></section><div className="calendar-list">{tasks.map(t => <div className="calendar-item" key={t.id}><div className="calendar-date"><strong>{t.due}</strong><span>{t.subject}</span></div><div><h3>{t.title}</h3><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority} priority</span></div></div>)}</div></div>;
}

export default App;
