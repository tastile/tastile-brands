# AGENTS.md — tastile-brands

- Constitution: [`constitution/CONSTITUTION.md`](constitution/CONSTITUTION.md)
- Current Operating Model: [`organization/profiles/release-driven-solo.md`](organization/profiles/release-driven-solo.md)

- brand asset の license / permission boundary を最優先の project-specific authority とする。
- raster generation は Bun scripts を既存 canonical entry とする。
- asset usage permission は agent が推測・拡張しない。

## Agent Skills lifecycle

project-init 由来の Agent Skills は project-local に管理する。

- standard bootstrap: `mise run skills-bootstrap`（内部で `bunx skills add rebuildup/project-init --skill '*' --agent claude-code --agent codex -y`）
- 継続更新: `mise run skills-update` / `bunx skills update -p -y`
- canonical install layout: `.agents/skills/` + `.claude/skills/`
- `skills-lock.json` は project-local source / skill path / content hash metadata として commit する
- current Skills CLI の `skills install` は universal pathのみを復元するため、Claude Codeを含むfresh bootstrapの唯一の入口にしない
- upstream-managed Skill は直接編集せず、project 固有差分は別 Skill / adapter / ADR / docs に置く
