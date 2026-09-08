# 在 TriliumNext v0.105 中安装 Taskline UI

这个版本使用 TriliumNext v0.105 的 Preact custom widget API。不需要单独部署 Node、静态网站或后端服务。

## 安装

1. 在 Trilium 中新建一个 **Code** 笔记。
2. 在 Options → Code Notes 中启用 **JSX** 语言（如果还没有启用）。
3. 将代码语言设置为 **JSX**。
4. 把 `taskline-widget.jsx` 的全部内容粘贴进去。
5. 给这个代码笔记添加标签：

   ```text
   #widget
   ```

6. 新建一个普通文本笔记，例如 `任务池`，给它添加：

   ```text
   #taskRoot
   ```

7. 新建另一个普通文本笔记，例如 `任务中心`。
8. 给 `任务中心` 添加标签：

   ```text
   #taskDashboard
   ```

9. 刷新 Trilium 窗口，然后打开 `任务中心`。

Taskline 会显示在 `center-pane` 中。这个 Preact 版本通过 `useActiveNoteContext()` 判断当前活动笔记是否带有 `#taskDashboard`，所以只有打开“任务中心”时显示。Widget 自带滚动容器，不依赖 Trilium 外层页面滚动。

## 放到左侧启动栏

如果希望从左侧启动栏一键打开 Taskline，而不是先在笔记树中找到“任务中心”：

1. 将 `taskline-launcher.jsx` 粘贴到另一个 JSX Code note，标题设为 `Taskline Launchbar`。
2. **不要**给这个笔记添加 `#widget`。
3. 打开 **Global menu → Configure launchbar → Add a custom widget**。
4. 将新增启动器的 `widget` 字段指向 `Taskline Launchbar`，保存并刷新界面。

启动栏按钮会自动查找带 `#taskDashboard` 的笔记并打开它；Dashboard 本身仍在 `center-pane` 中保持完整宽度。

## 当前版本范围

这是 UI 迁移版，包含：

- 今日计划
- 任务池
- 优先级筛选
- 搜索和排序
- 加入/移出今日计划
- 完成/恢复任务
- 新建任务弹窗
- Journal 连接状态展示
- 加入今日计划时向 Journal 写入任务笔记链接
- 新建任务正文
- 任务池/今日计划视图切换（不滚动整页）

Preact Widget v0.4 会通过 `searchForNotes("#task")` 读取真实任务；如果找不到 `#taskRoot` 和任务笔记，才回退到演示数据。存在 `#taskRoot` 时，新建任务会直接调用 `createNote()` 写入 Trilium；完成、恢复、加入或移出今日计划会通过 `runOnBackend()` 更新任务属性和 `plannedIn` 关系。

建议任务笔记使用这些属性：

```text
#task
#taskStatus=inbox|todo|doing|done
#taskPriority=urgent|high|medium|low
#taskPlannedDate=2025-01-15
```

任务正文直接写入任务笔记内容。新建任务表单只需要填写标题、正文、优先级，以及是否加入今天计划。

`getTodayNote()` 用于定位当天 Journal。加入今日计划时，Widget 会在 Journal 正文追加一个带有 `data-taskline-task` 标记的 Trilium 链接；移出计划时会删除这个链接。修改已有任务前，请在 Trilium 的 Security 设置中启用 Backend Script；如果未启用，Widget 仍然可以读取任务和创建不计划的任务，但完成/恢复/计划调整会提示无法写入。

## 位置调整

`left-pane` 是笔记树所在的普通左侧面板，不等同于左侧启动栏。启动栏入口请使用上面的 `defineLauncherWidget` 方案；Dashboard 当前仍使用 `center-pane`，这样可以保留完整宽度。

当前使用：

```javascript
export default defineWidget({
    parent: "center-pane",
    position: 5,
    render: () => <div>Preact UI</div>
});
```

使用 `center-pane` 是为了让面板拥有足够宽度，同时仍然通过 `#taskDashboard` 只在“任务中心”可见，避免污染普通笔记。v0.105 支持的 widget 位置还包括 `left-pane`、`note-detail-pane` 和 `right-pane`，详见 [Custom Widgets](https://github.com/TriliumNext/Trilium/blob/v0.105.0/docs/User%20Guide/User%20Guide/Scripting/Frontend%20Basics/Custom%20Widgets.md)。
