const icons = {
  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>`,
  "chevron-down": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  "chevron-up": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  "chevron-left": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  "chevron-right": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7 3.5v3M17 3.5v3M3.5 9.5h17M8 13h2M14 13h2M8 17h2"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5h16v15H4z"/><path d="M4 14h4l1.5 2h5L16 14h4"/></svg>`,
  "check-circle": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5a2 2 0 0 1 2-1.5h11v16H7a2 2 0 0 0-2 2V4.5Z"/><path d="M5 19.5a2 2 0 0 1 2-2h11M9 7h5M9 10h5"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V13M10 19.5V5M16 19.5v-9M22 19.5H2"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.7 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 0 1 0-3.7h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.7 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.7h-.2a1.8 1.8 0 0 0-.9 3Z"/></svg>`,
  dots: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8.5h18C21 16 18 16 18 9ZM10 21h4"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`,
  "arrow-up": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6M12 8v10"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12.2 21a6.2 6.2 0 0 0 5.7-8.6c-.7-1.5-1.8-2.5-3.5-3.8.1 1.8-.5 2.8-1.5 3.5.2-3.5-1.7-6.4-4.4-8.1.4 3.1-.9 4.4-2 6.2A6.2 6.2 0 0 0 12.2 21Z"/><path d="M12.1 21a3.5 3.5 0 0 0 3.2-4.9c-.4-.8-.9-1.3-1.8-2-.1 1.2-.5 1.8-1.2 2.2.1-1.6-.8-2.8-1.9-3.5.2 1.5-.5 2.2-.9 3.1A3.5 3.5 0 0 0 12.1 21Z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m9.5 14.5 5-5M7.7 17.3l-1.1 1.1a3.2 3.2 0 0 1-4.5-4.5l4.1-4.1a3.2 3.2 0 0 1 4.5 0M16.3 6.7l1.1-1.1a3.2 3.2 0 0 1 4.5 4.5l-4.1 4.1a3.2 3.2 0 0 1-4.5 0"/></svg>`,
  "arrow-up-right": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>`,
  sort: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.2 4.2L19 7"/></svg>`,
};

const today = new Date();
today.setHours(12, 0, 0, 0);

const state = {
  selectedDate: new Date(today),
  activeView: "today",
  filter: "all",
  query: "",
  showAllPool: false,
  sort: "recent",
  selectedTaskId: null,
};

const priorityMeta = {
  urgent: { label: "紧急", className: "priority-urgent" },
  high: { label: "高", className: "priority-high" },
  medium: { label: "中", className: "priority-medium" },
  low: { label: "低", className: "priority-low" },
};

const statusMeta = {
  inbox: "待安排",
  todo: "待完成",
  doing: "进行中",
  done: "已完成",
};

const colors = ["#9c91ec", "#e8a06a", "#72b6a4", "#6d9bed", "#d17c9b", "#aaa6c9"];

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromOffset(days, hour = 9, minute = 0) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function createdStamp(hoursAgo) {
  return Date.now() - hoursAgo * 60 * 60 * 1000;
}

