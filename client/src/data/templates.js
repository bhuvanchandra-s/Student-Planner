// client/src/data.js

/*
 * Student Planner data definitions.
 *
 * IMPORTANT:
 * Keep reusable definitions here.
 * Actual user data lives in App state/localStorage.
 *
 * Future additions should normally be:
 * - a new page type
 * - a new template
 * - a new activity type
 * - a new field on the relevant entity
 */

export const PAGE_TYPES = {
  blank: {
    label: "Blank",
    icon: "📄",
    description: "Start with an empty workspace."
  },

  notes: {
    label: "Notes",
    icon: "📝",
    description: "Write and organize study notes."
  },

  tasks: {
    label: "Tasks",
    icon: "✅",
    description: "Create tasks and track completion."
  },

  calendar: {
    label: "Calendar",
    icon: "📅",
    description: "Plan your academic schedule."
  },

  subject: {
    label: "Subject",
    icon: "📚",
    description: "Organize a subject, topics and progress."
  },

  project: {
    label: "Project",
    icon: "🚀",
    description: "Manage a project and its tasks."
  }
};


/*
 * Subjects are intentionally separate from Pages.
 *
 * A page can belong to a subject.
 * A task can belong to a subject.
 * Performance can later be calculated per subject.
 */

export const subjects = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    short: "DSA",
    icon: "💻"
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    short: "DBMS",
    icon: "🗄️"
  },
  {
    id: "os",
    name: "Operating Systems",
    short: "OS",
    icon: "⚙️"
  },
  {
    id: "cn",
    name: "Computer Networks",
    short: "CN",
    icon: "🌐"
  }
];


/*
 * Templates only describe how a page starts.
 *
 * They do NOT contain activity or performance data.
 */

export const templates = [
  {
    id: "notes",
    type: "notes",
    icon: "📝",
    title: "Lecture Notes",
    description: "A clean workspace for class notes.",
    blocks: [
      {
        id: "block-1",
        type: "heading",
        content: "Key Concepts"
      },
      {
        id: "block-2",
        type: "bullet",
        content: "Important concept"
      },
      {
        id: "block-3",
        type: "bullet",
        content: "Important example"
      },
      {
        id: "block-4",
        type: "heading",
        content: "Notes"
      },
      {
        id: "block-5",
        type: "text",
        content: "Start writing your notes..."
      }
    ]
  },

  {
    id: "todo",
    type: "tasks",
    icon: "✅",
    title: "To-Do List",
    description: "Create tasks and connect them to your schedule.",
    blocks: [
      {
        id: "block-1",
        type: "heading",
        content: "Tasks"
      },
      {
        id: "block-2",
        type: "text",
        content: "Use the Tasks section to create trackable tasks."
      }
    ]
  },

  {
    id: "subject",
    type: "subject",
    icon: "📚",
    title: "Subject",
    description: "Track notes, topics and study progress.",
    blocks: [
      {
        id: "block-1",
        type: "heading",
        content: "Course Information"
      },
      {
        id: "block-2",
        type: "text",
        content: "Faculty:"
      },
      {
        id: "block-3",
        type: "text",
        content: "Credits:"
      },
      {
        id: "block-4",
        type: "heading",
        content: "Topics"
      },
      {
        id: "block-5",
        type: "checkbox",
        content: "Topic 1",
        completed: false
      },
      {
        id: "block-6",
        type: "checkbox",
        content: "Topic 2",
        completed: false
      },
      {
        id: "block-7",
        type: "heading",
        content: "Notes"
      },
      {
        id: "block-8",
        type: "text",
        content: "Start writing..."
      }
    ]
  },

  {
    id: "project",
    type: "project",
    icon: "🚀",
    title: "Project",
    description: "Plan and track a project.",
    blocks: [
      {
        id: "block-1",
        type: "heading",
        content: "Project Overview"
      },
      {
        id: "block-2",
        type: "text",
        content: "Project description..."
      },
      {
        id: "block-3",
        type: "heading",
        content: "Tasks"
      }
    ]
  },

  {
    id: "exam",
    type: "tasks",
    icon: "🎯",
    title: "Exam Preparation",
    description: "Organize revision tasks.",
    blocks: [
      {
        id: "block-1",
        type: "heading",
        content: "Revision Plan"
      },
      {
        id: "block-2",
        type: "text",
        content: "Plan the topics you need to revise."
      }
    ]
  }
];


/*
 * Existing pages.
 *
 * These are only initial pages.
 * Users can create unlimited pages later.
 */

