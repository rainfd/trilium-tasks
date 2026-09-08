/*
 * Taskline Dashboard launcher for TriliumNext v0.105+
 *
 * Add this JSX Code note as a custom launcher from:
 * Global menu -> Configure launchbar -> Add a custom widget.
 * Do not add #widget to this note; the launchbar configuration points to it.
 */

import { activateNote, searchForNote, showMessage } from "trilium:api";
import { defineLauncherWidget } from "trilium:preact";

const CSS = `
    .taskline-launcher {
        display: inline-grid;
        width: 38px;
        height: 38px;
        place-items: center;
        padding: 0;
        color: var(--muted-text-color, var(--main-text-color, #666));
        background: transparent;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
    }

    .taskline-launcher:hover {
        color: var(--link-color, var(--main-text-color, #333));
        background: var(--hover-item-background-color, rgba(0, 0, 0, .06));
    }

    .taskline-launcher-icon {
        display: block;
        width: 22px;
        height: 22px;
    }
`;

async function openDashboard() {
    try {
        const dashboard = await searchForNote("#taskDashboard");
        if (!dashboard || !dashboard.noteId) {
            showMessage("没有找到 Taskline Dashboard，请先运行安装脚本。");
            return;
        }
        await activateNote(dashboard.noteId);
    } catch (error) {
        console.error("Taskline launcher: unable to open dashboard", error);
        showMessage("打开 Taskline Dashboard 失败，请检查笔记标签 #taskDashboard。");
    }
}

export default defineLauncherWidget({
    render: () => <>
        <style>{CSS}</style>
        <button class="taskline-launcher" type="button" title="打开 Taskline Dashboard" aria-label="打开 Taskline Dashboard" onClick={openDashboard}>
            <svg class="taskline-launcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="3.5" width="14" height="17" rx="2"></rect>
                <path d="M9 3.5h6v2H9z"></path>
                <path d="m8.5 11 1.5 1.5 3-3"></path>
                <path d="M8.5 16h7"></path>
            </svg>
        </button>
    </>
});
