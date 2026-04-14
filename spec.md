# LALALOU KPI Dashboard - Especificación Técnica

## 📋 Descripción del Proyecto

Sistema web profesional para análisis de KPIs de stock que permite cargar archivos Excel, procesarlos automáticamente y visualizar métricas en dashboards interactivos con capacidad de comparación histórica y actualización en tiempo real.

## 🛠️ Stack Técnico

### Frontend
- **Framework**: React 18 con TypeScript
- **Bundler**: Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts + D3.js para visualizaciones avanzadas
- **Estado**: Zustand para manejo de estado global
- **Formularios**: React Hook Form + Zod
- **Drag & Drop**: React Dropzone para upload de archivos
- **Tiempo Real**: Socket.io-client

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js con Helmet y CORS
- **Procesamiento Excel**: ExcelJS + XLSX
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT + bcrypt
- **Tiempo Real**: Socket.io
- **Validación**: Zod
- **Logs**: Winston
- **Queue**: Bull (Redis) para procesamiento asíncrono

### Infraestructura
- **Base de Datos**: PostgreSQL 15+
- **Cache**: Redis para sessions y queues
- **Storage**: Local filesystem con multer (escalable a S3)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx (producción)

## 📁 Estructura de Archivos

```
LALALOU-KPI/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn components
│   │   │   ├── charts/       # Componentes de gráficos
│   │   │   ├── upload/       # Upload de archivos
│   │   │   ├── dashboard/    # Dashboard principal
│   │   │   └── layout/       # Layout components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilidades y configuración
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # API calls
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Helper functions
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Prisma models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper functions
│   │   ├── workers/          # Background jobs
│   │   ├── config/           # Configuración
│   │   └── types/            # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── uploads/              # Archivos temporales
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── shared/
│   └── types/                # Types compartidos
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🧩 Componentes Principales

### 1. Upload Component
- **Funcionalidad**: Drag & drop para archivos Excel
- **Validación**: Formato, tamaño, estructura
- **UI**: Progress bar, preview, error handling
- **Estados**: idle, uploading, processing, success, error

### 2. Dashboard Grid
- **Layout**: Grid responsivo con widgets redimensionables
- **Widgets**: KPIs cards, gráficos, tablas, métricas
- **Personalización**: Drag & drop, filtros, timeframes
- **Exportación**: PDF, PNG, Excel

### 3. Charts Library
- **Tipos**: Line, Bar, Pie, Area, Scatter, Heatmap
- **Interactividad**: Zoom, pan, tooltip, click events
- **Responsive**: Auto-resize, mobile optimized
- **Animaciones**: Smooth transitions, loading states

### 4. Data Table
- **Features**: Sort, filter, pagination, search
- **Virtual scroll**: Para grandes datasets
- **Export**: CSV, Excel, PDF
- **Edición**: Inline editing con validación

### 5. Historical Comparison
- **Timeline**: Date range picker
- **Overlay**: Compare múltiples períodos
- **Diff View**: Destacar cambios significativos
- **Metrics**: Growth rates, variance analysis

### 6. Real-time Updates
- **WebSocket**: Conexión persistente
- **Notifications**: Toast messages para updates
- **Auto-refresh**: Configurable intervals
- **Optimistic UI**: Updates inmediatos

## 🗄️ Esquema de Base de Datos

### Users
```sql
id: UUID PRIMARY KEY
email: VARCHAR UNIQUE NOT NULL
password_hash: VARCHAR NOT NULL
name: VARCHAR NOT NULL
role: ENUM('admin', 'analyst', 'viewer')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Files
```sql
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY
filename: VARCHAR NOT NULL
original_name: VARCHAR NOT NULL
file_path: VARCHAR NOT NULL
file_size: INTEGER NOT NULL
mime_type: VARCHAR NOT NULL
status: ENUM('uploaded', 'processing', 'processed', 'error')
error_message: TEXT NULL
uploaded_at: TIMESTAMP
processed_at: TIMESTAMP NULL
```

