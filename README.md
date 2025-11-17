# 💍 Sistema RSVP para Boda

Sistema completo de confirmación de asistencia para bodas, construido con React + Vite + TypeScript + Docker + Google Apps Script.

## ✨ Características

- 🔍 **Búsqueda inteligente** de invitados
- ✅ **Validación de confirmaciones previas** - evita duplicados
- 👥 **Control de cupos** - respeta el número de invitados asignados
- 📝 **Formulario condicional** según asistencia (Sí/No)
- 📊 **Almacenamiento en Google Sheets** en tiempo real
- 🐳 **Dockerizado** para desarrollo fácil
- 📱 **Responsive** - funciona en móviles y escritorio
- 🎨 **Interfaz moderna** con gradientes y animaciones

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados
- Cuenta de Google para Google Sheets
- Node.js 22+ (si deseas ejecutar sin Docker)

### Instalación

1. **Clona o descarga el proyecto**

2. **Configura tus invitados**
   - Edita `src/invitados.ts` con tu lista de invitados

3. **Configura Google Apps Script**
   - Ve a https://script.google.com
   - Crea un nuevo proyecto
   - Copia el contenido de `google-apps-script.js`
   - Actualiza `SPREADSHEET_ID` con tu ID de Google Sheet
   - Despliega como Web App (Acceso: Cualquier persona)
   - Copia la URL del deployment

4. **Configura variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   - Edita `.env.local` y pega tu URL de Google Apps Script

5. **Inicia con Docker**
   ```bash
   docker-compose up --build
   ```

6. **Abre tu navegador**
   - Visita: http://localhost:5173

## 📁 Estructura del Proyecto

```
weeding/
├── src/
│   ├── App.tsx              # Componente principal con toda la lógica
│   ├── App.css              # Estilos del formulario
│   ├── invitados.ts         # Lista de invitados
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── google-apps-script.js    # Código para Google Apps Script
├── docker-compose.yml       # Configuración de Docker
├── Dockerfile               # Imagen Docker para desarrollo
├── Dockerfile.prod          # Imagen Docker para producción
├── .env.local               # Variables de entorno (no incluido en git)
├── .env.example             # Ejemplo de variables de entorno
├── package.json             # Dependencias del proyecto
├── vite.config.ts           # Configuración de Vite
└── README.md                # Este archivo
```

## 🔧 Configuración Detallada

### Lista de Invitados

Edita `src/invitados.ts`:

```typescript
export const listaInvitados: Invitado[] = [
  { id: 1, nombre: "Juan Pérez", invitados: 2, adicional: 0 },
  { id: 2, nombre: "María García", invitados: 4, adicional: 1 },
  // ... más invitados
]
```

- **id**: Identificador único
- **nombre**: Nombre completo o familia
- **invitados**: Número de lugares confirmados
- **adicional**: Lugares adicionales opcionales

### Google Apps Script

El ID de tu Google Sheet se encuentra en la URL:
```
https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
```

Actualiza la constante `SPREADSHEET_ID` en `google-apps-script.js`.

### Variables de Entorno

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

## 🎯 Flujo de Usuario

1. **Búsqueda**: El invitado escribe su nombre
2. **Selección**: Elige su nombre de la lista filtrada
3. **Verificación**: El sistema verifica si ya confirmó
   - ✅ Ya confirmó: Muestra mensaje de confirmación previa
   - ❌ No ha confirmado: Muestra formulario
4. **Formulario**:
   - Si asiste: Indica cuántos asistirán y quiénes faltan
   - Si no asiste: Puede dejar un comentario
5. **Confirmación**: Los datos se guardan en Google Sheets

## 🐳 Docker

### Desarrollo
```bash
docker-compose up
```

### Producción
```bash
docker build -f Dockerfile.prod -t wedding-rsvp-prod .
docker run -p 80:80 wedding-rsvp-prod
```

## 📊 Datos en Google Sheets

Las confirmaciones se guardan con las siguientes columnas:

| Fecha | ID Invitado | Nombre | Email | Teléfono | Asistencia | Asistentes | Faltantes | Observaciones |
|-------|-------------|--------|-------|----------|------------|------------|-----------|---------------|

## 🎨 Personalización

### Colores y Estilos

Edita `src/App.css` para cambiar:
- Gradientes de colores
- Tamaños de fuente
- Espaciados
- Animaciones

### Textos

Los textos del formulario están en `src/App.tsx`. Busca las secciones:
- `<header>` - Título principal
- Mensajes de cada paso del formulario

## 🔒 Seguridad

- ✅ Validación de invitados contra lista predefinida
- ✅ Prevención de confirmaciones duplicadas
- ✅ Validación de cupos máximos
- ✅ Google Apps Script con permisos controlados

## 🆘 Soporte

Si tienes problemas:

1. **La búsqueda no muestra resultados**
   - Verifica que `src/invitados.ts` tiene tus invitados
   - Escribe al menos 2 caracteres

2. **No se guarda en Google Sheets**
   - Verifica que el script esté desplegado correctamente
   - Revisa los logs en Google Apps Script (Ejecuciones)
   - Confirma que el SPREADSHEET_ID sea correcto

3. **Docker no inicia**
   - Verifica que Docker esté corriendo
   - Asegúrate de estar en el directorio `weeding`
   - Intenta `docker-compose down` y luego `docker-compose up --build`

## 💡 Consejos

- Prueba primero con invitados de prueba
- Haz un backup de tu Google Sheet regularmente
- Revisa las confirmaciones frecuentemente
- Considera enviar recordatorios a quienes no confirmen

---

¡Felicidades por tu boda! 🎉💕
