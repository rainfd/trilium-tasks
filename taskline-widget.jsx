/*
 * Taskline · TriliumNext v0.105 Preact Widget
 *
 * Install as a JSX Code note, add #widget to the code note, and add
 * #taskDashboard to the note where the dashboard should appear.
 *
 * This version reads #task notes from Trilium, creates new task notes, and
 * updates existing task attributes/relations when Backend Script is enabled.
 * Without a #taskPool/#taskRoot note it falls back to local demo data.
 */

import { activateNote, createNote, getTodayNote, isBackendScriptingEnabled, runOnBackend, searchForNote, searchForNotes, showMessage } from "trilium:api";
import { defineWidget, useActiveNoteContext, useEffect, useMemo, useRef, useState } from "trilium:preact";

const TASK_QUERY = "#task";
const TASK_POOL_QUERY = "#taskPool";
const LEGACY_TASK_POOL_QUERY = "#taskRoot";
const PRIORITY_NAMES = { urgent: "紧急", high: "高", medium: "中", low: "低" };
const DEMO_TASKS = [
    { id: "demo-1", title: "整理本周项目进展", project: "Trilium 插件", priority: "high", status: "doing", estimate: 45, created: "今天 09:12", planned: true },
    { id: "demo-2", title: "回复重要邮件", project: "个人事务", priority: "medium", status: "todo", estimate: 20, created: "今天 08:48", planned: true },
    { id: "demo-3", title: "确认下周会议议程", project: "团队协作", priority: "urgent", status: "todo", estimate: 25, created: "昨天 17:30", planned: true },
    { id: "demo-19", title: "整理昨日会议纪要", project: "团队协作", priority: "medium", status: "todo", estimate: 30, created: "昨天 17:05", planned: true, carriedFrom: "昨天" },
    { id: "demo-4", title: "阅读 30 分钟", project: "持续学习", priority: "low", status: "done", estimate: 30, created: "昨天 14:05", planned: true, completedAt: "今天 08:56" },
    { id: "demo-5", title: "设计任务池空状态", project: "Trilium 插件", priority: "high", status: "inbox", estimate: 60, created: "今天 08:26", planned: false },
    { id: "demo-6", title: "整理收件箱笔记", project: "知识库维护", priority: "medium", status: "inbox", estimate: 30, created: "昨天 16:22", planned: false },
    { id: "demo-7", title: "给书签添加标签", project: "知识库维护", priority: "low", status: "inbox", estimate: 15, created: "昨天 11:40", planned: false },
    { id: "demo-8", title: "梳理插件数据模型", project: "Trilium 插件", priority: "high", status: "inbox", estimate: 45, created: "3 天前", planned: false },
    { id: "demo-9", title: "更新个人主页简介", project: "个人事务", priority: "medium", status: "inbox", estimate: 30, created: "3 天前", planned: false },
    { id: "demo-10", title: "清理下载目录", project: "系统整理", priority: "low", status: "inbox", estimate: 20, created: "4 天前", planned: false },
    { id: "demo-11", title: "准备周五分享案例", project: "团队协作", priority: "medium", status: "inbox", estimate: 60, created: "上周五", planned: false },
    { id: "demo-12", title: "补充项目 README", project: "Trilium 插件", priority: "high", status: "inbox", estimate: 45, created: "上周四", planned: false },
    { id: "demo-13", title: "备份重要笔记", project: "知识库维护", priority: "low", status: "inbox", estimate: 30, created: "上周三", planned: false },
    { id: "demo-14", title: "整理下月目标草稿", project: "个人成长", priority: "medium", status: "inbox", estimate: 45, created: "上周二", planned: false },
    { id: "demo-15", title: "安装编辑器扩展", project: "开发环境", priority: "low", status: "done", estimate: 15, created: "上周一", planned: false, completedAt: "昨天 18:20" },
    { id: "demo-16", title: "整理年度发票", project: "个人事务", priority: "medium", status: "done", estimate: 40, created: "上周一", planned: false, completedAt: "昨天 16:40" },
    { id: "demo-17", title: "确认域名续费时间", project: "系统维护", priority: "urgent", status: "inbox", estimate: 10, created: "两周前", planned: false },
    { id: "demo-18", title: "整理灵感收集箱", project: "个人成长", priority: "low", status: "inbox", estimate: 35, created: "两周前", planned: false },
];

