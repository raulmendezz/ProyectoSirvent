/* =============================================================================
 * qr-track.js — Contador de accesos a la web (Heladería Sirvent)
 *
 * Envía un "ping" invisible al backend propio (API NestJS, endpoint /api/track)
 * cada vez que alguien entra en la web (por ejemplo, al escanear el QR del
 * local). El backend guarda el acceso y envía un resumen semanal por email.
 *
 * El endpoint /api/track lo sirve nginx en el mismo dominio (mira SERVIDOR.md).
 * ========================================================================== */
(function () {
  "use strict";

  // Endpoint propio (mismo dominio → sin CORS ni contenido mixto).
  var TRACKING_URL = "https://heladossirvent.es/api/track";

  // Si aún no hay URL configurada, no hacemos nada.
  if (!TRACKING_URL || TRACKING_URL.indexOf("PEGA_AQUI") === 0) return;

  try {
    // Contar una vez por sesión de navegador (aproxima "personas", no recargas).
    if (sessionStorage.getItem("qr_tracked")) return;
    sessionStorage.setItem("qr_tracked", "1");

    // ¿Primera vez en este dispositivo? (para estimar visitantes nuevos)
    var esNuevo = localStorage.getItem("qr_device") ? "0" : "1";
    localStorage.setItem("qr_device", "1");

    var params = [
      "ref=" + encodeURIComponent(document.referrer || ""),
      "path=" + encodeURIComponent(location.pathname || "/"),
      "ua=" + encodeURIComponent((navigator.userAgent || "").slice(0, 220)),
      "w=" + (window.screen ? window.screen.width : 0),
      "nuevo=" + esNuevo,
      "t=" + Date.now()
    ].join("&");

    var url = TRACKING_URL + "?" + params;

    // Envío que no bloquea la web ni da problemas de CORS.
    if (window.fetch) {
      fetch(url, { method: "GET", mode: "no-cors", keepalive: true })
        .catch(function () { new Image().src = url; });
    } else {
      new Image().src = url;
    }
  } catch (e) {
    // El tracking NUNCA debe romper la web: si algo falla, se ignora.
  }
})();