const tasks = [
  {
    id: "task-01",
    title: "整理本周项目进展",
    project: "Trilium 插件",
    priority: "high",
    status: "doing",
    estimate: 45,
    createdAt: "今天 09:12",
    createdTimestamp: createdStamp(1),
    plannedDate: isoDate(today),
    description: "把本周完成的工作整理成一段可以同步到 Journal 的进展摘要。",
  },
  {
    id: "task-02",
    title: "回复重要邮件",
    project: "个人事务",
    priority: "medium",
    status: "todo",
    estimate: 20,
    createdAt: "今天 08:48",
    createdTimestamp: createdStamp(2),
    plannedDate: isoDate(today),
    description: "处理收件箱里标记为重要的三封邮件，并给出明确的下一步。",
  },
  {
    id: "task-03",
    title: "确认下周会议议程",
    project: "团队协作",
    priority: "urgent",
    status: "todo",
    estimate: 25,
    createdAt: "昨天 17:30",
    createdTimestamp: createdStamp(16),
    plannedDate: isoDate(today),
    description: "确认参会人和议题，把最终版本同步给团队。",
  },
  {
    id: "task-04",
    title: "阅读 30 分钟",
    project: "持续学习",
    priority: "low",
    status: "done",
    estimate: 30,
    createdAt: "昨天 14:05",
    createdTimestamp: createdStamp(20),
    plannedDate: isoDate(today),
    completedAt: dateFromOffset(0, 8, 56).toISOString(),
    description: "完成今天的阅读时间，记录一个值得复用的想法。",
  },
  {
    id: "task-05",
    title: "设计任务池空状态",
    project: "Trilium 插件",
    priority: "high",
    status: "inbox",
    estimate: 60,
    createdAt: "今天 08:26",
    createdTimestamp: createdStamp(3),
    plannedDate: null,
    description: "为没有待安排任务、没有今日计划两种场景设计引导。",
  },
  {
    id: "task-06",
    title: "整理收件箱笔记",
    project: "知识库维护",
    priority: "medium",
    status: "inbox",
    estimate: 30,
    createdAt: "昨天 16:22",
    createdTimestamp: createdStamp(18),
    plannedDate: null,
    description: "把临时收集的笔记归档到合适的主题下。",
  },
  {
    id: "task-07",
    title: "给书签添加标签",
    project: "知识库维护",
    priority: "low",
    status: "inbox",
    estimate: 15,
    createdAt: "昨天 11:40",
    createdTimestamp: createdStamp(24),
    plannedDate: null,
    description: "处理最近保存的书签，至少补充主题和来源两个标签。",
  },
  {
    id: "task-08",
    title: "梳理插件数据模型",
    project: "Trilium 插件",
    priority: "high",
    status: "inbox",
    estimate: 45,
    createdAt: "3 天前",
    createdTimestamp: createdStamp(52),
    plannedDate: null,
    description: "确定任务笔记、优先级标签以及 Journal 关联的最小字段。",
  },
  {
    id: "task-09",
    title: "更新个人主页简介",
    project: "个人事务",
    priority: "medium",
    status: "inbox",
    estimate: 30,
    createdAt: "3 天前",
    createdTimestamp: createdStamp(57),
    plannedDate: null,
    description: "让简介更准确地反映目前正在投入的方向。",
  },
  {
    id: "task-10",
    title: "清理下载目录",
    project: "系统整理",
    priority: "low",
    status: "inbox",
    estimate: 20,
    createdAt: "4 天前",
    createdTimestamp: createdStamp(79),
    plannedDate: null,
    description: "删除临时文件，保留需要归档的资料。",
  },
  {
    id: "task-11",
    title: "准备周五分享案例",
    project: "团队协作",
    priority: "medium",
    status: "inbox",
    estimate: 60,
    createdAt: "上周五",
    createdTimestamp: createdStamp(116),
    plannedDate: null,
    description: "挑选一个案例并整理成 10 分钟分享提纲。",
  },
  {
    id: "task-12",
    title: "补充项目 README",
    project: "Trilium 插件",
    priority: "high",
    status: "inbox",
    estimate: 45,
    createdAt: "上周四",
    createdTimestamp: createdStamp(139),
    plannedDate: null,
    description: "补充安装、运行和未来接入 Trilium 的说明。",
  },
  {
    id: "task-13",
    title: "备份重要笔记",
    project: "知识库维护",
    priority: "low",
    status: "inbox",
    estimate: 30,
    createdAt: "上周三",
    createdTimestamp: createdStamp(164),
    plannedDate: null,
    description: "确认最近更新的笔记都已经进入备份范围。",
  },
  {
    id: "task-14",
    title: "整理下月目标草稿",
    project: "个人成长",
    priority: "medium",
    status: "inbox",
    estimate: 45,
    createdAt: "上周二",
    createdTimestamp: createdStamp(188),
    plannedDate: null,
    description: "把想做的事情整理成可执行的目标，而不是愿望清单。",
  },
  {
    id: "task-15",
    title: "安装编辑器扩展",
    project: "开发环境",
    priority: "low",
    status: "done",
    estimate: 15,
    createdAt: "上周一",
    createdTimestamp: createdStamp(216),
    plannedDate: null,
    completedAt: dateFromOffset(-1, 18, 20).toISOString(),
    description: "完成开发环境的小调整。",
  },
  {
    id: "task-16",
    title: "整理年度发票",
    project: "个人事务",
    priority: "medium",
    status: "done",
    estimate: 40,
    createdAt: "上周一",
    createdTimestamp: createdStamp(221),
    plannedDate: null,
    completedAt: dateFromOffset(-1, 16, 40).toISOString(),
    description: "归档并确认年度发票资料齐全。",
  },
  {
    id: "task-17",
    title: "确认域名续费时间",
    project: "系统维护",
    priority: "urgent",
    status: "inbox",
    estimate: 10,
    createdAt: "两周前",
    createdTimestamp: createdStamp(250),
    plannedDate: null,
    description: "确认续费日期和付款方式，避免服务中断。",
  },
  {
    id: "task-18",
    title: "整理灵感收集箱",
    project: "个人成长",
    priority: "low",
    status: "inbox",
    estimate: 35,
    createdAt: "两周前",
    createdTimestamp: createdStamp(276),
    plannedDate: null,
    description: "把零散的灵感归类，留下真正值得继续探索的内容。",
  },
];