const CSS = `
.tlp-widget { --tlp-bg: var(--main-background-color, #fff); --tlp-card: var(--main-background-color, #fff); --tlp-ink: var(--main-text-color, #333); --tlp-muted: var(--muted-text-color, #666); --tlp-line: var(--main-border-color, #dbdbdb); --tlp-primary: var(--link-color, #0076af); --tlp-primary-soft: var(--accented-background-color, rgba(0,0,0,.04)); --tlp-green: #3c9b72; --tlp-orange: #b77938; container: taskline / inline-size; display: block; box-sizing: border-box; width: 100%; height: 100%; min-height: 0; max-height: calc(100vh - 84px); overflow-x: hidden; overflow-y: auto; padding: 24px clamp(14px,3vw,38px) 20px; color: var(--tlp-ink); background: var(--tlp-bg); font-family: var(--main-font-family, inherit); scrollbar-gutter: stable; }
.tlp-header-main > div:first-child, .tlp-pool-heading > div:first-child { min-width: 0; }
.tlp-widget h1 { white-space: nowrap; }
.tlp-widget *, .tlp-widget *::before, .tlp-widget *::after { box-sizing: border-box; }
.tlp-widget-hidden { display: none !important; }
.tlp-widget button, .tlp-widget input, .tlp-widget select, .tlp-widget textarea { font: inherit; }
.tlp-widget button { border: 0; cursor: pointer; }
.tlp-widget h1, .tlp-widget h2, .tlp-widget h3, .tlp-widget p { margin: 0; }
.tlp-widget h1 { color: var(--tlp-ink); font-size: clamp(25px,3vw,34px); font-weight: 780; letter-spacing: -.045em; line-height: 1.1; }
.tlp-widget h2 { color: var(--tlp-ink); font-size: 17px; font-weight: 750; letter-spacing: -.035em; }
.tlp-widget small { color: var(--tlp-muted); font-size: 9px; font-weight: 750; letter-spacing: .13em; text-transform: uppercase; }
.tlp-header, .tlp-view-tabs, .tlp-stats, .tlp-content-grid, .tlp-view-content, .tlp-pool-card, .tlp-footer { max-width: 1200px; margin-right: auto; margin-left: auto; }
.tlp-header { margin-bottom: 22px; }
.tlp-brand-line { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; color: var(--tlp-muted); font-size: 9px; font-weight: 800; letter-spacing: .13em; }
.tlp-brand-dot { width: 6px; height: 6px; background: var(--tlp-green); border-radius: 50%; }
.tlp-source-pill { margin-left: 4px; padding: 3px 6px; color: var(--tlp-primary); background: var(--tlp-primary-soft); border: 1px solid var(--tlp-line); border-radius: 5px; font-size: 8px; letter-spacing: .04em; }
.tlp-header-main { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.tlp-subtitle { margin-top: 8px !important; color: var(--tlp-muted); font-size: 12px; }
.tlp-header-actions, .tlp-pool-tools { display: flex; align-items: center; gap: 8px; }
.tlp-button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 0 13px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; transition: transform .16s ease,background .16s ease,box-shadow .16s ease; }
.tlp-button:hover { transform: translateY(-1px); }
.tlp-button:active { transform: translateY(0); }
.tlp-button-primary { color: var(--main-background-color, #fff); background: var(--tlp-primary); border: 1px solid var(--tlp-primary); box-shadow: none; }
.tlp-button-primary:hover { background: color-mix(in srgb, var(--tlp-primary) 85%, var(--tlp-ink)); }
.tlp-button-secondary, .tlp-button-quiet { color: var(--tlp-ink); background: var(--button-background-color, transparent); border: 1px solid var(--tlp-line); }
.tlp-button-secondary:hover, .tlp-button-quiet:hover { color: var(--tlp-primary); background: var(--hover-item-background-color, var(--tlp-primary-soft)); border-color: var(--tlp-primary); }
.tlp-view-tabs { display: flex; align-items: center; gap: 4px; margin-bottom: 18px; padding-bottom: 9px; border-bottom: 1px solid var(--tlp-line); }
.tlp-view-tab, .tlp-filter { position: relative; padding: 0 9px 9px; color: var(--tlp-muted); background: transparent; font-size: 11px; font-weight: 700; }
.tlp-view-tab::after, .tlp-filter::after { position: absolute; right: 9px; bottom: -10px; left: 9px; height: 2px; background: transparent; border-radius: 2px 2px 0 0; content: ""; }
.tlp-view-tab.is-active, .tlp-filter.is-active { color: var(--tlp-primary); }
.tlp-view-tab.is-active::after, .tlp-filter.is-active::after { background: var(--tlp-primary); }
.tlp-tab-count { display: inline-flex; min-width: 18px; justify-content: center; margin-left: 3px; padding: 2px 4px; color: var(--tlp-muted); background: var(--input-background-color, rgba(0,0,0,.06)); border-radius: 5px; font-size: 9px; }
.tlp-view-hint { margin-left: auto; color: var(--tlp-muted); font-size: 10px; }
.tlp-stats { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin-bottom: 16px; }
.tlp-stat { position: relative; display: flex; align-items: center; gap: 12px; min-height: 94px; padding: 16px; overflow: hidden; background: var(--tlp-card); border: 1px solid var(--tlp-line); border-radius: 12px; }
.tlp-stat-primary { color: var(--tlp-ink); background: var(--accented-background-color, var(--tlp-card)); border-color: var(--tlp-line); box-shadow: none; }
.tlp-stat-icon { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; color: var(--tlp-ink); background: var(--input-background-color, rgba(0,0,0,.06)); border-radius: 7px; font-size: 21px; line-height: 1; }
.tlp-stat-primary .tlp-stat-icon { color: var(--tlp-primary); background: var(--tlp-card); }
.tlp-stat-icon-orange, .tlp-stat-icon-green { color: var(--tlp-ink); background: var(--input-background-color, rgba(0,0,0,.06)); }
.tlp-stat > div:nth-child(2) { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.tlp-stat > div:nth-child(2) span, .tlp-stat > div:nth-child(2) small { color: var(--tlp-muted); font-size: 10px; letter-spacing: 0; text-transform: none; }
.tlp-stat strong { color: var(--tlp-ink); font-size: 20px; font-weight: 780; letter-spacing: -.04em; line-height: 1; }
.tlp-stat-primary strong { color: var(--tlp-ink); }
.tlp-stat-trend { margin-left: auto; padding: 4px 6px; color: #47a981; background: #effaf5; border-radius: 6px; font-size: 10px; font-style: normal; font-weight: 750; }
.tlp-ring { position: relative; display: grid; width: 48px; height: 48px; flex: 0 0 auto; margin-left: auto; place-items: center; color: var(--tlp-ink); background: conic-gradient(var(--tlp-primary) var(--tlp-ring,25%),var(--tlp-line) 0); border-radius: 50%; font-size: 10px; }
.tlp-ring::after { position: absolute; inset: 4px; background: var(--accented-background-color, var(--tlp-card)); border-radius: 50%; content: ""; }
.tlp-ring b { position: relative; z-index: 1; }
.tlp-sync-pulse { width: 7px; height: 7px; margin-left: auto; background: var(--tlp-green); border-radius: 50%; box-shadow: 0 0 0 5px rgba(53,173,124,.1); }
.tlp-content-grid { display: grid; grid-template-columns: minmax(0,1.48fr) minmax(280px,.86fr); gap: 16px; margin-bottom: 16px; }
.tlp-card { background: var(--tlp-card); border: 1px solid var(--tlp-line); border-radius: 6px; box-shadow: none; }
.tlp-focus-card, .tlp-journal-card { min-height: 390px; padding: 20px; }
.tlp-card-heading, .tlp-pool-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.tlp-card-heading h2, .tlp-pool-heading h2 { margin-top: 5px; }
.tlp-card-heading h2 b, .tlp-pool-heading h2 b { display: inline-flex; margin-left: 6px; padding: 3px 6px; color: var(--tlp-primary); background: var(--tlp-primary-soft); border: 1px solid var(--tlp-line); border-radius: 4px; font-size: 9px; font-weight: 750; vertical-align: middle; }
.tlp-pool-heading h2 b { color: var(--tlp-muted); background: var(--input-background-color, rgba(0,0,0,.04)); }
.tlp-more { width: 29px; height: 29px; padding: 0; color: #a4acba; background: transparent; border-radius: 7px; font-size: 13px; letter-spacing: 2px; }
.tlp-more:hover { color: var(--tlp-ink); background: #f0f2f6; }
.tlp-sort-trigger { font-size: 18px; letter-spacing: 0; line-height: 1; }
.tlp-focus-tip { display: flex; align-items: center; gap: 9px; margin-top: 16px; padding: 10px; background: var(--accented-background-color, rgba(0,0,0,.03)); border: 1px solid var(--tlp-line); border-radius: 6px; }
.tlp-tip-icon { display: grid; width: 27px; height: 27px; flex: 0 0 auto; place-items: center; color: var(--tlp-primary); background: var(--tlp-card); border: 1px solid var(--tlp-line); border-radius: 6px; }
.tlp-focus-tip > div { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 3px; }
.tlp-focus-tip strong { overflow: hidden; color: var(--tlp-ink); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.tlp-focus-tip small { color: var(--tlp-muted); font-size: 9px; letter-spacing: 0; text-transform: none; }
.tlp-focus-tip small b { color: var(--tlp-primary); }
.tlp-focus-tip > button, .tlp-journal-meta button { padding: 0; color: var(--tlp-primary); background: transparent; font-size: 9px; font-weight: 700; white-space: nowrap; }
.tlp-focus-tip > button:hover, .tlp-journal-meta button:hover { text-decoration: underline; }
.tlp-task-list { margin-top: 11px; }
.tlp-task-row { display: flex; align-items: center; gap: 9px; min-height: 57px; padding: 8px 5px; border-bottom: 1px solid var(--tlp-line); border-radius: 4px; }
.tlp-task-row:hover { background: var(--hover-item-background-color, var(--tlp-primary-soft)); }
.tlp-task-check { display: grid; width: 19px; height: 19px; flex: 0 0 auto; place-items: center; color: transparent; background: var(--tlp-card); border: 1.5px solid var(--tlp-muted); border: 1.5px solid color-mix(in srgb, var(--tlp-ink) 28%, var(--tlp-card)); border-radius: 5px; box-shadow: 0 0 0 1px color-mix(in srgb, var(--tlp-line) 55%, transparent); font-size: 13px; font-weight: 800; }
.tlp-task-check:hover { color: var(--tlp-primary); border-color: var(--tlp-primary); }
.tlp-task-row.is-done .tlp-task-check { color: var(--main-background-color, #fff); background: var(--tlp-green); border-color: var(--tlp-green); }
.tlp-task-body { min-width: 0; flex: 1; }
.tlp-task-title { display: block; max-width: 100%; overflow: hidden; padding: 0; color: var(--tlp-ink); background: transparent; font-size: 11px; font-weight: 700; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
.tlp-task-title:hover { color: var(--tlp-primary); }
.tlp-task-row.is-done .tlp-task-title { color: var(--tlp-muted); text-decoration: line-through; }
.tlp-task-meta { display: flex; align-items: center; gap: 9px; margin-top: 4px; color: var(--tlp-muted); font-size: 9px; }
.tlp-project-dot { display: inline-block; width: 5px; height: 5px; margin-right: 4px; border-radius: 50%; vertical-align: 1px; }
.tlp-priority { display: inline-flex; min-width: 58px; height: 29px; align-items: center; justify-content: center; gap: 6px; flex: 0 0 auto; padding: 0 8px; border: 1px solid var(--tlp-line); border-radius: 7px; font-size: 11px; font-weight: 750; line-height: 1; }
.tlp-priority::before { width: 9px; height: 9px; flex: 0 0 auto; background: currentColor; border-radius: 50%; box-shadow: 0 0 0 2px rgba(255,255,255,.72); content: ""; }
.tlp-priority-urgent { color: #b4233b; background: #ffe6ea; border-color: #efa8b3; }
.tlp-priority-high { color: #b85c16; background: #fff0d9; border-color: #efc27f; }
.tlp-priority-medium { color: #245fc7; background: #e4efff; border-color: #a4c2f5; }
.tlp-priority-low { color: #475569; background: #e8edf3; border-color: #b8c2cf; }
.tlp-task-more, .tlp-task-delete { display: grid; width: 28px; height: 28px; flex: 0 0 auto; place-items: center; background: transparent; border-radius: 6px; }
.tlp-task-more { color: #a6afbf; opacity: 0; }
.tlp-task-delete { color: #c34d5d; }
.tlp-task-row:hover .tlp-task-more { opacity: 1; }
.tlp-task-more:hover { color: #626c80; background: #eef0f5; }
.tlp-task-delete:hover, .tlp-task-delete:focus-visible { color: #fff; background: #c34d5d; }
.tlp-task-more svg, .tlp-task-delete svg { width: 16px; height: 16px; }
.tlp-task-delete svg { stroke-width: 1.9; }
.tlp-add-row { display: flex; align-items: center; gap: 7px; width: 100%; margin-top: 8px; padding: 9px 5px; color: #8f98aa; background: transparent; border-radius: 7px; font-size: 10px; font-weight: 700; text-align: left; }
.tlp-add-row:hover { color: var(--tlp-primary); background: #faf9ff; }
.tlp-add-row span { font-size: 16px; line-height: 1; }
.tlp-journal-card { padding-right: 18px; padding-left: 18px; }
.tlp-journal-card .tlp-card-heading { margin-bottom: 16px; }
.tlp-journal-note { padding: 13px; background: var(--accented-background-color, var(--tlp-card)); border: 1px solid var(--tlp-line); border-radius: 6px; }
.tlp-journal-top { display: flex; align-items: center; gap: 8px; }
.tlp-journal-icon { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; color: var(--tlp-primary); background: var(--tlp-card); border: 1px solid var(--tlp-line); border-radius: 6px; font-size: 16px; }
.tlp-journal-top > div:nth-child(2) { min-width: 0; flex: 1; }
.tlp-journal-top small { color: #baa695; font-size: 8px; }
.tlp-journal-top h3 { overflow: hidden; margin-top: 3px; color: var(--tlp-ink); font-size: 11px; font-weight: 720; text-overflow: ellipsis; white-space: nowrap; }
.tlp-connected { display: inline-flex; align-items: center; gap: 4px; color: #63a480; font-size: 8px; font-weight: 700; white-space: nowrap; }
.tlp-connected i { width: 5px; height: 5px; background: #63a480; border-radius: 50%; }
.tlp-journal-quote { display: flex; gap: 5px; margin: 18px 0 15px 3px; }
.tlp-journal-quote b { color: var(--tlp-muted); font-family: Georgia,serif; font-size: 24px; line-height: .7; }
.tlp-journal-quote p { color: var(--tlp-ink); font-size: 10px; line-height: 1.5; }
.tlp-journal-meta { display: flex; align-items: center; justify-content: space-between; gap: 7px; padding-top: 10px; border-top: 1px solid var(--tlp-line); }
.tlp-journal-meta > span { color: var(--tlp-muted); font-size: 8px; white-space: nowrap; }
.tlp-journal-meta button { color: var(--tlp-primary); font-size: 8px; }
.tlp-sync-summary { margin: 20px 2px 0; }
.tlp-sync-summary > div:first-child { display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--tlp-muted); font-size: 9px; }
.tlp-sync-summary strong { color: var(--tlp-ink); font-size: 9px; }
.tlp-progress { height: 5px; overflow: hidden; background: var(--tlp-line); border-radius: 999px; }
.tlp-progress i { display: block; height: 100%; background: var(--tlp-primary); border-radius: inherit; transition: width .3s ease; }
.tlp-journal-foot { display: flex; align-items: center; gap: 7px; margin-top: 24px; padding: 9px; color: var(--tlp-muted); background: var(--input-background-color, rgba(0,0,0,.03)); border: 1px solid var(--tlp-line); border-radius: 5px; font-size: 8px; }
.tlp-journal-foot span { width: 5px; height: 5px; flex: 0 0 auto; background: #6ec59c; border-radius: 50%; box-shadow: 0 0 0 3px rgba(110,197,156,.12); }
.tlp-pool-card { padding: 19px 20px 12px; }
.tlp-pool-heading { align-items: center; }
.tlp-search { display: flex; align-items: center; gap: 6px; width: 175px; height: 32px; padding: 0 8px; color: var(--tlp-muted); background: var(--input-background-color, rgba(0,0,0,.03)); border: 1px solid var(--tlp-line); border-radius: 5px; }
.tlp-search:focus-within { background: var(--tlp-card); border-color: var(--tlp-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--tlp-primary) 15%, transparent); }
.tlp-search span { font-size: 18px; line-height: 1; }
.tlp-search input { min-width: 0; flex: 1; padding: 0; color: var(--tlp-ink); background: transparent; border: 0; outline: 0; font-size: 10px; }
.tlp-search input::placeholder { color: var(--tlp-muted); }
.tlp-pool-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 18px; border-bottom: 1px solid var(--tlp-line); }
.tlp-filters { display: flex; align-items: center; gap: 3px; }
.tlp-filter { padding-bottom: 10px; }
.tlp-sort { padding: 0 0 10px; color: var(--tlp-muted); background: transparent; font-size: 9px; }
.tlp-sort:hover { color: var(--tlp-primary); }
.tlp-pool-list { min-height: 70px; }
.tlp-pool-row { min-height: 58px; padding: 7px 2px; }
.tlp-status-dot { width: 7px; height: 7px; flex: 0 0 auto; background: #c4cbd7; border-radius: 50%; }
.tlp-status-dot.is-doing { background: var(--tlp-primary); box-shadow: 0 0 0 4px rgba(108,92,231,.1); }
.tlp-status-dot.is-done { background: var(--tlp-green); }
.tlp-pool-action { min-width: 72px; height: 29px; padding: 0 8px; color: var(--tlp-primary); background: transparent; border: 1px solid var(--tlp-line); border-radius: 5px; font-size: 10px; font-weight: 700; white-space: nowrap; opacity: 0; }
.tlp-pool-row:hover .tlp-pool-action, .tlp-pool-action.is-added { opacity: 1; }
.tlp-pool-action.is-added { color: var(--tlp-muted); background: var(--input-background-color, rgba(0,0,0,.03)); }
.tlp-load-more { width: 100%; margin-top: 4px; padding: 10px; color: #919aab; background: transparent; border-top: 1px solid var(--tlp-line); font-size: 9px; font-weight: 700; }
.tlp-load-more:hover { color: var(--tlp-primary); }
.tlp-empty { display: flex; min-height: 130px; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: var(--tlp-muted); text-align: center; }
.tlp-empty strong { color: var(--tlp-ink); font-size: 11px; }
.tlp-empty span { font-size: 9px; }
.tlp-modal { position: fixed; z-index: 50; inset: 0; display: flex; align-items: center; justify-content: center; padding: 18px; font-family: inherit; background: rgba(20,26,44,.42); }
.tlp-modal-box { width: min(490px,100%); font-family: inherit; overflow: hidden; color: var(--tlp-ink); background: var(--tlp-card); border: 1px solid var(--tlp-line); border-radius: 6px; box-shadow: 0 16px 35px rgba(0,0,0,.18); }
.tlp-modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px; border-bottom: 1px solid var(--tlp-line); }
.tlp-modal-header h2 { margin-top: 5px; font-size: 19px; }
.tlp-modal form { padding: 19px 20px 0; }
.tlp-modal label { display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px; color: var(--tlp-ink); font-family: inherit; font-size: 11px; font-weight: 700; }
.tlp-modal label > b { color: var(--tlp-primary); }
.tlp-modal input, .tlp-modal select, .tlp-modal textarea { width: 100%; padding: 0 10px; color: var(--tlp-ink); background: var(--input-background-color, rgba(0,0,0,.035)); border: 1px solid var(--tlp-line); border-radius: 7px; outline: 0; font-size: 12px; }
.tlp-modal input, .tlp-modal select { height: 38px; }
.tlp-modal textarea { min-height: 98px; padding-top: 9px; padding-bottom: 9px; resize: vertical; line-height: 1.55; }
.tlp-modal input:focus, .tlp-modal select:focus, .tlp-modal textarea:focus { background: var(--tlp-card); border-color: var(--tlp-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--tlp-primary) 15%, transparent); }
.tlp-content-field small { margin-top: -1px; color: var(--tlp-muted); font-family: inherit; font-size: 10px; font-weight: 400; letter-spacing: 0; text-transform: none; }
.tlp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tlp-form-check > span:last-child { display: flex; align-items: center; gap: 8px; height: 38px; color: var(--tlp-muted); font-family: inherit; font-size: 11px; font-weight: 550; }
.tlp-form-check input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.tlp-form-check i { position: relative; width: 31px; height: 18px; background: #dfe3eb; border-radius: 999px; }
.tlp-form-check i::after { position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(40,48,73,.2); content: ""; transition: transform .16s ease; }
.tlp-form-check input:checked + i { background: var(--tlp-primary); }
.tlp-form-check input:checked + i::after { transform: translateX(13px); }
.tlp-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin: 3px -20px 0; padding: 13px 20px; background: rgba(120,130,150,.045); border-top: 1px solid var(--tlp-line); }
.tlp-toast { position: fixed; z-index: 60; right: 22px; bottom: 20px; max-width: min(330px,calc(100% - 32px)); padding: 10px 13px; color: #536075; background: #fff; border: 1px solid #e5e8ef; border-radius: 8px; box-shadow: 0 12px 28px rgba(28,37,65,.14); font-size: 10px; font-weight: 700; }
.tlp-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 15px; color: #aab1bf; font-size: 8px; }
.tlp-footer > span:first-child { display: inline-flex; align-items: center; gap: 6px; }
.tlp-footer i { width: 5px; height: 5px; background: #e0a05d; border-radius: 50%; }
@media (max-width:850px) { .tlp-content-grid { grid-template-columns: 1fr; } .tlp-stats { grid-template-columns: 1fr 1fr; } .tlp-view-hint { display: none; } }
@media (max-width:560px) { .tlp-widget { padding: 21px 13px 18px; } .tlp-header-main, .tlp-pool-heading { align-items: flex-start; flex-direction: column; } .tlp-header-actions, .tlp-pool-tools { width: 100%; } .tlp-header-actions .tlp-button { flex: 1; } .tlp-pool-tools .tlp-search { flex: 1; } .tlp-stats { grid-template-columns: 1fr; } .tlp-stat:last-child { grid-column: auto; } .tlp-view-tabs { overflow-x: auto; } .tlp-view-tab { flex: 0 0 auto; } .tlp-filters { overflow-x: auto; } .tlp-pool-toolbar { align-items: flex-start; flex-direction: column; } .tlp-sort { align-self: flex-end; } .tlp-priority { display: inline-flex; } .tlp-pool-action { opacity: 1; white-space: nowrap; } .tlp-form-grid { grid-template-columns: 1fr; gap: 0; } .tlp-footer { align-items: flex-start; flex-direction: column; gap: 7px; } }
@container taskline (max-width: 680px) { .tlp-content-grid { grid-template-columns: 1fr; } .tlp-compact-stats { grid-template-columns: repeat(3,minmax(0,1fr)); } .tlp-compact-stats .tlp-stat:last-child { grid-column: auto; } .tlp-compact-stats .tlp-stat { min-width: 0; gap: 5px; padding: 7px 6px; } .tlp-compact-stats .tlp-stat-icon { width: 22px; height: 22px; border-radius: 4px; font-size: 13px; } .tlp-compact-stats .tlp-stat strong { font-size: 14px; } .tlp-compact-stats .tlp-stat > div:nth-child(2) span, .tlp-compact-stats .tlp-stat > div:nth-child(2) small { font-size: 7px; } .tlp-compact-stats .tlp-ring { width: 30px; height: 30px; font-size: 7px; } .tlp-view-hint { display: none; } }
@container taskline (max-width: 440px) { .tlp-widget { padding: 20px 12px 18px; } .tlp-header-main, .tlp-pool-heading { align-items: flex-start; flex-direction: column; } .tlp-header-actions, .tlp-pool-tools { width: 100%; } .tlp-header-actions .tlp-button { flex: 1; } .tlp-pool-tools .tlp-search { flex: 1; } .tlp-stats { grid-template-columns: 1fr; } .tlp-stat:last-child { grid-column: auto; } .tlp-view-tabs, .tlp-filters { overflow-x: auto; } .tlp-view-tab, .tlp-filter { flex: 0 0 auto; } .tlp-pool-toolbar { align-items: flex-start; flex-direction: column; } .tlp-sort { align-self: flex-end; } .tlp-priority { display: inline-flex; } .tlp-pool-action { opacity: 1; white-space: nowrap; } .tlp-form-grid { grid-template-columns: 1fr; gap: 0; } .tlp-footer { align-items: flex-start; flex-direction: column; gap: 7px; } }
/* Compact single-screen layout. The list itself may scroll, but the widget shell does not. */
.tlp-widget { display: flex; flex-direction: column; overflow: hidden; padding: 24px clamp(18px,3vw,38px) 16px; }
.tlp-header, .tlp-view-tabs, .tlp-stats, .tlp-view-content, .tlp-footer { width: 100%; flex: 0 0 auto; }
.tlp-header { margin-bottom: 14px; }
.tlp-brand-line { margin-bottom: 8px; font-size: 10px; }
.tlp-header-main { align-items: center; }
.tlp-header-main h1 { font-size: clamp(28px,3vw,36px); }
.tlp-subtitle { margin-top: 8px !important; font-size: 12px; }
.tlp-button { min-height: 38px; padding: 0 14px; border-radius: 7px; font-size: 12px; }
.tlp-view-tabs { margin-bottom: 12px; padding-bottom: 9px; }
.tlp-view-tab, .tlp-filter { padding-bottom: 9px; }
.tlp-view-tab::after, .tlp-filter::after { bottom: -10px; }
.tlp-stats { gap: 12px; margin-bottom: 12px; }
.tlp-compact-stats .tlp-stat { min-height: 66px; gap: 10px; padding: 11px 13px; border-radius: 8px; }
.tlp-compact-stats .tlp-stat-icon { width: 30px; height: 30px; border-radius: 7px; font-size: 19px; }
.tlp-compact-stats .tlp-stat strong { font-size: 19px; }
.tlp-compact-stats .tlp-stat > div:nth-child(2) { gap: 2px; }
.tlp-compact-stats .tlp-stat > div:nth-child(2) span, .tlp-compact-stats .tlp-stat > div:nth-child(2) small { font-size: 9px; }
.tlp-compact-stats .tlp-ring { width: 42px; height: 42px; font-size: 9px; }
.tlp-view-content { display: flex; min-height: 0; flex: 1 1 auto; overflow: hidden; }
.tlp-view-panel { display: flex; min-width: 0; min-height: 0; flex: 1 1 auto; flex-direction: column; overflow: hidden; padding: 18px 20px 12px; }
.tlp-view-panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex: 0 0 auto; }
.tlp-view-panel-heading h2 { margin-top: 5px; }
.tlp-panel-scroll { min-height: 0; flex: 1 1 auto; overflow-x: hidden; overflow-y: auto; padding-right: 2px; }
.tlp-today-view .tlp-panel-scroll { margin-top: 8px; }
.tlp-today-view .tlp-add-row { flex: 0 0 auto; margin-top: 8px; }
.tlp-view-panel .tlp-task-row { display: grid; grid-template-columns: 20px minmax(0,1fr) auto auto auto; align-items: center; gap: 10px; min-height: 56px; padding: 9px 6px; }
.tlp-today-view .tlp-task-row { grid-template-columns: 20px minmax(0,1fr) auto 20px; }
.tlp-today-view .tlp-task-body { grid-column: 2; }
.tlp-today-view .tlp-priority { grid-column: 3; }
.tlp-today-view .tlp-task-check { grid-column: 4; }
.tlp-view-panel .tlp-task-meta { margin-top: 3px; font-size: 9px; }
.tlp-view-panel .tlp-task-check { grid-column: 1; width: 20px; height: 20px; }
.tlp-view-panel .tlp-task-body { grid-column: 2; min-width: 0; }
.tlp-view-panel .tlp-priority { grid-column: 3; }
.tlp-view-panel .tlp-task-more { grid-column: 5; opacity: 1; }
.tlp-today-view .tlp-task-check { grid-column: 4; }
.tlp-today-view .tlp-task-more { grid-column: 5; }
.tlp-pool-view .tlp-pool-row { grid-template-columns: 20px minmax(0,1fr) auto auto 28px 28px; }
.tlp-pool-row .tlp-status-dot { grid-column: 1; justify-self: center; width: 8px; height: 8px; }
.tlp-pool-row .tlp-pool-action { grid-column: 4; }
.tlp-pool-row .tlp-task-delete { grid-column: 5; }
.tlp-pool-row .tlp-task-more { grid-column: 6; }
.tlp-priority { display: inline-flex; width: 58px; min-width: 58px; height: 29px; align-items: center; justify-content: center; gap: 6px; padding: 0 8px; font-size: 11px; text-align: center; }
.tlp-pool-action { width: 72px; min-width: 72px; text-align: center; white-space: nowrap; }
.tlp-pool-view .tlp-pool-heading, .tlp-pool-view .tlp-pool-toolbar { flex: 0 0 auto; }
.tlp-pool-view .tlp-pool-toolbar { margin-top: 12px; }
.tlp-pool-view .tlp-panel-scroll { margin-top: 4px; }
.tlp-footer { margin-top: 10px; }
@container taskline (max-width: 440px) { .tlp-compact-stats { gap: 5px; } .tlp-compact-stats .tlp-stat { padding: 6px 7px; } .tlp-compact-stats .tlp-stat-icon, .tlp-compact-stats .tlp-ring { display: none; } .tlp-compact-stats .tlp-stat > div:nth-child(2) span, .tlp-compact-stats .tlp-stat > div:nth-child(2) small { font-size: 7px; } }
@media (max-height: 600px) { .tlp-widget { padding-top: 14px; padding-bottom: 10px; } .tlp-header { margin-bottom: 8px; } .tlp-view-tabs { margin-bottom: 8px; } .tlp-footer { margin-top: 6px; } }
/* Keep the fixed viewport usable even when Trilium's center pane is narrow. */
.tlp-header-main { min-height: 32px; }
.tlp-brand-line { line-height: 10px; }
.tlp-header-main h1 { line-height: 1; }
.tlp-subtitle { line-height: 12px; }
.tlp-view-tabs { min-height: 38px; height: 38px; }
.tlp-view-tab, .tlp-filter { line-height: 14px; }
.tlp-compact-stats .tlp-stat { min-height: 66px; height: 66px; padding: 11px 13px; }
.tlp-compact-stats .tlp-stat > div:nth-child(2) { gap: 0; }
.tlp-compact-stats .tlp-stat > div:nth-child(2) span, .tlp-compact-stats .tlp-stat > div:nth-child(2) small { line-height: 9px; }
.tlp-compact-stats .tlp-stat strong { line-height: 14px; }
.tlp-compact-stats .tlp-stat-icon { width: 30px; height: 30px; }
.tlp-compact-stats .tlp-ring { width: 42px; height: 42px; }
.tlp-compact-stats .tlp-ring::after { inset: 4px; }
.tlp-view-panel-heading > div:first-child, .tlp-pool-heading > div:first-child { line-height: 14px; }
.tlp-view-panel-heading h2 { font-size: 19px; line-height: 23px; }
.tlp-view-panel-heading small, .tlp-pool-heading small { display: block; line-height: 12px; }
.tlp-pool-heading h2 { line-height: 23px; }
.tlp-today-view .tlp-add-row { min-height: 34px; height: 34px; margin-top: 6px; padding: 5px; line-height: 18px; }
.tlp-panel-scroll { min-height: 0; }

/* Let the widget feel native inside Trilium instead of importing a second visual language. */
.tlp-widget {
    --tlp-bg: var(--main-background-color, #fff);
    --tlp-card: var(--main-background-color, #fff);
    --tlp-surface: var(--input-background-color, #f3f3f3);
    --tlp-hover: var(--hover-item-background-color, #e9e9e9);
    --tlp-ink: var(--main-text-color, #333);
    --tlp-muted: var(--muted-text-color, #777);
    --tlp-line: var(--main-border-color, #d6d6d6);
    --tlp-primary: var(--link-color, #1683b3);
    --tlp-danger: var(--danger-color, #c94b55);
    color: var(--tlp-ink);
    background: var(--tlp-bg);
    font-size: var(--main-font-size, 14px);
}
.tlp-widget h1 { font-weight: 650; letter-spacing: -.025em; }
.tlp-widget h2 { font-weight: 650; letter-spacing: -.018em; }
.tlp-widget small { font-weight: 600; letter-spacing: .08em; }
.tlp-button { min-height: 34px; border-radius: 4px; box-shadow: none; font-weight: 600; transition: background .15s ease, border-color .15s ease, color .15s ease; }
.tlp-button:hover { transform: none; }
.tlp-button-primary { color: var(--tlp-bg); background: var(--tlp-primary); border-color: var(--tlp-primary); box-shadow: none; }
.tlp-button-primary:hover { background: color-mix(in srgb, var(--tlp-primary) 86%, var(--tlp-ink)); }
.tlp-button-secondary, .tlp-button-quiet { color: var(--tlp-ink); background: var(--button-background-color, var(--tlp-surface)); border-color: var(--tlp-line); }
.tlp-button-secondary:hover, .tlp-button-quiet:hover { color: var(--tlp-ink); background: var(--tlp-hover); border-color: var(--tlp-line); }
.tlp-source-pill { color: var(--tlp-primary); background: var(--tlp-surface); border-color: var(--tlp-line); border-radius: 3px; }
.tlp-view-tabs { border-color: var(--tlp-line); }
.tlp-view-tab, .tlp-filter { color: var(--tlp-muted); font-weight: 500; }
.tlp-view-tab.is-active, .tlp-filter.is-active { color: var(--tlp-primary); }
.tlp-view-tab::after, .tlp-filter::after { background: transparent; border-radius: 0; }
.tlp-view-tab.is-active::after, .tlp-filter.is-active::after { background: var(--tlp-primary); }
.tlp-tab-count { color: var(--tlp-muted); background: var(--tlp-surface); border: 1px solid var(--tlp-line); border-radius: 3px; }
.tlp-stat, .tlp-card { box-shadow: none; border-color: var(--tlp-line); }
.tlp-stat { border-radius: 8px; }
.tlp-stat-primary { color: var(--tlp-ink); background: var(--tlp-surface); border-color: var(--tlp-line); }
.tlp-stat-primary .tlp-stat-icon { color: var(--tlp-primary); background: var(--tlp-card); border: 1px solid var(--tlp-line); }
.tlp-stat-icon, .tlp-stat-icon-orange, .tlp-stat-icon-green { color: var(--tlp-ink); background: var(--tlp-surface); }
.tlp-ring { color: var(--tlp-ink); background: conic-gradient(var(--tlp-primary) var(--tlp-ring,25%), var(--tlp-line) 0); }
.tlp-ring::after { background: var(--tlp-surface); }
.tlp-card { border-radius: 6px; }
.tlp-card-heading h2 b, .tlp-pool-heading h2 b { color: var(--tlp-muted); background: var(--tlp-surface); border-color: var(--tlp-line); border-radius: 3px; }
.tlp-focus-tip { background: var(--tlp-surface); border-color: var(--tlp-line); border-radius: 4px; }
.tlp-tip-icon { color: var(--tlp-primary); background: var(--tlp-card); border-color: var(--tlp-line); border-radius: 4px; }
.tlp-task-row { border-bottom-color: var(--tlp-line); border-radius: 3px; }
.tlp-task-row:hover { background: var(--tlp-hover); }
.tlp-task-title { color: var(--tlp-ink); font-weight: 500; }
.tlp-task-title:hover { color: var(--tlp-primary); }
.tlp-task-meta { color: var(--tlp-muted); }
.tlp-task-check { background: var(--tlp-card); border-color: var(--tlp-line); box-shadow: none; }
.tlp-task-check:hover { color: var(--tlp-primary); border-color: var(--tlp-primary); background: var(--tlp-surface); }
.tlp-priority { border-radius: 4px; }
.tlp-priority-urgent { color: #b4232f; background: color-mix(in srgb, #e05260 12%, var(--tlp-card)); border-color: color-mix(in srgb, #e05260 42%, var(--tlp-line)); }
.tlp-priority-high { color: #ad5b16; background: color-mix(in srgb, #e5a048 14%, var(--tlp-card)); border-color: color-mix(in srgb, #e5a048 42%, var(--tlp-line)); }
.tlp-priority-medium { color: var(--tlp-primary); background: color-mix(in srgb, var(--tlp-primary) 11%, var(--tlp-card)); border-color: color-mix(in srgb, var(--tlp-primary) 42%, var(--tlp-line)); }
.tlp-priority-low { color: var(--tlp-ink); background: var(--tlp-surface); border-color: var(--tlp-line); }
.tlp-pool-action { color: var(--tlp-primary); background: transparent; border: 1px solid transparent; border-radius: 4px; font-weight: 500; }
.tlp-pool-action:hover { background: var(--tlp-hover); }
.tlp-pool-action.is-added { color: var(--tlp-muted); background: var(--button-background-color, var(--tlp-surface)); border-color: transparent; }
.tlp-task-delete { color: var(--tlp-danger); border-radius: 4px; }
.tlp-task-delete:hover, .tlp-task-delete:focus-visible { color: var(--tlp-danger); background: color-mix(in srgb, var(--tlp-danger) 12%, var(--tlp-card)); }
.tlp-task-more { color: var(--tlp-muted); border-radius: 4px; }
.tlp-task-more:hover { color: var(--tlp-ink); background: var(--tlp-hover); }
.tlp-search { height: 34px; color: var(--tlp-muted); background: var(--tlp-surface); border-color: var(--tlp-line); border-radius: 4px; }
.tlp-search:focus-within { background: var(--tlp-card); border-color: var(--tlp-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--tlp-primary) 16%, transparent); }
.tlp-search input { color: var(--tlp-ink); font-size: 11px; }
.tlp-pool-toolbar { border-color: var(--tlp-line); }
.tlp-sort { color: var(--tlp-muted); font-weight: 500; }
.tlp-sort:hover { color: var(--tlp-primary); }
.tlp-load-more { color: var(--tlp-muted); border-color: var(--tlp-line); font-weight: 500; }
.tlp-load-more:hover { color: var(--tlp-primary); }
.tlp-modal-box { border-radius: 6px; box-shadow: 0 10px 28px rgba(0,0,0,.18); }
.tlp-modal input, .tlp-modal select, .tlp-modal textarea { background: var(--tlp-surface); border-color: var(--tlp-line); border-radius: 4px; }
.tlp-modal input:focus, .tlp-modal select:focus, .tlp-modal textarea:focus { background: var(--tlp-card); border-color: var(--tlp-primary); }
.tlp-modal-actions { background: var(--tlp-surface); border-color: var(--tlp-line); }
.tlp-footer { color: var(--tlp-muted); }
`;

