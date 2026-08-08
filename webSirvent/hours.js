/* =============================================================================
 * hours.js — Horario estacional compartido (Heladería Sirvent)
 *
 * Fuente única de verdad para el horario. La usan:
 *   - index.html  (a través de app.js, cargado DESPUÉS de este archivo)
 *   - historia.html y fabrica.html (que no cargan app.js)
 *
 * Al cargarse, actualiza automáticamente las líneas de horario visibles
 * (#footerHours y, si existe, #statusHours) con el horario de la temporada
 * actual. En las páginas sin selector de idioma se usa español por defecto.
 * ========================================================================== */

// Returns the schedule for a given date, in minutes from midnight.
// closeMin <= openMin means the closing time falls after midnight.
function getScheduleForDate(date) {
    const month = date.getMonth(); // 0 = Jan ... 11 = Dec
    const day = date.getDay();     // 0 = Sun, 5 = Fri, 6 = Sat

    // July & August: peak season (Fri/Sat until 02:00, rest until 01:30)
    if (month === 6 || month === 7) {
        if (day === 5 || day === 6) {
            return { openHour: 9, openMinute: 0, closeHour: 2, closeMinute: 0 };
        }
        return { openHour: 9, openMinute: 0, closeHour: 1, closeMinute: 30 };
    }
    // June & September: every day until 01:00
    if (month === 5 || month === 8) {
        return { openHour: 9, openMinute: 0, closeHour: 1, closeMinute: 0 };
    }
    // April, May & October: every day until 00:30
    if (month === 3 || month === 4 || month === 9) {
        return { openHour: 9, openMinute: 0, closeHour: 0, closeMinute: 30 };
    }
    // Rest of the year (Nov, Dec, Jan, Feb, Mar): every day until 19:00
    return { openHour: 9, openMinute: 0, closeHour: 19, closeMinute: 0 };
}

// Builds the human-readable hours line for the current date & language.
function getHoursText(date, lang) {
    const month = date.getMonth();
    const es = lang === 'es';

    if (month === 6 || month === 7) {
        return es
            ? "Horario: Vie y Sáb de 09:00 a 02:00 · Otros días 09:00 a 01:30"
            : "Hours: Fri & Sat 09:00 AM to 02:00 AM · Other days 09:00 AM to 01:30 AM";
    }
    if (month === 5 || month === 8) {
        return es
            ? "Horario: Todos los días de 09:00 a 01:00"
            : "Hours: Every day from 09:00 AM to 01:00 AM";
    }
    if (month === 3 || month === 4 || month === 9) {
        return es
            ? "Horario: Todos los días de 09:00 a 00:30"
            : "Hours: Every day from 09:00 AM to 00:30 AM";
    }
    return es
        ? "Horario: Todos los días de 09:00 a 19:00"
        : "Hours: Every day from 09:00 AM to 07:00 PM";
}

// Compact hours line for the footer, e.g. "09:00 - 19:00 (Lunes - Domingo)".
function getFooterHoursText(date, lang) {
    const month = date.getMonth();
    const days = lang === 'es' ? "(Lunes - Domingo)" : "(Monday - Sunday)";

    if (month === 6 || month === 7) {
        return (lang === 'es'
            ? "Vie-Sáb 09:00-02:00 · resto 09:00-01:30 "
            : "Fri-Sat 09:00-02:00 · other days 09:00-01:30 ") + days;
    }
    if (month === 5 || month === 8) {
        return "09:00 - 01:00 " + days;
    }
    if (month === 3 || month === 4 || month === 9) {
        return "09:00 - 00:30 " + days;
    }
    return "09:00 - 19:00 " + days;
}

// Auto-actualiza las líneas de horario visibles al cargar la página.
// En index.html, app.js las vuelve a fijar con el idioma correcto tras esto.
(function () {
    function updateHours() {
        const lang = (typeof state !== 'undefined' && state.currentLanguage) ? state.currentLanguage : 'es';
        const now = new Date();
        const footer = document.getElementById("footerHours");
        if (footer) footer.textContent = getFooterHoursText(now, lang);
        const status = document.getElementById("statusHours");
        if (status) status.textContent = getHoursText(now, lang);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateHours);
    } else {
        updateHours();
    }
})();
