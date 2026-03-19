# 🏢 Plataforma de Reservas de Coworking

> Proyecto full-stack evaluado por el docente — Programación Web 2026A

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Tablero Kanban](#-tablero-kanban)
- [Instalación y Ejecución](#-instalación-y-ejecución)

---

## 📖 Descripción del Proyecto

La **Plataforma de Reservas de Coworking** es una aplicación web full-stack que permite administrar espacios de trabajo compartido, incluyendo la gestión de usuarios, sedes, espacios, reservas, tarifas y reportes de ocupación.

### Alcance

| Aspecto                  | Detalle                                          |
| ------------------------ | ------------------------------------------------ |
| **Tipo**                 | Proyecto evaluativo — Guiado por el docente      |
| **Entidades**            | 7 entidades con relaciones (ver modelo de datos) |
| **Historias de Usuario** | 10 HUs organizadas en 5 sprints                  |
| **Releases**             | 2 releases alineados con los cortes académicos   |
| **Casos de Uso**         | 10 CUs                                           |

### Funcionalidades Principales

- ✅ Gestión de usuarios y membresías
- ✅ Administración de sedes y espacios
- ✅ Consulta de disponibilidad por fecha y horario
- ✅ Creación y cancelación de reservas
- ✅ Historial de reservas del usuario
- ✅ Configuración de tarifas
- ✅ Reportes de ocupación

---

## 🛠 Stack Tecnológico

| Capa              | Tecnología                          | Propósito                                |
| ----------------- | ----------------------------------- | ---------------------------------------- |
| **Backend**       | NestJS (Node.js + TypeScript)       | API REST con arquitectura en capas       |
| **Frontend**      | Next.js 14+ (React + TypeScript)    | Interfaz de usuario con App Router       |
| **Base de Datos** | PostgreSQL 16                       | Almacenamiento relacional                |
| **ORM**           | Prisma                              | Modelado de datos, migraciones y queries |
| **Contenedores**  | Docker + Docker Compose             | Orquestación de servicios                |
| **Validación**    | class-validator + class-transformer | DTOs y validación de entrada             |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
Cliente → Controller → Service → Repository → Prisma → PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/                 # Módulo compartido (cross-cutting)
│   │   │   ├── filters/            # Filtros de excepción globales
│   │   │   ├── interceptors/       # Interceptores de respuesta
│   │   │   ├── pipes/              # Pipes de validación
│   │   │   └── guards/             # Guards de autenticación
│   │   ├── prisma/                 # Módulo Prisma (acceso a BD)
│   │   └── modules/                # Módulos de dominio
│   │       └── [entidad]/
│   │           ├── controller/     # Solo manejo HTTP
│   │           ├── service/        # Lógica de negocio
│   │           ├── repository/     # Acceso a datos (Prisma)
│   │           ├── dto/            # Validación de entrada
│   │           └── entities/       # Representación del dominio
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/                    # App Router (páginas)
│   │   ├── components/             # Componentes reutilizables
│   │   ├── services/               # Capa de acceso a la API
│   │   ├── interfaces/             # Tipos e interfaces TypeScript
│   │   └── lib/                    # Utilidades
│   └── package.json
│
└── README.md
```

---

## 📊 Modelo de Datos

### Diagrama de Relaciones

```
Usuario          1 ──── N  Reserva
Sede             1 ──── N  Espacio
TipoEspacio      1 ──── N  Espacio
Espacio          1 ──── N  Reserva
Membresia        1 ──── N  Usuario
Tarifa           N ──── N  TipoEspacio + Membresia
```

### Entidades

| Entidad         | Campos Principales                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| **Usuario**     | id, nombre, apellido, correo (unique), contraseña, teléfono, membresiaId                                    |
| **Membresia**   | id, tipo (básica, premium, corporativa)                                                                     |
| **Sede**        | id, nombre (unique), dirección, horarioApertura, horarioCierra, capacidadTotal                              |
| **TipoEspacio** | id, nombre (escritorio individual, sala de reuniones, sala de conferencias, auditorio)                      |
| **Espacio**     | id, nombre, capacidad, sedeId, tipoEspacioId                                                                |
| **Tarifa**      | id, precioHora, tipoEspacioId, membresiaId (unique compound)                                                |
| **Reserva**     | id, usuarioId, espacioId, fecha, horaInicio, horaFin, fechaCreacion, estado (activa, cancelada, finalizada) |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte

> **📅 Cierre: 17 de Abril de 2026** · Sprints 1, 2 y 3

**Objetivo:** Entregar la API REST completa con arquitectura en capas y el frontend con las vistas de CRUD para las entidades base.

| Sprint                                                  | Período         | HUs           | Alcance                                                                                                                 |
| ------------------------------------------------------- | --------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [Sprint 1](#sprint-1--infraestructura-y-entidades-base) | Mar 18 → Mar 29 | HU-01 a HU-02 | Docker Compose, Prisma schema, migraciones, módulos CRUD de Usuario y Sede                                              |
| [Sprint 2](#sprint-2--espacios-y-disponibilidad)        | Mar 30 → Abr 10 | HU-03 a HU-04 | Módulos CRUD de Espacio y TipoEspacio. Lógica de consulta de disponibilidad por fecha y horario                         |
| [Sprint 3](#sprint-3--gestión-de-reservas)              | Abr 13 → Abr 17 | HU-05 a HU-06 | Módulos de creación y cancelación de reservas con lógica de negocio. Frontend: listados y formularios de entidades base |

### Release 2 — Tercer Corte

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Integración completa frontend ↔ backend, flujos avanzados (reservar → cancelar → historial), administración de tarifas y reportes de ocupación. Sistema validado y funcionando con Docker.

| Sprint                                                 | Período         | HUs          | Alcance                                                                                            |
| ------------------------------------------------------ | --------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| [Sprint 4](#sprint-4--historial,-tarifas-y-navegación) | Abr 20 → May 8  | HU-07, HU-08 | Historial de reservas del usuario, administración de tarifas, navegación y layout general          |
| [Sprint 5](#sprint-5--reportes-y-consolidación-final)  | May 11 → May 22 | HU-09, HU-10 | Reporte de ocupación, listado de reservas activas del día, pruebas finales y validación con Docker |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura y entidades base

> 📅 **Mar 16 → Mar 29** · 🚫 Festivo: Mar 23 (San José) · [Ver Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/1)

| #     | Historia de Usuario             | Labels                            | Issue                                                                    |
| ----- | ------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| HU-01 | Registro de Usuario             | `user-story` `backend` `frontend` | [#1](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/1) |
| HU-02 | Gestión de Sedes                | `user-story` `backend` `frontend` | [#2](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/2) |

**Entregables:**

- Docker Compose con PostgreSQL, NestJS y Next.js
- Prisma schema con entidades Usuario y Sede
- Migraciones ejecutadas
- CRUD completo (Controller → Service → Repository) para las entidades Usuario y Sede
- Frontend: listados y formularios básicos

---

### Sprint 2 — Espacios y disponibilidad

> 📅 **Mar 30 → Abr 10** · 🚫 Festivos: Abr 2-3 (Semana Santa) · [Ver Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/2)

| #     | Historia de Usuario            | Labels                            | Issue                                                                    |
| ----- | ------------------------------ | --------------------------------- | ------------------------------------------------------------------------ |
| HU-03 | Configuración de espacios      | `user-story` `backend` `frontend` | [#3](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/3) |
| HU-04 | Consulta de disponibilidad     | `user-story` `backend` `frontend` | [#4](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/4) |

**Entregables:**

- CRUD de Espacio con relación a Sede y TipoEspacio
- Validaciones de integridad (existencia de sede y tipo de espacio)
- Lógica de restricción para eliminación de espacios con reservas activas
- Servicio de consulta de disponibilidad por sede, fecha y franja horaria
- Endpoint de disponibilidad con validación de rango horario

---

### Sprint 3 — Gestión de reservas

> 📅 **Abr 13 → Abr 17** · 📝 Cierre Segundo Corte: Abr 17 · [Ver Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/3)

| #     | Historia de Usuario                         | Labels                            | Issue                                                                      |
| ----- | ------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| HU-05 | Creación de Reservas                        | `user-story` `backend` `frontend` | [#5](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/5)   |
| HU-06 | Cancelación de Reservas                     | `user-story` `backend` `frontend` | [#6](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/6)   |

**Entregables:**

- Módulo de Reserva con validación de disponibilidad por horario
- Lógica de creación de reservas con registro automático de estado y fecha
- Lógica de cancelación de reservas con validación de tiempo mínimo y estado
- Validaciones de integridad y reglas de negocio (colisión de horarios)
- Frontend: formularios de reserva y gestión básica de reservas

---

### Sprint 4 — Historial, tarifas y navegación

> 📅 **Abr 20 → May 8** · 🚫 Festivo: May 1 (Día del Trabajo) · [Ver Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/4)

| #     | Historia de Usuario                   | Labels                  | Issue                                                                      |
| ----- | ------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| HU-07 |  Historial de reservas del Usuario    | `user-story` `backend` `frontend` | [#7](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/7) |
| HU-08 | Administración de tarifas             | `user-story` `backend` `frontend` `cross-cutting` | [#8](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/8) |

**Entregables:**

- Endpoint de historial de reservas por usuario con joins a Espacio y Sede
- Listado de historial ordenado por fecha (reciente → antiguo)
- CRUD de Tarifa con validación de combinación única (TipoEspacio + Membresía)
- Frontend: página de historial de reservas y gestión de tarifas
- Layout general con navegación y componentes de feedback

---

### Sprint 5 — Reportes y consolidación final

> 📅 **May 11 → May 22** · 🚫 Festivo: May 18 (Día de la Ascensión) · 📝 Cierre Tercer Corte: May 22 · [Ver Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/5)

| #     | Historia de Usuario                    | Labels                                      | Issue                                                                      |
| ----- | -------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| HU-09 | Reporte de ocupación                   | `user-story` `backend` `frontend` `reporte` | [#9](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/9) |
| HU-10 | Listado de reservas activas del día    | `user-story` `backend` `frontend` `reporte` | [#10](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/10) |

**Entregables:**

- Endpoint de reporte de ocupación por sede y rango de fechas
- Query agregada con total de reservas y espacios más utilizados
- Listado de reservas activas del día filtrado por sede
- Manejo de resultados vacíos en reportes y listados
- Frontend: página de reportes y listado de reservas activas

---

## 📅 Cronograma

```
┌──────────────────────────────────────────────────────────────────────────────┐
│             SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026                  │
│                         Backend + Frontend Base                              │
├─────────────────────┬─────────────────────┬──────────────────────────────────┤
│ Sprint 1            │ Sprint 2            │ Sprint 3                         │
│ Mar 18 → Mar 29     │ Mar 30 → Abr 10     │ Abr 13 → Abr 17                  │
│                     │                     │                                  │
│ • Docker            │ • Espacio           │ • Reservas                       │
│ • Prisma            │ • TipoEspacio       │ • Cancelación                    │
│ • Usuario           │ • Disponibilidad    │ • Frontend listados              │
│ • Sede              │ • Tarifas           │ • Formularios                    │
│ • Membresía         │                     │                                  │
│                     │  ⦸ Abr 2-3         │                                  │
│  ⦸ Mar 23          │  (Semana Santa)     │                                  │
│  (San José)         │                     │                                  │
├─────────────────────┴─────────────────────┴──────────────────────────────────┤
│             TERCER CORTE (Release 2) — Cierre: 22 May 2026                   │
│                         Integración + Reportes                               │
├────────────────────────────────────┬─────────────────────────────────────────┤
│ Sprint 4                           │ Sprint 5                                │
│ Abr 20 → May 8                     │ May 11 → May 22                         │
│                                    │                                         │
│ • Frontend Reservas                │ • Reporte ocupación                     │
│ • Historial                        │ • Reservas activas                      │
│ • Administración Tarifas           │ • Pruebas activas                       │
│ • Navegación                       │ • Pruebas finales                       │
│                                    │ • Docker compose validación final       │
│  ⦸ May 1                          │  ⦸ May 18                              │
│  (Día del Trabajo)                 │  (Día de la Ascensión)                  │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

### Festivos Colombianos (Marzo — Mayo 2026)

| Fecha              | Festivo             | Sprint Afectado |
| ------------------ | ------------------- | --------------- |
| Lunes 23 de Marzo  | Día de San José     | Sprint 1        |
| Jueves 2 de Abril  | Jueves Santo        | Sprint 2        |
| Viernes 3 de Abril | Viernes Santo       | Sprint 2        |
| Viernes 1 de Mayo  | Día del Trabajo     | Sprint 4        |
| Lunes 18 de Mayo   | Día de la Ascensión | Sprint 5        |

---

## ✅ Definition of Done (DoD)

> 📌 Referencia completa: [Issue #17 — Definition of Done](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/11)

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend  

- [ ] Endpoint(s) implementados con arquitectura en capas: Controller → Service → Repository. 
- [ ] DTOs con validaciones (class-validator) para campos como fecha, horario, capacidad, unicidad y FKs. 
- [ ] Validaciones de reglas de negocio aplicadas (disponibilidad, horarios, reservas activas, unicidad de tarifas). 
- [ ] Manejo de errores con excepciones HTTP apropiadas (BadRequestException, ConflictException, NotFoundException). 
- [ ] Respuestas con formato uniforme mediante interceptor global. 
- [ ] Endpoints probados manualmente con Postman/Thunder Client y funcionando correctamente. 


### Frontend 

- [ ] Página(s) implementada(s) con componentes reutilizables (tablas, formularios, selects dinámicos). 
- [ ] Consumo del API a través de la capa de services/. 
- [ ] Manejo de estados: carga (loading), éxito y error en operaciones como reservas y disponibilidad. 
- [ ] Formularios con validación del lado del cliente (campos obligatorios, rangos de horas, fechas válidas). 
- [ ] Diseño responsivo y consistencia visual en todas las vistas. 


### Infraestructura y código 

- [ ] Código versionado en GitHub con commits descriptivos. 
- [ ] El sistema completo (backend + base de datos + frontend) funciona correctamente con docker compose up. 
- [ ] No hay errores de consola ni advertencias críticas en frontend o backend. 
- [ ] Las migraciones de Prisma están aplicadas y el esquema es consistente con el modelo de datos del coworking. 
- [ ] Variables de entorno configuradas correctamente (.env). 

---

## 📊 Tablero Kanban

El seguimiento del proyecto se realiza mediante un tablero Kanban en GitHub Projects:

🔗 **[Ver Tablero Kanban](https://github.com/users/laura-marcela05/projects/1/views/1?layout=table)**

El tablero incluye:

- **Columnas:** Todo → In Progress → Done
- **Campos personalizados:** Sprint, Release
- **Vistas:** Board (Kanban), Table, Roadmap

---

## ⚙ Instalación y Ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio

```bash
git clone https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking.git
cd Plataforma-de-Reservas-de-Coworking
```

### Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

```env
# .env.example
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=plataforma_reservas_coworking_db
```

### Levantar los servicios

```bash
# Levantar todos los servicios con Docker Compose
docker compose up

# O en modo detached (segundo plano)
docker compose up -d
```

### Acceder a los servicios

| Servicio                 | URL                                            |
| ------------------------ | ---------------------------------------------- |
| **Frontend (Next.js)**   | [http://localhost:3000](http://localhost:3000) |
| **Backend (NestJS API)** | [http://localhost:3001](http://localhost:3001) |
| **PostgreSQL**           | `localhost:5432`                               |

### Ejecutar migraciones de Prisma

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Ejecutar migraciones
npx prisma migrate dev

# Generar el cliente Prisma
npx prisma generate
```

---

## 📎 Enlaces Rápidos

| Recurso               | Enlace                                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| 📋 Tablero Kanban     | [GitHub Projects](https://github.com/users/laura-marcela05/projects/1/views/1?layout=table)                |
| 📌 Issues (todos)     | [Ver Issues](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues)     |
| 🏁 Sprint 1           | [Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/1) |
| 🏁 Sprint 2           | [Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/2) |
| 🏁 Sprint 3           | [Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/3) |
| 🏁 Sprint 4           | [Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/4) |
| 🏁 Sprint 5           | [Milestone](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/milestone/5) |
| 📖 Definition of Done | [Issue #17](https://github.com/laura-marcela05/Plataforma-de-Reservas-de-Coworking/issues/11)   |

---

<p align="center">
  <strong>Programación Web — Ingeniería de Sistemas — 2026A</strong><br>
  <em>Corporación Universitaria del Huila — CORHUILA</em>
</p>