function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function normalizeStatus(value, completedAt) {
    const status = String(value || "").toLowerCase();
    if (status === "done" || status === "completed") return "done";
    if (status === "doing" || status === "in-progress") return "doing";
    if (status === "todo" || status === "planned" || status === "open") return "todo";
    return completedAt ? "done" : "inbox";
}

function normalizePriority(value) {
    const priority = String(value || "medium").toLowerCase();
    if (["p0", "urgent", "critical"].includes(priority)) return "urgent";
    if (["p1", "high"].includes(priority)) return "high";
    if (["p3", "low"].includes(priority)) return "low";
    return "medium";
}

function formatCreated(value) {
    if (!value) return "Trilium 笔记";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(date);
}

function formatCarriedFrom(value) {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [, month, day] = value.split("-").map(Number);
        return `${month}月${day}日`;
    }
    return String(value);
}

function todayKey() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function findTaskPool() {
    return await searchForNote(TASK_POOL_QUERY) || await searchForNote(LEGACY_TASK_POOL_QUERY);
}

async function ensureTaskMonthNote(taskPool) {
    if (!taskPool || !taskPool.noteId) return taskPool;
    const date = new Date();
    const yearKey = String(date.getFullYear());
    const monthKey = `${yearKey}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    let yearNote = await searchForNote(`#taskYear="${yearKey}"`);
    if (!yearNote) {
        const created = await createNote(taskPool.noteId, { title: `${yearKey}年`, type: "book", mime: "", activate: false, attributes: [{ type: "label", name: "taskYear", value: yearKey }] });
        yearNote = created && created.note;
    }
    const parent = yearNote && yearNote.noteId ? yearNote : taskPool;
    let monthNote = await searchForNote(`#taskMonth="${monthKey}"`);
    if (!monthNote) {
        const created = await createNote(parent.noteId, { title: `${yearKey}年${String(date.getMonth() + 1).padStart(2, "0")}月`, type: "book", mime: "", activate: false, attributes: [{ type: "label", name: "taskMonth", value: monthKey }] });
        monthNote = created && created.note;
    }
    return monthNote && monthNote.noteId ? monthNote : parent;
}

