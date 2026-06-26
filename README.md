# Белая Линия

Сайт стоматологической клиники с онлайн-записью, административной панелью и независимыми интеграциями Telegram, Email и AmoCRM.

## Локальный запуск

1. Установите Node.js 22+ и PostgreSQL.
2. Создайте `.env` и заполните `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`:

```powershell
Copy-Item .env.example .env
```

`DATABASE_URL` должен содержать реальный адрес PostgreSQL, например строку подключения Neon, Supabase или локального PostgreSQL. Значение `postgresql://...` из шаблона само по себе не работает.
3. Выполните:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run db:admin
npm run dev
```

Публичный сайт: `http://localhost:3000`. Админка: `http://localhost:3000/admin`.

## Production

- Приложение разворачивается на Vercel, PostgreSQL может размещаться в Neon, Supabase или другом managed-сервисе.
- Перед деплоем выполните `prisma migrate deploy`, затем `prisma db seed` и `npm run db:admin`.
- Для production обязательны Upstash Redis и QStash. Без QStash интеграции выполняются синхронно только как локальный fallback.
- Cloudinary хранит изображения врачей. В БД сохраняются `photoUrl` и `photoPublicId`; старый ресурс удаляется после успешного обновления врача.
- Основной email-провайдер — Resend. SMTP включается через `EMAIL_PROVIDER=smtp`. Автоматического fallback между провайдерами нет.

## XLSX-импорт

Первая строка должна содержать колонки: `Услуга`, `Категория`, `Описание`, `Цена от`, `Цена до`, `Единица`.

Импорт проходит в два шага: проверка файла и подтверждение. Корректные строки применяются одной транзакцией, некорректные возвращаются списком с номером строки и причиной.

## Проверки

```bash
npm run typecheck
npm test
npm run build
```

Для приёмки AmoCRM проверьте: создание нового контакта, повторное использование контакта по телефону, создание сделки, связь с контактом, поля заявки, ответственного, тег «С сайта» и отсутствие дубля при повторной QStash-доставке.
