# Panel de Métricas MVP · Sitio Web Externo

Este proyecto es un sitio web independiente construido con **HTML5, CSS3 y JavaScript Vanilla** (sin dependencias ni frameworks). Está diseñado para subirse directamente a un repositorio de **GitHub** y desplegarse en **GitHub Pages** (o cualquier hosting estático gratuito como Vercel, Netlify, Cloudflare Pages).

---

## 🎨 Paleta de Colores
El diseño implementa una estética limpia y moderna basada en los tres colores solicitados:
- **Azul Cenote (`#0284c7`)**: Tarjeta de **Visitantes**.
- **Verde Selva (`#15803d`)**: Tarjeta de **Intención de Compra**.
- **Café Tierra / Raíces (`#6c4629`)**: Tarjeta de **Tasa de Conversión** y detalles de identidad.

---

## 📁 Estructura de Archivos

```text
sitio-metricas-externo/
├── .github/
│   └── workflows/
│       └── update-metrics.yml  # GitHub Action para actualizar automáticamente los datos
├── template.html    # Plantilla HTML con marcas para inyección estática
├── build.js         # Script en Node.js que consulta la API y compila index.html
├── index.html       # Archivo HTML 100% estático compilado (ideal para Canva y navegadores)
├── style.css        # Hoja de estilos con variables, paleta (verde, azul, café) y diseño responsive
├── script.js        # Lógica opcional para actualizar datos en vivo desde el navegador
└── README.md        # Esta guía de uso y despliegue
```

---

## ⚡ Compatibilidad con Canva (Sitio 100% Estático)
Canva bloquea la ejecución de scripts y peticiones externas por seguridad. Con este flujo:
1. `index.html` ya contiene los números reales impresos directamente en el HTML.
2. Canva lo muestra sin requerir JavaScript ni peticiones de red en vivo.
3. GitHub Actions se encarga de consultar la API en sus servidores y mantener `index.html` actualizado.

## 🚀 Cómo Subirlo a GitHub y Activar GitHub Pages

### Paso 1: Crear un nuevo repositorio en GitHub
1. Entra a [github.com/new](https://github.com/new).
2. Nómbralo como desees (por ejemplo: `panel-metricas-mvp`).
3. Elige **Public** y haz clic en **Create repository**.

### Paso 2: Subir los archivos desde tu terminal
Abre tu terminal en la carpeta `sitio-metricas-externo`:

```bash
cd sitio-metricas-externo
git init
git add .
git commit -m "feat: initial commit of metrics dashboard"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

*(O si prefieres, simplemente arrastra los 3 archivos `index.html`, `style.css` y `script.js` en la interfaz web de GitHub haciendo clic en **Add file -> Upload files**).*

### Paso 3: Activar GitHub Pages (Gratis en 30 segundos)
1. En tu repositorio de GitHub, ve a **Settings** (Configuración) en el menú superior.
2. En la barra lateral izquierda, haz clic en **Pages**.
3. En la sección **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: selecciona **`main`** y la carpeta **`/(root)`**.
4. Haz clic en **Save**.
5. En 1 minuto tendrás tu enlace activo:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

---

## ⚙️ Configuración de la API

El panel incluye un campo en la parte inferior para configurar el **Endpoint de la API**.
- Por defecto intentará conectar con `http://localhost:3000/api/metricas` si estás probando en tu máquina local.
- Cuando tu sitio de Raíces esté desplegado en producción (ej. Vercel o dominio propio), simplemente ingresa tu URL completa:
  ```text
  https://tu-dominio-raices.com/api/metricas
  ```
- Al presionar **Guardar URL**, se guardará en el `localStorage` de tu navegador para que siempre consulte tu servidor en producción.

---

## 🤖 Configurar Permisos del GitHub Action (Recomendado)
Para que el flujo automático pueda guardar los datos en tu repositorio:
1. En tu repositorio de GitHub (`M-trics`), ve a **Settings** -> **Actions** -> **General**.
2. Al final, en la sección **Workflow permissions**, selecciona **Read and write permissions**.
3. Haz clic en **Save**.
4. ¡Listo! Ahora en la pestaña **Actions** podrás ver el workflow *Actualizar Métricas Estáticas* y ejecutarlo cuando quieras con el botón **Run workflow**, o dejar que corra solo cada hora.