async function mapTriliumTask(note, journalNoteId) {
    const label = name => (note.getLabelValue ? note.getLabelValue(name) : "") || "";
    const completedAt = label("taskCompletedAt");
    const plannedDate = label("taskPlannedDate") || label("plannedDate");
    const status = normalizeStatus(label("taskStatus") || label("status"), completedAt);
    const today = todayKey();
    let journalLinked = false;
    let oldJournalIds = [];
    if (journalNoteId && note.getRelationTargets) {
        try {
            const targets = await note.getRelationTargets("plannedIn");
            const validTargets = Array.isArray(targets) ? targets.filter(target => target && target.noteId) : [];
            journalLinked = validTargets.some(target => target.noteId === journalNoteId);
            oldJournalIds = validTargets.filter(target => target.noteId !== journalNoteId).map(target => target.noteId);
        } catch (error) {
            console.warn("Taskline: unable to read plannedIn relation", error);
        }
    }
    const planned = plannedDate === today || journalLinked;
    const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(plannedDate);
    const dateOverdue = isIsoDate && plannedDate < today;
    const relationOverdue = oldJournalIds.length > 0;
    // 未完成且计划日期早于今天（或仍指向旧 Journal）的任务，视为“待顺延”
    const overdue = status !== "done" && (dateOverdue || relationOverdue);
    const carriedFrom = label("taskInheritedFrom") || (dateOverdue ? plannedDate : "");
    const rawCreated = (note.dto && note.dto.dateCreated) || label("taskCreatedAt");
    return {
        id: note.noteId,
        noteId: note.noteId,
        title: note.title || "未命名任务",
        project: label("taskProject") || label("project") || "未分类",
        priority: normalizePriority(label("taskPriority") || label("priority")),
        status,
        estimate: Number(label("taskEstimate") || 30),
        created: formatCreated(rawCreated),
        planned,
        overdue,
        carriedFrom,
        oldJournalIds,
        plannedDate,
        journalLinked,
        completedAt: completedAt || null,
    };
}

