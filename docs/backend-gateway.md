# Backend gateway клиента

Доменные модули не должны обращаться к `window.supabase` напрямую.
`src/shared/api/backend` задает общий контракт хранения и серверных операций.
`hybridBackend` выбирает между legacy `supabaseBackend` и новым
platform-neutral HTTP API отдельно для каждого перенесённого домена.

Gateway отвечает за:

- сохранение прежней формы ответов для entities/widgets/pages;
- маршрутизацию доменов в legacy, shadow или platform mode;
- авторизованные запросы через единый application session transport;
- единый формат ошибок.

Telegram SDK остается внутри `hostPlatform`, Supabase Auth — внутри auth
adapter, а Supabase Edge Functions — внутри `supabaseBackend`. Новые
универсальные маршруты описаны в `universal-domain-canary.md`; остальные
операции продолжают автоматически уходить в legacy backend.

Пользовательские выборки используют `appUserId`. Числовой `User.id` временно
сохраняется только как внутренний profile ID для старых серверных RPC и не
считается Telegram ID.