export const defaultPages = [
  {
    id: "welcome",
    title: "My Student Workspace",
    icon: "🎓",
    type: "blank",
    blocks: [
      {
        id: "welcome-1",
        type: "heading",
        content: "Welcome to Student Planner"
      },
      {
        id: "welcome-2",
        type: "text",
        content:
          "Create pages, organize your studies, schedule tasks and build your academic activity history."
      },
      {
        id: "welcome-3",
        type: "heading",
        content: "Getting Started"
      },
      {
        id: "welcome-4",
        type: "checkbox",
        content: "Create your first page",
        completed: false
      },
      {
        id: "welcome-5",
        type: "checkbox",
        content: "Create a task",
        completed: false
      },
      {
        id: "welcome-6",
        type: "checkbox",
        content: "Schedule a task",
        completed: false
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
        content: "Topics"
      },
      {
        id: "dsa-2",
        type: "checkbox",
        content: "Arrays",
        completed: true
      },
      {
        id: "dsa-3",
        type: "checkbox",
        content: "Linked Lists",
        completed: true
      },
      {
        id: "dsa-4",
        type: "checkbox",
        content: "Stacks & Queues",
        completed: false
      },
      {
        id: "dsa-5",
        type: "checkbox",
        content: "Trees",
        completed: false
      },
      {
        id: "dsa-6",
        type: "checkbox",
        content: "Graphs",
        completed: false
      },
      {
        id: "dsa-7",
        type: "heading",
        content: "Notes"
      },
      {
        id: "dsa-8",
        type: "text",
        content: "Keep important concepts, patterns and mistakes here..."
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];


/*
 * Initial tasks.
 *
 * Notice that tasks have relationships:
 *
 * pageId
 * subjectId
 * calendarEventId
 *
 * This is what allows one task to appear in:
 * - its page
 * - Tasks
 * - Calendar
 * - Activity
 * - Performance
 */

export const initialTasks = [
  {
    id: "task-1",
    pageId: "dsa-page",
    title: "Practice DSA problems",
    subjectId: "dsa",
    priority: "high",
    dueDate: getDateOffset(0),
    completed: false,
    completedAt: null,
    calendarEventId: null,
    createdAt: new Date().toISOString()
  },

  {
    id: "task-2",
    pageId: null,
    title: "Finish DBMS assignment",
    subjectId: "dbms",
    priority: "high",
    dueDate: getDateOffset(1),
    completed: false,
    completedAt: null,
    calendarEventId: null,
    createdAt: new Date().toISOString()
  },

  {
    id: "task-3",
    pageId: null,
    title: "Review Operating Systems",
    subjectId: "os",
    priority: "medium",
    dueDate: getDateOffset(3),
    completed: false,
    completedAt: null,
    calendarEventId: null,
    createdAt: new Date().toISOString()
  }
];


/*
 * Calendar events.
 *
 * A calendar event is NOT another task.
 *
 * It references a task.
 */

export const initialCalendarEvents = [];


/*
 * Initial activity.
 *
 * In the real system this will be generated automatically.
 */

export const initialActivities = [];


/*
 * Problems are kept because coding activity can eventually
 * become one of the performance sources.
 *
 * They are NOT the center of the application.
 */

export const problems = [
  {
    id: "problem-1",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    solved: true
  },
  {
    id: "problem-2",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    solved: true
  },
  {
    id: "problem-3",
    title: "Add Two Numbers",
    topic: "Linked List",
    difficulty: "Medium",
    solved: true
  },
  {
    id: "problem-4",
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    difficulty: "Medium",
    solved: false
  },
  {
    id: "problem-5",
    title: "Binary Tree Inorder Traversal",
    topic: "Trees",
    difficulty: "Easy",
    solved: true
  },
  {
    id: "problem-6",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    solved: false
  }
];


/*
 * Utility.
 */

export function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}


export function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric"
    }
  );
}


/*
 * Creates a completely fresh state.
 *
 * Keeping this function separate makes future migration
 * much easier when we eventually move to a backend.
 */

export function createInitialState() {
  return {
    version: 2,

    user: {
      id: "local-user",
      name: "Bhuvana",
      avatar: "B"
    },

    pages: structuredClone(defaultPages),

    tasks: structuredClone(initialTasks),

    calendarEvents: structuredClone(initialCalendarEvents),

    activities: structuredClone(initialActivities),

    problems: structuredClone(problems)
  };
}