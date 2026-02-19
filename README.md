# Управление балансами игроков

React-приложение для управления балансами игроков. API: [Swagger](https://dev-space.su/swagger/index.html).

## Архитектура (FSD)

- **app** — провайдеры (QueryClient, ToastContainer), PageLoader, глобальные стили
- **pages** — страницы (HomePage)
- **widgets** — device-list, player-list (композиции UI)
- **features** — balance-form (действия пользователя)
- **entities** — device (api, model, ui)
- **shared** — config, lib (валидация, formatter, normalization), ui (PageLoader)

**Решения:** TanStack Query для кэширования и мутаций; фабрики сервисов с DI; API → DTO маппер для UI; lazy-loading PlayerList; мемоизация компонентов и колбэков.

## Запуск

```bash
npm install
npm run dev
npm run storybook
npm run test
```

**Сборка:** `npm run build` | `npm run preview` | `npm run type-check` | `npm run build:analyze`

## Pre-commit (Husky)

Перед коммитом выполняются: **lint → test → type-check → build**. Коммит не пройдёт, пока все проверки не будут пройдены. В терминале отображается прогресс каждой проверки.

## Деплой

Build: `npm run build`, publish: `dist`.
