import { useEffect, useMemo, useState } from "react";

import {

  Activity,

  ArrowLeft,

  BarChart3,

  CalendarDays,

  Check,

  CheckCircle2,

  ChevronRight,

  FileText,
  FilePlus2,
  NotebookPen,
  Maximize2,
  Code2,

  Flame,

  Home as HomeIcon,

  LayoutTemplate,

  Menu,

  Plus,

  Search,

  Settings,

  Target,

  Trash2,

  X,

} from "lucide-react";

import "./styles.css";

const STORAGE_KEY = "student-planner-state";

const PAGE_TYPES = {

  blank: {

    label: "Blank Page",

    icon: "📄",

  },

  notes: {

    label: "Notes",

    icon: "📝",

  },

  tasks: {

    label: "To-Do List",

    icon: "✅",

  },

  subject: {

    label: "Subject",

    icon: "📚",

  },

  project: {

    label: "Project",

    icon: "🚀",

  },

};

const SUBJECTS = [

  {

    id: "dsa",

    name: "Data Structures & Algorithms",

    short: "DSA",

    icon: "💻",

  },

  {

    id: "dbms",

    name: "Database Management Systems",

    short: "DBMS",

    icon: "🗄️",

  },

  {

    id: "os",

    name: "Operating Systems",

    short: "OS",

    icon: "⚙️",

  },

  {

    id: "cn",

    name: "Computer Networks",

    short: "CN",

    icon: "🌐",

  },

];

const TEMPLATES = [

  {

    id: "blank",

    type: "blank",

    icon: "📄",

    title: "Blank Page",

    description: "Start with an empty workspace.",

    blocks: [],

  },

  {

    id: "notes",

    type: "notes",

    icon: "📝",

    title: "Lecture Notes",

    description: "Organize notes for a subject.",

    blocks: [

      {

        type: "heading",

        content: "Key Concepts",

      },

      {

        type: "text",

        content: "Start writing your notes...",

      },

    ],

  },

  {

    id: "tasks",

    type: "tasks",

    icon: "✅",

    title: "To-Do List",

    description: "Create tasks and track completion.",

    blocks: [

      {

        type: "heading",

        content: "Tasks",

      },

    ],

  },

  {

    id: "subject",

    type: "subject",

    icon: "📚",

    title: "Subject",

    description: "Track a subject and its topics.",

    blocks: [

      {

        type: "heading",

        content: "Topics",

      },

      {

        type: "checkbox",

        content: "Topic 1",

        completed: false,

      },

      {

        type: "checkbox",

        content: "Topic 2",

        completed: false,

      },

      {

        type: "text",

        content: "Subject notes...",

      },

    ],

  },

  {

    id: "project",

    type: "project",

    icon: "🚀",

    title: "Project",

    description: "Plan and manage a project.",

    blocks: [

      {

        type: "heading",

        content: "Project Overview",

      },

      {

        type: "text",

        content: "Describe your project...",

      },

      {

        type: "heading",

        content: "Tasks",

      },

    ],

  },

];

/* =========================================================

   UTILITIES

\========================================================= */

function createId(prefix = "id") {

  if (

    typeof crypto !== "undefined" &&

    crypto.randomUUID

  ) {

    return `${prefix}-${crypto.randomUUID()}`;

  }

  return `${prefix}-${Date.now()}-${Math.random()

    .toString(36)

    .slice(2)}`;

}

function getToday() {

  return new Date().toISOString().slice(0, 10);

}

function getDateOffset(days) {

  const date = new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);

}

function formatDate(date) {

  if (!date) return "";

  return new Date(

    `${date}T00:00:00`

  ).toLocaleDateString(undefined, {

    month: "short",

    day: "numeric",

  });

}

function clone(value) {

  return JSON.parse(JSON.stringify(value));

}

/* =========================================================

   INITIAL DATA

\========================================================= */

function createInitialState() {

  return {

    version: 1,

    user: {

      id: "local-user",

      name: "Bhuvana",

      avatar: "B",

    },

    pages: [

      {

        id: "welcome-page",

        title: "My Student Workspace",

        icon: "🎓",

        type: "blank",

        subjectId: null,

        blocks: [

          {

            id: "welcome-1",

            type: "heading",

            content: "Welcome to Student Planner",

          },

          {

            id: "welcome-2",

            type: "text",

            content:

              "Create pages, schedule tasks and track your academic progress.",

          },

        ],

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

      },

      {

        id: "dsa-page",

        title: "Data Structures & Algorithms",

        icon: "💻",

        type: "subject",

        subjectId: "dsa",

        blocks: [

          {

            id: "dsa-1",

            type: "heading",

            content: "Topics",

          },

          {

            id: "dsa-2",

            type: "checkbox",

            content: "Arrays",

            completed: true,

          },

          {

            id: "dsa-3",

            type: "checkbox",

            content: "Linked Lists",

            completed: true,

          },

          {

            id: "dsa-4",

            type: "checkbox",

            content: "Stacks & Queues",

            completed: false,

          },

          {

            id: "dsa-5",

            type: "checkbox",

            content: "Trees",

            completed: false,

          },

        ],

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

      },

    ],

    tasks: [

      {

        id: "task-1",

        title: "Practice DSA problems",

        pageId: "dsa-page",

        subjectId: "dsa",

        dueDate: getToday(),

        completed: false,

        completedAt: null,

        priority: "high",

        calendarEventId: null,

        createdAt: new Date().toISOString(),

      },

      {

        id: "task-2",

        title: "Finish DBMS assignment",

        pageId: null,

        subjectId: "dbms",

        dueDate: getDateOffset(1),

        completed: false,

        completedAt: null,

        priority: "high",

        calendarEventId: null,

        createdAt: new Date().toISOString(),

      },

    ],

    calendarEvents: [],

    activities: [],

    problems: [],

  };

}

function loadState() {

  try {

    const saved =

      localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      return createInitialState();

    }

    const parsed = JSON.parse(saved);

    return {

      ...createInitialState(),

      ...parsed,

    };

  } catch {

    return createInitialState();

  }

}

/* =========================================================

   ACTIVITY ENGINE

\========================================================= */

