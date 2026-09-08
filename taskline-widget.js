/*
 * Taskline UI for TriliumNext v0.105 (legacy fallback)
 *
 * The primary widget is taskline-widget.jsx (Preact). Keep this file only if
 * you need the legacy jQuery implementation.
 *
 * Installation:
 * 1. Create a Code note and set its language to "JavaScript (frontend)".
 * 2. Paste this file into the note.
 * 3. Add the #widget label to the code note.
 * 4. Add #taskDashboard to the note where the dashboard should appear.
 * 5. Refresh Trilium.
 *
 * This first version is intentionally UI-first. The demo store below is the
 * seam for the next step: replace it with Trilium note/attribute/relation IO.
 */

const TASKLINE_TEMPLATE = `
<div class="tl-widget" data-taskline-root>
  <header class="tl-header">
    <div class="tl-brand-line"><span class="tl-brand-dot"></span><span>TRILIUM TASKLINE</span><span class="tl-prototype-pill" data-source-pill>UI prototype</span></div>
    <div class="tl-header-main">
      <div>
        <h1 class="tl-title">今日计划</h1>
        <p class="tl-subtitle">把注意力留给最重要的几件事。</p>
      </div>
      <div class="tl-header-actions">
        <button class="tl-button tl-button-secondary" type="button" data-action="journal"><span class="tl-icon">↗</span>打开 Journal</button>
        <button class="tl-button tl-button-primary" type="button" data-action="new-task"><span class="tl-icon">＋</span>新建任务</button>
      </div>
    </div>
  </header>

  <nav class="tl-view-tabs" aria-label="Taskline 视图">
    <button class="tl-view-tab is-active" type="button" data-view="today">今日计划 <span class="tl-tab-count" data-count-today>4</span></button>
    <button class="tl-view-tab" type="button" data-view="pool">任务池 <span class="tl-tab-count" data-count-pool>15</span></button>
    <button class="tl-view-tab" type="button" data-view="done">已完成</button>
    <span class="tl-view-hint">任务笔记是唯一数据来源 · Journal 只保存引用</span>
  </nav>

  <section class="tl-stats" aria-label="任务概览">
    <div class="tl-stat tl-stat-primary">
      <div class="tl-stat-icon">◎</div>
      <div><span>今日进度</span><strong data-stat-progress>1 / 4</strong><small data-stat-hint>继续保持节奏</small></div>
      <div class="tl-ring" data-ring><b data-stat-percent>25%</b></div>
    </div>
    <div class="tl-stat">
      <div class="tl-stat-icon tl-stat-icon-orange">□</div>
      <div><span>待安排任务</span><strong data-stat-pool>12</strong><small>还在任务池里</small></div>
      <em class="tl-stat-trend">+3</em>
    </div>
    <div class="tl-stat">
      <div class="tl-stat-icon tl-stat-icon-green">↗</div>
      <div><span>Journal 状态</span><strong data-stat-journal>已连接</strong><small data-stat-journal-hint>完成状态自动回写</small></div>
      <span class="tl-sync-pulse"></span>
    </div>
  </section>

  <div class="tl-content-grid">
    <section class="tl-card tl-focus-card">
      <div class="tl-card-heading">
        <div><small>FOCUS LIST</small><h2>今天要做 <b data-today-total>4 项</b></h2></div>
        <button class="tl-more-button" type="button" data-action="focus-menu" aria-label="计划菜单">•••</button>
      </div>
      <div class="tl-focus-tip"><span class="tl-tip-icon">✦</span><div><strong>建议先完成一项高优任务</strong><small>今天还剩 <b data-remaining>3 小时 20 分</b> 可安排</small></div><button type="button" data-action="suggest">查看建议 →</button></div>
      <div class="tl-task-list" data-today-list></div>
      <button class="tl-add-row" type="button" data-action="new-task"><span>＋</span>添加到今天</button>
    </section>

    <aside class="tl-card tl-journal-card">
      <div class="tl-card-heading"><div><small>TRILIUM JOURNAL</small><h2>日记同步</h2></div><button class="tl-more-button" type="button" data-action="journal-menu" aria-label="Journal 菜单">•••</button></div>
      <div class="tl-journal-note">
        <div class="tl-journal-top"><div class="tl-journal-icon">▤</div><div><small>JOURNAL NOTE</small><h3 data-journal-title>今天 · Journal</h3></div><span class="tl-connected"><i></i>已连接</span></div>
        <div class="tl-journal-quote"><b>“</b><p>给重要的事情留出一段完整的时间。</p></div>
        <div class="tl-journal-meta"><span>◷ 最后编辑 09:24</span><button type="button" data-action="open-note">在 Trilium 中打开 ↗</button></div>
      </div>
      <div class="tl-sync-summary"><div><span>今日任务</span><strong data-journal-summary>1 / 4 已完成</strong></div><div class="tl-progress"><i data-journal-progress style="width:25%"></i></div></div>
      <div class="tl-journal-foot"><span></span>任务完成状态会自动回写任务池</div>
    </aside>
  </div>

  <section class="tl-card tl-pool-card">
    <div class="tl-pool-heading"><div><small>ALL TASKS</small><h2>任务池 <b data-pool-total>18 件</b></h2></div><div class="tl-pool-tools"><label class="tl-search"><span>⌕</span><input type="search" placeholder="搜索任务" data-search /></label><button class="tl-button tl-button-quiet" type="button" data-action="filter">☷ 筛选</button></div></div>
    <div class="tl-pool-toolbar"><div class="tl-filters"><button class="is-active" type="button" data-filter="all">全部</button><button type="button" data-filter="inbox">待安排</button><button type="button" data-filter="high">高优先级</button><button type="button" data-filter="done">已完成</button></div><button class="tl-sort" type="button" data-action="sort">↕ 最近创建</button></div>
    <div class="tl-pool-list" data-pool-list></div>
    <button class="tl-load-more" type="button" data-action="more">显示更多任务 ↓</button>
  </section>

  <div class="tl-modal" data-modal aria-hidden="true">
    <div class="tl-modal-box" role="dialog" aria-modal="true" aria-labelledby="tl-modal-title">
      <div class="tl-modal-header"><div><small>NEW TASK</small><h2 id="tl-modal-title">创建一个任务</h2></div><button type="button" class="tl-more-button" data-action="close-modal">×</button></div>
      <form data-task-form>
        <label>任务名称 <b>*</b><input type="text" required placeholder="例如：整理本周项目进展" data-form-title /></label>
        <div class="tl-form-grid"><label>所属项目<input type="text" placeholder="例如：Trilium 插件" data-form-project /></label><label>优先级<select data-form-priority><option value="urgent">紧急 · P0</option><option value="high" selected>高 · P1</option><option value="medium">中 · P2</option><option value="low">低 · P3</option></select></label></div>
        <div class="tl-form-grid"><label>预计用时<select data-form-estimate><option value="15">15 分钟</option><option value="30" selected>30 分钟</option><option value="45">45 分钟</option><option value="60">1 小时</option><option value="120">2 小时</option></select></label><label class="tl-form-check"><span>计划</span><span><input type="checkbox" checked data-form-plan /><i></i>加入今天计划</span></label></div>
        <div class="tl-modal-actions"><button type="button" class="tl-button tl-button-secondary" data-action="close-modal">取消</button><button type="submit" class="tl-button tl-button-primary">＋ 创建任务</button></div>
      </form>
    </div>
  </div>

  <div class="tl-toast" data-toast></div>
  <footer class="tl-footer"><span data-source-status><i></i>正在读取 Trilium 任务</span><span>Taskline v0.2</span></footer>
</div>`;

