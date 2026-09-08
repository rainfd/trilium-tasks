#!/usr/bin/env python3
"""Install or update Taskline in a Trilium instance through ETAPI."""

from __future__ import annotations

import argparse
import getpass
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_WIDGET = ROOT / "taskline-widget.jsx"
DEFAULT_LAUNCHER = ROOT / "taskline-launcher.jsx"


def normalize_server(value: str) -> str:
    value = value.strip().rstrip("/")
    if value.endswith("/etapi"):
        value = value[:-6]
    return value


class TriliumApi:
    def __init__(self, server: str, token: str):
        self.server = normalize_server(server)
        self.token = token.strip()

    def request(self, endpoint: str, method: str = "GET", body: Any = None, raw: bool = False) -> Any:
        headers = {
            "Accept": "application/json",
            "Authorization": self.token,
        }
        data = None
        if body is not None:
            if raw:
                data = body.encode("utf-8")
                headers["Content-Type"] = "text/plain; charset=utf-8"
            else:
                data = json.dumps(body, ensure_ascii=False).encode("utf-8")
                headers["Content-Type"] = "application/json"
        try:
            with urlopen(Request(f"{self.server}{endpoint}", data=data, method=method, headers=headers), timeout=30) as response:
                content = response.read().decode("utf-8")
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"HTTP {error.code}: {detail[:400]}") from error
        except URLError as error:
            raise RuntimeError(f"无法连接 Trilium：{error.reason}") from error
        if not content.strip():
            return None
        content_type = response.headers.get("content-type", "")
        return json.loads(content) if "application/json" in content_type else content

    def search(self, query: str) -> list[dict[str, Any]]:
        result = self.request(f"/etapi/notes?search={quote(query, safe='')}")
        return result.get("results", [])

    def by_label(self, label: str) -> list[dict[str, Any]]:
        return self.search(f"#{label}")

    def add_label(self, note_id: str, name: str, value: str = "", position: int = 10) -> None:
        self.request("/etapi/attributes", "POST", {
            "noteId": note_id,
            "type": "label",
            "name": name,
            "value": value,
            "isInheritable": False,
            "position": position,
        })

    def ensure_label(self, note_id: str, name: str, value: str = "", position: int = 10) -> None:
        if not any(note.get("noteId") == note_id for note in self.by_label(name)):
            self.add_label(note_id, name, value, position)

    def create_note(self, parent_id: str, title: str, note_type: str, mime: str, content: str = "", labels: list[dict[str, str]] | None = None) -> dict[str, Any]:
        result = self.request("/etapi/create-note", "POST", {
            "parentNoteId": parent_id,
            "title": title,
            "type": note_type,
            "mime": mime,
            "content": content,
            "notePosition": 0,
            "prefix": "",
            "isExpanded": True,
        })
        note = result["note"]
        for index, label in enumerate(labels or [], start=1):
            self.add_label(note["noteId"], label["name"], label.get("value", ""), index * 10)
        return note

    def update_note(self, note: dict[str, Any], title: str, note_type: str, mime: str, content: str | None = None) -> None:
        self.request(f"/etapi/notes/{note['noteId']}", "PATCH", {"title": title, "type": note_type, "mime": mime})
        if content is not None:
            self.request(f"/etapi/notes/{note['noteId']}/content", "PUT", content, raw=True)


def ensure_widget(api: TriliumApi, content: str) -> tuple[dict[str, Any], bool]:
    candidates = api.by_label("widget")
    note = next((item for item in candidates if item.get("title") == "Taskline Widget"), None)
    note = note or (candidates[0] if candidates else None)
    if note is None:
        titled = api.search('note.title = "Taskline Widget"')
        note = titled[0] if titled else None
    if note is None:
        note = api.create_note("root", "Taskline Widget", "code", "text/jsx", content, [
            {"name": "widget"},
            {"name": "language", "value": "jsx"},
        ])
        return note, True
    api.update_note(note, "Taskline Widget", "code", "text/jsx", content)
    api.ensure_label(note["noteId"], "widget", "", 10)
    api.ensure_label(note["noteId"], "language", "jsx", 20)
    return note, False


def ensure_launcher(api: TriliumApi, content: str) -> tuple[dict[str, Any], bool]:
    titled = api.search('note.title = "Taskline Launchbar"')
    note = titled[0] if titled else None
    if note is None:
        note = api.create_note("root", "Taskline Launchbar", "code", "text/jsx", content, [
            {"name": "language", "value": "jsx"},
            {"name": "iconClass", "value": "bx bx-list-check"},
        ])
        return note, True
    api.update_note(note, "Taskline Launchbar", "code", "text/jsx", content)
    api.ensure_label(note["noteId"], "language", "jsx", 10)
    api.ensure_label(note["noteId"], "iconClass", "bx bx-list-check", 20)
    return note, False


