# ☕ Coffee Experience Assistant — Fusagasugá

Aplicación web para mejorar la cultura cafetera: recomendación inteligente, simulación de temperatura en tiempo real y trazabilidad verificable.

## Estructura del proyecto

```
coffee-experience-assistant/
├── backend/       # Node.js + Express + Prisma + Socket.IO
└── frontend/      # React 18 + TypeScript + Vite + Tailwind
```

## Instalación y ejecución

### 1. Backend

```bash
cd backend
npm install
npm run db:push      # Crea la base de datos SQLite
npm run db:seed      # Carga los 6 cafés de demostración
npm run dev          # Inicia en http://localhost:3001
```

### 2. Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev          # Inicia en http://localhost:5173
```

## Credenciales de demostración

| Usuario | Email | Contraseña | Rol |
|---------|-------|-----------|-----|
| Demo | demo@coffee.com | cliente123 | Cliente |
| Admin | admin@coffee.com | admin123 | Administrador |

## Funcionalidades

- **🎯 Recomendación Inteligente** — Quiz de 3 preguntas + Cosine Similarity
- **🌡️ Temperatura en Tiempo Real** — Ley de Newton sin sensores físicos
- **📍 Trazabilidad QR** — 4 etapas: Cosecha → Procesamiento → Tostión → Taza
- **📔 Pasaporte Cafetero** — Sellos + insignias + gamificación
- **🕸️ Perfil Sensorial** — Gráfico radar de 8 dimensiones (Chart.js)

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| GET | /api/coffees | Listar cafés |
| GET | /api/coffees/:id | Detalle del café |
| POST | /api/recommendations | Obtener recomendaciones |
| POST | /api/recommendations/rate | Valorar un café |
| POST | /api/temperature/simulate | Simular temperatura |
| GET | /api/traceability/:coffeeId | Ver trazabilidad |

## Stack Tecnológico

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Chart.js, Zustand, Socket.IO Client
**Backend:** Node.js, Express, Prisma ORM, Socket.IO, JWT, bcryptjs, qrcode
**Base de datos:** SQLite (dev) / PostgreSQL (producción)