function createActivity(

  type,

  referenceId = null,

  metadata = {}

) {

  return {

    id: createId("activity"),

    type,

    referenceId,

    metadata,

    date: getToday(),

    createdAt: new Date().toISOString(),

  };

}

function buildActivityMap(activities) {

  const result = {};

  for (const activity of activities) {

    result[activity.date] =

      (result[activity.date] || 0) + 1;

  }

  return result;

}

/* =========================================================

   APP

\========================================================= */

export default function App() {

  const [state, setState] =

    useState(loadState);

  const [activePage, setActivePage] =

    useState("home");

  const [search, setSearch] =

    useState("");

  const [mobileOpen, setMobileOpen] =

    useState(false);

  const [pageCreateOpen, setPageCreateOpen] = useState(false);
  const [newPageTemplate, setNewPageTemplate] = useState("blank");
  const [newPageTitle, setNewPageTitle] = useState("Untitled Canvas");
  const [newPageDescription, setNewPageDescription] = useState("");

  function openPageCreator() {
    setNewPageTemplate("blank");
    setNewPageTitle("Untitled Canvas");
    setNewPageDescription("");
    setPageCreateOpen(true);
  }

  /* Save application state */

  useEffect(() => {

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(state)

    );

  }, [state]);

  /* =======================================================

     NAVIGATION

  ======================================================= */

  function navigate(page) {

    setActivePage(page);

    setMobileOpen(false);

  }

  /* =======================================================

     PAGE MANAGEMENT

  ======================================================= */

  function createPage(template = null, custom = {}) {

    const source =

      template ||

      TEMPLATES[0];

    const page = {

      id: createId("page"),

      title:
        custom.title?.trim() ||
        template?.title ||
        (source.type === "blank" ? "Untitled Canvas" : source.title) ||
        "Untitled Page",

      description: custom.description?.trim() || template?.description || "",

      icon:

        source.icon ||

        "📄",

      type:

        source.type ||

        "blank",

      subjectId: null,

      blocks: clone(

        source.blocks || []

      ).map(block => ({

        ...block,

        id: createId("block"),

      })),

      createdAt:

        new Date().toISOString(),

      updatedAt:

        new Date().toISOString(),

    };

    setState(current => ({

      ...current,

      pages: [

        ...current.pages,

        page,

      ],

      activities: [

        ...current.activities,

        createActivity(

          "page_created",

          page.id,

          {

            pageType: page.type,

          }

        ),

      ],

    }));

    navigate(`page:${page.id}`);

  }

  function updatePage(pageId, changes) {

    setState(current => ({

      ...current,

      pages: current.pages.map(

        page =>

          page.id === pageId

            ? {

                ...page,

                ...changes,

                updatedAt:

                  new Date().toISOString(),

              }

            : page

      ),

    }));

  }

  function deletePage(pageId) {

    setState(current => ({

      ...current,

      pages: current.pages.filter(

        page =>

          page.id !== pageId

      ),

      tasks: current.tasks.map(

        task =>

          task.pageId === pageId

            ? {

                ...task,

                pageId: null,

              }

            : task

      ),

    }));

    navigate("pages");

  }

  /* =======================================================

     TASK MANAGEMENT

  ======================================================= */

  function createTask({

    title,

    pageId = null,

    subjectId = null,

    dueDate = null,

    priority = "medium",

  }) {

    if (!title.trim()) {

      return;

    }

    const task = {

      id: createId("task"),

      title: title.trim(),

      pageId,

      subjectId,

      dueDate,

      priority,

      completed: false,

      completedAt: null,

      calendarEventId: null,

      createdAt:

        new Date().toISOString(),

    };

    setState(current => ({

      ...current,

      tasks: [

        ...current.tasks,

        task,

      ],

      activities: [

        ...current.activities,

        createActivity(

          "task_created",

          task.id,

          {

            pageId,

            subjectId,

          }

        ),

      ],

    }));

  }

  function toggleTask(taskId) {

    setState(current => {

      const task =

        current.tasks.find(

          item =>

            item.id === taskId

        );

      if (!task) {

        return current;

      }

      const completed =

        !task.completed;

      const updatedTasks =

        current.tasks.map(item =>

          item.id === taskId

            ? {

                ...item,

                completed,

                completedAt:

                  completed

                    ? new Date().toISOString()

                    : null,

              }

            : item

        );

      let activities =

        current.activities;

      if (completed) {

        activities = [

          ...activities,

          createActivity(

            "task_completed",

            task.id,

            {

              subjectId:

                task.subjectId,

              pageId:

                task.pageId,

            }

          ),

        ];

      }

      return {

        ...current,

        tasks: updatedTasks,

        activities,

      };

    });

  }

  function deleteTask(taskId) {

    setState(current => ({

      ...current,

      tasks:

        current.tasks.filter(

          task =>

            task.id !== taskId

        ),

      calendarEvents:

        current.calendarEvents.filter(

          event =>

            event.taskId !== taskId

        ),

    }));

  }

  /* =======================================================

     CALENDAR

  ======================================================= */

  function scheduleTask(

    taskId,

    date,

    startTime = "09:00",

    endTime = "10:00"

  ) {

    setState(current => {

      const task =

        current.tasks.find(

          item =>

            item.id === taskId

        );

      if (!task) {

        return current;

      }

      const existing =

        current.calendarEvents.find(

          event =>

            event.taskId === taskId

        );

      const event =

        existing

          ? {

              ...existing,

              date,

              startTime,

              endTime,

            }

          : {

              id: createId("event"),

              taskId,

              pageId:

                task.pageId,

              date,

              startTime,

              endTime,

              createdAt:

                new Date().toISOString(),

            };

      return {

        ...current,

        tasks:

          current.tasks.map(

            item =>

              item.id === taskId

                ? {

                    ...item,

                    dueDate:

                      date,

                    calendarEventId:

                      event.id,

                  }

                : item

          ),

        calendarEvents:

          existing

            ? current.calendarEvents.map(

                item =>

                  item.id === event.id

                    ? event

                    : item

              )

            : [

                ...current.calendarEvents,

                event,

              ],

        activities: [

          ...current.activities,

          createActivity(

            "task_scheduled",

            task.id,

            {

              date,

            }

          ),

        ],

      };

    });

  }

  /* =======================================================

     DERIVED DATA

  ======================================================= */

  const activityMap =

    useMemo(

      () =>

        buildActivityMap(

          state.activities

        ),

      [state.activities]

    );

  const performance =

    useMemo(() => {

      const completed =

        state.tasks.filter(

          task =>

            task.completed

        ).length;

      const scheduled =

        state.tasks.filter(

          task =>

            task.calendarEventId

        ).length;

      const completionRate =

        state.tasks.length === 0

          ? 0

          : Math.round(

              (completed /

                state.tasks.length) *

                100

            );

      const subjectProgress =

        SUBJECTS.map(subject => {

          const tasks =

            state.tasks.filter(

              task =>

                task.subjectId ===

                subject.id

            );

          const completedTasks =

            tasks.filter(

              task =>

                task.completed

            ).length;

          return {

            ...subject,

            total:

              tasks.length,

            completed:

              completedTasks,

            progress:

              tasks.length === 0

                ? 0

                : Math.round(

                    (completedTasks /

                      tasks.length) *

                      100

                  ),

          };

        });

      return {

        pages:

          state.pages.length,

        tasks:

          state.tasks.length,

        completed,

        scheduled,

        completionRate,

        activities:

          state.activities.length,

        subjectProgress,

      };

    }, [

      state.pages,

      state.tasks,

      state.activities,

    ]);

  /* =======================================================

     CURRENT PAGE

  ======================================================= */

  const editorPage =

    activePage.startsWith("page:")

      ? state.pages.find(

          page =>

            page.id ===

            activePage.slice(5)

        )

      : null;

  return (

    <div className="app">

      <Sidebar

        activePage={activePage}

        navigate={navigate}

        pages={state.pages}

        search={search}

        setSearch={setSearch}

        mobileOpen={mobileOpen}

        setMobileOpen={setMobileOpen}

      />

      <main className="main">

        <header className="topbar">

          <button

            className="mobile-menu"

            onClick={() =>

              setMobileOpen(true)

            }

          >

            <Menu size={20} />

          </button>

          <div className="top-search">

            <Search size={17} />

            <input

              value={search}

              onChange={event =>

                setSearch(

                  event.target.value

                )

              }

              placeholder="Search your workspace..."

            />

          </div>

          <div className="top-actions">

            <button className="icon-btn">

              <Settings size={18} />

            </button>

            <div className="avatar">

              {state.user.avatar}

            </div>

          </div>

        </header>

        <div className="content">

          {activePage === "home" && (

            <Home

              state={state}

              performance={performance}

              activityMap={activityMap}

              navigate={navigate}

              createPage={createPage}

              createTask={createTask}

              toggleTask={toggleTask}

            />

          )}

          {activePage === "pages" && (

            <Pages

              pages={state.pages}

              navigate={navigate}

              createPage={createPage}

              search={search}

            />

          )}

          {activePage === "tasks" && (

            <Tasks

              state={state}

              createTask={createTask}

              toggleTask={toggleTask}

              deleteTask={deleteTask}

              scheduleTask={scheduleTask}

            />

          )}

          {activePage === "calendar" && (

            <Calendar

              state={state}

              toggleTask={toggleTask}

            />

          )}

          {activePage === "progress" && (

            <Progress

              state={state}

              performance={performance}

              activityMap={activityMap}

            />

          )}

          {activePage === "templates" && (

            <Templates

              createPage={createPage}

            />

          )}

          {editorPage && (

            <PageEditor

              page={editorPage}

              state={state}

              updatePage={updatePage}

              deletePage={deletePage}

              navigate={navigate}

            />

          )}

        </div>

      </main>

      {pageCreateOpen && (
        <div
          className="page-create-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setPageCreateOpen(false);
          }}
        >
          <section
            className="page-create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="page-create-title"
          >
            <div className="page-create-modal-top">
              <div className="page-create-kicker">YOUR WORKSPACE</div>
              <button className="page-create-close" type="button" onClick={() => setPageCreateOpen(false)} aria-label="Close new page dialog">
                <X size={18} />
              </button>
            </div>
            <h2 id="page-create-title">Create a new page</h2>
            <p className="page-create-intro">A space for your notes, plans, classes, and coding progress.</p>

            <label className="page-create-field-label" htmlFor="new-page-title">Page title</label>
            <input
              id="new-page-title"
              className="page-create-title-input"
              value={newPageTitle}
              onChange={event => setNewPageTitle(event.target.value)}
              placeholder="Give your page a name"
              autoFocus
              onKeyDown={event => {
                if (event.key === "Escape") setPageCreateOpen(false);
                if (event.key === "Enter") {
                  const chosen = TEMPLATES.find(item => item.id === newPageTemplate) || TEMPLATES[0];
                  createPage(chosen, { title: newPageTitle, description: newPageDescription });
                  setPageCreateOpen(false);
                }
              }}
            />

            <label className="page-create-field-label" htmlFor="new-page-description">Description <span>Optional</span></label>
            <textarea
              id="new-page-description"
              className="page-create-description-input"
              value={newPageDescription}
              onChange={event => setNewPageDescription(event.target.value)}
              placeholder="What will you use this page for?"
              rows={2}
            />

            <div className="page-create-field-label template-label">Choose a starting point</div>
            <div className="page-template-options">
              {[
                { id: "blank", icon: "📄", title: "Blank canvas", description: "Build your own page" },
                { id: "notes", icon: "📝", title: "Notes", description: "Capture ideas and concepts" },
                { id: "tasks", icon: "☑️", title: "To-do list", description: "Organise tasks and check them off" },
                { id: "subject", icon: "📚", title: "Subject", description: "Keep study material together" },
                { id: "project", icon: "🚀", title: "Project / coding log", description: "Track work and practice" },
              ].map(option => (
                <button
                  type="button"
                  key={option.id}
                  className={`page-template-option ${newPageTemplate === option.id ? "selected" : ""}`}
                  onClick={() => {
                    setNewPageTemplate(option.id);
                    if (!newPageTitle.trim() || newPageTitle === "Untitled Canvas" || TEMPLATES.some(item => item.title === newPageTitle)) {
                      setNewPageTitle(option.id === "blank" ? "Untitled Canvas" : option.title === "Project / coding log" ? "Coding Log" : option.title);
                    }
                  }}
                >
                  <span className="page-template-option-icon">{option.icon}</span>
                  <span className="page-template-option-copy"><strong>{option.title}</strong><small>{option.description}</small></span>
                  <span className="page-template-radio">{newPageTemplate === option.id ? "✓" : ""}</span>
                </button>
              ))}
            </div>

            <div className="page-create-modal-footer">
              <span>Keep it simple. Add more blocks inside the page.</span>
              <div>
                <button type="button" className="page-create-cancel" onClick={() => setPageCreateOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="page-create-submit"
                  onClick={() => {
                    const chosen = TEMPLATES.find(item => item.id === newPageTemplate) || TEMPLATES[0];
                    createPage(chosen, { title: newPageTitle, description: newPageDescription });
                    setPageCreateOpen(false);
                  }}
                  disabled={!newPageTitle.trim()}
                >
                  <Plus size={16} /> Create page
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

    </div>

  );

}

