export const templates = [
  {
    id: "subject",
    icon: "📚",
    title: "Subject",
    description: "A complete workspace for a subject.",
    blocks: [
      { type: "heading", content: "Course Information" },
      { type: "text", content: "Faculty: " },
      { type: "text", content: "Credits: " },
      { type: "heading", content: "Topics" },
      { type: "checkbox", content: "Topic 1", completed: false },
      { type: "checkbox", content: "Topic 2", completed: false },
      { type: "checkbox", content: "Topic 3", completed: false },
      { type: "heading", content: "Notes" },
      { type: "text", content: "Start writing your notes here..." }
    ]
  },
  {
    id: "lecture",
    icon: "📝",
    title: "Lecture Notes",
    description: "Structured notes for a lecture.",
    blocks: [
      { type: "heading", content: "Key Concepts" },
      { type: "bullet", content: "Important concept" },
      { type: "bullet", content: "Important example" },
      { type: "heading", content: "Notes" },
      { type: "text", content: "Write your lecture notes..." },
      { type: "heading", content: "Questions" },
      { type: "bullet", content: "Question to revisit" }
    ]
  },
  {
    id: "assignment",
    icon: "📋",
    title: "Assignment",
    description: "Track an assignment from start to submission.",
    blocks: [
      { type: "heading", content: "Assignment Details" },
      { type: "text", content: "Subject: " },
      { type: "text", content: "Deadline: " },
      { type: "heading", content: "Requirements" },
      { type: "checkbox", content: "Understand the requirements", completed: false },
      { type: "checkbox", content: "Complete the work", completed: false },
      { type: "checkbox", content: "Review and submit", completed: false }
    ]
  },
  {
    id: "exam",
    icon: "🎯",
    title: "Exam Preparation",
    description: "Plan revision for an upcoming exam.",
    blocks: [
      { type: "heading", content: "Exam Information" },
      { type: "text", content: "Subject: " },
      { type: "text", content: "Exam Date: " },
      { type: "heading", content: "Revision Checklist" },
      { type: "checkbox", content: "Unit 1", completed: false },
      { type: "checkbox", content: "Unit 2", completed: false },
      { type: "checkbox", content: "Unit 3", completed: false },
      { type: "checkbox", content: "Practice questions", completed: false }
    ]
  },
  {
    id: "weekly",
    icon: "📅",
    title: "Weekly Planner",
    description: "Organize classes, study sessions and deadlines.",
    blocks: [
      { type: "heading", content: "Monday" },
      { type: "bullet", content: "Plan your priorities..." },
      { type: "heading", content: "Tuesday" },
      { type: "bullet", content: "Plan your priorities..." },
      { type: "heading", content: "Wednesday" },
      { type: "bullet", content: "Plan your priorities..." },
      { type: "heading", content: "Thursday" },
      { type: "bullet", content: "Plan your priorities..." },
      { type: "heading", content: "Friday" },
      { type: "bullet", content: "Plan your priorities..." }
    ]
  }
];

export const defaultPages = [
  {
    id: "welcome",
    title: "Welcome to Student Planner",
    icon: "👋",
    template: "blank",
    blocks: [
      { type: "heading", content: "Your academic workspace" },
      { type: "text", content: "Create pages, use templates and keep your student life organized in one place." },
      { type: "heading", content: "Getting started" },
      { type: "checkbox", content: "Create your first subject", completed: false },
      { type: "checkbox", content: "Add your weekly plan", completed: false },
      { type: "checkbox", content: "Create an exam preparation page", completed: false }
    ]
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    icon: "📚",
    template: "subject",
    blocks: [
      { type: "heading", content: "Course Information" },
      { type: "text", content: "Faculty: " },
      { type: "text", content: "Credits: 4" },
      { type: "heading", content: "Topics" },
      { type: "checkbox", content: "Arrays", completed: true },
      { type: "checkbox", content: "Linked Lists", completed: true },
      { type: "checkbox", content: "Stacks & Queues", completed: false },
      { type: "checkbox", content: "Trees", completed: false },
      { type: "checkbox", content: "Graphs", completed: false },
      { type: "heading", content: "Notes" },
      { type: "text", content: "Add your DSA notes here..." }
    ]
  }
];

export const initialTasks = [
  { id: 1, title: "Practice DSA problems", subject: "DSA", due: "Today", priority: "High", completed: false },
  { id: 2, title: "Finish DBMS assignment", subject: "DBMS", due: "Tomorrow", priority: "High", completed: false },
  { id: 3, title: "Review Operating Systems", subject: "OS", due: "Friday", priority: "Medium", completed: false },
  { id: 4, title: "Work on project", subject: "Project", due: "Saturday", priority: "Medium", completed: true }
];

export const subjects = [
  { id: 1, name: "Data Structures & Algorithms", short: "DSA", progress: 72, icon: "💻" },
  { id: 2, name: "Database Management Systems", short: "DBMS", progress: 61, icon: "🗄️" },
  { id: 3, name: "Operating Systems", short: "OS", progress: 48, icon: "⚙️" },
  { id: 4, name: "Computer Networks", short: "CN", progress: 35, icon: "🌐" }
];