const TASKLINE_CSS = `
.tl-widget { --tl-bg: var(--main-background-color, #f5f7fb); --tl-card: var(--main-background-color, #fff); --tl-ink: var(--main-font-color, #253047); --tl-muted: #8b94a7; --tl-line: rgba(120, 130, 150, .16); --tl-primary: #6c5ce7; --tl-primary-soft: #f0edff; --tl-orange: #d98545; --tl-green: #35ad7c; box-sizing: border-box; width: 100%; min-height: 100%; padding: 28px clamp(18px, 4vw, 52px) 24px; color: var(--tl-ink); background: var(--tl-bg); font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; font-size: 14px; }
.tl-widget *, .tl-widget *::before, .tl-widget *::after { box-sizing: border-box; }
.tl-widget button, .tl-widget input, .tl-widget select { font: inherit; }
.tl-widget button { border: 0; cursor: pointer; }
.tl-widget button:focus-visible, .tl-widget input:focus-visible, .tl-widget select:focus-visible { outline: 3px solid rgba(108, 92, 231, .2); outline-offset: 2px; }
.tl-widget h1, .tl-widget h2, .tl-widget h3, .tl-widget p { margin: 0; }
.tl-widget h1 { color: var(--tl-ink); font-size: clamp(25px, 3vw, 34px); font-weight: 780; letter-spacing: -.045em; line-height: 1.1; }
.tl-widget h2 { color: var(--tl-ink); font-size: 17px; font-weight: 750; letter-spacing: -.035em; }
.tl-widget small { color: var(--tl-muted); font-size: 9px; font-weight: 750; letter-spacing: .13em; text-transform: uppercase; }
.tl-header { max-width: 1200px; margin: 0 auto 22px; }
.tl-brand-line { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; color: #9aa3b5; font-size: 9px; font-weight: 800; letter-spacing: .13em; }
.tl-brand-dot { width: 6px; height: 6px; background: #35ad7c; border-radius: 50%; box-shadow: 0 0 0 4px rgba(53, 173, 124, .1); }
.tl-prototype-pill { margin-left: 4px; padding: 3px 6px; color: #7569d8; background: #f0edff; border-radius: 5px; font-size: 8px; letter-spacing: .04em; }
.tl-header-main { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.tl-subtitle { margin-top: 8px !important; color: var(--tl-muted); font-size: 12px; }
.tl-header-actions, .tl-pool-tools { display: flex; align-items: center; gap: 8px; }
.tl-button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 0 13px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; transition: transform .16s ease, background .16s ease, box-shadow .16s ease; }
.tl-button:hover { transform: translateY(-1px); }
.tl-button:active { transform: translateY(0); }
.tl-button-primary { color: #fff; background: var(--tl-primary); box-shadow: 0 7px 15px rgba(108, 92, 231, .2); }
.tl-button-primary:hover { background: #5746d5; }
.tl-button-secondary, .tl-button-quiet { color: #667086; background: var(--tl-card); border: 1px solid var(--tl-line); }
.tl-button-secondary:hover, .tl-button-quiet:hover { color: var(--tl-primary); border-color: #d8d3fa; }
.tl-icon { font-size: 15px; line-height: 1; }
.tl-view-tabs { display: flex; align-items: center; gap: 4px; max-width: 1200px; margin: 0 auto 18px; padding-bottom: 9px; border-bottom: 1px solid var(--tl-line); }
.tl-view-tab, .tl-filters button { position: relative; padding: 0 9px 9px; color: #99a1af; background: transparent; font-size: 11px; font-weight: 700; }
.tl-view-tab::after, .tl-filters button::after { position: absolute; right: 9px; bottom: -10px; left: 9px; height: 2px; background: transparent; border-radius: 2px 2px 0 0; content: ""; }
.tl-view-tab.is-active, .tl-filters button.is-active { color: var(--tl-primary); }
.tl-view-tab.is-active::after, .tl-filters button.is-active::after { background: var(--tl-primary); }
.tl-tab-count { display: inline-flex; min-width: 18px; justify-content: center; margin-left: 3px; padding: 2px 4px; color: #8790a3; background: #f2f4f8; border-radius: 5px; font-size: 9px; }
.tl-view-hint { margin-left: auto; color: #a7afbd; font-size: 10px; }
.tl-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; max-width: 1200px; margin: 0 auto 16px; }
.tl-stat { position: relative; display: flex; align-items: center; gap: 12px; min-height: 94px; padding: 16px; overflow: hidden; background: var(--tl-card); border: 1px solid var(--tl-line); border-radius: 12px; }
.tl-stat-primary { color: #fff; background: linear-gradient(120deg, #6c5ce7, #8173ed); border-color: transparent; box-shadow: 0 9px 20px rgba(108, 92, 231, .15); }
.tl-stat-icon { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; color: #6d5ee1; background: #f0edff; border-radius: 10px; font-size: 21px; line-height: 1; }
.tl-stat-primary .tl-stat-icon { color: #fff; background: rgba(255, 255, 255, .15); }
.tl-stat-icon-orange { color: var(--tl-orange); background: #fff3e7; }
.tl-stat-icon-green { color: var(--tl-green); background: #eaf8f2; }
.tl-stat > div:nth-child(2) { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.tl-stat > div:nth-child(2) span, .tl-stat > div:nth-child(2) small { color: #98a1b1; font-size: 10px; letter-spacing: 0; text-transform: none; }
.tl-stat-primary > div:nth-child(2) span, .tl-stat-primary > div:nth-child(2) small { color: rgba(255, 255, 255, .7); }
.tl-stat strong { color: var(--tl-ink); font-size: 20px; font-weight: 780; letter-spacing: -.04em; line-height: 1; }
.tl-stat-primary strong { color: #fff; }
.tl-stat-trend { margin-left: auto; padding: 4px 6px; color: #47a981; background: #effaf5; border-radius: 6px; font-size: 10px; font-style: normal; font-weight: 750; }
.tl-ring { position: relative; display: grid; width: 48px; height: 48px; flex: 0 0 auto; margin-left: auto; place-items: center; color: #fff; background: conic-gradient(#fff var(--tl-ring, 25%), rgba(255, 255, 255, .18) 0); border-radius: 50%; font-size: 10px; }
.tl-ring::after { position: absolute; inset: 4px; background: #7567e9; border-radius: 50%; content: ""; }
.tl-ring b { position: relative; z-index: 1; }
.tl-sync-pulse { width: 7px; height: 7px; margin-left: auto; background: var(--tl-green); border-radius: 50%; box-shadow: 0 0 0 5px rgba(53, 173, 124, .1); }
.tl-content-grid { display: grid; grid-template-columns: minmax(0, 1.48fr) minmax(280px, .86fr); gap: 16px; max-width: 1200px; margin: 0 auto 16px; }
.tl-card { background: var(--tl-card); border: 1px solid var(--tl-line); border-radius: 12px; box-shadow: 0 10px 28px rgba(34, 43, 74, .045); }
.tl-focus-card, .tl-journal-card { min-height: 390px; padding: 20px; }
.tl-card-heading, .tl-pool-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.tl-card-heading h2, .tl-pool-heading h2 { margin-top: 5px; }
.tl-card-heading h2 b, .tl-pool-heading h2 b { display: inline-flex; margin-left: 6px; padding: 4px 6px; color: #7569d8; background: #f0edff; border-radius: 5px; font-size: 9px; font-weight: 750; vertical-align: middle; }
.tl-pool-heading h2 b { color: #8b94a7; background: #f2f4f8; }
.tl-more-button { width: 29px; height: 29px; padding: 0; color: #a4acba; background: transparent; border-radius: 7px; font-size: 13px; letter-spacing: 2px; }
.tl-more-button:hover { color: var(--tl-ink); background: #f0f2f6; }
.tl-focus-tip { display: flex; align-items: center; gap: 9px; margin-top: 16px; padding: 10px; background: #faf9ff; border: 1px solid #eeecff; border-radius: 8px; }
.tl-tip-icon { display: grid; width: 27px; height: 27px; flex: 0 0 auto; place-items: center; color: #786be8; background: #ece9ff; border-radius: 7px; }
.tl-focus-tip > div { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 3px; }
.tl-focus-tip strong { overflow: hidden; color: #4c5368; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.tl-focus-tip small { color: #9aa2b3; font-size: 9px; letter-spacing: 0; text-transform: none; }
.tl-focus-tip small b { color: #6b61c8; }
.tl-focus-tip > button, .tl-journal-meta button { padding: 0; color: #7064d8; background: transparent; font-size: 9px; font-weight: 700; white-space: nowrap; }
.tl-focus-tip > button:hover, .tl-journal-meta button:hover { color: #5746d5; }
.tl-task-list { margin-top: 11px; }
.tl-task-row { display: flex; align-items: center; gap: 9px; min-height: 57px; padding: 8px 5px; border-bottom: 1px solid rgba(120, 130, 150, .11); border-radius: 7px; }
.tl-task-row:hover { background: rgba(108, 92, 231, .035); }
.tl-task-check { display: grid; width: 19px; height: 19px; flex: 0 0 auto; place-items: center; color: transparent; background: transparent; border: 1.5px solid #cbd1dd; border-radius: 6px; font-size: 13px; font-weight: 800; }
.tl-task-check:hover { color: #6c5ce7; border-color: #6c5ce7; }
.tl-task-row.is-done .tl-task-check { color: #fff; background: #35ad7c; border-color: #35ad7c; }
.tl-task-body { min-width: 0; flex: 1; }
.tl-task-title { display: block; max-width: 100%; overflow: hidden; padding: 0; color: #3b4559; background: transparent; font-size: 11px; font-weight: 700; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
.tl-task-title:hover { color: #5746d5; }
.tl-task-row.is-done .tl-task-title { color: #9da5b4; text-decoration: line-through; }
.tl-task-meta { display: flex; align-items: center; gap: 9px; margin-top: 4px; color: #9aa3b2; font-size: 9px; }
.tl-project-dot { display: inline-block; width: 5px; height: 5px; margin-right: 4px; border-radius: 50%; vertical-align: 1px; }
.tl-priority { flex: 0 0 auto; padding: 4px 6px; border-radius: 5px; font-size: 8px; font-weight: 800; }
.tl-priority-urgent { color: #d8636a; background: #fff0f1; }
.tl-priority-high { color: #d98545; background: #fff3e7; }
.tl-priority-medium { color: #6688d9; background: #eef3ff; }
.tl-priority-low { color: #7b8799; background: #f1f3f6; }
.tl-task-more { display: grid; width: 24px; height: 26px; flex: 0 0 auto; place-items: center; color: #b0b7c4; background: transparent; border-radius: 5px; opacity: 0; }
.tl-task-row:hover .tl-task-more { opacity: 1; }
.tl-task-more:hover { background: #eef0f5; }
.tl-add-row { display: flex; align-items: center; gap: 7px; width: 100%; margin-top: 8px; padding: 9px 5px; color: #8f98aa; background: transparent; border-radius: 7px; font-size: 10px; font-weight: 700; text-align: left; }
.tl-add-row:hover { color: var(--tl-primary); background: #faf9ff; }
.tl-add-row span { font-size: 16px; line-height: 1; }
.tl-journal-card { padding-right: 18px; padding-left: 18px; }
.tl-journal-card .tl-card-heading { margin-bottom: 16px; }
.tl-journal-note { padding: 13px; background: #fffdf9; border: 1px solid #f2eadf; border-radius: 9px; }
.tl-journal-top { display: flex; align-items: center; gap: 8px; }
.tl-journal-icon { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; color: #d68b53; background: #fff0df; border-radius: 8px; font-size: 16px; }
.tl-journal-top > div:nth-child(2) { min-width: 0; flex: 1; }
.tl-journal-top small { color: #baa695; font-size: 8px; }
.tl-journal-top h3 { overflow: hidden; margin-top: 3px; color: #594f47; font-size: 11px; font-weight: 720; text-overflow: ellipsis; white-space: nowrap; }
.tl-connected { display: inline-flex; align-items: center; gap: 4px; color: #63a480; font-size: 8px; font-weight: 700; white-space: nowrap; }
.tl-connected i { width: 5px; height: 5px; background: #63a480; border-radius: 50%; }
.tl-journal-quote { display: flex; gap: 5px; margin: 18px 0 15px 3px; }
.tl-journal-quote b { color: #e8c7aa; font-family: Georgia, serif; font-size: 24px; line-height: .7; }
.tl-journal-quote p { color: #75695f; font-size: 10px; line-height: 1.5; }
.tl-journal-meta { display: flex; align-items: center; justify-content: space-between; gap: 7px; padding-top: 10px; border-top: 1px solid #f3e9de; }
.tl-journal-meta > span { color: #b7a799; font-size: 8px; white-space: nowrap; }
.tl-journal-meta button { color: #bd8355; font-size: 8px; }
.tl-sync-summary { margin: 20px 2px 0; }
.tl-sync-summary > div:first-child { display: flex; justify-content: space-between; margin-bottom: 8px; color: #8790a1; font-size: 9px; }
.tl-sync-summary strong { color: #536075; font-size: 9px; }
.tl-progress { height: 5px; overflow: hidden; background: #eceef5; border-radius: 999px; }
.tl-progress i { display: block; height: 100%; background: linear-gradient(90deg, #6c5ce7, #9c8ff4); border-radius: inherit; transition: width .3s ease; }
.tl-journal-foot { display: flex; align-items: center; gap: 7px; margin-top: 24px; padding: 9px; color: #8f98a7; background: #fafbfc; border: 1px solid #eef0f3; border-radius: 7px; font-size: 8px; }
.tl-journal-foot span { width: 5px; height: 5px; flex: 0 0 auto; background: #6ec59c; border-radius: 50%; box-shadow: 0 0 0 3px rgba(110, 197, 156, .12); }
.tl-pool-card { max-width: 1200px; margin: 0 auto; padding: 19px 20px 12px; }
.tl-pool-heading { align-items: center; }
.tl-search { display: flex; align-items: center; gap: 6px; width: 175px; height: 32px; padding: 0 8px; color: #a3aab9; background: #fafbfc; border: 1px solid var(--tl-line); border-radius: 7px; }
.tl-search:focus-within { background: #fff; border-color: #cfc9f8; box-shadow: 0 0 0 3px rgba(108, 92, 231, .08); }
.tl-search span { font-size: 18px; line-height: 1; }
.tl-search input { min-width: 0; flex: 1; padding: 0; color: #4a556a; background: transparent; border: 0; outline: 0; font-size: 10px; }
.tl-search input::placeholder { color: #aeb5c1; }
.tl-pool-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 18px; border-bottom: 1px solid var(--tl-line); }
.tl-filters { display: flex; align-items: center; gap: 3px; }
.tl-filters button { padding-bottom: 10px; }
.tl-sort { padding: 0 0 10px; color: #9ba4b4; background: transparent; font-size: 9px; }
.tl-sort:hover { color: #626c80; }
.tl-pool-list { min-height: 70px; }
.tl-pool-row { min-height: 58px; padding: 7px 2px; }
.tl-pool-row .tl-task-body { padding-left: 1px; }
.tl-status-dot { width: 7px; height: 7px; flex: 0 0 auto; background: #c4cbd7; border-radius: 50%; }
.tl-status-dot.is-doing { background: var(--tl-primary); box-shadow: 0 0 0 4px rgba(108, 92, 231, .1); }
.tl-status-dot.is-done { background: var(--tl-green); }
.tl-pool-action { min-width: 56px; height: 25px; padding: 0 7px; color: #7469d8; background: #f3f1ff; border-radius: 5px; font-size: 9px; font-weight: 700; opacity: 0; }
.tl-pool-row:hover .tl-pool-action, .tl-pool-action.is-added { opacity: 1; }
.tl-pool-action.is-added { color: #8791a3; background: #f2f4f7; }
.tl-load-more { width: 100%; margin-top: 4px; padding: 10px; color: #919aab; background: transparent; border-top: 1px solid var(--tl-line); font-size: 9px; font-weight: 700; }
.tl-load-more:hover { color: var(--tl-primary); }
.tl-empty { display: flex; min-height: 130px; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #9ba4b5; text-align: center; }
.tl-empty strong { color: #5e687b; font-size: 11px; }
.tl-empty span { font-size: 9px; }
.tl-modal { position: fixed; z-index: 50; inset: 0; display: none; align-items: center; justify-content: center; padding: 18px; background: rgba(20, 26, 44, .42); }
.tl-modal.is-open { display: flex; }
.tl-modal-box { width: min(490px, 100%); overflow: hidden; color: var(--tl-ink); background: var(--tl-card); border-radius: 13px; box-shadow: 0 24px 70px rgba(23, 29, 52, .2); }
.tl-modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px; border-bottom: 1px solid var(--tl-line); }
.tl-modal-header h2 { margin-top: 5px; font-size: 19px; }
.tl-modal form { padding: 19px 20px 0; }
.tl-modal label { display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px; color: #667086; font-size: 10px; font-weight: 700; }
.tl-modal label b { color: #e26e72; }
.tl-modal input, .tl-modal select { width: 100%; height: 36px; padding: 0 10px; color: #455066; background: #fbfcfe; border: 1px solid var(--tl-line); border-radius: 7px; outline: 0; font-size: 11px; }
.tl-modal input:focus, .tl-modal select:focus { background: #fff; border-color: #b9b1f4; box-shadow: 0 0 0 3px rgba(108, 92, 231, .09); }
.tl-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tl-form-check > span:last-child { display: flex; align-items: center; gap: 8px; height: 36px; color: #737d90; font-size: 10px; font-weight: 550; }
.tl-form-check input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.tl-form-check i { position: relative; width: 31px; height: 18px; background: #dfe3eb; border-radius: 999px; }
.tl-form-check i::after { position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(40, 48, 73, .2); content: ""; transition: transform .16s ease; }
.tl-form-check input:checked + i { background: var(--tl-primary); }
.tl-form-check input:checked + i::after { transform: translateX(13px); }
.tl-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin: 3px -20px 0; padding: 13px 20px; background: rgba(120, 130, 150, .045); border-top: 1px solid var(--tl-line); }
.tl-toast { position: fixed; z-index: 60; right: 22px; bottom: 20px; max-width: min(330px, calc(100% - 32px)); padding: 10px 13px; color: #536075; background: #fff; border: 1px solid #e5e8ef; border-radius: 8px; box-shadow: 0 12px 28px rgba(28, 37, 65, .14); font-size: 10px; font-weight: 700; opacity: 0; pointer-events: none; transform: translateY(8px); transition: opacity .18s ease, transform .18s ease; }
.tl-toast.is-visible { opacity: 1; transform: translateY(0); }
.tl-footer { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 15px auto 0; color: #aab1bf; font-size: 8px; }
.tl-footer > span:first-child { display: inline-flex; align-items: center; gap: 6px; }
.tl-footer i { width: 5px; height: 5px; background: #e0a05d; border-radius: 50%; }
.tl-footer span:last-child { color: #969faf; }
@media (max-width: 850px) { .tl-content-grid { grid-template-columns: 1fr; } .tl-stats { grid-template-columns: 1fr 1fr; } .tl-stat:last-child { grid-column: 1 / -1; } .tl-view-hint { display: none; } }
@media (max-width: 560px) { .tl-widget { padding: 21px 13px 18px; } .tl-header-main, .tl-pool-heading { align-items: flex-start; flex-direction: column; } .tl-header-actions, .tl-pool-tools { width: 100%; } .tl-header-actions .tl-button { flex: 1; } .tl-pool-tools .tl-search { flex: 1; } .tl-stats { grid-template-columns: 1fr; } .tl-stat:last-child { grid-column: auto; } .tl-view-tabs { overflow-x: auto; } .tl-view-tab { flex: 0 0 auto; } .tl-filters { overflow-x: auto; } .tl-pool-toolbar { align-items: flex-start; flex-direction: column; } .tl-sort { align-self: flex-end; } .tl-priority { display: none; } .tl-pool-action { opacity: 1; } .tl-form-grid { grid-template-columns: 1fr; gap: 0; } .tl-footer { align-items: flex-start; flex-direction: column; gap: 7px; } }
`;

