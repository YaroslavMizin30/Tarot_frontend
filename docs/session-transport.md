# Provider-neutral session transport

## Назначение

`src/shared/api/session` отделяет сессию приложения от:

- конкретной платформы запуска;
- Supabase Auth;
- способа хранения токенов;
- продуктовых API-клиентов.

Это позволяет последовательно подключить российский backend, а затем VK и MAX,
не размножая exchange, refresh и retry-логику по страницам приложения.

## Границы

```text
Telegram / VK / MAX
        |
PlatformProofProvider
        |
SessionTransport ---- SessionStore
        |
      /v1 API
```

- `PlatformProofProvider` возвращает подписанное доказательство платформы.
- `SessionTransport` обменивает proof на каноническую application session,
  обновляет токены и выполняет авторизованные запросы.
- `SessionStore` хранит application session. Текущая реализация — память
  вкладки, без `localStorage` и `sessionStorage`.
- Продуктовый код получает только `appUserId` и авторизованный HTTP transport;
  platform user ID не становится идентификатором доменной модели.

## Инварианты

1. Одновременно выполняется не более одного exchange или refresh.
2. Access token обновляется до фактического истечения с небольшим запасом.
3. После `401` запрос повторяется не более одного раза.
4. Отклонённый refresh (`400`/`401`) очищается и допускает новый platform
   exchange.
5. Временная ошибка refresh (`5xx`, timeout, network error) не приводит к
   автоматическому replay platform proof.
6. Bearer token отправляется только на настроенный API origin и только по
   относительным путям `/v1/...`.
7. Logout очищает локальную сессию даже при ошибке серверного запроса.

## Текущее состояние

- Реализован Telegram `PlatformProofProvider`.
- Контракты предусматривают `telegram`, `vk` и `max`.
- Session transport используется только shadow canary.
- Основная продуктовая авторизация по-прежнему работает через Supabase.
- Production canary flags выключены.

## Следующие расширения

1. Подключить transport к контролируемому onboarding/profile write canary.
2. Зафиксировать серверную идемпотентность exchange до добавления повторов на
   временные `5xx`.
3. Добавить метрики exchange/refresh latency, retry и error code.
4. Перед cutover выбрать постоянство сессии:
   - memory-only с повторным platform exchange после перезапуска;
   - platform SecureStorage;
   - HttpOnly cookie, если одинаково поддерживается целевыми контейнерами.
5. Реализовать VK/MAX proof adapters без изменения session transport.