const refs = {
  pageTitle: document.querySelector("#page-title"),
  pageSubtitle: document.querySelector("#page-subtitle"),
  dateLabel: document.querySelector("#date-label"),
  breadcrumbTitle: document.querySelector("#breadcrumb-title"),
  todayList: document.querySelector("#today-list"),
  poolList: document.querySelector("#pool-list"),
  todayTotal: document.querySelector("#today-total"),
  poolTotal: document.querySelector("#pool-total"),
  statProgress: document.querySelector("#stat-progress"),
  statProgressHint: document.querySelector("#stat-progress-hint"),
  statPercent: document.querySelector("#stat-percent"),
  statRing: document.querySelector("#stat-ring"),
  statPool: document.querySelector("#stat-pool"),
  todayCount: document.querySelector("#today-count"),
  poolCount: document.querySelector("#pool-count"),
  sidebarProgress: document.querySelector("#sidebar-progress"),
  sidebarProgressBar: document.querySelector("#sidebar-progress-bar"),
  sidebarDoneCount: document.querySelector("#sidebar-done-count"),
  sidebarTotalCount: document.querySelector("#sidebar-total-count"),
  journalTaskSummary: document.querySelector("#journal-task-summary"),
  journalProgressBar: document.querySelector("#journal-progress-bar"),
  journalDate: document.querySelector(".journal-date"),
  journalNoteTitle: document.querySelector("#journal-note-title"),
  availableTime: document.querySelector("#available-time"),
  search: document.querySelector("#task-search"),
  taskDialog: document.querySelector("#task-dialog"),
  taskForm: document.querySelector("#task-form"),
  taskTitle: document.querySelector("#task-title"),
  planToday: document.querySelector("#plan-today"),
  planDateLabel: document.querySelector("#plan-date-label"),
  detailDialog: document.querySelector("#detail-dialog"),
  detailContent: document.querySelector("#detail-content"),
  toast: document.querySelector("#toast"),
  toastMessage: document.querySelector("#toast-message"),
};

let toastTimer;