def ensure_task_pool(api: TriliumApi) -> tuple[dict[str, Any], bool]:
    candidates = api.by_label("taskPool") + api.by_label("taskRoot")
    note = next((item for item in candidates if item.get("title") == "Task Pool"), None)
    note = note or (candidates[0] if candidates else None)
    if note is None:
        note = api.create_note("root", "Task Pool", "text", "text/html", "<p>Task Pool</p>", [
            {"name": "taskPool"},
            {"name": "taskRoot"},
        ])
        return note, True
    api.update_note(note, "Task Pool", note.get("type", "text"), note.get("mime", "text/html"))
    api.ensure_label(note["noteId"], "taskPool", "", 20)
    api.ensure_label(note["noteId"], "taskRoot", "", 10)
    return note, False


def ensure_dashboard(api: TriliumApi) -> tuple[dict[str, Any], bool]:
    candidates = api.by_label("taskDashboard")
    if candidates:
        dashboard = candidates[0]
        api.ensure_label(dashboard["noteId"], "iconClass", "bx bx-list-check", 20)
        return dashboard, False
    return api.create_note(
        "root",
        "Taskline Dashboard",
        "text",
        "text/html",
        "<p>Taskline Dashboard</p>",
        [
            {"name": "taskDashboard"},
            {"name": "iconClass", "value": "bx bx-list-check"},
        ],
    ), True


def ensure_calendar_folders(api: TriliumApi, pool: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    now = datetime.now()
    year = str(now.year)
    month = f"{now.year}-{now.month:02d}"
    year_title = f"{year}年"
    month_title = f"{year}年{now.month:02d}月"
    year_candidates = api.by_label("taskYear")
    year_note = next((item for item in year_candidates if item.get("title") == year_title), None)
    if year_note is None:
        year_note = api.create_note(pool["noteId"], year_title, "book", "", labels=[{"name": "taskYear", "value": year}])
    month_candidates = api.by_label("taskMonth")
    month_note = next((item for item in month_candidates if item.get("title") == month_title), None)
    if month_note is None:
        month_note = api.create_note(year_note["noteId"], month_title, "book", "", labels=[{"name": "taskMonth", "value": month}])
    return year_note, month_note


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="通过 Trilium ETAPI 安装 Taskline")
    parser.add_argument("--server", "--url", help="Trilium 地址，例如 http://127.0.0.1:8090")
    parser.add_argument("--token", help="ETAPI Token")
    parser.add_argument("--widget", default=str(DEFAULT_WIDGET), help="本地 taskline-widget.jsx 路径")
    parser.add_argument("--widget-url", help="从 GitHub Raw 下载 taskline-widget.jsx")
    parser.add_argument("--launcher", default=str(DEFAULT_LAUNCHER), help="本地 taskline-launcher.jsx 路径")
    parser.add_argument("--launcher-url", help="从 GitHub Raw 下载 taskline-launcher.jsx")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    server = normalize_server(args.server or input("Trilium 地址（例如 http://127.0.0.1:8090）："))
    token = (args.token or getpass.getpass("ETAPI Token：")).strip()
    if not server or not token:
        print("安装失败：必须提供 Trilium 地址和 ETAPI Token。", file=sys.stderr)
        return 1
    try:
        if args.widget_url:
            with urlopen(args.widget_url, timeout=30) as response:
                content = response.read().decode("utf-8")
        else:
            widget_path = Path(args.widget).expanduser().resolve()
            content = widget_path.read_text(encoding="utf-8")
        if args.launcher_url:
            with urlopen(args.launcher_url, timeout=30) as response:
                launcher_content = response.read().decode("utf-8")
        else:
            launcher_path = Path(args.launcher).expanduser().resolve()
            launcher_content = launcher_path.read_text(encoding="utf-8")
        api = TriliumApi(server, token)
        print(f"连接 Trilium：{server}")
        api.request("/etapi/notes/root")
        widget, widget_created = ensure_widget(api, content)
        launcher, launcher_created = ensure_launcher(api, launcher_content)
        pool, pool_created = ensure_task_pool(api)
        dashboard, dashboard_created = ensure_dashboard(api)
        year_note, month_note = ensure_calendar_folders(api, pool)
        print(f"{'创建' if widget_created else '更新'}：Taskline Widget ({widget['noteId']})")
        print(f"{'创建' if launcher_created else '更新'}：Taskline Launchbar ({launcher['noteId']})")
        print(f"{'创建' if pool_created else '确认'}：Task Pool ({pool['noteId']})")
        print(f"{'创建' if dashboard_created else '确认'}：Taskline Dashboard ({dashboard['noteId']})")
        print(f"确认日历目录：{year_note['title']} / {month_note['title']}")
        print("安装完成；刷新 Trilium 后，在 Global menu → Configure launchbar → Add a custom widget 中选择 Taskline Launchbar。")
        return 0
    except (OSError, RuntimeError, KeyError, json.JSONDecodeError) as error:
        print(f"安装失败：{error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