### DataSets
```sql
id: UUID PRIMARY KEY
file_id: UUID FOREIGN KEY
name: VARCHAR NOT NULL
description: TEXT
total_rows: INTEGER NOT NULL
columns_config: JSONB NOT NULL
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### KPIs
```sql
id: UUID PRIMARY KEY
dataset_id: UUID FOREIGN KEY
name: VARCHAR NOT NULL
description: TEXT
formula: TEXT NOT NULL
value: DECIMAL(15,4)
unit: VARCHAR
category: VARCHAR
calculated_at: TIMESTAMP
```

### Historical_Data
```sql
id: UUID PRIMARY KEY
kpi_id: UUID FOREIGN KEY
period_start: DATE NOT NULL
period_end: DATE NOT NULL
value: DECIMAL(15,4) NOT NULL
metadata: JSONB
created_at: TIMESTAMP
INDEX (kpi_id, period_start, period_end)
```

### Dashboards
```sql
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY
name: VARCHAR NOT NULL
description: TEXT
layout_config: JSONB NOT NULL
widgets: JSONB NOT NULL
is_public: BOOLEAN DEFAULT FALSE
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## 🔧 APIs Principales

### Upload & Processing
```
POST /api/files/upload
GET  /api/files/:id/status
POST /api/files/:id/process
DELETE /api/files/:id
```

### Data Management
```
GET    /api/datasets
GET    /api/datasets/:id
POST   /api/datasets/:id/kpis
PUT    /api/datasets/:id
DELETE /api/datasets/:id
```

### KPIs & Analytics
```
GET  /api/kpis
GET  /api/kpis/:id/history
POST /api/kpis/calculate
GET  /api/kpis/compare?periods=...
```

### Dashboards
```
GET    /api/dashboards
POST   /api/dashboards
GET    /api/dashboards/:id
PUT    /api/dashboards/:id
DELETE /api/dashboards/:id
```

### Real-time
```
WebSocket: /ws
Events: kpi_updated, data_processed, dashboard_changed
```

## 🚀 Flujo de Procesamiento

1. **Upload**: Usuario arrastra Excel al dropzone
2. **Validation**: Verificar formato y estructura
3. **Queue**: Agregar a cola de procesamiento
4. **Parse**: ExcelJS extrae datos y metadatos
5. **Transform**: Limpieza y normalización
6. **Store**: Guardar en PostgreSQL
7. **Calculate**: Generar KPIs automáticamente
8. **Notify**: WebSocket notifica completion
9. **Visualize**: Renderizar en dashboard

## 📊 KPIs Automáticos

### Stock Analysis
- **Turnover Rate**: Rotación de inventario
- **Stock Coverage**: Días de cobertura
- **ABC Analysis**: Clasificación de productos
- **Dead Stock**: Items sin movimiento
- **Stock Value**: Valorización total

### Performance Metrics
- **Accuracy**: Precisión de forecasting
- **Service Level**: Nivel de servicio
- **Fill Rate**: Tasa de cumplimiento
- **Backorder Rate**: Tasa de pendientes
- **Cost Analysis**: Análisis de costos

## 🔐 Seguridad

- **Authentication**: JWT tokens con refresh
- **Authorization**: RBAC (Role-Based Access Control)
- **File Validation**: Mime type + content validation
- **Rate Limiting**: API throttling
- **Input Sanitization**: XSS y injection prevention
- **HTTPS**: SSL/TLS en producción
- **CORS**: Configuración restrictiva

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switcher
- **Loading States**: Skeletons y spinners
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels, keyboard navigation
- **Internationalization**: i18n ready (ES/EN)
- **Progressive Web App**: Service worker, offline cache

## 📈 Escalabilidad

- **Database**: Connection pooling, read replicas
- **File Storage**: Scalable a S3/CloudStorage
- **Caching**: Redis para queries frecuentes
- **CDN**: Assets estáticos
- **Monitoring**: Health checks, metrics
- **Logging**: Structured logs con Winston
- **Docker**: Containerización completa

## 🧪 Testing Strategy

- **Unit Tests**: Jest + Testing Library
- **Integration**: Supertest para APIs
- **E2E**: Playwright para flows completos
- **Performance**: k6 para load testing
- **Coverage**: >80% code coverage target

---

*Esta especificación define un sistema robusto y escalable para análisis de KPIs con capacidades enterprise y UX moderna.*