# Scripts

## Активные скрипты (запуск из корня проекта)

| Скрипт                      | Назначение                    |
| --------------------------- | ----------------------------- |
| `create-admin.ts`           | Создание админ-пользователя   |
| `deploy-neon-migrations.ts` | Деплой миграций Prisma в Neon |
| `setup-neon-db.ts`          | Первичная настройка БД Neon   |
| `test-api-routes.js`        | Проверка API-маршрутов        |
| `validate-routes.js`        | Валидация роутов              |

Запуск (из корня): `npx tsx scripts/<имя>.ts` или через `package.json` (см. `create-admin`, `deploy:neon-migrations`, `setup:neon-db` в package.json).

## Архив (`archive/`)

Одноразовые миграции, фиксы и утилиты, которые уже применялись. Оставлены для истории. Не использовать без понимания контекста.

- Миграции данных: `migrate-mongo-to-postgres.ts`, `migrate-db-to-utf8.ts`, `migrate-variants-to-attributes.ts`, `run-attribute-value-migration.ts`
- Добавление колонок/данных: `add-colors-*.ts`, `add-order-quantity-fields.ts`, `add-*-products.ts`
- Фиксы: `check-db-encoding.ts`, `fix-database-encoding*.sql`, `cleanup-old-backend.js`
- PowerShell: `fix-colors-error.ps1`, `fix-prisma-client.ps1`
- **server-setup.sh** — установка на своём Linux-сервере (VPS, /var/www). Для деплоя на Vercel не нужен.

Официальные миграции схемы — только в `packages/db/prisma/migrations/`. См. также `NEON_MIGRATION_README.md` при работе с Neon.
