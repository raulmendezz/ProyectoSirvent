# Contador de accesos por QR — versión servidor propio (VPS)

Esta es la versión **definitiva** del contador de visitas, montada sobre tu
propia infraestructura (API NestJS + MySQL + nginx en el VPS). Sustituye al
método antiguo con Google Apps Script (ver nota en `INSTRUCCIONES.md`), que no
funcionaba porque Google no permitía el acceso anónimo con tu cuenta.

## Cómo funciona

1. Cuando alguien entra en **heladossirvent.es**, `webSirvent/qr-track.js` hace
   un "ping" invisible a `https://heladossirvent.es/api/track`.
2. nginx reenvía **solo esa ruta** a la API interna (NestJS en `127.0.0.1:4000`).
3. La API guarda la visita en la tabla `visits` (MySQL), clasificándola:
   móvil/escritorio, visitante nuevo/recurrente y "probable QR" (móvil sin
   referrer).
4. Cada **lunes a las 9:00** (hora de España) la API envía por email un resumen
   de los últimos 7 días.

Todo el código ya está en el repo:
- `adminSystem/apps/api/src/tracking/` — endpoint + cron + email
- `adminSystem/apps/api/prisma/schema.prisma` — modelo `Visit` (tabla `visits`)
- `webSirvent/qr-track.js` — ping desde la web

## Puesta en marcha (una sola vez)

### 1) Desplegar la API (crea la tabla y activa el endpoint)
En el VPS, tu flujo de siempre:
```bash
git pull origin main
bash deploy/deploy.sh
```
El `deploy.sh` ya ejecuta `prisma db push` (crea la tabla `visits`), recompila y
reinicia con PM2. No hay pasos extra.

### 2) Abrir SOLO /api/track en nginx (heladossirvent.es)
Edita el server block de **heladossirvent.es** y añade este `location`
**dentro** de él:

```nginx
# Tracking de visitas del QR: reenvía SOLO /api/track a la API interna.
# ⚠️ Debe ser la ruta EXACTA (location = /api/track), NUNCA "location /api/",
#    o expondrías todo el panel de administración a Internet.
location = /api/track {
    proxy_pass         http://127.0.0.1:4000/api/track;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
}
```

Recarga nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3) (Opcional) Email de destino
Por defecto el resumen se envía a `EMAIL_RECIPIENTS` (el mismo que las alertas de
stock). Si lo quieres en otra dirección, añade en el `.env` de la API:
```
QR_EMAIL_TO=raulmendezsaez@gmail.com
```
Usa las mismas credenciales SMTP ya configuradas (`EMAIL_HOST`, `EMAIL_USER`,
`EMAIL_PASS`).

## Comprobar que funciona

Desde cualquier sitio:
```bash
curl -i "https://heladossirvent.es/api/track?ref=&path=/&ua=iPhone&nuevo=1"
# Debe responder: HTTP 200  y  cuerpo "ok"
```
Y que el resto de la API sigue cerrada (debe dar 403):
```bash
curl -i "https://heladossirvent.es/api/logs"
```
Luego entra en heladossirvent.es desde el móvil y comprueba que aparece una fila
nueva en la tabla `visits`.

## Cómo cambiar cosas

| Quiero… | Dónde |
|---|---|
| Cambiar el email de destino | `.env` de la API → `QR_EMAIL_TO` |
| Cambiar el día/hora del envío | `tracking.service.ts` → decorador `@Cron` |
| Dejar de contar temporalmente | Vaciar `TRACKING_URL` en `qr-track.js` |
| Ver los datos en crudo | Tabla `visits` en MySQL |