const demoTasks = [
  { id: "demo-1", title: "整理本周项目进展", project: "Trilium 插件", priority: "high", status: "doing", estimate: 45, created: "今天 09:12", planned: true },
  { id: "demo-2", title: "回复重要邮件", project: "个人事务", priority: "medium", status: "todo", estimate: 20, created: "今天 08:48", planned: true },
  { id: "demo-3", title: "确认下周会议议程", project: "团队协作", priority: "urgent", status: "todo", estimate: 25, created: "昨天 17:30", planned: true },
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

const priorityNames = { urgent: "紧急", high: "高", medium: "中", low: "低" };
const projectColors = ["#9c91ec", "#e8a06a", "#72b6a4", "#6d9bed", "#d17c9b", "#aaa6c9"];
const TASK_QUERY = "#task";

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
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
  if (priority === "p0" || priority === "urgent" || priority === "critical") return "urgent";
  if (priority === "p1" || priority === "high") return "high";
  if (priority === "p3" || priority === "low") return "low";
  return "medium";
}

function formatCreatedValue(value) {
  if (!value) return "Trilium 笔记";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(date);
}

function colorForTask(id) {
  const sum = Array.from(String(id || "")).reduce((total, character) => total + character.charCodeAt(0), 0);
  return projectColors[sum % projectColors.length];
}

