# ⚽ DeporAnalytics | Pro Tactical Telemetry Lab

Plataforma web completa de alto impacto visual y escalable para el análisis táctico de futbolistas a partir de secuencias de video, inspirada en la telemetría broadcast de **EA Sports FC**, grafismo de la **Premier League** y los laboratorios biomecánicos de **Nike Football Labs**.

Impulsada 100% por la API oficial de **Gemini** (`gemini-2.5-flash`), sin requerir servidores Python pesados ni pipelines complejos de visión artificial.

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** >= 18 (se incluye v26 LTS autogestionada vía pnpm)
- **pnpm** >= 9

### Instalación y Ejecución

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno (opcional)
cp .env.example .env.local
# Añade tu GEMINI_API_KEY si deseas análisis en vivo con la API de Google Gemini.
# Si no la configuras, la plataforma activa su modo de simulación táctica de alta precisión.

# 3. Iniciar servidor de desarrollo
pnpm dev

# 4. Compilar para producción
pnpm build
pnpm start
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Sistema de Design Tokens ("Pitch Night Telemetry")

La estética visual se basa en variables CSS puras centralizadas en `src/styles/tokens.css` y mapeadas semánticamente a Tailwind CSS:

| Token Semántico | Valor / Variable | Rol en la UI |
| :--- | :--- | :--- |
| `bg-stadium-base` | `#070B0E` | Fondo carbón profundo con retícula táctica |
| `bg-stadium-surface` | `#0E151B` | Glassmorphism táctico, borde `rgba(163, 230, 53, 0.14)` |
| `bg-stadium-elevated` | `#15202B` | Tooltips, modales y controles flotantes |
| `text-volt` / `bg-volt` | `#A3E635` | Color primario eléctrico, CTAs, acentos positivos |
| `text-telemetry-cyan` | `#22D3EE` | Métricas de pase, líneas tácticas y contrastes |
| `text-thermal-high` | `#EF4444` | Alertas de pérdidas y zonas de calor máximo |

### Tipografía
- **Display:** `Barlow Condensed` (`700`, `800`, `900`, `uppercase`, tracking ajustado) para titulares, ratings y dorsales.
- **Sans:** `Plus Jakarta Sans` para lectura fluida de diagnósticos y drills.
- **Mono:** `JetBrains Mono` con `tabular-nums` para tiempos `[MM:SS]`, KPIs y porcentajes.

---

## 📐 Arquitectura de Carpetas (`src/`)

```
src/
├── app/
│   ├── layout.tsx              # Root Layout, tipografías y metadatos
│   ├── page.tsx                # Landing Hero & Match Setup Form
│   ├── loading.tsx             # Estado de carga root
│   ├── error.tsx               # Error boundary root
│   ├── analisis/
│   │   └── [id]/
│   │       ├── page.tsx        # Tactical Telemetry Dashboard (Bento Grid)
│   │       ├── loading.tsx     # Skeleton de telemetría y escaneo
│   │       └── error.tsx       # Manejo de excepciones con fallback a demo
│   └── api/
│       └── analyze/
│           └── route.ts        # Route handler con Gemini 2.5 Flash Structured Outputs
├── components/
│   ├── ui/                     # Primitivos atómicos desacoplados (Button, Card, Badge, Tabs, Toggle, StatBar, Skeleton, SectionHeader)
│   ├── pitch/                  # Módulo de cancha 2D cenital (SoccerPitchSVG, HeatmapLayer, EventMarkers, TimelineScrubber)
│   ├── analytics/              # Métricas y scout (PlayerScoutCard, TacticalRadarChart, KpiGrid, CoachFeedbackPanel, DrillCard, SyncedVideoPlayer)
│   └── layout/                 # Navegación persistente (Navbar, Breadcrumbs, MobileBottomNav)
├── lib/
│   ├── formatTimestamp.ts      # Utilidades para [MM:SS], formateo y parseo
│   ├── normalizeHeatmapData.ts # Escalado a cancha 100x68 y gradiente térmico
│   ├── geminiClient.ts         # Integración oficial con @google/genai y prompt táctico
│   └── cn.ts                   # Merge condicional de clases Tailwind
├── types/
│   └── analysis.ts             # Tipos e interfaces TypeScript estrictas (cero any)
└── data/
    └── mockAnalysis.ts         # Dataset de prueba completo: Verano #7 - Dibujitos FC
```

---

## ⚡ Características Principales del MVP

1. **Pantalla de Inicio & Match Setup (`/`):**
   - Formulario de configuración de partido con URL de YouTube, dorsal, nombre, color de uniforme, equipo y posición.
   - **Acceso Directo al Demo:** Botón instantáneo para explorar el partido de `Alexis "Verano" Gómez #7 (Dibujitos FC)` sin gastar tokens de API.
   - Modal de escaneo táctico con radar giratorio y etapas dinámicas.

2. **Dashboard de Telemetría (`/analisis/[id]`):**
   - **Player Scout Card:** Dorsal estilizado gigante en marca de agua, posición nominal vs **rol real detectado**, y medidor circular animado de **Match Rating (0.0 - 10.0)**.
   - **Cancha 2D Cenital Proporcional (100x68):** Césped con franjas de corte alternadas, flecha de dirección de ataque, y capas activables de **Mapa de Calor** y **Eventos Clave**.
   - **Selector de Tramos (`TimelineScrubber`):** `0-10 min`, `10-20 min`, `20-Fin` y `Partido Completo`.
   - **Sincronización de Video a Segundo Exacto:** Haz clic en cualquier chip `[MM:SS]` de la cancha o del feedback y el reproductor de YouTube saltará directamente a esa jugada.
   - **Radar Táctico de 5 Ejes:** `Defensa`, `Distribución`, `Táctica`, `Intensidad Física`, `Impacto Ofensivo`.
   - **KPI Grid:** `Precisión de Pases %`, `Duelos Ganados %`, `Intercepciones`, `Recuperaciones`, `Pérdidas en Zona Crítica`, `Velocidad Punta (km/h)`.
   - **Diagnóstico del Entrenador en 3 Columnas:**
     - Fortalezas (Mantener) con acento Volt y timestamps clicables.
     - A Corregir (Mejorar) con diagnóstico de causa raíz (orientación a 45°, escaneo ciego) y acento térmico.
     - Plan de Mejora con tarjetas de ejercicios (**DrillCard**) paso a paso de 15 minutos.
   - **Navegación Móvil Rápida:** Barra inferior anclada (`Cancha`, `Métricas`, `Video`, `Coach IA`) para smartphones sin scroll infinito.
