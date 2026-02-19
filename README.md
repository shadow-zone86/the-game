# Управление балансами игроков

React-приложение для управления балансами игроков. API: [Swagger](https://dev-space.su/swagger/index.html).

## Архитектура (FSD)

- **app** — провайдеры (QueryClient, ToastContainer), PageLoader, глобальные стили
- **pages** — страницы (HomePage)
- **widgets** — device-list, player-list (композиции UI)
- **features** — balance-form (ui + BalanceForm.module.css, lib)
- **entities** — device (api, model, ui)
- **shared** — config (api, constants, messages), lib (валидация, formatter, normalization, errors, api), ui (PageLoader, ContentLoader)

**Решения:** TanStack Query; фабрики сервисов с DI (getFetchFn из config); API → DTO маппер; lazy-loading PlayerList; мемоизация; submitBalanceOperation — общая логика deposit/withdraw (DRY); сообщения в config/messages; явная проверка deviceId в мутациях.

## Запуск

```bash
npm install
npm run dev
npm run storybook
npm run test
```

**Сборка:** `npm run build` | `npm run preview` | `npm run type-check`

**Bundle analyze:** `npm run build:analyze` — собирает проект и открывает `dist/stats.html` с treemap чанков (JS, CSS). Используйте для контроля размера бандла.

## Pre-commit (Husky)

Перед коммитом выполняются: **lint → test → type-check → build**. Коммит не пройдёт, пока все проверки не будут пройдены. В терминале отображается прогресс каждой проверки.

## Деплой

Build: `npm run build`, publish: `dist`.