class TasklineWidget extends api.NoteContextAwareWidget {
  constructor() {
    super();
    this.contentSized();
    this.tasks = demoTasks.map((task) => ({ ...task }));
    this.dataSource = "demo";
    this.dataSourceError = null;
    this.filter = "all";
    this.query = "";
    this.showAll = false;
    this.sortByPriority = false;
    this.toastTimer = null;
  }

  static get parentWidget() {
    return "note-detail-pane";
  }

  get position() {
    return 5;
  }

  isEnabled() {
    return super.isEnabled() && this.note && this.note.hasLabel("taskDashboard");
  }

  doRender() {
    this.$widget = $(TASKLINE_TEMPLATE);
    this.cssBlock(TASKLINE_CSS);
    this.bindEvents();
    this.renderSourceState("loading");
    this.render();
  }

  async refreshWithNote(note) {
    this.note = note;
    this.renderSourceState("loading");
    await this.loadTasksFromTrilium();
    this.render();
    await this.loadJournalNote();
  }

  cleanup() {
    if (this.$widget) this.$widget.off(".taskline");
    super.cleanup();
  }

  bindEvents() {
    this.$widget.on("click.taskline", "[data-view]", (event) => {
      const view = $(event.currentTarget).data("view");
      this.filter = view === "done" ? "done" : "all";
      this.$widget.find("[data-view]").removeClass("is-active");
      $(event.currentTarget).addClass("is-active");
      this.$widget.find("[data-filter]").removeClass("is-active");
      this.$widget.find(`[data-filter="${this.filter}"]`).addClass("is-active");
      this.renderPool();
      if (view === "today") this.renderToday();
    });
    this.$widget.on("click.taskline", "[data-filter]", (event) => {
      this.filter = $(event.currentTarget).data("filter");
      this.showAll = false;
      this.$widget.find("[data-filter]").removeClass("is-active");
      $(event.currentTarget).addClass("is-active");
      this.renderPool();
    });
    this.$widget.on("input.taskline", "[data-search]", (event) => {
      this.query = event.currentTarget.value;
      this.showAll = false;
      this.renderPool();
    });
    this.$widget.on("click.taskline", "[data-action]", (event) => this.handleAction(event));
    this.$widget.on("click.taskline", "[data-task-action]", (event) => {
      const id = $(event.currentTarget).data("id");
      const action = $(event.currentTarget).data("task-action");
      if (action === "toggle") this.toggleTask(id);
      if (action === "add") this.addToToday(id);
      if (action === "remove") this.removeFromToday(id);
      if (action === "detail") this.showTaskDetail(id);
    });
    this.$widget.on("submit.taskline", "[data-task-form]", (event) => this.createTask(event));
    this.$widget.on("click.taskline", "[data-modal]", (event) => {
      if (event.target === event.currentTarget) this.closeModal();
    });
  }

