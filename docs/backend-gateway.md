# Backend gateway клиента

Доменные модули не должны обращаться к `window.supabase` напрямую.
`src/shared/api/backend` задает общий контракт хранения и серверных операций,
а `supabaseBackend` является его текущим адаптером.

Gateway отвечает за:

- преобразование имен полей между camelCase и snake_case;
- авторизованные select/insert/update/delete;
- вызовы серверных операций и RPC;
- единый формат ошибок.

Telegram SDK остается внутри `hostPlatform`, Supabase Auth — внутри auth
adapter, а Supabase data API — внутри `supabaseBackend`. При переносе backend
достаточно реализовать второй `BackendGateway`, не меняя entities, widgets и
pages.

Пользовательские выборки используют `appUserId`. Числовой `User.id` временно
сохраняется только как внутренний profile ID для старых серверных RPC и не
считается Telegram ID.
