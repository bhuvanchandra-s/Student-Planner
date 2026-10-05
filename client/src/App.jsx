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
========================================================= */

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
========================================================= */

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
========================================================= */

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
========================================================= */

export default function App() {
  const [state, setState] =
    useState(loadState);

  const [activePage, setActivePage] =
    useState("home");

  const [search, setSearch] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);


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

  function createPage(template = null) {
    const source =
      template ||
      TEMPLATES[0];

    const page = {
      id: createId("page"),

      title:
        source.title ||
        "Untitled Page",

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
              createTask={createTask}
            />
          )}

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

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
========================================================= */

function Home({
  state,
  performance,
  activityMap,
  navigate,
  createPage,
  createTask,
  toggleTask,
}) {
  const [newTask, setNewTask] =
    useState("");


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


        <button
          className="primary-btn"
          onClick={() =>
            createPage()
          }
        >
          <Plus size={17} />
          New Page
        </button>

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


          <div className="inline-task">

            <input
              value={newTask}
              onChange={event =>
                setNewTask(
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
              placeholder="Add a task..."
            />


            <button
              onClick={addTask}
            >
              <Plus size={17} />
            </button>

          </div>

        </div>

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
========================================================= */

function Pages({
  pages,
  navigate,
  createPage,
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
          onClick={() =>
            createPage()
          }
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
========================================================= */

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
========================================================= */

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
========================================================= */

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
========================================================= */

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
========================================================= */

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
========================================================= */

function PageEditor({
  page,
  state,
  updatePage,
  deletePage,
  navigate,
  createTask,
}) {
  const [taskTitle, setTaskTitle] =
    useState("");


  function addBlock(type) {
    const content =
      type === "heading"
        ? "New heading"
        : type === "checkbox"
        ? "New task"
        : type === "bullet"
        ? "New item"
        : "Start writing...";


    const block = {
      id: createId("block"),
      type,
      content,

      ...(type === "checkbox"
        ? {
            completed: false,
          }
        : {}),
    };


    updatePage(page.id, {
      blocks: [
        ...page.blocks,
        block,
      ],
    });
  }


  function updateBlock(
    blockId,
    changes
  ) {
    updatePage(page.id, {
      blocks: page.blocks.map(
        block =>
          block.id === blockId
            ? {
                ...block,
                ...changes,
              }
            : block
      ),
    });
  }


  function deleteBlock(
    blockId
  ) {
    updatePage(page.id, {
      blocks: page.blocks.filter(
        block =>
          block.id !== blockId
      ),
    });
  }


  function addPageTask() {
    if (!taskTitle.trim()) {
      return;
    }


    createTask({
      title: taskTitle,

      pageId: page.id,

      subjectId:
        page.subjectId ||
        null,

      dueDate: null,
    });


    setTaskTitle("");
  }


  const pageTasks =
    state.tasks.filter(
      task =>
        task.pageId === page.id
    );


  return (
    <div>

      <div className="editor-toolbar">

        <button
          className="text-btn"
          onClick={() =>
            navigate("pages")
          }
        >
          <ArrowLeft size={16} />
          My Pages
        </button>


        <button
          className="danger-btn"
          onClick={() =>
            deletePage(page.id)
          }
        >
          <Trash2 size={16} />
          Delete
        </button>

      </div>


      <div className="editor">

        <div className="editor-title">

          <span>
            {page.icon}
          </span>


          <input
            value={page.title}
            onChange={event =>
              updatePage(
                page.id,
                {
                  title:
                    event.target
                      .value,
                }
              )
            }
          />

        </div>


        <div className="editor-type">

          {
            PAGE_TYPES[
              page.type
            ]?.label
          }

        </div>


        <div className="editor-blocks">

          {page.blocks.map(
            block => (
              <div
                key={block.id}
                className="editor-block"
              >

                {block.type ===
                  "heading" && (
                  <input
                    className="editor-heading"
                    value={
                      block.content
                    }
                    onChange={event =>
                      updateBlock(
                        block.id,
                        {
                          content:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />
                )}


                {block.type ===
                  "text" && (
                  <textarea
                    className="editor-text"
                    value={
                      block.content
                    }
                    onChange={event =>
                      updateBlock(
                        block.id,
                        {
                          content:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />
                )}


                {block.type ===
                  "bullet" && (
                  <div className="bullet-editor">

                    <span>
                      •
                    </span>

                    <input
                      value={
                        block.content
                      }
                      onChange={event =>
                        updateBlock(
                          block.id,
                          {
                            content:
                              event
                                .target
                                .value,
                          }
                        )
                      }
                    />

                  </div>
                )}


                {block.type ===
                  "checkbox" && (
                  <div className="checkbox-editor">

                    <button
                      className={`task-check ${
                        block.completed
                          ? "checked"
                          : ""
                      }`}
                      onClick={() =>
                        updateBlock(
                          block.id,
                          {
                            completed:
                              !block.completed,
                          }
                        )
                      }
                    >
                      {block.completed && (
                        <Check
                          size={14}
                        />
                      )}
                    </button>


                    <input
                      value={
                        block.content
                      }
                      onChange={event =>
                        updateBlock(
                          block.id,
                          {
                            content:
                              event
                                .target
                                .value,
                          }
                        )
                      }
                    />

                  </div>
                )}


                <button
                  className="block-delete"
                  onClick={() =>
                    deleteBlock(
                      block.id
                    )
                  }
                >
                  <X size={14} />
                </button>

              </div>
            )
          )}

        </div>


        <div className="block-toolbar">

          <button
            onClick={() =>
              addBlock("text")
            }
          >
            Text
          </button>


          <button
            onClick={() =>
              addBlock(
                "heading"
              )
            }
          >
            Heading
          </button>


          <button
            onClick={() =>
              addBlock(
                "bullet"
              )
            }
          >
            Bullet
          </button>


          <button
            onClick={() =>
              addBlock(
                "checkbox"
              )
            }
          >
            Checkbox
          </button>

        </div>


        <div className="page-task-section">

          <div className="panel-header">

            <div>

              <h2>
                Tasks for this page
              </h2>

              <span>
                Tasks created here remain
                connected to this page.
              </span>

            </div>

          </div>


          <div className="inline-task">

            <input
              value={taskTitle}
              onChange={event =>
                setTaskTitle(
                  event.target
                    .value
                )
              }
              onKeyDown={event => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  addPageTask();
                }
              }}
              placeholder="Add a task..."
            />


            <button
              onClick={
                addPageTask
              }
            >
              <Plus size={17} />
            </button>

          </div>


          <div className="task-list">

            {pageTasks.map(
              task => (
                <div
                  key={task.id}
                  className="task-row"
                >

                  <span>
                    {task.completed
                      ? "✅"
                      : "○"}
                  </span>


                  <strong>
                    {task.title}
                  </strong>


                  {task.dueDate && (
                    <small>
                      {formatDate(
                        task.dueDate
                      )}
                    </small>
                  )}

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

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