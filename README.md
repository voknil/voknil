# Voknil

Монорепозиторий для проекта voknil на TypeScript.

## Структура проекта

```
voknil/
├── apps/
│   └── web/          # Next.js веб-приложение (лендинг)
├── packages/         # Общие пакеты (если понадобятся)
└── README.md
```

## Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Docker** - контейнеризация для деплоя

## Разработка

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000)

### Сборка для production

```bash
npm run build
npm start
```

### Проверка типов

```bash
npm run type-check
```

## Деплой

Проект настроен для деплоя через Dokploy.

### Быстрый старт в Dokploy:

1. **Applications** → **New Application** → **Git Repository**
2. **Repository URL**: `https://github.com/voknil/voknil.git`
3. **Branch**: `main`
4. **Dockerfile Path**: `apps/web/Dockerfile`
5. **Port**: `3000`
6. Нажмите **Deploy**

**Важно:** В Dokploy нужно установить **Build Context** в `.` (корень репозитория) для работы с монoreпо.

См. `apps/web/Dockerfile` для конфигурации Docker.

## Лицензия

Приватный проект.
