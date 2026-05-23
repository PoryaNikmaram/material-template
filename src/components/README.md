# Shared components

Only **generic, cross-feature** UI lives here. Domain-specific UI belongs in `src/features/{domain}/components/`.

| Folder | Purpose |
|--------|---------|
| `ui/` | Atomic primitives (animations, future buttons/inputs) |
| `shared/` | Composed widgets used across multiple pages |
| `layout/` | App shell: navbar, sidebar, footer, logo |

Theme infrastructure: `src/core/theme/app/` + `src/providers/theme/`.
