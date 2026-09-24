# AGENTS.md — tastile-brands

- Constitution: [`constitution/CONSTITUTION.md`](constitution/CONSTITUTION.md)
- Current Operating Model: [`organization/profiles/release-driven-solo.md`](organization/profiles/release-driven-solo.md)

- brand asset の license / permission boundary を最優先の project-specific authority とする。
- raster generation は Bun scripts を既存 canonical entry とする。
- asset usage permission は agent が推測・拡張しない。

## Agent Skills lifecycle

project-init 由来の Agent Skills は project-local に管理する。

- 初回導入 / 全体 reconcile: `bunx skills add rebuildup/project-init --skill '*' --agent claude-code opencode codex -y`
- fresh clone: `bunx skills install`
- 継続更新: `bunx skills update -p -y`
- `skills-lock.json` は CLI 生成物として commit し、手で source/hash を作らない
- upstream-managed Skill は直接編集せず、project 固有差分は別 Skill / adapter / ADR / docs に置く
