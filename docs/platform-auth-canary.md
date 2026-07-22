# Platform auth canary

Клиентский canary проверяет собственную сессию нового backend параллельно с
действующей авторизацией Supabase. Supabase остаётся обязательным источником
сессии для всех продуктовых запросов, поэтому транспортная ошибка нового
backend не блокирует вход.

## Включение

В Cloudflare preview deployment задаются:

```text
VITE_PLATFORM_AUTH_CANARY_ENABLED=true
VITE_PLATFORM_AUTH_API_URL=https://<gateway-domain>
VITE_PROFILE_SHADOW_CANARY_ENABLED=true
```

По умолчанию canary выключен. Флаг применяется только на этапе сборки. До
появления активных пользователей допустимо кратковременно включить его в
production deployment; после smoke-теста флаг следует снова выключить.

Canary отправляет исходный Telegram `initData` только в новый exchange endpoint.
Access token хранится только в памяти WebView и допускается лишь к
явному allowlist shadow-маршрутов. Refresh token не сохраняется, а
продуктовые запросы продолжают использовать Supabase.
Клиент сравнивает `appUserId` и безопасное подмножество профиля с
текущей реализацией. Несовпадение identity блокирует тестовый вход;
остальные ошибки и profile mismatch остаются fail-open.

Безопасный диагностический результат без proof и токенов сохраняется на время
вкладки в `sessionStorage` под ключом
`tarotopia:platform-auth-canary-status`. Сервер также пишет только код исхода,
платформу, request ID и при успехе канонический app user ID.
Profile shadow пишет отдельный результат в
`tarotopia:profile-shadow-canary-status`: только статус, код и имена
несовпавших полей, без их значений.

## Откат

1. Установить `VITE_PLATFORM_AUTH_CANARY_ENABLED=false` или удалить переменную.
2. Собрать и опубликовать клиент заново.
3. При необходимости вернуть health-only спецификацию API Gateway.

Откат клиента полностью возвращает прежний auth flow: новый backend больше не
вызывается, Supabase-сессия продолжает работать без миграции локальных данных.
