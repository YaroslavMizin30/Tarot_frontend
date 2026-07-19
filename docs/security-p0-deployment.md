# P0: безопасная авторизация и платежи

## Что изменилось

- Telegram Mini App передаёт на сервер только сырой `initData`.
- Сервер проверяет HMAC-подпись и срок действия `auth_date`.
- Supabase-сессия выдаётся только после подтверждения Telegram-личности.
- RLS связывает строки пользователя с `auth.uid()` через таблицу
  `telegram_auth_identities`; `user_metadata` и email больше не являются
  источниками полномочий.
- Старый пароль, совпадавший с Telegram ID, заменяется случайным. При первом
  подтверждённом входе старые сессии пользователя удаляются.
- Баланс, бонусный баланс, финансовые журналы и натальная карта изменяются
  только серверными функциями.
- Платежи идемпотентны по ID операции провайдера. ЮKassa дополнительно
  проверяется прямым запросом к API перед начислением.
- Универсальный `ai-request` доступен только подтверждённому пользователю и
  ограничен 12 запросами в час.

## Обязательная ротация секретов

Секреты ранее находились во frontend `.env` и в отслеживаемом Git файле
backend `.env.local` для `telegram-bot`, `ai-request` и `support-bot`. Файлы
backend теперь исключены из Git, но их прежние значения остаются в истории
репозитория, поэтому считать их безопасными больше нельзя.

1. Перевыпустить токены основного и support-бота через BotFather.
2. Перевыпустить секретный ключ магазина ЮKassa.
3. Перевыпустить AI-токен и прочие токены платёжных провайдеров, если они
   использовались в production.
4. Если `DATABASE_URL` содержал пароль, сменить пароль базы. Если `ROLE_KEY`
   был service-role ключом, выполнить ротацию ключа проекта Supabase.
5. Сменить `FUNCTION_SECRET` и обновить все cron/webhook-вызовы, которые его
   используют.
6. Сохранить новые значения только в Supabase Secrets:

```sh
supabase secrets set TELEGRAM_BOT_TOKEN=...
supabase secrets set SUPPORT_BOT_TOKEN=...
supabase secrets set YOOKASSA_SHOP_ID=...
supabase secrets set YOOKASSA_SECRET_KEY=...
supabase secrets set FUNCTION_SECRET=...
supabase secrets set AI_TOKEN=...
```

Опционально можно изменить допустимый возраст Telegram `initData`:

```sh
supabase secrets set TELEGRAM_AUTH_MAX_AGE_SECONDS=3600
```

После смены токена нужно заново установить Telegram webhook. После ротации
проверить cron-задачи и внешние webhook. Не помещать новые секреты в
переменные с префиксом `VITE_` и не возвращать `.env.local` под контроль Git.

## Порядок деплоя

Тестовый релиз подготовлен в ветках `test/p0-auth`. До начала миграций в
обоих репозиториях создан локальный тег
`rollback/pre-p0-auth-20260719`.

Перед `db push` обязательно создать backup базы в Supabase Dashboard либо
schema-only снимок при запущенном Docker:

```sh
supabase db dump --linked --schema public \
  --file /private/tmp/tarot-p0-predeploy-public-schema-20260719.sql
```

Снимок нужен потому, что P0 меняет существующие RLS-политики. Откат одного
frontend-коммита после миграции не восстановит прежнюю схему авторизации.

Из каталога backend:

```sh
supabase db push
supabase functions deploy telegram-auth --no-verify-jwt
supabase functions deploy telegram-message
supabase functions deploy ai-request
supabase functions deploy create-invoice
supabase functions deploy payment-status
supabase functions deploy chart
supabase functions deploy daily-bonus
supabase functions deploy daily-reflection
supabase functions deploy personal-transits
supabase functions deploy tarot-reading
```

`telegram-auth` публичен намеренно: до его вызова JWT ещё нет, поэтому он
сам проверяет подпись Telegram. Остальные перечисленные функции требуют JWT,
а затем проверяют подтверждённое серверное сопоставление личности.

Для первой проверки только авторизации достаточно `db push`, деплоя
`telegram-auth` и нового frontend. Не деплоить незакоммиченный рефакторинг
`telegram-bot` в рамках этого теста. После backend-деплоя пересобрать и
задеплоить frontend, чтобы опубликованный bundle больше не содержал старые
секреты.

## Откат тестового релиза

- Для просмотра или сборки прежнего кода использовать тег
  `rollback/pre-p0-auth-20260719`, не сбрасывая текущую рабочую директорию.
- Если ошибка только в Edge Function, исправить её вперёд либо задеплоить
  прежнюю версию этой функции из отдельного worktree.
- Если требуется полный откат identity/RLS, восстановить созданный перед
  релизом backup. Простое удаление новых таблиц не вернёт удалённые прежние
  политики.
- Никогда не возвращать прежние секреты: ротация токенов и паролей необратима
  независимо от отката кода.

Пример отдельного worktree для прежнего frontend:

```sh
git worktree add /private/tmp/tarot-frontend-pre-p0 \
  rollback/pre-p0-auth-20260719
```

## Ручная проверка

1. Открыть Mini App из Telegram. Убедиться, что профиль текущего пользователя
   загружается.
2. Открыть приложение с просроченным или изменённым `initData`: должен
   появиться экран ошибки входа, а не содержимое приложения.
3. Зарегистрировать нового пользователя. В `users.id` должен быть его
   подтверждённый Telegram ID.
4. Изменить тему/звук/профиль и убедиться, что безопасные поля сохраняются.
5. Попытаться напрямую PATCH-нуть `balance`, `bonus_balance` или
   `natal_chart`: PostgREST должен вернуть отказ.
6. Создать натальную карту: списание происходит один раз; при ошибке
   провайдера баланс возвращается.
7. Оплатить каждый пакет через Stars и СБП. Повтор одного webhook или повторная
   проверка статуса не должны начислять пентакли второй раз.
8. Закрыть окно СБП без оплаты: клиент не должен показывать статус `paid`.

## Локальная разработка

Вне Telegram разрешён только явный dev-вход через некоммитящийся `.env.local`:

```text
VITE_DEV_AUTH_EMAIL=...
VITE_DEV_AUTH_PASSWORD=...
```

У dev-пользователя в Supabase Auth должен быть серверный
`app_metadata.telegram_id` и подтверждённая запись в
`telegram_auth_identities`. Значение `VITE_ADMIN_ID` само по себе больше не
авторизует пользователя.
