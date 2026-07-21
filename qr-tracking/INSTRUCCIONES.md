> ⚠️ **OBSOLETO — no usar.** Este método (Google Apps Script) se descartó porque
> la cuenta de Google no permitía publicar el servicio con acceso anónimo (solo
> ofrecía "Cualquier usuario con cuenta de Google", que obliga a iniciar sesión y
> rechaza los pings del QR). La versión que SÍ funciona está en **`SERVIDOR.md`**
> (contador sobre el propio VPS: API NestJS + MySQL + nginx). Se conserva este
> documento solo como referencia histórica.

---

# Contador de accesos por QR → email semanal

Cuando alguien entra en **heladossirvent.es** (por ejemplo escaneando el QR del
local), la web avisa a un pequeño servicio de Google que guarda el acceso y, una
vez por semana, envía un email a **raulmendezsaez@gmail.com** con cuántas
personas han entrado.

- **No hay que reimprimir el QR.** El QR ya apunta a `https://heladossirvent.es/`
  y así se queda.
- **No se toca el servidor** (nginx sigue igual). El único cambio en la web es un
  archivo nuevo (`qr-track.js`) que ya está añadido a `index.html`.
- **No hace falta SMTP ni contraseñas.** El email lo manda Google por ti.

> ⚠️ Como el QR apunta a la misma dirección que usa todo el mundo, no se puede
> separar al 100% quién vino por el QR. En el email recibirás **el total de
> accesos** (cifra exacta) y una **estimación de "probable QR"** (accesos desde
> el móvil sin venir de Google/Instagram).

---

## Instalación (una sola vez, ~10 minutos)

### 1) Crear la hoja de cálculo
1. Entra en <https://sheets.google.com> con tu cuenta de Google.
2. Crea una hoja nueva y ponle de nombre, por ejemplo, **"Accesos QR Sirvent"**.

### 2) Pegar el código
1. Dentro de esa hoja: menú **Extensiones → Apps Script**.
2. Borra lo que haya en el editor y **pega TODO el contenido de `Codigo.gs`**
   (el archivo que está en esta misma carpeta `qr-tracking/`).
3. Pulsa el icono de **guardar** (💾).

### 3) Publicar el servicio (Web App)
1. Arriba a la derecha: botón **Implementar → Nueva implementación**.
2. En el engranaje ⚙️ elige **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** **Cualquier usuario**
4. Pulsa **Implementar**. Te pedirá **autorizar permisos** → acepta
   (si sale "Google no ha verificado la app", pulsa *Configuración avanzada →
   Ir a (nombre) → Permitir*).
5. Copia la **URL de la aplicación web** (termina en **`/exec`**).

### 4) Pegar la URL en la web
1. Abre el archivo **`webSirvent/qr-track.js`**.
2. Sustituye:
   ```js
   var TRACKING_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
   ```
   por tu URL real, por ejemplo:
   ```js
   var TRACKING_URL = "https://script.google.com/macros/s/AKfy..../exec";
   ```
3. Sube el cambio a producción con tu flujo habitual
   (`git add` → `git commit` → `git push` y `deploy.sh` en el VPS).

### 5) Programar el email semanal
1. Vuelve al editor de Apps Script.
2. En el desplegable de funciones (arriba) elige **`crearTriggerSemanal`** y pulsa
   **Ejecutar** ▶️. Esto deja el email programado **cada lunes a las 9:00**.
   - ¿Quieres otro día/hora? Cambia `MONDAY` y `atHour(9)` en el código antes de
     ejecutarlo.

### 6) (Opcional) Probar ahora
- En el desplegable de funciones elige **`probarEmailAhora`** y pulsa **Ejecutar**.
  Debería llegarte un email de prueba a `raulmendezsaez@gmail.com` en segundos.
- Entra en `https://heladossirvent.es` desde el móvil y comprueba que aparece una
  fila nueva en la pestaña **"Accesos"** de la hoja.

---

## Cómo cambiar cosas después

| Quiero… | Dónde |
|---|---|
| Cambiar el email de destino | `Codigo.gs` → `EMAIL_DESTINO` |
| Cambiar el día/hora del envío | `Codigo.gs` → `crearTriggerSemanal` (`MONDAY`, `atHour`) y volver a ejecutarla |
| Dejar de contar temporalmente | Vaciar `TRACKING_URL` en `qr-track.js` |
| Ver los datos en crudo | La propia hoja de Google Sheets, pestaña "Accesos" |

## ¿Y si el día de mañana quieres separar el QR de verdad?
La única forma 100% fiable sería que el QR apunte a `heladossirvent.es/?qr=1` en
vez de a `heladossirvent.es/`. Eso implica **reimprimir el QR**. Si algún día lo
haces, dímelo y ajusto el contador para contar solo esos escaneos exactos.