async function updateTriliumTask(noteId, changes) {
    if (!isBackendScriptingEnabled()) {
        throw new Error("Backend Script 未启用，请在 Trilium 的 Security 设置中启用后重试。");
    }
    await runOnBackend((id, patch) => {
        const task = api.getNote(id);
        if (!task) throw new Error(`找不到任务笔记：${id}`);
        if (patch.status) task.setLabel("taskStatus", patch.status);
        if (Object.prototype.hasOwnProperty.call(patch, "completedAt")) {
            if (patch.completedAt) task.setLabel("taskCompletedAt", patch.completedAt);
            else task.removeLabel("taskCompletedAt");
        }
        if (Object.prototype.hasOwnProperty.call(patch, "planned")) {
            if (patch.planned) {
                if (patch.plannedDate) task.setLabel("taskPlannedDate", patch.plannedDate);
                if (patch.journalNoteId) task.setRelation("plannedIn", patch.journalNoteId);
            } else {
                task.removeLabel("taskPlannedDate");
                task.removeRelation("plannedIn");
            }
        }
    }, [noteId, changes]);
}

async function deleteTriliumTask(noteId) {
    if (!isBackendScriptingEnabled()) {
        throw new Error("Backend Script 未启用，请在 Trilium 的 Security 设置中启用后重试。");
    }
    await runOnBackend(id => {
        const task = api.getNote(id);
        if (!task) throw new Error(`找不到任务笔记：${id}`);
        const tableMarker = 'data-taskline-tasks="true"';
        const rowPattern = new RegExp('<tr[^>]*data-taskline-task="' + id + '"[^>]*>[\\s\\S]*?</tr>', "g");
        const legacyPattern = new RegExp('<p[^>]*data-taskline-task="' + id + '"[^>]*>[\\s\\S]*?</p>', "g");
        const relations = typeof task.getOwnedRelations === "function" ? task.getOwnedRelations("plannedIn") || [] : [];
        const journalIds = new Set();
        for (const relation of relations) {
            if (relation && relation.value) journalIds.add(relation.value);
        }
        for (const journalId of journalIds) {
            const journal = api.getNote(journalId);
            if (!journal) continue;
            const content = typeof journal.getContent() === "string" ? journal.getContent() : "";
            let nextContent = content.replace(rowPattern, "").replace(legacyPattern, "");
            if (nextContent.includes(tableMarker) && !nextContent.includes('data-taskline-task="')) {
                nextContent = nextContent.replace(/<h2[^>]*data-taskline-tasks-heading="true"[^>]*>Tasks:<\/h2>\s*<table[^>]*data-taskline-tasks="true"[^>]*>[\s\S]*?<\/table>/i, "");
            }
            if (nextContent !== content) journal.setContent(nextContent.replace(/\n{3,}/g, "\n\n"));
        }
        if (typeof task.deleteNote !== "function") throw new Error("当前 Trilium API 不支持删除任务笔记。");
        task.deleteNote();
    }, [noteId]);
}

