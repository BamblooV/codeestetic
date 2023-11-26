# [Тестовое](https://docs.google.com/document/d/1pgVvDlOw6F3lj2UUQU7Q4Mic45pTQO_y_7i4kTUaooU/edit#heading=h.vilbomg3ya32)

## Требования к среде: node 18

## [Деплой](https://bambloov.github.io/codeestetic/)

## Запуск приложения

Приложение можно запустить как с применением вебсокет сервера, так и без него. Чтобы клиент общался с сервером нужно пройти `client/env` и раскомментировать первую строку (она была закоменчена, чтобы задеплоелось самодостаточное приложение на gh pages)

Самостоятельный запуск:

```bash
cd server
npm install
npm run start
cd ../client
npm install
npm run dev
```

Запуск в докер контейнере (если не раскоментировали `client/env`, то клиент не будет получать данные с сервера):
```bash
docker compose up
```