  renderSourceState(mode) {
    const pill = this.$widget.find("[data-source-pill]");
    const status = this.$widget.find("[data-source-status]");
    if (mode === "loading") {
      pill.text("读取中");
      status.html("<i></i>正在读取 Trilium 任务");
      return;
    }
    if (mode === "trilium") {
      pill.text("Trilium · 只读");
      status.html("<i></i>已读取 Trilium 任务 · 当前为只读模式");
      return;
    }
    pill.text("UI prototype");
    status.html(`<i></i>${this.dataSourceError ? "读取失败 · 当前使用演示数据" : "未找到 #task · 当前使用演示数据"}`);
  }

  todayKey() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  async loadTasksFromTrilium() {
    if (!api.searchForNotes) {
      this.dataSource = "demo";
      this.dataSourceError = "api.searchForNotes is unavailable";
      this.renderSourceState("demo");
      return;
    }
    try {
      const result = await api.searchForNotes(TASK_QUERY);
      const notes = Array.isArray(result) ? result : result && Array.isArray(result.notes) ? result.notes : [];
      const taskNotes = notes.filter((note) => note && note.noteId && (!note.hasLabel || note.hasLabel("task")));
      if (!taskNotes.length) {
        this.dataSource = "demo";
        this.dataSourceError = null;
        this.renderSourceState("demo");
        return;
      }
      let journalNoteId = null;
      if (api.getTodayNote) {
        const journal = await api.getTodayNote();
        journalNoteId = journal && journal.noteId;
      }
      this.tasks = await Promise.all(taskNotes.map((note) => this.mapTriliumNote(note, journalNoteId)));
      this.dataSource = "trilium";
      this.dataSourceError = null;
      this.renderSourceState("trilium");
    } catch (error) {
      this.dataSource = "demo";
      this.dataSourceError = error;
      console.warn("Taskline: unable to load #task notes", error);
      this.renderSourceState("demo");
    }
  }