async function syncJournalTaskLink(taskId, journalNoteId, mode) {
    if (!journalNoteId) return;
    if (!isBackendScriptingEnabled()) {
        throw new Error("Backend Script 未启用，无法写入 Journal 任务链接。");
    }
    await runOnBackend((id, journalId, change) => {
        const task = api.getNote(id);
        const journal = api.getNote(journalId);
        if (!task) throw new Error(`找不到任务笔记：${id}`);
        if (!journal) throw new Error(`找不到 Journal 笔记：${journalId}`);
        const marker = `data-taskline-task="${id}"`;
        const tableMarker = 'data-taskline-tasks="true"';
        const content = typeof journal.getContent() === "string" ? journal.getContent() : "";
        const rawStatus = String(task.getLabelValue("taskStatus") || "").toLowerCase();
        const status = rawStatus === "done" || task.getLabelValue("taskCompletedAt") ? "done" : rawStatus === "doing" ? "doing" : rawStatus === "todo" ? "todo" : "inbox";
        const statusLabels = { done: "已完成", doing: "进行中", todo: "待完成", inbox: "待安排" };
        const priorityLabels = { urgent: "紧急", high: "高", medium: "中", low: "低" };
        const rawPriority = String(task.getLabelValue("taskPriority") || task.getLabelValue("priority") || "medium").toLowerCase();
        const priorityText = priorityLabels[rawPriority] || api.escapeHtml(rawPriority);
        const title = api.escapeHtml(task.title || "未命名任务");
        const statusText = statusLabels[status];
        const row = `<tr class="taskline-journal-task" ${marker}><td><a href="#root/${id}">${title}</a></td><td><span class="taskline-priority taskline-priority-${rawPriority}">${priorityText}</span></td><td><span class="taskline-status taskline-status-${status}">${statusText}</span></td></tr>`;
        const rowPattern = new RegExp('<tr[^>]*data-taskline-task="' + id + '"[^>]*>[\\s\\S]*?</tr>', "g");
        const legacyPattern = new RegExp('<p[^>]*data-taskline-task="' + id + '"[^>]*>[\\s\\S]*?</p>', "g");
        const tableHead = "<thead><tr><th>任务</th><th>优先度</th><th>状态</th></tr></thead>";
        let nextContent = content;
        if (change === "carry") {
            // 任务顺延后，在旧 Journal 中把状态标记为“已顺延”，保留历史记录
            const carriedSpan = '<span class="taskline-status taskline-status-carried">已顺延</span>';
            nextContent = nextContent.replace(rowPattern, match => match.replace(/<span class="taskline-status[^"]*">[^<]*<\/span>/g, carriedSpan));
            nextContent = nextContent.replace(legacyPattern, match => match.replace(/<span class="taskline-status[^"]*">[^<]*<\/span>/g, carriedSpan));
        } else if (change === true || change === "add") {
            nextContent = nextContent.replace(rowPattern, row).replace(legacyPattern, "");
            if (!nextContent.includes(marker)) {
                if (nextContent.includes(tableMarker)) {
                    nextContent = nextContent.replace(/<thead>[\s\S]*?<\/thead>/i, tableHead).replace(/<\/tbody>/i, `${row}</tbody>`);
                } else {
                    const section = `<h2 data-taskline-tasks-heading="true">Tasks:</h2><table class="taskline-journal-table" ${tableMarker}>${tableHead}<tbody>${row}</tbody></table>`;
                    const separator = nextContent.trim() ? "\n" : "";
                    nextContent = `${nextContent}${separator}${section}`;
                }
            }
        } else {
            nextContent = nextContent.replace(rowPattern, "").replace(legacyPattern, "");
            if (nextContent.includes(tableMarker) && !nextContent.includes('data-taskline-task="')) {
                nextContent = nextContent.replace(/<h2[^>]*data-taskline-tasks-heading="true"[^>]*>Tasks:<\/h2>\s*<table[^>]*data-taskline-tasks="true"[^>]*>[\s\S]*?<\/table>/i, "");
            }
        }
        if (nextContent !== content) journal.setContent(nextContent.replace(/\n{3,}/g, "\n\n"));
    }, [taskId, journalNoteId, mode]);
}

/*
 * 自动顺延：把计划日期早于今天、且尚未完成的任务搬到今天的计划中。
 * - 更新 taskPlannedDate 为今天，plannedIn 改为指向今天的 Journal
 * - 旧 Journal 中的任务行标记为“已顺延”，新 Journal 中补齐任务行
 * - 首次顺延时记录 taskInheritedFrom（最早的计划日期）
 * 一次性在单个 backend 调用中顺序执行，避免并发读写同一 Journal。
 */
async function rolloverOverdueTasks(tasks, journalNote) {
    if (!journalNote || !journalNote.noteId || !tasks.length) return 0;
    const payload = tasks.map(task => ({
        noteId: task.noteId,
        oldJournalIds: Array.isArray(task.oldJournalIds) ? task.oldJournalIds : [],
        inheritedFrom: task.carriedFrom || task.plannedDate || "",
        status: task.status,
        priority: task.priority,
        title: task.title,
    }));
    const today = todayKey();
    return await runOnBackend((items, todayJournalId, targetDate) => {
        const statusLabels = { done: "已完成", doing: "进行中", todo: "待完成", inbox: "待安排" };
        const priorityLabels = { urgent: "紧急", high: "高", medium: "中", low: "低" };
        const carriedSpan = '<span class="taskline-status taskline-status-carried">已顺延</span>';
        let count = 0;
        for (const item of items) {
            const task = api.getNote(item.noteId);
            if (!task) continue;
            // 1) 旧 Journal 标记“已顺延”
            for (const oldId of item.oldJournalIds) {
                if (oldId === todayJournalId) continue;
                const journal = api.getNote(oldId);
                if (!journal) continue;
                const content = typeof journal.getContent() === "string" ? journal.getContent() : "";
                const rowPattern = new RegExp('<tr[^>]*data-taskline-task="' + item.noteId + '"[^>]*>[\\s\\S]*?</tr>', "g");
                const legacyPattern = new RegExp('<p[^>]*data-taskline-task="' + item.noteId + '"[^>]*>[\\s\\S]*?</p>', "g");
                let next = content.replace(rowPattern, match => match.replace(/<span class="taskline-status[^"]*">[^<]*<\/span>/g, carriedSpan));
                next = next.replace(legacyPattern, match => match.replace(/<span class="taskline-status[^"]*">[^<]*<\/span>/g, carriedSpan));
                if (next !== content) journal.setContent(next.replace(/\n{3,}/g, "\n\n"));
            }
            // 2) 计划日期与关系移动到今天
            const existingFrom = task.getLabelValue("taskInheritedFrom");
            const inheritedFrom = existingFrom || item.inheritedFrom || "";
            task.setLabel("taskPlannedDate", targetDate);
            if (inheritedFrom) task.setLabel("taskInheritedFrom", inheritedFrom);
            task.removeRelation("plannedIn");
            task.setRelation("plannedIn", todayJournalId);
            // 3) 今天的 Journal 补齐任务行
            const journal = api.getNote(todayJournalId);
            if (journal) {
                const marker = `data-taskline-task="${item.noteId}"`;
                const tableMarker = 'data-taskline-tasks="true"';
                const content = typeof journal.getContent() === "string" ? journal.getContent() : "";
                const status = item.status === "done" ? "done" : item.status || "todo";
                const statusText = statusLabels[status] || "待完成";
                const priorityText = priorityLabels[item.priority] || api.escapeHtml(item.priority);
                const title = api.escapeHtml(item.title || "未命名任务");
                const row = `<tr class="taskline-journal-task" ${marker}><td><a href="#root/${item.noteId}">${title}</a></td><td><span class="taskline-priority taskline-priority-${item.priority}">${priorityText}</span></td><td><span class="taskline-status taskline-status-${status}">${statusText}</span></td></tr>`;
                const rowPattern = new RegExp('<tr[^>]*data-taskline-task="' + item.noteId + '"[^>]*>[\\s\\S]*?</tr>', "g");
                const legacyPattern = new RegExp('<p[^>]*data-taskline-task="' + item.noteId + '"[^>]*>[\\s\\S]*?</p>', "g");
                const tableHead = "<thead><tr><th>任务</th><th>优先度</th><th>状态</th></tr></thead>";
                let nextContent = content.replace(rowPattern, row).replace(legacyPattern, "");
                if (!nextContent.includes(marker)) {
                    if (nextContent.includes(tableMarker)) {
                        nextContent = nextContent.replace(/<thead>[\s\S]*?<\/thead>/i, tableHead).replace(/<\/tbody>/i, `${row}</tbody>`);
                    } else {
                        const section = `<h2 data-taskline-tasks-heading="true">Tasks:</h2><table class="taskline-journal-table" ${tableMarker}>${tableHead}<tbody>${row}</tbody></table>`;
                        const separator = nextContent.trim() ? "\n" : "";
                        nextContent = `${nextContent}${separator}${section}`;
                    }
                }
                if (nextContent !== content) journal.setContent(nextContent.replace(/\n{3,}/g, "\n\n"));
            }
            count += 1;
        }
        return count;
    }, [payload, journalNote.noteId, today]);
}

async function ensureJournalTaskLinks(tasks, journalNote) {
    if (!journalNote || !journalNote.noteId || !isBackendScriptingEnabled()) return;
    const plannedTasks = tasks.filter(task => task.planned && task.noteId);
    await Promise.all(plannedTasks.map(task => syncJournalTaskLink(task.noteId, journalNote.noteId, true).catch(error => {
        console.warn(`Taskline: unable to link task ${task.noteId} in Journal`, error);
    })));
}

function TaskRow({ task, today, onAction }) {
    const done = task.status === "done";
    const priorityClass = `tlp-priority tlp-priority-${task.priority}`;
    const metaText = today ? done ? `完成于 ${task.completedAt || "刚刚"}` : task.carriedFrom ? `从 ${formatCarriedFrom(task.carriedFrom)} 顺延 · ${task.status === "doing" ? "进行中" : "待完成"}` : task.status === "doing" ? "进行中" : "待完成" : `创建于 ${task.created}`;
    if (today) {
        return <div class={`tlp-task-row ${done ? "is-done" : ""}`}>
            <div class="tlp-task-body">
                <button class="tlp-task-title" type="button" onClick={() => onAction("detail", task.id)}>{task.title}</button>
                <div class="tlp-task-meta"><span>◷ {metaText}</span></div>
            </div>
            <span class={priorityClass}>{PRIORITY_NAMES[task.priority]}</span>
            <button class="tlp-task-check" type="button" onClick={() => onAction("toggle", task.id)} aria-label={done ? "恢复任务" : "完成任务"}>{done ? "✓" : ""}</button>
        </div>;
    }
    const isPlanned = task.planned || task.overdue;
    const action = done ? "查看" : isPlanned ? "已加入" : "加入今天";
    const actionName = done ? "detail" : isPlanned ? "remove" : "add";
    return <div class={`tlp-task-row tlp-pool-row ${done ? "is-done" : ""}`}>
        <i class={`tlp-status-dot ${task.status === "doing" ? "is-doing" : done ? "is-done" : ""}`}></i>
        <div class="tlp-task-body">
            <button class="tlp-task-title" type="button" onClick={() => onAction("detail", task.id)}>{task.title}</button>
            <div class="tlp-task-meta"><span>◷ {metaText}</span></div>
        </div>
        <span class={priorityClass}>{PRIORITY_NAMES[task.priority]}</span>
        <button class={`tlp-pool-action ${isPlanned || done ? "is-added" : ""}`} type="button" onClick={() => onAction(actionName, task.id)}>{action}</button>
        <button class="tlp-task-delete" type="button" onClick={() => onAction("delete", task.id)} aria-label={`删除任务：${task.title}`} title="删除任务"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path></svg></button>
        <button class="tlp-task-more" type="button" onClick={() => onAction("detail", task.id)} aria-label="任务详情">•••</button>
    </div>;
}

function TasklineScreen() {
    const { note } = useActiveNoteContext();
    const [tasks, setTasks] = useState(DEMO_TASKS.map(task => ({ ...task })));
    const [source, setSource] = useState("loading");
    const [taskRoot, setTaskRoot] = useState(null);
    const [journal, setJournal] = useState(null);
    const [reloadToken, setReloadToken] = useState(0);
    const [activeView, setActiveView] = useState("today");
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [sortByPriority, setSortByPriority] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [toast, setToast] = useState("");
    const [form, setForm] = useState({ title: "", content: "", priority: "low", plan: true });
    const rolloverAttemptedRef = useRef("");

    useEffect(() => {
        if (!note || !note.hasLabel("taskDashboard")) return undefined;
        let cancelled = false;
        setSource("loading");
        async function load() {
            try {
                const [notes, rootNote, journalNote] = await Promise.all([
                    searchForNotes(TASK_QUERY),
                    findTaskPool(),
                    getTodayNote(),
                ]);
                const taskNotes = Array.isArray(notes) ? notes.filter(item => item && item.noteId) : [];
                if (cancelled) return;
                setJournal(journalNote || null);
                setTaskRoot(rootNote || null);
                if (!taskNotes.length && !rootNote) {
                    setTasks(DEMO_TASKS.map(task => ({ ...task })));
                    setSource("demo");
                    return;
                }
                const mapped = await Promise.all(taskNotes.map(item => mapTriliumTask(item, journalNote && journalNote.noteId)));
                if (cancelled) return;
                // 自动顺延：把未完成的过期计划任务搬到今天的计划（每天只尝试一次，避免失败时反复重试）
                const today = todayKey();
                const overdue = mapped.filter(task => task.overdue && task.noteId);
                if (overdue.length && typeof isBackendScriptingEnabled === "function" && isBackendScriptingEnabled() && rolloverAttemptedRef.current !== today) {
                    rolloverAttemptedRef.current = today;
                    try {
                        const carried = await rolloverOverdueTasks(overdue, journalNote);
                        if (carried > 0) {
                            if (cancelled) return;
                            toastMessage(`已自动顺延 ${carried} 个未完成任务到今天`);
                            setReloadToken(value => value + 1);
                            return;
                        }
                    } catch (error) {
                        console.warn("Taskline: automatic carry-over failed", error);
                    }
                }
                setTasks(mapped);
                setSource("trilium");
                void ensureJournalTaskLinks(mapped, journalNote);
            } catch (error) {
                if (cancelled) return;
                console.warn("Taskline: unable to load #task notes", error);
                setTasks(DEMO_TASKS.map(task => ({ ...task })));
                setSource("demo");
            }
        }
        load();
        return () => { cancelled = true; };
    }, [note && note.noteId, note && note.hasLabel("taskDashboard"), reloadToken]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(""), 2400);
        return () => window.clearTimeout(timer);
    }, [toast]);

    // 今日计划 = 计划在今天 + 尚未完成且待顺延的过期任务（自动继承）
    const planned = useMemo(() => tasks.filter(task => task.planned || task.overdue), [tasks]);
    const doneCount = planned.filter(task => task.status === "done").length;
    const percentage = planned.length ? Math.round(doneCount / planned.length * 100) : 0;
    const remaining = planned.filter(task => task.status !== "done").reduce((total, task) => total + (Number(task.estimate) || 0), 0);
    const activePool = tasks.filter(task => task.status !== "done").length;
    const filteredPool = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const list = tasks.filter(task => {
            const matchesQuery = !normalizedQuery || `${task.title} ${task.project}`.toLowerCase().includes(normalizedQuery);
            const matchesFilter = filter === "inbox" ? task.status === "inbox" : filter === "high" ? ["urgent", "high"].includes(task.priority) : filter === "done" ? task.status === "done" : true;
            return matchesQuery && matchesFilter;
        });
        if (sortByPriority) {
            const order = { urgent: 0, high: 1, medium: 2, low: 3 };
            return list.slice().sort((a, b) => order[a.priority] - order[b.priority]);
        }
        return list;
    }, [tasks, query, filter, sortByPriority]);
    const visiblePool = showAll ? filteredPool : filteredPool.slice(0, 7);

    function toastMessage(message) {
        setToast(message);
        showMessage(message);
    }

    function backendReady() {
        return typeof isBackendScriptingEnabled === "function" && isBackendScriptingEnabled();
    }

    function backendRequiredMessage() {
        toastMessage("请在 Trilium 的 Security 设置中启用 Backend Script 后再修改任务。");
    }

    function handleWriteError(error) {
        console.error("Taskline: write failed", error);
        toastMessage(error && error.message ? error.message : "写入 Trilium 失败，请查看日志。");
    }

    async function handleTaskAction(action, id) {
        const task = tasks.find(item => item.id === id);
        if (!task) return;
        if (action === "detail") {
            if (source === "trilium" && task.noteId) {
                await activateNote(task.noteId);
            } else {
                toastMessage(`${task.title} · ${PRIORITY_NAMES[task.priority]}优先级 · ${task.status === "done" ? "已完成" : task.planned ? "今日计划" : "待安排"}`);
            }
            return;
        }
        if (action === "delete") {
            if (typeof window === "undefined" || typeof window.confirm !== "function") {
                toastMessage("当前环境不支持确认删除，请在 Trilium 中手动删除。");
                return;
            }
            if (!window.confirm(`确定删除“${task.title}”吗？此操作不可恢复。`)) return;
        }
        if (source === "loading") {
            toastMessage("正在同步 Trilium 任务，请稍候。");
            return;
        }
        if (source === "demo") {
            if (action === "delete") {
                setTasks(current => current.filter(item => item.id !== id));
                toastMessage(`已删除：${task.title}`);
            }
            if (action === "toggle") {
                setTasks(current => current.map(item => item.id === id ? { ...item, status: item.status === "done" ? item.planned ? "todo" : "inbox" : "done", completedAt: item.status === "done" ? null : "刚刚" } : item));
                toastMessage(task.status === "done" ? `“${task.title}” 已恢复到待办` : `已完成：${task.title}`);
            }
            if (action === "add") {
                setTasks(current => current.map(item => item.id === id ? { ...item, planned: true, status: item.status === "inbox" ? "todo" : item.status } : item));
                toastMessage("已加入今日计划");
            }
            if (action === "remove") {
                setTasks(current => current.map(item => item.id === id ? { ...item, planned: false, status: ["todo", "doing"].includes(item.status) ? "inbox" : item.status } : item));
                toastMessage("已从今日计划移回任务池");
            }
            return;
        }
        if (!backendReady()) {
            backendRequiredMessage();
            return;
        }
        try {
            if (action === "delete") {
                await deleteTriliumTask(task.noteId);
                toastMessage(`已删除：${task.title}`);
            }
            if (action === "toggle") {
                const markingDone = task.status !== "done";
                await updateTriliumTask(task.noteId, { status: markingDone ? "done" : task.planned ? "todo" : "inbox", completedAt: markingDone ? new Date().toISOString() : null });
                if (task.planned) {
                    const journalNote = journal || await getTodayNote();
                    if (journalNote && journalNote.noteId) {
                        if (!journal) setJournal(journalNote);
                        await syncJournalTaskLink(task.noteId, journalNote.noteId, true);
                    }
                }
                toastMessage(markingDone ? `已完成：${task.title}` : `“${task.title}” 已恢复到待办`);
            }
            if (action === "add") {
                const journalNote = journal || await getTodayNote();
                if (!journalNote || !journalNote.noteId) throw new Error("没有找到当天 Journal 笔记。");
                if (!journal) setJournal(journalNote);
                await updateTriliumTask(task.noteId, { status: task.status === "inbox" ? "todo" : task.status, planned: true, plannedDate: todayKey(), journalNoteId: journalNote.noteId });
                await syncJournalTaskLink(task.noteId, journalNote.noteId, true);
                toastMessage("已加入今日计划，并在 Journal 中创建任务链接");
            }
            if (action === "remove") {
                await updateTriliumTask(task.noteId, { status: ["todo", "doing"].includes(task.status) ? "inbox" : task.status, planned: false });
                if (journal && journal.noteId) await syncJournalTaskLink(task.noteId, journal.noteId, false);
                toastMessage("已从今日计划移回任务池，并移除 Journal 链接");
            }
            setReloadToken(value => value + 1);
        } catch (error) {
            handleWriteError(error);
        }
    }

    function openModal() {
        setForm({ title: "", content: "", priority: "low", plan: true });
        setModalOpen(true);
    }

    async function createTask(event) {
        event.preventDefault();
        const title = form.title.trim();
        const content = form.content.trim();
        if (!title) return;
        if (source === "loading") {
            toastMessage("正在同步 Trilium 任务，请稍候。");
            return;
        }
        if (source === "trilium") {
            if (!taskRoot || !taskRoot.noteId) {
                toastMessage("请先创建 Task Pool 笔记，并添加 #taskPool 标签。");
                return;
            }
            if (form.plan && !backendReady()) {
                backendRequiredMessage();
                return;
            }
            try {
                const journalNote = form.plan ? journal || await getTodayNote() : null;
                if (form.plan && (!journalNote || !journalNote.noteId)) throw new Error("没有找到当天 Journal 笔记。");
                const attributes = [
                    { type: "label", name: "task", value: "" },
                    { type: "label", name: "taskStatus", value: form.plan ? "todo" : "inbox" },
                    { type: "label", name: "taskPriority", value: form.priority },
                ];
                if (form.plan) {
                    attributes.push({ type: "label", name: "taskPlannedDate", value: todayKey() });
                    attributes.push({ type: "relation", name: "plannedIn", value: journalNote.noteId });
                }
                const htmlContent = content ? `<p>${escapeHtml(content).replace(/\n/g, "<br>")}</p>` : "";
                const taskMonth = await ensureTaskMonthNote(taskRoot);
                const created = await createNote((taskMonth && taskMonth.noteId) || taskRoot.noteId, { title, content: htmlContent, type: "text", mime: "text/html", activate: false, attributes });
                if (form.plan && created && created.note && created.note.noteId) await syncJournalTaskLink(created.note.noteId, journalNote.noteId, true);
                setModalOpen(false);
                setReloadToken(value => value + 1);
                toastMessage(form.plan ? "任务已创建，并已链接到今日 Journal" : "任务已放入任务池");
            } catch (error) {
                handleWriteError(error);
            }
            return;
        }
        setTasks(current => [{ id: `local-${Date.now()}`, title, content, project: "未分类", estimate: 30, priority: form.priority, status: form.plan ? "todo" : "inbox", created: "刚刚", planned: form.plan }, ...current]);
        setModalOpen(false);
        toastMessage(form.plan ? "任务已创建并加入今日计划" : "任务已放入任务池");
    }

    async function openJournal() {
        if (journal && journal.noteId) {
            await ensureJournalTaskLinks(planned, journal);
            await activateNote(journal.noteId);
            return;
        }
        toastMessage("没有找到当天 Journal");
    }

    function selectFilter(value) {
        setFilter(value);
        setActiveView(value === "done" ? "done" : "pool");
        setShowAll(false);
    }

    function selectView(view) {
        setActiveView(view);
        setFilter(view === "done" ? "done" : "all");
        setShowAll(false);
    }

    const backendEnabled = source === "trilium" && backendReady();
    const sourceLabel = source === "trilium" ? backendEnabled ? "Trilium · 已连接" : "Trilium · 待读写" : source === "loading" ? "读取中" : "UI prototype";
    const footerLabel = source === "trilium" ? backendEnabled ? "已连接 Trilium · 任务可编辑" : "已连接 Trilium · 请启用 Backend Script" : source === "loading" ? "正在读取 Trilium 任务" : "未找到 Task Pool · 当前使用演示数据";
    const dashboardActive = !!(note && note.hasLabel("taskDashboard"));

    return <div class={`tlp-widget ${dashboardActive ? "" : "tlp-widget-hidden"}`}>
        <style>{CSS}</style>
        <header class="tlp-header">
            <div class="tlp-brand-line"><span class="tlp-brand-dot"></span><span>TRILIUM TASKLINE</span><span class="tlp-source-pill">{sourceLabel}</span></div>
            <div class="tlp-header-main"><div><h1>{activeView === "today" ? "今日计划" : activeView === "pool" ? "任务池" : "已完成"}</h1><p class="tlp-subtitle">{activeView === "today" ? "只保留今天真正要做的事。" : activeView === "pool" ? "收集任务，再选择下一件要做的事。" : "回看已经完成的事情。"}</p></div><div class="tlp-header-actions">{activeView === "today" && <button class="tlp-button tlp-button-secondary" type="button" onClick={openJournal}>↗ Journal</button>}<button class="tlp-button tlp-button-primary" type="button" onClick={openModal}>＋ 新建任务</button></div></div>
        </header>

        <nav class="tlp-view-tabs" aria-label="Taskline 视图">
            <button class={`tlp-view-tab ${activeView === "today" ? "is-active" : ""}`} type="button" onClick={() => selectView("today")}>今日计划 <span class="tlp-tab-count">{planned.length}</span></button>
            <button class={`tlp-view-tab ${activeView === "pool" ? "is-active" : ""}`} type="button" onClick={() => selectView("pool")}>任务池 <span class="tlp-tab-count">{activePool}</span></button>
            <button class={`tlp-view-tab ${activeView === "done" ? "is-active" : ""}`} type="button" onClick={() => selectView("done")}>已完成</button>
            <span class="tlp-view-hint">任务笔记是唯一数据来源 · Journal 只保存引用</span>
        </nav>

        <section class="tlp-stats" aria-label="任务概览">
            <div class="tlp-stat tlp-stat-primary"><div class="tlp-stat-icon">◎</div><div><span>今日进度</span><strong>{doneCount} / {planned.length}</strong></div><div class="tlp-ring" style={{ "--tlp-ring": `${percentage}%` }}><b>{percentage}%</b></div></div>
            <div class="tlp-stat"><div class="tlp-stat-icon tlp-stat-icon-orange">□</div><div><span>待安排</span><strong>{activePool}</strong></div></div>
        </section>

        <div class="tlp-view-content">
            {activeView === "today" ? <section class="tlp-card tlp-view-panel tlp-today-view">
                <div class="tlp-view-panel-heading"><div><small>FOCUS LIST</small><h2>今天要做 <b>{planned.length} 项</b></h2></div><button class="tlp-more tlp-sort-trigger" type="button" onClick={() => toastMessage("今日计划支持按优先级快速调整")} aria-label="调整任务排序" title="调整任务排序">↕</button></div>
                <div class="tlp-panel-scroll">{planned.length ? planned.slice().sort((a, b) => Number(a.status === "done") - Number(b.status === "done")).map(task => <TaskRow key={task.id} task={task} today onAction={handleTaskAction} />) : <div class="tlp-empty"><strong>今天还没有安排任务</strong><span>从任务池挑选几件重要的事，开始你的 Journal。</span></div>}</div>
            </section> : <section class="tlp-card tlp-view-panel tlp-pool-view">
                <div class="tlp-pool-heading"><div><small>{activeView === "done" ? "COMPLETED TASKS" : "TASK POOL"}</small><h2>{activeView === "done" ? "已完成任务" : "任务池"} <b>{activeView === "done" ? tasks.filter(task => task.status === "done").length : tasks.length} 件</b></h2></div><div class="tlp-pool-tools"><label class="tlp-search"><span>⌕</span><input type="search" placeholder="搜索任务" value={query} onInput={event => { setQuery(event.currentTarget.value); setShowAll(false); }} /></label><button class="tlp-button tlp-button-quiet" type="button" onClick={() => selectFilter("high")}>☷ 筛选</button></div></div>
                <div class="tlp-pool-toolbar"><div class="tlp-filters"><button class={`tlp-filter ${filter === "all" ? "is-active" : ""}`} type="button" onClick={() => selectFilter("all")}>全部</button><button class={`tlp-filter ${filter === "inbox" ? "is-active" : ""}`} type="button" onClick={() => selectFilter("inbox")}>待安排</button><button class={`tlp-filter ${filter === "high" ? "is-active" : ""}`} type="button" onClick={() => selectFilter("high")}>高优先级</button><button class={`tlp-filter ${filter === "done" ? "is-active" : ""}`} type="button" onClick={() => selectFilter("done")}>已完成</button></div><button class="tlp-sort" type="button" onClick={() => setSortByPriority(value => !value)}>↕ {sortByPriority ? "优先级" : "最近创建"}</button></div>
                <div class="tlp-panel-scroll">{source === "loading" ? <div class="tlp-empty"><strong>正在读取任务</strong><span>正在从 Trilium 加载带有 #task 的笔记。</span></div> : visiblePool.length ? visiblePool.map(task => <TaskRow key={task.id} task={task} onAction={handleTaskAction} />) : <div class="tlp-empty"><strong>没有找到匹配的任务</strong><span>试试其他关键词或切换筛选条件。</span></div>}</div>
                {filteredPool.length > 7 && <button class="tlp-load-more" type="button" onClick={() => setShowAll(value => !value)}>{showAll ? "收起任务 ↑" : "显示更多任务 ↓"}</button>}
            </section>}
        </div>

        {modalOpen && <div class="tlp-modal" onClick={event => { if (event.target === event.currentTarget) setModalOpen(false); }}><div class="tlp-modal-box" role="dialog" aria-modal="true" aria-labelledby="tlp-modal-title"><div class="tlp-modal-header"><div><small>NEW TASK</small><h2 id="tlp-modal-title">创建一个任务</h2></div><button type="button" class="tlp-more" onClick={() => setModalOpen(false)} aria-label="关闭">×</button></div><form onSubmit={createTask}><label>任务标题 <b>*</b><input type="text" required placeholder="例如：整理本周项目进展" value={form.title} onInput={event => setForm(current => ({ ...current, title: event.currentTarget.value }))} /></label><label class="tlp-content-field">任务内容<textarea rows="5" placeholder="记录这件事要完成的具体内容……" value={form.content} onInput={event => setForm(current => ({ ...current, content: event.currentTarget.value }))}></textarea><small>内容会保存到任务笔记正文中。</small></label><div class="tlp-form-grid"><label>优先级<select value={form.priority} onChange={event => setForm(current => ({ ...current, priority: event.currentTarget.value }))}><option value="urgent">紧急 · P0</option><option value="high">高 · P1</option><option value="medium">中 · P2</option><option value="low">低 · P3</option></select></label><label class="tlp-form-check"><span>计划</span><span><input type="checkbox" checked={form.plan} onChange={event => setForm(current => ({ ...current, plan: event.currentTarget.checked }))} /><i></i>加入今天计划</span></label></div><div class="tlp-modal-actions"><button type="button" class="tlp-button tlp-button-secondary" onClick={() => setModalOpen(false)}>取消</button><button type="submit" class="tlp-button tlp-button-primary">＋ 创建任务</button></div></form></div></div>}
        {toast && <div class="tlp-toast" role="status">{toast}</div>}
        <footer class="tlp-footer"><span><i></i>{footerLabel}</span><span>Taskline · Preact v0.4</span></footer>
    </div>;
}

export default defineWidget({
    parent: "center-pane",
    position: 5,
    render: TasklineScreen
});
