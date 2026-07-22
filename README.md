# Tastile Brand Assets

> **License**: All Rights Reserved. See [LICENSE](./LICENSE) and
> [NOTICE](./NOTICE) (English) / [NOTICE.ja.md](./NOTICE.ja.md) (日本語).
> This repository is published for reference only; no permission is granted to
> copy, modify, or redistribute any asset without prior written authorization.
> Reach the maintainers via a GitHub Issue or X DM `@361do_sleep`.

## Purpose

This repository collects the canonical brand assets for the Tastile family of
products:

* the Tastile wordmark and product marks
* the project logos and app icons
* the color tokens used in the design system
* the typography specimens loaded by `tastile-web` and `tastile-android`

The open-source client repositories (`tastile-web`, `tastile-android`,
`tastile-desktop`) reference these assets by written permission from Tastile.
**That permission is specific to the upstream repositories and does not
extend to forks.** If you fork a client, replace the brand assets with your
own.

## Structure

* `svg/icons/` — icon SVG masters
* `svg/logos/` — logo SVG masters
* `raster/icons/` — generated icon PNG / ICO
* `raster/logos/` — generated logo PNG

## Raster generation

```bash
bun install
bun run generate:raster
```

Generated files are written to `raster/icons/` and `raster/logos/`.

## What you may NOT do with these assets

* Use them in your own product, including forks of Tastile clients.
* Redistribute them, modified or unmodified.
* Register any of them, or confusingly similar marks, as a trademark.
* Use them in marketing, advertising, documentation, or social media without
  prior written permission.

## What you MAY do without permission

* View and study them for personal, non-commercial evaluation.
* Reference them in academic, journalistic, or commentary contexts where use
  is clearly nominative and not as a brand identifier.

For all other uses, open a GitHub Issue on this repository, or reach out via
X DM to `@361do_sleep`.

---

## 日本語での方針

本リポジトリは参照目的のみで公開されています。「All Rights Reserved」のもとで
公開されており、事前の書面による許諾なく内容をコピー・改変・再配布することを
禁じます。許諾申請は GitHub Issue、もしくは X の DM `@361do_sleep` まで
ご連絡ください(公開メールアドレスは掲載していません)。

詳細は [LICENSE](./LICENSE)、[NOTICE](./NOTICE)、[NOTICE.ja.md](./NOTICE.ja.md)
を参照してください。