  async mapTriliumNote(note, journalNoteId) {
    const labelValue = (name) => (note.getLabelValue ? note.getLabelValue(name) : "") || "";
    const completedAt = labelValue("taskCompletedAt");
    const plannedDate = labelValue("taskPlannedDate") || labelValue("plannedDate");
    let planned = plannedDate === this.todayKey();
    if (!planned && journalNoteId && note.getRelationTargets) {
      try {
        const targets = await note.getRelationTargets("plannedIn");
        planned = Array.isArray(targets) && targets.some((target) => target && target.noteId === journalNoteId);
      } catch (error) {
        console.warn("Taskline: unable to read plannedIn relation", error);
      }
    }
    const rawCreated = (note.dto && note.dto.dateCreated) || labelValue("taskCreatedAt");
    return {
      id: note.noteId,
      noteId: note.noteId,
      title: note.title || "未命名任务",
      project: labelValue("taskProject") || labelValue("project") || "未分类",
      priority: normalizePriority(labelValue("taskPriority") || labelValue("priority")),
      status: normalizeStatus(labelValue("taskStatus") || labelValue("status"), completedAt),
      estimate: Number(labelValue("taskEstimate") || 30),
      created: formatCreatedValue(rawCreated),
      planned,
      completedAt: completedAt || null,
      description: "该任务来自 Trilium 笔记。详情和内容将在任务详情视图中打开。",
    };
  }

