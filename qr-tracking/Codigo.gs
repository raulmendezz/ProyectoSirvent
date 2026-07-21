/* =============================================================================
 * Codigo.gs — Registro de accesos QR + resumen semanal por email
 * Heladería Sirvent  ·  heladossirvent.es
 *
 * Este código va DENTRO de un proyecto de Google Apps Script vinculado a una
 * hoja de cálculo de Google Sheets. Ver INSTRUCCIONES.md para el paso a paso.
 * ========================================================================== */

// A dónde se envía el resumen semanal:
var EMAIL_DESTINO = "raulmendezsaez@gmail.com";

// Nombre de la pestaña donde se guardan los accesos:
var NOMBRE_HOJA = "Accesos";


/**
 * Se ejecuta automáticamente cada vez que la web hace el "ping" (una visita).
 * Guarda una fila con los datos del acceso.
 */
function doGet(e) {
  try {
    var hoja = obtenerHoja_();
    var p = (e && e.parameter) ? e.parameter : {};

    var ua = p.ua || "";
    var ref = p.ref || "";
    var esMovil = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
    var esDirecto = !ref; // sin referrer = acceso directo (típico de un QR)
    var probableQR = (esMovil && esDirecto) ? 1 : 0;

    hoja.appendRow([
      new Date(),                                   // Fecha y hora
      ref,                                          // Referrer (de dónde viene)
      p.path || "",                                 // Página
      ua,                                           // Navegador / dispositivo
      esMovil ? "movil" : "escritorio",             // Tipo de dispositivo
      p.nuevo === "1" ? "nuevo" : "recurrente",     // Visitante nuevo o repetido
      probableQR                                    // 1 = probable escaneo de QR
    ]);
  } catch (err) {
    // Nunca fallamos: si algo va mal, simplemente no se registra esa visita.
  }
  return ContentService.createTextOutput("ok");
}


/**
 * Devuelve la pestaña de accesos, creándola con cabeceras si no existe.
 */
function obtenerHoja_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = ss.insertSheet(NOMBRE_HOJA);
    hoja.appendRow([
      "Fecha", "Referrer", "Pagina", "Dispositivo/UA",
      "Tipo", "Visitante", "ProbableQR"
    ]);
  }
  return hoja;
}


/**
 * Envía el resumen de los últimos 7 días a EMAIL_DESTINO.
 * Se ejecuta sola cada semana (ver crearTriggerSemanal).
 */
function enviarResumenSemanal() {
  var hoja = obtenerHoja_();
  var datos = hoja.getDataRange().getValues();

  var ahora = new Date();
  var hace7 = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

  var total = 0, nuevos = 0, qr = 0, movil = 0;

  for (var i = 1; i < datos.length; i++) { // i=1 para saltar la cabecera
    var fila = datos[i];
    var fecha = (fila[0] instanceof Date) ? fila[0] : new Date(fila[0]);
    if (fecha >= hace7 && fecha <= ahora) {
      total++;
      if (fila[4] === "movil") movil++;
      if (fila[5] === "nuevo") nuevos++;
      if (fila[6] === 1 || fila[6] === "1") qr++;
    }
  }

  var tz = Session.getScriptTimeZone();
  var fmt = function (d) { return Utilities.formatDate(d, tz, "dd/MM/yyyy"); };

  var asunto = "📊 Accesos web Heladería Sirvent — " + fmt(hace7) + " a " + fmt(ahora);

  var cuerpo =
    "Hola Raúl,\n\n" +
    "Resumen de accesos a heladossirvent.es de los últimos 7 días:\n\n" +
    "  • Accesos totales:            " + total + "\n" +
    "  • Desde el móvil:             " + movil + "\n" +
    "  • Visitantes nuevos:          " + nuevos + "\n" +
    "  • Probable QR (móvil directo): " + qr + "\n\n" +
    "Periodo: " + fmt(hace7) + " – " + fmt(ahora) + "\n\n" +
    "Nota: como el QR apunta a la misma dirección que la web general, el número\n" +
    "\"Probable QR\" es una estimación (accesos desde el móvil sin venir de Google\n" +
    "u otra web). El resto de cifras son exactas.\n\n" +
    "— Informe automático de la web";

  MailApp.sendEmail(EMAIL_DESTINO, asunto, cuerpo);
}


/**
 * EJECUTAR UNA SOLA VEZ (a mano) para programar el envío semanal.
 * Deja el email saliendo cada LUNES por la mañana.
 */
function crearTriggerSemanal() {
  // Borra cualquier programación anterior de esta misma función.
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "enviarResumenSemanal") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger("enviarResumenSemanal")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)   // 9 de la mañana
    .create();
}


/**
 * OPCIONAL: ejecútala a mano para recibir el email de prueba ahora mismo
 * y comprobar que todo funciona.
 */
function probarEmailAhora() {
  enviarResumenSemanal();
}