/* =========================================================

   SIDEBAR

\========================================================= */

function Sidebar({

  activePage,

  navigate,

  pages,

  search,

  setSearch,

  mobileOpen,

  setMobileOpen,

}) {

  const filteredPages =

    pages.filter(page =>

      page.title

        .toLowerCase()

        .includes(

          search.toLowerCase()

        )

    );

  return (

    <aside

      className={`sidebar ${

        mobileOpen

          ? "sidebar-open"

          : ""

      }`}

    >

      <div className="brand">

        <div className="brand-mark">

          SP

        </div>

        <div>

          <strong>

            Student Planner

          </strong>

          <small>

            Academic workspace

          </small>

        </div>

      </div>

      <div className="sidebar-search">

        <Search size={15} />

        <input

          value={search}

          onChange={event =>

            setSearch(

              event.target.value

            )

          }

          placeholder="Search"

        />

      </div>

      <nav>

        <SidebarItem

          icon={

            <HomeIcon size={17} />

          }

          label="Home"

          active={

            activePage === "home"

          }

          onClick={() =>

            navigate("home")

          }

        />

        <SidebarItem

          icon={

            <FileText size={17} />

          }

          label="My Pages"

          active={

            activePage === "pages"

          }

          onClick={() =>

            navigate("pages")

          }

        />

        <SidebarItem

          icon={

            <CheckCircle2 size={17} />

          }

          label="Tasks"

          active={

            activePage === "tasks"

          }

          onClick={() =>

            navigate("tasks")

          }

        />

        <SidebarItem

          icon={

            <CalendarDays size={17} />

          }

          label="Calendar"

          active={

            activePage ===

            "calendar"

          }

          onClick={() =>

            navigate("calendar")

          }

        />

        <SidebarItem

          icon={

            <Activity size={17} />

          }

          label="Progress"

          active={

            activePage ===

            "progress"

          }

          onClick={() =>

            navigate("progress")

          }

        />

        <SidebarItem

          icon={

            <LayoutTemplate

              size={17}

            />

          }

          label="Templates"

          active={

            activePage ===

            "templates"

          }

          onClick={() =>

            navigate("templates")

          }

        />

      </nav>

      <div className="sidebar-section">

        <div className="sidebar-section-title">

          Your Pages

        </div>

        {filteredPages

          .slice(0, 6)

          .map(page => (

            <button

              key={page.id}

              className="page-nav-item"

              onClick={() =>

                navigate(

                  `page:${page.id}`

                )

              }

            >

              <span>

                {page.icon}

              </span>

              <span>

                {page.title}

              </span>

            </button>

          ))}

      </div>

      <div className="sidebar-bottom">

        <SidebarItem

          icon={

            <Settings size={17} />

          }

          label="Settings"

          onClick={() => {}}

        />

        <div className="profile-mini">

          <div className="avatar">

            B

          </div>

          <div>

            <strong>

              Bhuvana

            </strong>

            <small>

              Student

            </small>

          </div>

        </div>

      </div>

      {mobileOpen && (

        <button

          className="sidebar-close"

          onClick={() =>

            setMobileOpen(false)

          }

        >

          <X size={20} />

        </button>

      )}

    </aside>

  );

}