  async loadJournalNote() {
    try {
      if (api.getTodayNote) {
        const journal = await api.getTodayNote();
        if (journal && journal.title) {
          this.$widget.find("[data-journal-title]").text(journal.title);
          this.$widget.find("[data-stat-journal]").text("已连接");
          this.$widget.find("[data-stat-journal-hint]").text("当前 Journal 已找到");
          return;
        }
      }
    } catch (error) {
      console.warn("Taskline: unable to load today's Journal", error);
    }
    this.$widget.find("[data-stat-journal]").text("待连接");
    this.$widget.find("[data-stat-journal-hint]").text("请先启用 Journal");
  }

  handleAction(event) {
    const element = $(event.currentTarget);
    const action = element.data("action");
    if (action === "new-task") this.openModal();
    if (action === "close-modal") this.closeModal();
    if (action === "journal" || action === "open-note") this.showMessage("这里将打开当前 Journal 笔记");
    if (action === "journal-menu") this.showMessage("Journal 与今日计划已建立关联");
    if (action === "focus-menu") this.showMessage("接入 Trilium 后可在这里批量调整计划");
    if (action === "filter") {
      this.filter = "high";
      this.$widget.find("[data-filter]").removeClass("is-active");
      this.$widget.find('[data-filter="high"]').addClass("is-active");
      this.renderPool();
      this.showMessage("已筛选高优先级任务");
    }
    if (action === "sort") {
      this.sortByPriority = !this.sortByPriority;
      element.text(this.sortByPriority ? "↕ 优先级" : "↕ 最近创建");
      this.renderPool();
      this.showMessage(this.sortByPriority ? "已按优先级排序" : "已按最近创建排序");
    }
    if (action === "more") {
      this.showAll = !this.showAll;
      this.renderPool();
    }
    if (action === "suggest") {
      const suggested = this.tasks.find((task) => task.planned && task.status !== "done" && (task.priority === "urgent" || task.priority === "high"));
      this.showMessage(suggested ? `建议先做：${suggested.title}` : "今天暂时没有高优先级任务");
    }
  }

  canUseLocalStore() {
    if (this.dataSource === "trilium") {
      this.showMessage("已读取 Trilium 任务；写入操作将在下一步接入");
      return false;
    }
    return true;
  }

  createTask(event) {
    event.preventDefault();
    if (!this.canUseLocalStore()) return;
    const form = $(event.currentTarget);
    const title = form.find("[data-form-title]").val().trim();
    if (!title) return;
    const plan = form.find("[data-form-plan]").prop("checked");
    this.tasks.unshift({
      id: `task-${Date.now()}`,
      title,
      project: form.find("[data-form-project]").val().trim() || "未分类",
      priority: form.find("[data-form-priority]").val(),
      status: plan ? "todo" : "inbox",
      estimate: Number(form.find("[data-form-estimate]").val()),
      created: "刚刚",
      planned: plan,
    });
    this.closeModal();
    this.showAll = false;
    this.render();
    this.showMessage(plan ? "任务已创建并加入今日计划" : "任务已放入任务池");
  }

  openModal() {
    const modal = this.$widget.find("[data-modal]");
    modal.addClass("is-open").attr("aria-hidden", "false");
    window.setTimeout(() => modal.find("[data-form-title]").trigger("focus"), 50);
  }

  closeModal() {
    this.$widget.find("[data-modal]").removeClass("is-open").attr("aria-hidden", "true");
  }

  toggleTask(id) {
    if (!this.canUseLocalStore()) return;
    const task = this.tasks.find((item) => item.id === id);
    if (!task) return;
    if (task.status === "done") {
      task.status = task.planned ? "todo" : "inbox";
      task.completedAt = null;
      this.showMessage(`“${task.title}” 已恢复到待办`);
    } else {
      task.status = "done";
      task.completedAt = "刚刚";
      this.showMessage(`已完成：${task.title}`);
    }
    this.render();
  }

  addToToday(id) {
    if (!this.canUseLocalStore()) return;
    const task = this.tasks.find((item) => item.id === id);
    if (!task || task.status === "done") return;
    task.planned = true;
    if (task.status === "inbox") task.status = "todo";
    this.showMessage("已加入今日计划");
    this.render();
  }

  removeFromToday(id) {
    if (!this.canUseLocalStore()) return;
    const task = this.tasks.find((item) => item.id === id);
    if (!task) return;
    task.planned = false;
    if (task.status === "todo" || task.status === "doing") task.status = "inbox";
    this.showMessage("已从今日计划移回任务池");
    this.render();
  }

