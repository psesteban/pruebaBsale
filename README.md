# Flight Seat Assignment API

API REST para la asignación automática de asientos en vuelos, diseñada para optimizar la experiencia de check-in de pasajeros priorizando la proximidad de menores de edad con adultos de la misma compra.

## 🚀 Características

- **Asignación Inteligente de Asientos**: Algoritmo que prioriza sentar menores de edad junto a adultos de la misma compra
- **Soporte Multi-clase**: Maneja diferentes tipos de asientos (Económica, Premium, Business)
- **Pool de Conexiones**: Gestión eficiente de conexiones a la base de datos MySQL
- **Manejo de Errores**: Sistema robusto de manejo de errores con logging detallado
- **Conversión de Formatos**: Convierte automáticamente de snake_case a camelCase en las respuestas
- **Testing**: Suite de pruebas incluida con Jest y Supertest

## 📋 Requisitos Previos

- **Node.js** v16.0.0 o superior
- **MySQL** 8.0 o superior
- **npm** o **yarn**

## 🛠️ Instalación

1. **Clona el repositorio**
```bash
git clone <url-del-repositorio>
cd steve_prueba
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:
```env
# Configuración del servidor
PORT=3000

# Configuración de la base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos
DB_PORT=3306
```

4. **Configura la base de datos**

Asegúrate de tener las siguientes tablas en tu base de datos MySQL:
- `flight` - Información de vuelos
- `passenger` - Datos de pasajeros
- `boarding_pass` - Pases de abordar
- `seat` - Configuración de asientos del avión

## 🚀 Ejecución

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

La API estará disponible en `http://localhost:3000` (o el puerto especificado en `.env`).

## 📚 Documentación de la API

### Endpoint Principal

#### `GET /flights/:id/passengers`

Obtiene la información del vuelo y asigna asientos automáticamente a los pasajeros.

**Parámetros:**
- `id` (string): ID del vuelo

**Respuesta Exitosa (200):**
```json
{
  "code": 200,
  "data": {
    "flightId": 1,
    "takeoffDateTime": 1719835200,
    "takeoffAirport": "Aeropuerto Internacional Arturo Merino Benítez, Chile",
    "landingDateTime": 1719849600,
    "landingAirport": "Aeropuerto Internacional Jorge Chávez, Perú",
    "airplaneId": 1,
    "passengers": [
      {
        "passengerId": 1,
        "dni": 12345678,
        "name": "Juan Pérez",
        "age": 35,
        "country": "Chile",
        "boardingPassId": 1,
        "purchaseId": 1,
        "seatTypeId": 1,
        "seatId": 10
      }
    ]
  }
}
```

**Respuestas de Error:**
- `400`: Error de conexión a base de datos o parámetros inválidos
- `404`: Vuelo no encontrado

## 🧠 Algoritmo de Asignación de Asientos

El sistema implementa un algoritmo inteligente que sigue estas reglas de prioridad:

### 1. Fase de Reservas Previas
- Procesa pasajeros que ya tienen asientos asignados
- Si un adulto tiene asiento reservado, busca asientos adyacentes para menores de su misma compra

### 2. Fase de Asignación Automática
- Ordena pasajeros por `boarding_pass_id` para mantener consistencia
- Prioriza por tipo de asiento: **Business (3)** → **Premium (2)** → **Económica (1)**
- Para cada adulto:
  - Asigna el primer asiento disponible de su clase
  - Busca asientos adyacentes (columnas A↔B, B↔C, etc.) para menores de la misma compra
  - Si no hay asientos adyacentes, el menor queda sin asiento asignado

### 3. Características del Algoritmo
- **Proximidad**: Menores de 18 años siempre intentan ubicarse junto a adultos de su compra
- **Flexibilidad**: Si no hay asientos adyacentes, prioriza la asignación del adulto
- **Eficiencia**: Utiliza filtros y búsquedas optimizadas para grandes volúmenes de datos