function hydrateIcons(scope = document) {
  scope.querySelectorAll("[data-icon]").forEach((element) => {
    const name = element.dataset.icon;
    if (icons[name]) element.innerHTML = icons[name];
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat("zh-CN", options).format(date);
}

function isToday(date) {
  return isoDate(date) === isoDate(today);
}

function selectedDateKey() {
  return isoDate(state.selectedDate);
}

function dateLabel(date) {
  if (isToday(date)) return "今天";
  return formatDate(date, { month: "long", day: "numeric", weekday: "short" });
}

function longDateLabel(date) {
  return formatDate(date, { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

function formatClock(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return formatDate(date, { month: "numeric", day: "numeric" }) + " " + formatDate(date, { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
}

function priorityBadge(priority) {
  const meta = priorityMeta[priority] || priorityMeta.medium;
  return `<span class="priority-badge ${meta.className}">${meta.label}</span>`;
}

function projectLabel(task) {
  const color = colors[Number(task.id.replace(/\D/g, "")) % colors.length];
  return `<span class="project-label"><i class="project-dot" style="background:${color}"></i><span>${escapeHtml(task.project || "未分类")}</span></span>`;
}

function taskTitle(task) {
  return `<button class="task-title-button" type="button" data-action="detail" data-id="${task.id}">${escapeHtml(task.title)}</button>`;
}

function taskRow(task, variant) {
  const isDone = task.status === "done";
  const statusClass = isDone ? "is-done" : "";
  if (variant === "today") {
    const timeText = isDone ? `完成于 ${formatClock(task.completedAt)}` : `${task.estimate} 分钟`;
    return `<article class="task-row today-task ${statusClass}">
      <button class="task-check" type="button" data-action="toggle" data-id="${task.id}" aria-label="${isDone ? "标记为未完成" : "完成任务"}" aria-pressed="${isDone}"><span data-icon="check"></span></button>
      <div class="task-main">
        ${taskTitle(task)}
        <div class="task-meta">${projectLabel(task)}<span class="time-label"><span data-icon="clock"></span>${timeText}</span></div>
      </div>
      ${priorityBadge(task.priority)}
      <button class="task-more" type="button" data-action="detail" data-id="${task.id}" aria-label="查看任务详情"><span data-icon="dots"></span></button>
    </article>`;
  }

  const isPlanned = task.plannedDate === selectedDateKey();
  const action = isDone ? "查看" : isPlanned ? "已加入" : "加入今天";
  const actionType = isDone ? "detail" : isPlanned ? "remove" : "add";
  return `<article class="task-row pool-row ${statusClass}">
    <span class="task-status-dot status-${task.status}" aria-hidden="true"></span>
    <div class="task-main">
      ${taskTitle(task)}
      <div class="task-meta">${projectLabel(task)}<span class="created-label"><span data-icon="clock"></span>${escapeHtml(task.createdAt)}</span></div>
    </div>
    ${priorityBadge(task.priority)}
    <button class="task-action ${isPlanned || isDone ? "is-added" : ""}" type="button" data-action="${actionType}" data-id="${task.id}">${action}</button>
    <button class="task-more" type="button" data-action="detail" data-id="${task.id}" aria-label="查看任务详情"><span data-icon="dots"></span></button>
  </article>`;
}

function renderToday() {
  const planned = tasks
    .filter((task) => task.plannedDate === selectedDateKey())
    .sort((a, b) => Number(a.status === "done") - Number(b.status === "done"));

  refs.todayTotal.textContent = `${planned.length} 项`;
  if (!planned.length) {
    refs.todayList.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon"><span data-icon="calendar"></span></div>
      <strong>今天还没有安排任务</strong>
      <span>从任务池挑选几件重要的事，开始你的 Journal。</span>
    </div>`;
  } else {
    refs.todayList.innerHTML = planned.map((task) => taskRow(task, "today")).join("");
  }
  hydrateIcons(refs.todayList);
}

function poolFilter(task) {
  if (state.filter === "inbox") return task.status === "inbox";
  if (state.filter === "high") return task.priority === "urgent" || task.priority === "high";
  if (state.filter === "done") return task.status === "done";
  return true;
}

function renderPool() {
  const query = state.query.trim().toLowerCase();
  let visible = tasks.filter((task) => {
    const matchesQuery = !query || `${task.title} ${task.project}`.toLowerCase().includes(query);
    return poolFilter(task) && matchesQuery;
  });

  if (state.sort === "priority") {
    const order = { urgent: 0, high: 1, medium: 2, low: 3 };
    visible.sort((a, b) => order[a.priority] - order[b.priority] || b.createdTimestamp - a.createdTimestamp);
  } else {
    visible.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
  }

  const displayTasks = state.showAllPool ? visible : visible.slice(0, 7);
  if (!displayTasks.length) {
    refs.poolList.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon"><span data-icon="search"></span></div>
      <strong>没有找到匹配的任务</strong>
      <span>试试其他关键词或切换筛选条件。</span>
    </div>`;
  } else {
    refs.poolList.innerHTML = displayTasks.map((task) => taskRow(task, "pool")).join("");
  }
  hydrateIcons(refs.poolList);

  const loadMore = document.querySelector("#load-more");
  loadMore.hidden = visible.length <= 7;
  loadMore.innerHTML = state.showAllPool ? `收起任务 <span data-icon="chevron-up"></span>` : `显示更多任务 <span data-icon="chevron-down"></span>`;
  hydrateIcons(loadMore);
}

function renderStats() {
  const planned = tasks.filter((task) => task.plannedDate === selectedDateKey());
  const done = planned.filter((task) => task.status === "done").length;
  const percentage = planned.length ? Math.round((done / planned.length) * 100) : 0;
  const remaining = planned.filter((task) => task.status !== "done").reduce((sum, task) => sum + (Number(task.estimate) || 0), 0);
  const activePool = tasks.filter((task) => task.status !== "done").length;

  refs.statProgress.textContent = `${done} / ${planned.length}`;
  refs.statPercent.textContent = `${percentage}%`;
  refs.statRing.style.setProperty("--progress", `${percentage}%`);
  refs.statProgressHint.textContent = planned.length === 0 ? "先安排一件重要的事" : done === planned.length ? "今天的计划全部完成" : "继续保持节奏";
  refs.statPool.textContent = activePool;
  refs.todayCount.textContent = planned.length;
  refs.poolCount.textContent = activePool;
  refs.sidebarProgress.textContent = `${percentage}%`;
  refs.sidebarProgressBar.style.width = `${percentage}%`;
  refs.sidebarDoneCount.textContent = done;
  refs.sidebarTotalCount.textContent = planned.length;
  refs.journalTaskSummary.textContent = `${done} / ${planned.length} 已完成`;
  refs.journalProgressBar.style.width = `${percentage}%`;
  refs.availableTime.textContent = formatDuration(remaining);
  refs.poolTotal.textContent = `${tasks.length} 件`;
}

function updateDateLabels() {
  const label = dateLabel(state.selectedDate);
  refs.dateLabel.textContent = label;
  refs.planDateLabel.textContent = isToday(state.selectedDate) ? "今天" : formatDate(state.selectedDate, { month: "numeric", day: "numeric" });
  refs.journalDate.textContent = longDateLabel(state.selectedDate).replace(/星期[一二三四五六日]/, "");
  refs.journalNoteTitle.firstChild.textContent = `${label} · `;
}

function updatePageView() {
  const config = {
    today: { title: "今日计划", subtitle: "把注意力留给最重要的几件事。", breadcrumb: "任务管理" },
    pool: { title: "任务池", subtitle: "先收集，再选择今天真正要做的事。", breadcrumb: "任务管理" },
    completed: { title: "已完成", subtitle: "回看已经完成的事情，也看见自己的节奏。", breadcrumb: "任务管理" },
    journal: { title: "Journal", subtitle: "任务计划会和当天的 Journal 保持同步。", breadcrumb: "Journal" },
    insights: { title: "完成统计", subtitle: "用轻量的反馈，调整下一天的安排。", breadcrumb: "任务管理" },
  };
  const current = config[state.activeView] || config.today;
  refs.pageTitle.textContent = current.title;
  refs.pageSubtitle.textContent = current.subtitle;
  refs.breadcrumbTitle.textContent = current.breadcrumb;
  document.querySelectorAll("[data-view]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === state.activeView);
  });
  document.querySelectorAll("[data-filter]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.filter === state.filter);
  });
}

function renderAll() {
  updateDateLabels();
  updatePageView();
  renderStats();
  renderToday();
  renderPool();
}

function findTask(id) {
  return tasks.find((task) => task.id === id);
}

function toggleTask(id) {
  const task = findTask(id);
  if (!task) return;
  if (task.status === "done") {
    task.status = task.plannedDate ? "todo" : "inbox";
    task.completedAt = null;
    showToast(`“${task.title}” 已恢复到待办`);
  } else {
    task.status = "done";
    task.completedAt = new Date().toISOString();
    showToast(`已完成：${task.title}`);
  }
  renderAll();
}

function addTaskToSelectedDate(id) {
  const task = findTask(id);
  if (!task || task.status === "done") return;
  task.plannedDate = selectedDateKey();
  if (task.status === "inbox") task.status = "todo";
  showToast(`已加入${isToday(state.selectedDate) ? "今天" : "所选日期"}计划`);
  renderAll();
}

function removeTaskFromSelectedDate(id) {
  const task = findTask(id);
  if (!task) return;
  task.plannedDate = null;
  if (task.status === "todo" || task.status === "doing") task.status = "inbox";
  showToast("已从今日计划移回任务池");
  renderAll();
}

function handleTaskAction(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id } = target.dataset;
  if (action === "toggle") toggleTask(id);
  if (action === "add") addTaskToSelectedDate(id);
  if (action === "remove") removeTaskFromSelectedDate(id);
  if (action === "detail") openTaskDetail(id);
}

function openTaskDialog() {
  refs.taskForm.reset();
  refs.planToday.checked = true;
  updateDateLabels();
  if (typeof refs.taskDialog.showModal === "function") refs.taskDialog.showModal();
  else refs.taskDialog.setAttribute("open", "");
  window.setTimeout(() => refs.taskTitle.focus(), 80);
}

function closeTaskDialog() {
  if (typeof refs.taskDialog.close === "function") refs.taskDialog.close();
  else refs.taskDialog.removeAttribute("open");
}

function createTask(event) {
  event.preventDefault();
  const title = refs.taskTitle.value.trim();
  if (!title) return;
  const project = document.querySelector("#task-project").value.trim() || "未分类";
  const priority = document.querySelector("#task-priority").value;
  const estimate = Number(document.querySelector("#task-estimate").value);
  const shouldPlan = refs.planToday.checked;
  tasks.unshift({
    id: `task-${Date.now()}`,
    title,
    project,
    priority,
    status: shouldPlan ? "todo" : "inbox",
    estimate,
    createdAt: "刚刚",
    createdTimestamp: Date.now(),
    plannedDate: shouldPlan ? selectedDateKey() : null,
    description: "这是一个新创建的任务，可以在接入 Trilium 后继续补充笔记内容。",
  });
  closeTaskDialog();
  state.showAllPool = false;
  renderAll();
  showToast(shouldPlan ? "任务已创建并加入计划" : "任务已放入任务池");
}

function openTaskDetail(id) {
  const task = findTask(id);
  if (!task) return;
  state.selectedTaskId = id;
  const meta = priorityMeta[task.priority] || priorityMeta.medium;
  const isDone = task.status === "done";
  const isPlanned = task.plannedDate === selectedDateKey();
  refs.detailContent.innerHTML = `<div class="detail-content">
    <div class="detail-header">
      <div>
        <div class="panel-kicker">TASK NOTE · ${escapeHtml(statusMeta[task.status] || "任务")}</div>
        <h2 class="detail-title">${escapeHtml(task.title)}</h2>
      </div>
      <button class="icon-button" type="button" data-detail-action="close" aria-label="关闭"><span data-icon="close"></span></button>
    </div>
    <p class="detail-description">${escapeHtml(task.description || "暂时没有描述。")}</p>
    <div class="detail-fields">
      <div class="detail-field"><span>所属项目</span><strong>${escapeHtml(task.project || "未分类")}</strong></div>
      <div class="detail-field"><span>优先级</span><strong class="${meta.className}">${meta.label} · P${task.priority === "urgent" ? 0 : task.priority === "high" ? 1 : task.priority === "medium" ? 2 : 3}</strong></div>
      <div class="detail-field"><span>创建时间</span><strong>${escapeHtml(task.createdAt)}</strong></div>
      <div class="detail-field"><span>完成时间</span><strong>${escapeHtml(formatClock(task.completedAt))}</strong></div>
    </div>
    <div class="detail-actions">
      <button class="button ${isDone ? "button-secondary" : "button-primary"}" type="button" data-detail-action="toggle" data-id="${task.id}">${isDone ? "恢复任务" : "标记完成"}</button>
      ${isDone ? "" : `<button class="button button-secondary" type="button" data-detail-action="${isPlanned ? "remove" : "add"}" data-id="${task.id}">${isPlanned ? "移出今日" : "加入今日"}</button>`}
    </div>
  </div>`;
  hydrateIcons(refs.detailContent);
  if (typeof refs.detailDialog.showModal === "function") refs.detailDialog.showModal();
  else refs.detailDialog.setAttribute("open", "");
}

function closeDetail() {
  if (typeof refs.detailDialog.close === "function") refs.detailDialog.close();
  else refs.detailDialog.removeAttribute("open");
}

function handleDetailAction(event) {
  const target = event.target.closest("[data-detail-action]");
  if (!target) return;
  const action = target.dataset.detailAction;
  const id = target.dataset.id || state.selectedTaskId;
  if (action === "close") closeDetail();
  if (action === "toggle") {
    closeDetail();
    toggleTask(id);
  }
  if (action === "add") {
    closeDetail();
    addTaskToSelectedDate(id);
  }
  if (action === "remove") {
    closeDetail();
    removeTaskFromSelectedDate(id);
  }
}

function showToast(message) {
  refs.toastMessage.textContent = message;
  refs.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => refs.toast.classList.remove("is-visible"), 2600);
}

function selectView(view) {
  state.activeView = view;
  if (view === "completed") state.filter = "done";
  if (view === "pool") state.filter = "all";
  if (view === "today" || view === "journal" || view === "insights") state.filter = "all";
  state.showAllPool = false;
  renderAll();
  if (view === "pool" || view === "completed") {
    document.querySelector(".pool-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function changeDate(delta) {
  const date = new Date(state.selectedDate);
  date.setDate(date.getDate() + delta);
  state.selectedDate = date;
  state.showAllPool = false;
  renderAll();
}

function initEvents() {
  document.querySelectorAll("[data-view]").forEach((item) => {
    item.addEventListener("click", () => selectView(item.dataset.view));
  });

  document.querySelectorAll("[data-filter]").forEach((item) => {
    item.addEventListener("click", () => {
      state.filter = item.dataset.filter;
      state.activeView = item.dataset.filter === "done" ? "completed" : "pool";
      state.showAllPool = false;
      renderAll();
    });
  });

  refs.todayList.addEventListener("click", handleTaskAction);
  refs.poolList.addEventListener("click", handleTaskAction);
  refs.detailDialog.addEventListener("click", handleDetailAction);
  refs.taskDialog.addEventListener("click", (event) => {
    if (event.target === refs.taskDialog) closeTaskDialog();
  });
  refs.detailDialog.addEventListener("click", (event) => {
    if (event.target === refs.detailDialog) closeDetail();
  });

  document.querySelector("#open-task-dialog").addEventListener("click", openTaskDialog);
  document.querySelector("#add-inline").addEventListener("click", openTaskDialog);
  document.querySelector("#close-task-dialog").addEventListener("click", closeTaskDialog);
  document.querySelector("#cancel-task-dialog").addEventListener("click", closeTaskDialog);
  refs.taskForm.addEventListener("submit", createTask);
  document.querySelector("#previous-day").addEventListener("click", () => changeDate(-1));
  document.querySelector("#next-day").addEventListener("click", () => changeDate(1));
  document.querySelector("#focus-search").addEventListener("click", () => refs.search.focus());
  refs.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.showAllPool = false;
    renderPool();
  });
  document.querySelector("#load-more").addEventListener("click", () => {
    state.showAllPool = !state.showAllPool;
    renderPool();
  });
  document.querySelector("#sort-button").addEventListener("click", () => {
    state.sort = state.sort === "recent" ? "priority" : "recent";
    document.querySelector("#sort-button").innerHTML = `<span data-icon="sort"></span> ${state.sort === "recent" ? "最近创建" : "优先级"} <span data-icon="chevron-down"></span>`;
    hydrateIcons(document.querySelector("#sort-button"));
    renderPool();
    showToast(state.sort === "recent" ? "已按最近创建排序" : "已按优先级排序");
  });
  document.querySelector("#suggest-task").addEventListener("click", () => {
    const suggested = tasks.find((task) => task.plannedDate === selectedDateKey() && task.status !== "done" && (task.priority === "urgent" || task.priority === "high"));
    if (suggested) openTaskDetail(suggested.id);
    else showToast("今天暂时没有高优先级任务");
  });
  document.querySelector("#open-journal").addEventListener("click", () => showToast("原型：这里将打开当前 Journal 笔记"));
  document.querySelector("#open-note").addEventListener("click", () => showToast("原型：这里将跳转到 Trilium Journal 笔记"));
  document.querySelector("#today-menu").addEventListener("click", () => showToast("计划菜单将在接入 Trilium 后提供批量操作"));
  document.querySelector("#journal-more").addEventListener("click", () => showToast("Journal 已与今日计划建立关联"));
  document.querySelector("#filter-button").addEventListener("click", () => {
    document.querySelector("[data-filter=high]").click();
    showToast("已筛选高优先级任务");
  });
  document.querySelector("#load-more").addEventListener("click", () => {
    window.setTimeout(() => hydrateIcons(document.querySelector("#load-more")), 0);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      refs.search.focus();
    }
    if (event.key === "Escape") {
      if (refs.taskDialog.open) closeTaskDialog();
      if (refs.detailDialog.open) closeDetail();
    }
  });
}

hydrateIcons();
initEvents();
renderAll();
