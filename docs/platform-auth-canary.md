# Platform auth canary

Клиентский canary проверяет собственную сессию нового backend параллельно с
действующей авторизацией Supabase. Supabase остаётся обязательным источником
сессии для всех продуктовых запросов, поэтому транспортная ошибка нового
backend не блокирует вход.

## Включение

В Cloudflare preview deployment задаются:

```text
VITE_PLATFORM_BACKEND_MODE=shadow
VITE_PLATFORM_AUTH_API_URL=https://<gateway-domain>
VITE_PROFILE_SHADOW_CANARY_ENABLED=true
VITE_ONBOARDING_SHADOW_CANARY_ENABLED=true
```

Для совместимости старый
`VITE_PLATFORM_AUTH_CANARY_ENABLED=true` пока также включает shadow exchange,
но новым сборкам следует использовать единый `VITE_PLATFORM_BACKEND_MODE`.
По умолчанию применяется `legacy`, и новый backend не является источником
профиля. Флаг применяется только на этапе сборки. До
появления активных пользователей допустимо кратковременно включить его в
production deployment; после smoke-теста флаг следует снова выключить.

Canary отправляет исходный Telegram `initData` только в новый exchange endpoint.
Access и refresh token хранятся только в памяти WebView и допускаются лишь к
явному allowlist shadow-маршрутов. При перезагрузке страницы оба токена
исчезают, а продуктовые запросы продолжают использовать Supabase.

Canary использует общий provider-neutral session transport. Транспорт:

- не знает о Supabase и получает proof через `PlatformProofProvider`;
- поддерживает `telegram`, `vk` и `max` на уровне контракта, но текущий host
  adapter реализован только для Telegram Mini App;
- дедуплицирует одновременные exchange и refresh;
- заранее обновляет истекающий access token;
- после `401` выполняет один refresh и один повтор исходного запроса;
- не повторяет platform exchange после временной ошибки refresh, чтобы
  случайно не воспроизвести одноразовый proof;
- разрешает bearer-запросы только к относительным путям `/v1/...` на
  настроенном API origin.

Хранилище сессии оформлено отдельным `SessionStore`. Сейчас применяется
`createMemorySessionStore`; постоянное хранилище или platform SecureStorage
можно добавить отдельным adapter без изменения HTTP-транспорта.

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

Отдельный onboarding shadow включается только вместе с platform auth canary и
только после успешного authoritative onboarding в Supabase. Он:

1. нормализует дату в `YYYY-MM-DD`, время в `HH:mm | null`;
2. параллельно отправляет два одинаковых `PUT /v1/profile`;
3. выполняет `GET /v1/profile`;
4. проверяет create-once результат и сравнивает его с authoritative профилем.

Canary выполняется в фоне и не блокирует регистрацию. Его безопасный результат
сохраняется в `tarotopia:onboarding-shadow-canary-status`; персональные значения
в diagnostics не записываются. `PUT /v1/profile` следует публиковать в Gateway
только на время отдельного контролируемого теста.

## Откат

1. Установить `VITE_PLATFORM_BACKEND_MODE=legacy`.
2. Установить `VITE_PLATFORM_AUTH_CANARY_ENABLED=false` или удалить старую
   переменную совместимости.
3. Установить `VITE_ONBOARDING_SHADOW_CANARY_ENABLED=false` или удалить
   переменную.
4. Собрать и опубликовать клиент заново.
5. Вернуть health-only спецификацию API Gateway.

Откат клиента полностью возвращает прежний auth flow: новый backend больше не
вызывается, Supabase-сессия продолжает работать без миграции локальных данных.

## Authoritative profile cutover

Режим:

```text
VITE_PLATFORM_BACKEND_MODE=authoritative-profile
VITE_PLATFORM_AUTH_API_URL=https://<gateway-domain>
VITE_LEGACY_PRODUCT_API_COMPATIBILITY_ENABLED=true
```

делает собственную platform session и `/v1/profile` источником состояния
auth-shell и onboarding. Старый `User` в этом режиме не определяет, нужно ли
показывать регистрацию, и остаётся только явно названным compatibility-слоем
для ещё не перенесённых продуктовых API.

Сборка `authoritative-profile` без
`VITE_LEGACY_PRODUCT_API_COMPATIBILITY_ENABLED=true` намеренно блокируется
ошибкой `PLATFORM_PRODUCT_API_CUTOVER_INCOMPLETE`: астрология, Таро, баланс и
история пока не полностью перенесены. После endpoint-by-endpoint cutover этот
guard и сам compatibility-слой удаляются.

## Проверка

Перед публикацией:

```bash
npm run check
```

Команда выполняет typecheck тестового контура, unit-тесты session transport и
production build. Тестами закреплены конкурентные exchange/refresh, повтор
после `401`, обработка протухшего refresh token, запрет утечки bearer token на
чужой origin и локальная очистка logout.
