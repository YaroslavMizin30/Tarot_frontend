# Canary универсальных продуктовых доменов

Клиент умеет переводить совместимые продуктовые домены с Supabase Edge
Functions на platform-neutral API независимо друг от друга. Один домен можно
тестировать и откатывать, не перестраивая остальные.

## Домены

Допустимые идентификаторы:

- `feedback`;
- `activity`;
- `moon-plans`;
- `spreads`;
- `astrology`.

Профиль уже использует отдельный канонический `/v1/profile` для auth-shell и
onboarding. Полный legacy `User` пока остаётся compatibility-моделью, потому
что содержит ещё не выделенные кошелёк, натальную карту и права доступа.

Платежи, AI-генерация, натальные транзиты и фоновые уведомления этим шлюзом не
перехватываются и продолжают использовать прежний backend.

## Конфигурация

Новый URL API:

```text
VITE_PLATFORM_API_URL=https://<gateway-domain>
```

Старое имя `VITE_PLATFORM_AUTH_API_URL` временно поддерживается как fallback.

Теневой вызов одного или нескольких доменов:

```text
VITE_PLATFORM_API_SHADOW_DOMAINS=feedback,activity
VITE_PLATFORM_API_DOMAINS=
```

Authoritative-вызов:

```text
VITE_PLATFORM_API_DOMAINS=feedback,activity
VITE_PLATFORM_API_SHADOW_DOMAINS=
```

Если домен присутствует в обоих списках, authoritative-режим имеет приоритет.
Неизвестные значения игнорируются. Пустые переменные сохраняют legacy.

В shadow-режиме UI получает ответ старого backend, а новый запрос выполняется
в фоне через ту же application session. В `sessionStorage` под ключом
`tarotopia:universal-domain-shadow-status` хранится не более 50 безопасных
результатов: домен, операция, статус и признак совпадения. Пользовательские
данные, payload, токены и ответы не сохраняются.

## Текущий совместный canary

Identity и universal backfill уже проверены, а активных пользователей нет.
Поэтому текущая контрольная точка тестирует все совместимые домены одной
заранее определённой группой:

```text
VITE_PLATFORM_BACKEND_MODE=shadow
VITE_PLATFORM_API_URL=https://d5d5m96bkbl8jja51m16.tmjd4m4j.apigw.yandexcloud.net
VITE_PLATFORM_API_SHADOW_DOMAINS=feedback,activity,moon-plans,spreads,astrology
VITE_PLATFORM_API_DOMAINS=
```

Порядок проверки:

1. Применить explicit-allowlist спецификацию API Gateway.
2. Опубликовать отдельную shadow-сборку клиента.
3. Открыть все соответствующие разделы Telegram Mini App.
4. Проверить HTTP `2xx` нового API и shadow-status.
5. Перевести всю группу в `VITE_PLATFORM_API_DOMAINS`.
6. Повторить smoke-тест чтения и нескольких обратимых write-операций.

В будущей production-эксплуатации с активными пользователями следует вернуться
к постепенному включению по одному домену или небольшими группами.

## Мгновенный откат

Удалить домен из `VITE_PLATFORM_API_DOMAINS` и
`VITE_PLATFORM_API_SHADOW_DOMAINS`, затем опубликовать новую сборку. Код UI и
формат данных менять не требуется: адаптер сохраняет текущий контракт
вызывающих модулей.