function SidebarItem({

  icon,

  label,

  active,

  onClick,

}) {

  return (

    <button

      className={`sidebar-item ${

        active

          ? "active"

          : ""

      }`}

      onClick={onClick}

    >

      {icon}

      <span>

        {label}

      </span>

    </button>

  );

}

/* =========================================================

   HOME

\========================================================= */

function Home({

  state,

  performance,

  activityMap,

  navigate,

  createPage,

  openPageCreator,

  createTask,

  toggleTask,

}) {

  const [newTask, setNewTask] =
    useState("");

  const [createMenuOpen, setCreateMenuOpen] =
    useState(false);
  const [quickTaskOpen, setQuickTaskOpen] =
    useState(false);

  const todayTasks =

    state.tasks.filter(

      task =>

        task.dueDate ===

        getToday()

    );

  function addTask() {

    if (!newTask.trim()) {

      return;

    }

    createTask({

      title: newTask,

      dueDate: getToday(),

    });

    setNewTask("");

  }

  return (

    <div>

      <div className="page-heading">

        <div>

          <span className="eyebrow">

            YOUR WORKSPACE

          </span>

          <h1>

            Good to see you, Bhuvana.

          </h1>

          <p>

            What you create, schedule and

            complete becomes part of your

            academic progress.

          </p>

        </div>


      </div>

      <div className="stats-grid">

        <StatCard

          icon={

            <FileText size={18} />

          }

          label="Pages"

          value={

            performance.pages

          }

        />

        <StatCard

          icon={

            <CheckCircle2

              size={18}

            />

          }

          label="Completed"

          value={

            performance.completed

          }

        />

        <StatCard

          icon={

            <CalendarDays

              size={18}

            />

          }

          label="Scheduled"

          value={

            performance.scheduled

          }

        />

        <StatCard

          icon={

            <Flame size={18} />

          }

          label="Completion"

          value={`${performance.completionRate}%`}

        />

      </div>

      <div className="dashboard-grid">

        <div className="panel large">

          <div className="panel-header">

            <div>

              <h2>

                Activity

              </h2>

              <span>

                Your workspace activity

              </span>

            </div>

            <button

              className="text-btn"

              onClick={() =>

                navigate("progress")

              }

            >

              View progress

              <ChevronRight

                size={15}

              />

            </button>

          </div>

          <ActivityGraph

            activityMap={

              activityMap

            }

          />

        </div>

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>

                Today's Tasks

              </h2>

              <span>

                {todayTasks.length} tasks

              </span>

            </div>

          </div>

          <div className="task-list">

            {todayTasks.length ===

              0 && (

              <EmptyState

                text="No tasks for today."

              />

            )}

            {todayTasks.map(

              task => (

                <TaskRow

                  key={task.id}

                  task={task}

                  onToggle={() =>

                    toggleTask(

                      task.id

                    )

                  }

                />

              )

            )}

          </div>


        </div>

      </div>

      <div className={`quick-task-widget ${createMenuOpen || quickTaskOpen ? "is-open" : ""}`}>
        {createMenuOpen && !quickTaskOpen && (
          <div className="create-menu">
            <div className="create-menu-heading">
              <div>
                <strong>Create something</strong>
                <span>What are we working on?</span>
              </div>
              <button type="button" className="quick-task-close" onClick={() => setCreateMenuOpen(false)} aria-label="Close create menu">
                <X size={17} />
              </button>
            </div>
            <button type="button" className="create-menu-item" onClick={() => { setCreateMenuOpen(false); openPageCreator(); }}>
              <span className="create-menu-icon"><FilePlus2 size={19} /></span>
              <span><strong>New page</strong><small>A flexible page with content blocks</small></span>
            </button>
            <button type="button" className="create-menu-item" onClick={() => { setCreateMenuOpen(false); openPageCreator(); }}>
              <span className="create-menu-icon tilted-page-icon"><Maximize2 size={19} /></span>
              <span><strong>Full-page editor</strong><small>Open a spacious, distraction-free canvas</small></span>
            </button>
            <button type="button" className="create-menu-item" onClick={() => { setCreateMenuOpen(false); setQuickTaskOpen(true); }}>
              <span className="create-menu-icon"><CheckCircle2 size={19} /></span>
              <span><strong>New task</strong><small>Add it to your daily workflow</small></span>
            </button>
            <button type="button" className="create-menu-item" onClick={() => { setCreateMenuOpen(false); createPage(TEMPLATES.find(template => template.id === "notes")); }}>
              <span className="create-menu-icon"><NotebookPen size={19} /></span>
              <span><strong>Quick note</strong><small>Capture an idea or lecture notes</small></span>
            </button>
            <button type="button" className="create-menu-item" onClick={() => { setCreateMenuOpen(false); createPage(TEMPLATES.find(template => template.id === "project")); }}>
              <span className="create-menu-icon"><Code2 size={19} /></span>
              <span><strong>Code / practice log</strong><small>Keep coding notes and problem progress</small></span>
            </button>
          </div>
        )}

        {quickTaskOpen && (
          <div className="task-quick-add">
            <div className="quick-task-heading">
              <div><strong>New task</strong><span>Keep it small. Get it done.</span></div>
              <button type="button" className="quick-task-close" onClick={() => setQuickTaskOpen(false)} aria-label="Close task composer"><X size={17} /></button>
            </div>
            <div className="quick-task-form">
              <input
                autoFocus
                value={newTask}
                onChange={event => setNewTask(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter") { addTask(); setQuickTaskOpen(false); }
                  if (event.key === "Escape") setQuickTaskOpen(false);
                }}
                placeholder="What do you need to do?"
                aria-label="New task"
              />
              <button type="button" onClick={() => { addTask(); setQuickTaskOpen(false); }} aria-label="Add task" title="Add task"><Plus size={17} /></button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="quick-task-fab"
          onClick={() => {
            if (quickTaskOpen) { setQuickTaskOpen(false); setCreateMenuOpen(false); }
            else setCreateMenuOpen(open => !open);
          }}
          aria-label={createMenuOpen || quickTaskOpen ? "Close create menu" : "Create something"}
          title="Create something"
        >
          {createMenuOpen || quickTaskOpen ? <X size={22} /> : <Plus size={23} />}
        </button>
      </div>

      <div className="panel">

        <div className="panel-header">

          <div>

            <h2>

              My Pages

            </h2>

            <span>

              Your workspaces

            </span>

          </div>

          <button

            className="text-btn"

            onClick={() =>

              navigate("pages")

            }

          >

            View all

            <ChevronRight

              size={15}

            />

          </button>

        </div>

        <div className="page-grid">

          {state.pages.map(

            page => (

              <button

                key={page.id}

                className="workspace-card"

                onClick={() =>

                  navigate(

                    `page:${page.id}`

                  )

                }

              >

                <span className="workspace-icon">

                  {page.icon}

                </span>

                <strong>

                  {page.title}

                </strong>

                <small>

                  {

                    PAGE_TYPES[

                      page.type

                    ]?.label

                  }

                </small>

              </button>

            )

          )}

        </div>

      </div>

    </div>

  );

}

/* =========================================================

   PAGES

\========================================================= */

function Pages({

  pages,

  navigate,

  createPage,

  openPageCreator,

  search,

}) {

  const filtered =

    pages.filter(page =>

      page.title

        .toLowerCase()

        .includes(

          search.toLowerCase()

        )

    );

  return (

    <div>

      <div className="page-heading">

        <div>

          <span className="eyebrow">

            WORKSPACE

          </span>

          <h1>

            My Pages

          </h1>

          <p>

            Notes, subjects, projects,

            tasks and everything else

            you create.

          </p>

        </div>

        <button

          className="primary-btn"

          onClick={openPageCreator}

        >

          <Plus size={17} />

          New Page

        </button>

      </div>

      <div className="page-grid">

        {filtered.map(page => (

          <button

            key={page.id}

            className="workspace-card"

            onClick={() =>

              navigate(

                `page:${page.id}`

              )

            }

          >

            <span className="workspace-icon">

              {page.icon}

            </span>

            <strong>

              {page.title}

            </strong>

            <small>

              {

                PAGE_TYPES[

                  page.type

                ]?.label

              }

            </small>

          </button>

        ))}

      </div>

    </div>

  );

}

/* =========================================================

   TASKS

\========================================================= */

function Tasks({

  state,

  createTask,

  toggleTask,

  deleteTask,

  scheduleTask,

}) {

  const [title, setTitle] =

    useState("");

  const [date, setDate] =

    useState(getToday());

  function addTask() {

    if (!title.trim()) {

      return;

    }

    createTask({

      title,

      dueDate: date,

    });

    setTitle("");

  }

  return (

    <div>

      <div className="page-heading">

        <div>

          <span className="eyebrow">

            WORK

          </span>

          <h1>

            Tasks

          </h1>

          <p>

            Your tasks connect your pages,

            calendar and activity history.

          </p>

        </div>

      </div>

      <div className="panel task-create-panel">

        <input

          value={title}

          onChange={event =>

            setTitle(

              event.target.value

            )

          }

          onKeyDown={event => {

            if (

              event.key ===

              "Enter"

            ) {

              addTask();

            }

          }}

          placeholder="What needs to be done?"

        />

        <input

          type="date"

          value={date}

          onChange={event =>

            setDate(

              event.target.value

            )

          }

        />

        <button

          className="primary-btn"

          onClick={addTask}

        >

          <Plus size={17} />

          Add Task

        </button>

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>

            <h2>

              All Tasks

            </h2>

            <span>

              {state.tasks.length} total

            </span>

          </div>

        </div>

        <div className="task-list">

          {state.tasks.map(

            task => (

              <TaskRow

                key={task.id}

                task={task}

                onToggle={() =>

                  toggleTask(

                    task.id

                  )

                }

                onDelete={() =>

                  deleteTask(

                    task.id

                  )

                }

                onSchedule={date =>

                  scheduleTask(

                    task.id,

                    date

                  )

                }

              />

            )

          )}

        </div>

      </div>

    </div>

  );

}

function TaskRow({

  task,

  onToggle,

  onDelete,

  onSchedule,

}) {

  const subject =

    SUBJECTS.find(

      item =>

        item.id ===

        task.subjectId

    );

  return (

    <div

      className={`task-row ${

        task.completed

          ? "completed"

          : ""

      }`}

    >

      <button

        className={`task-check ${

          task.completed

            ? "checked"

            : ""

        }`}

        onClick={onToggle}

      >

        {task.completed && (

          <Check size={14} />

        )}

      </button>

      <div className="task-main">

        <strong>

          {task.title}

        </strong>

        <div className="task-meta">

          {subject && (

            <span>

              {subject.icon}{" "}

              {subject.short}

            </span>

          )}

          {task.dueDate && (

            <span>

              <CalendarDays

                size={13}

              />

              {formatDate(

                task.dueDate

              )}

            </span>

          )}

          {task.calendarEventId && (

            <span className="scheduled">

              Scheduled

            </span>

          )}

        </div>

      </div>

      {onSchedule && (

        <input

          type="date"

          value={

            task.dueDate || ""

          }

          onChange={event =>

            onSchedule(

              event.target.value

            )

          }

        />

      )}

      {onDelete && (

        <button

          className="icon-btn danger"

          onClick={onDelete}

        >

          <Trash2 size={16} />

        </button>

      )}

    </div>

  );

}

/* =========================================================

   CALENDAR

\========================================================= */

function Calendar({

  state,

  toggleTask,

}) {

  const days = Array.from(

    { length: 7 },

    (_, index) =>

      getDateOffset(index)

  );

  return (

    <div>

      <div className="page-heading">

        <div>

          <span className="eyebrow">

            SCHEDULE

          </span>

          <h1>

            Calendar

          </h1>

          <p>

            Tasks scheduled for a date

            appear here.

          </p>

        </div>

      </div>

      <div className="calendar-grid">

        {days.map(date => {

          const events =

            state.calendarEvents.filter(

              event =>

                event.date ===

                date

            );

          const unscheduledTasks =

            state.tasks.filter(

              task =>

                task.dueDate ===

                  date &&

                !task.calendarEventId

            );

          return (

            <div

              key={date}

              className={`calendar-day ${

                date === getToday()

                  ? "today"

                  : ""

              }`}

            >

              <div className="calendar-day-header">

                <strong>

                  {new Date(

                    `${date}T00:00:00`

                  ).toLocaleDateString(

                    undefined,

                    {

                      weekday:

                        "short",

                    }

                  )}

                </strong>

                <span>

                  {new Date(

                    `${date}T00:00:00`

                  ).getDate()}

                </span>

              </div>

              <div className="calendar-events">

                {events.map(

                  event => {

                    const task =

                      state.tasks.find(

                        item =>

                          item.id ===

                          event.taskId

                      );

                    if (!task) {

                      return null;

                    }

                    return (

                      <button

                        key={

                          event.id

                        }

                        className={`calendar-event ${

                          task.completed

                            ? "completed"

                            : ""

                        }`}

                        onClick={() =>

                          toggleTask(

                            task.id

                          )

                        }

                      >

                        <small>

                          {

                            event.startTime

                          }

                        </small>

                        <strong>

                          {

                            task.title

                          }

                        </strong>

                      </button>

                    );

                  }

                )}

                {unscheduledTasks.map(

                  task => (

                    <div

                      key={task.id}

                      className="calendar-event unscheduled-card"

                    >

                      <strong>

                        {task.title}

                      </strong>

                      <small>

                        Due today

                      </small>

                    </div>

                  )

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

/* =========================================================

   PROGRESS

\========================================================= */

function Progress({

  state,

  performance,

  activityMap,

}) {

  return (

    <div>

      <div className="page-heading">

        <div>

          <span className="eyebrow">

            PERFORMANCE

          </span>

          <h1>

            Progress

          </h1>

          <p>

            Generated from your actual

            planner activity.

          </p>

        </div>

      </div>

      <div className="stats-grid">

        <StatCard

          icon={

            <Activity size={18} />

          }

          label="Activities"

          value={

            performance.activities

          }

        />

        <StatCard

          icon={

            <CheckCircle2

              size={18}

            />

          }

          label="Completed"

          value={

            performance.completed

          }

        />

        <StatCard

          icon={

            <CalendarDays

              size={18}

            />

          }

          label="Scheduled"

          value={

            performance.scheduled

          }

        />

        <StatCard

          icon={

            <Target size={18} />

          }

          label="Completion"

          value={`${performance.completionRate}%`}

        />

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>

            <h2>

              Activity History

            </h2>

            <span>

              GitHub-inspired activity

              tracking

            </span>

          </div>

        </div>

        <ActivityGraph

          activityMap={

            activityMap

          }

        />

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>

            <h2>

              Subject Progress

            </h2>

            <span>

              Based on completed tasks

            </span>

          </div>

        </div>

        <div className="subject-progress-list">

          {performance.subjectProgress.map(

            subject => (

              <div

                className="subject-progress"

                key={subject.id}

              >

                <div className="subject-progress-top">

                  <span>

                    {subject.icon}{" "}

                    {subject.name}

                  </span>

                  <strong>

                    {subject.progress}%

                  </strong>

                </div>

                <div className="progress-bar">

                  <div

                    style={{

                      width: `${subject.progress}%`,

                    }}

                  />

                </div>

                <small>

                  {subject.completed}{" "}

                  of{" "}

                  {subject.total}{" "}

                  tasks completed

                </small>

              </div>

            )

          )}

        </div>

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>

            <h2>

              Activity Breakdown

            </h2>

            <span>

              What your planner recorded

            </span>

          </div>

        </div>

        <div className="activity-breakdown">

          <ActivityType

            icon={

              <Plus size={16} />

            }

            label="Pages created"

            count={

              state.activities.filter(

                activity =>

                  activity.type ===

                  "page_created"

              ).length

            }

          />

          <ActivityType

            icon={

              <CheckCircle2

                size={16}

              />

            }

            label="Tasks completed"

            count={

              state.activities.filter(

                activity =>

                  activity.type ===

                  "task_completed"

              ).length

            }

          />

          <ActivityType

            icon={

              <CalendarDays

                size={16}

              />

            }

            label="Tasks scheduled"

            count={

              state.activities.filter(

                activity =>

                  activity.type ===

                  "task_scheduled"

              ).length

            }

          />

        </div>

      </div>

    </div>

  );

}

function ActivityType({

  icon,

  label,

  count,

}) {

  return (

    <div className="activity-type">

      <span>

        {icon}

      </span>

      <div>

        <strong>

          {count}

        </strong>

        <small>

          {label}

        </small>

      </div>

    </div>

  );

}

/* =========================================================

   ACTIVITY GRAPH

\========================================================= */

function ActivityGraph({

  activityMap,

}) {

  const days = Array.from(

    { length: 35 },

    (_, index) =>

      getDateOffset(

        index - 34

      )

  );

  return (

    <div className="activity-graph">

      {days.map(date => {

        const count =

          activityMap[date] || 0;

        const level =

          count === 0

            ? 0

            : count === 1

            ? 1

            : count <= 3

            ? 2

            : 3;

        return (

          <div

            key={date}

            className={`activity-cell level-${level}`}

            title={`${date}: ${count} activities`}

          />

        );

      })}

    </div>

  );

}

/* =========================================================

   TEMPLATES

\========================================================= */

function Templates({

  createPage,

}) {

  return (

    <div>

      <div className="page-heading">

        <div>

          <span className="eyebrow">

            CREATE

          </span>

          <h1>

            Templates

          </h1>

          <p>

            Create a workspace suited to

            what you are studying.

          </p>

        </div>

      </div>

      <div className="page-grid">

        {TEMPLATES.map(

          template => (

            <button

              key={

                template.id

              }

              className="workspace-card"

              onClick={() =>

                createPage(

                  template

                )

              }

            >

              <span className="workspace-icon">

                {template.icon}

              </span>

              <strong>

                {template.title}

              </strong>

              <small>

                {

                  template.description

                }

              </small>

            </button>

          )

        )}

      </div>

    </div>

  );

}

/* =========================================================

   PAGE EDITOR

\========================================================= */

function PageEditor({
  page,
  updatePage,
  deletePage,
  navigate,
}) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [showCover, setShowCover] = useState(Boolean(page.cover));
  const pageIcons = ["📄", "📝", "📚", "🎯", "💻", "🧠", "🌱", "🚀", "☑️", "📅"];

  // Remove only the old demo placeholders that were accidentally added to blank pages.
  // Real user-written blocks and all non-blank templates are left untouched.
  useEffect(() => {
    if (page.type !== "blank" || !Array.isArray(page.blocks) || page.blocks.length === 0) return;

    const demoPlaceholders = new Set([
      "List item",
      "To-do",
      "Heading",
      "Start writing...",
      "New heading",
      "New item",
      "// Write code...",
    ]);

    const cleanedBlocks = page.blocks.filter(block => {
      const content = (block.content || "").trim();
      return !demoPlaceholders.has(content);
    });

    if (cleanedBlocks.length !== page.blocks.length) {
      updatePage(page.id, { blocks: cleanedBlocks });
    }
  }, [page.id, page.type, page.blocks, updatePage]);

  function addBlock(type) {
    const content = type === "heading" ? "Heading"
      : type === "checkbox" ? "To-do"
      : type === "bullet" ? "List item"
      : type === "code" ? "// Write code..."
      : "";
    const block = {
      id: createId("block"),
      type,
      content,
      ...(type === "checkbox" ? { completed: false } : {}),
    };
    updatePage(page.id, { blocks: [...(page.blocks || []), block] });
    setShowBlockMenu(false);
  }

  function updateBlock(blockId, changes) {
    updatePage(page.id, {
      blocks: (page.blocks || []).map(block =>
        block.id === blockId ? { ...block, ...changes } : block
      ),
    });
  }

  function deleteBlock(blockId) {
    updatePage(page.id, {
      blocks: (page.blocks || []).filter(block => block.id !== blockId),
    });
  }

  function onBlockKeyDown(event, block, index) {
    if (event.key === "Enter" && block.type === "text" && !event.shiftKey) {
      // Keep Enter as a newline in text blocks; use the inline + menu to add blocks.
      return;
    }
    if (event.key === "Escape") event.currentTarget.blur();
  }

  return (
    <div className="notion-page-shell">
      <div className="editor-toolbar notion-page-topbar">
        <button className="text-btn" onClick={() => navigate("pages")}>
          <ArrowLeft size={16} /> My Pages
        </button>
        <div className="notion-page-actions">
          <span className="notion-private-label">◈ Private</span>
          <button className="notion-action-btn" onClick={() => setShowCover(value => !value)}>
            {showCover ? "Remove cover" : "Add cover"}
          </button>
          <button className="danger-btn" onClick={() => deletePage(page.id)}>
            <Trash2 size={15} /> Delete page
          </button>
        </div>
      </div>

      {showCover && (
        <div className="notion-page-cover" aria-label="Page cover">
          <button className="cover-remove" onClick={() => setShowCover(false)} aria-label="Remove cover">
            <X size={15} />
          </button>
        </div>
      )}

      <article className={`notion-page ${showCover ? "has-cover" : ""}`}>
        <div className="notion-page-meta-actions">
          <div className="notion-icon-picker-wrap">
            <button
              className="notion-page-icon"
              onClick={() => setShowIconMenu(open => !open)}
              aria-label="Change page icon"
              title="Change icon"
            >
              {page.icon || "📄"}
            </button>
            {showIconMenu && (
              <div className="notion-icon-menu">
                {pageIcons.map(icon => (
                  <button key={icon} onClick={() => {
                    updatePage(page.id, { icon });
                    setShowIconMenu(false);
                  }}>{icon}</button>
                ))}
              </div>
            )}
          </div>
          <button className="notion-subtle-action" onClick={() => setShowCover(value => !value)}>
            <FilePlus2 size={14} /> {showCover ? "Hide cover" : "Add cover"}
          </button>
        </div>

        <input
          className="notion-page-title"
          value={page.title || ""}
          onChange={event => updatePage(page.id, { title: event.target.value })}
          placeholder="New page"
          aria-label="Page title"
        />

        <textarea
          className="notion-page-description"
          value={page.description || ""}
          onChange={event => updatePage(page.id, { description: event.target.value })}
          placeholder="Add a description, purpose, or a quick summary..."
          rows={1}
          aria-label="Page description"
        />

        <div className="notion-blocks">
          {(page.blocks || []).map((block, index) => (
            <div key={block.id} className="notion-block-row">
              <button
                className="notion-block-grip"
                aria-label="Block options"
                title="Remove block"
                onClick={() => deleteBlock(block.id)}
              >⠿</button>

              {block.type === "heading" && (
                <input
                  className="notion-block-heading"
                  value={block.content}
                  onChange={event => updateBlock(block.id, { content: event.target.value })}
                  onKeyDown={event => onBlockKeyDown(event, block, index)}
                  placeholder="Heading"
                  aria-label="Heading block"
                />
              )}

              {block.type === "text" && (
                <textarea
                  className="notion-block-text"
                  value={block.content}
                  onChange={event => updateBlock(block.id, { content: event.target.value })}
                  onKeyDown={event => onBlockKeyDown(event, block, index)}
                  placeholder="Type something, or press + to add a block..."
                  rows={Math.max(1, Math.min(5, (block.content || "").split("\n").length))}
                  aria-label="Text block"
                />
              )}

              {block.type === "bullet" && (
                <div className="notion-list-block">
                  <span className="notion-bullet-dot" />
                  <input
                    value={block.content}
                    onChange={event => updateBlock(block.id, { content: event.target.value })}
                    onKeyDown={event => onBlockKeyDown(event, block, index)}
                    placeholder="List item"
                    aria-label="Bullet list item"
                  />
                </div>
              )}

              {block.type === "checkbox" && (
                <label className={`notion-todo-block ${block.completed ? "is-complete" : ""}`}>
                  <input
                    type="checkbox"
                    checked={Boolean(block.completed)}
                    onChange={event => updateBlock(block.id, { completed: event.target.checked })}
                  />
                  <input
                    value={block.content}
                    onChange={event => updateBlock(block.id, { content: event.target.value })}
                    onKeyDown={event => onBlockKeyDown(event, block, index)}
                    placeholder="To-do"
                    aria-label="To-do item"
                  />
                </label>
              )}

              {block.type === "code" && (
                <div className="notion-code-block">
                  <div className="notion-code-label"><Code2 size={13} /> Code</div>
                  <textarea
                    value={block.content}
                    onChange={event => updateBlock(block.id, { content: event.target.value })}
                    placeholder="// Write code..."
                    aria-label="Code block"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="notion-add-block-area">
          <button
            className="notion-add-block"
            onClick={() => setShowBlockMenu(open => !open)}
            aria-expanded={showBlockMenu}
          >
            <Plus size={16} /> Add a block
          </button>
          {showBlockMenu && (
            <div className="notion-block-menu">
              <div className="notion-block-menu-title">BASIC BLOCKS</div>
              <button onClick={() => addBlock("text")}><span>¶</span><div><strong>Text</strong><small>Start writing plain text</small></div></button>
              <button onClick={() => addBlock("heading")}><span>T</span><div><strong>Heading</strong><small>Give a section a title</small></div></button>
              <button onClick={() => addBlock("bullet")}><span>•</span><div><strong>Bulleted list</strong><small>Make a simple list</small></div></button>
              <button onClick={() => addBlock("checkbox")}><span>☑</span><div><strong>To-do</strong><small>Track something to complete</small></div></button>
              <button onClick={() => addBlock("code")}><span>{"</>"}</span><div><strong>Code</strong><small>Keep a snippet or solution</small></div></button>
            </div>
          )}
        </div>

      </article>
    </div>
  );
}

/* =========================================================

   SMALL COMPONENTS

\========================================================= */

function StatCard({

  icon,

  label,

  value,

}) {

  return (

    <div className="stat-card">

      <div className="stat-icon">

        {icon}

      </div>

      <div>

        <strong>

          {value}

        </strong>

        <span>

          {label}

        </span>

      </div>

    </div>

  );

}

function EmptyState({

  text,

}) {

  return (

    <div className="empty-state">

      {text}

    </div>

  );

}