## 🏗️ Arquitectura del Proyecto

```
src/
├── config/
│   └── databaseBsale.js      # Configuración del pool de conexiones MySQL
├── controllers/
│   └── flightcontroller.js   # Controlador principal de vuelos
├── middleware/
│   └── errors.js             # Middleware de manejo de errores
├── models/
│   └── query.js              # Modelo para ejecutar consultas SQL
├── routes/
│   └── model.routes.js       # Definición de rutas
├── services/
│   ├── assigmentServices.js  # Servicio de asignación de asientos
│   └── serviceData.js        # Servicio de consulta de datos
├── tests/
│   └── test.js               # Suite de pruebas
└── utils/
    ├── caseConverter.js      # Utilidades de conversión de formato
    └── errorHandler.js       # Utilidades de manejo de errores
```

## 🔧 Servicios Principales

### SeatAssignmentService
Clase responsable de la lógica de asignación de asientos:
- `assignSeatsToPassengers()`: Método principal que ejecuta el algoritmo
- Manejo de columnas adyacentes (A↔B, B↔C, etc.)
- Agrupación por compra y filtrado por edad

### Database Service
- Pool de conexiones con reconexión automática
- Timeout y retry configurables
- Consultas optimizadas con JOIN para mejor rendimiento

## 🧪 Testing

El proyecto incluye una suite de pruebas completa:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch
```

### Cobertura de Pruebas
- **API Endpoints**: Pruebas de integración con diferentes escenarios
- **Servicios**: Pruebas unitarias del algoritmo de asignación
- **Utilidades**: Pruebas de conversión de formatos y manejo de errores
- **Manejo de Errores**: Escenarios de fallo de base de datos y datos inválidos

## 🔍 Monitoreo y Logging

El sistema incluye logging detallado para facilitar el debugging:
- Errores de base de datos con stack trace completo
- Timestamp y contexto de cada error
- Información de requests (URL, método, parámetros)

## 🚀 Mejoras Futuras

- [ ] Implementar cache con Redis para consultas frecuentes
- [ ] Añadir endpoint de health check
- [ ] Implementar rate limiting
- [ ] Añadir documentación con Swagger/OpenAPI
- [ ] Métricas de performance con Prometheus
- [ ] Implementar WebSockets para actualizaciones en tiempo real
- [ ] Soporte para reservas de grupos grandes
- [ ] Algoritmo de optimización de ocupación por fila

## 📊 Esquema de Base de Datos

### Tablas Principales

**flight**
- `flight_id`: ID único del vuelo
- `takeoff_date_time`: Fecha y hora de despegue
- `takeoff_airport`: Aeropuerto de origen
- `landing_date_time`: Fecha y hora de aterrizaje
- `landing_airport`: Aeropuerto de destino
- `airplane_id`: ID del avión asignado

**passenger**
- `passenger_id`: ID único del pasajero
- `dni`: Documento de identidad
- `name`: Nombre completo
- `age`: Edad (importante para lógica de asignación)
- `country`: País de origen

**boarding_pass**
- `boarding_pass_id`: ID único del pase de abordar
- `passenger_id`: Referencia al pasajero
- `flight_id`: Referencia al vuelo
- `purchase_id`: ID de compra (agrupa pasajeros de la misma reserva)
- `seat_type_id`: Tipo de asiento (1: Económica, 2: Premium, 3: Business)
- `seat_id`: Asiento asignado (null si no tiene asignación previa)

**seat**
- `seat_id`: ID único del asiento
- `seat_column`: Columna del asiento (A, B, C, etc.)
- `seat_row`: Fila del asiento
- `seat_type_id`: Tipo de asiento
- `airplane_id`: ID del avión

## 🤝 Contribución

1. De Juicios buenos aprendemos todos

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

**Steve** - Desarrollador Principal

---

*Para más información o soporte, por favor abre un issue en el repositorio.*