  showTaskDetail(id) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) return;
    const priority = priorityNames[task.priority] || "中";
    const status = task.status === "done" ? "已完成" : task.status === "doing" ? "进行中" : task.planned ? "今日计划" : "待安排";
    this.showMessage(`${task.title} · ${priority}优先级 · ${status}`);
  }

  matchingPoolTasks() {
    const query = this.query.trim().toLowerCase();
    let list = this.tasks.filter((task) => {
      const matchesQuery = !query || `${task.title} ${task.project}`.toLowerCase().includes(query);
      const matchesFilter = this.filter === "inbox" ? task.status === "inbox" : this.filter === "high" ? task.priority === "urgent" || task.priority === "high" : this.filter === "done" ? task.status === "done" : true;
      return matchesQuery && matchesFilter;
    });
    if (this.sortByPriority) {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 };
      list = list.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    return list;
  }

  render() {
    if (!this.$widget) return;
    this.renderToday();
    this.renderPool();
    this.renderStats();
  }

  renderToday() {
    const planned = this.tasks.filter((task) => task.planned);
    const list = planned.slice().sort((a, b) => Number(a.status === "done") - Number(b.status === "done"));
    this.$widget.find("[data-today-total]").text(`${planned.length} 项`);
    this.$widget.find("[data-count-today]").text(planned.length);
    this.$widget.find("[data-today-list]").html(list.length ? list.map((task) => this.taskMarkup(task, true)).join("") : `<div class="tl-empty"><strong>今天还没有安排任务</strong><span>从任务池挑选几件重要的事，开始你的 Journal。</span></div>`);
  }

  renderPool() {
    const all = this.matchingPoolTasks();
    const visible = this.showAll ? all : all.slice(0, 7);
    this.$widget.find("[data-pool-list]").html(visible.length ? visible.map((task) => this.taskMarkup(task, false)).join("") : `<div class="tl-empty"><strong>没有找到匹配的任务</strong><span>试试其他关键词或切换筛选条件。</span></div>`);
    this.$widget.find("[data-pool-total]").text(`${this.tasks.length} 件`);
    const more = this.$widget.find('[data-action="more"]');
    more.toggle(all.length > 7).text(this.showAll ? "收起任务 ↑" : "显示更多任务 ↓");
  }

  renderStats() {
    const planned = this.tasks.filter((task) => task.planned);
    const done = planned.filter((task) => task.status === "done").length;
    const percentage = planned.length ? Math.round((done / planned.length) * 100) : 0;
    const remaining = planned.filter((task) => task.status !== "done").reduce((total, task) => total + task.estimate, 0);
    const activePool = this.tasks.filter((task) => task.status !== "done").length;
    this.$widget.find("[data-stat-progress]").text(`${done} / ${planned.length}`);
    this.$widget.find("[data-stat-percent]").text(`${percentage}%`);
    this.$widget.find("[data-ring]").css("--tl-ring", `${percentage}%`);
    this.$widget.find("[data-stat-hint]").text(planned.length && done === planned.length ? "今天的计划全部完成" : planned.length ? "继续保持节奏" : "先安排一件重要的事");
    this.$widget.find("[data-stat-pool]").text(activePool);
    this.$widget.find("[data-count-pool]").text(activePool);
    this.$widget.find("[data-journal-summary]").text(`${done} / ${planned.length} 已完成`);
    this.$widget.find("[data-journal-progress]").css("width", `${percentage}%`);
    this.$widget.find("[data-remaining]").text(this.formatDuration(remaining));
  }

  taskMarkup(task, today) {
    const done = task.status === "done";
    const priorityClass = `tl-priority-${task.priority}`;
    const priorityText = priorityNames[task.priority] || "中";
    const color = projectColors[Number(task.id.replace(/\D/g, "")) % projectColors.length];
    const meta = `<span><i class="tl-project-dot" style="background:${color}"></i>${escapeHtml(task.project)}</span><span>◷ ${escapeHtml(today && done ? `完成于 ${task.completedAt || "刚刚"}` : `${task.estimate} 分钟`)}</span>`;
    if (today) {
      return `<div class="tl-task-row ${done ? "is-done" : ""}"><button class="tl-task-check" type="button" data-task-action="toggle" data-id="${task.id}" aria-label="${done ? "恢复任务" : "完成任务"}">${done ? "✓" : ""}</button><div class="tl-task-body"><button class="tl-task-title" type="button" data-task-action="detail" data-id="${task.id}">${escapeHtml(task.title)}</button><div class="tl-task-meta">${meta}</div></div><span class="tl-priority ${priorityClass}">${priorityText}</span><button class="tl-task-more" type="button" data-task-action="detail" data-id="${task.id}" aria-label="任务详情">•••</button></div>`;
    }
    const action = done ? "查看" : task.planned ? "已加入" : "加入今天";
    const actionType = done ? "detail" : task.planned ? "remove" : "add";
    return `<div class="tl-task-row tl-pool-row ${done ? "is-done" : ""}"><i class="tl-status-dot ${task.status === "doing" ? "is-doing" : done ? "is-done" : ""}"></i><div class="tl-task-body"><button class="tl-task-title" type="button" data-task-action="detail" data-id="${task.id}">${escapeHtml(task.title)}</button><div class="tl-task-meta">${meta.replace(`◷ ${escapeHtml(today && done ? `完成于 ${task.completedAt || "刚刚"}` : `${task.estimate} 分钟`)}`, `◷ ${escapeHtml(task.created)}`)}</div></div><span class="tl-priority ${priorityClass}">${priorityText}</span><button class="tl-pool-action ${task.planned || done ? "is-added" : ""}" type="button" data-task-action="${actionType}" data-id="${task.id}">${action}</button><button class="tl-task-more" type="button" data-task-action="detail" data-id="${task.id}" aria-label="任务详情">•••</button></div>`;
  }

  formatDuration(minutes) {
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
  }

  showMessage(message) {
    const toast = this.$widget.find("[data-toast]");
    toast.text(message).addClass("is-visible");
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => toast.removeClass("is-visible"), 2400);
  }
}

module.exports = TasklineWidget;
