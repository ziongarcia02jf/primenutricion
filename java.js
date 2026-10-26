// ===== Configuración =====
// WhatsApp: código país + número, SIN el "+" (wa.me lo pide así)
const WHATSAPP = "5491122929399";   // +54 9 11 2292-9399
const COACH = "Franco";
const IG_URL = "https://www.instagram.com/primenutricion/";

const $ = (id) => document.getElementById(id);

// ================== WhatsApp ==================
function waUrl(texto) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
}

// Botón flotante / nav / CTA final: consulta general
function whatsappDirecto() {
    window.open(waUrl("¡Hola " + COACH + "! Vengo de tu página 🏋️ y quiero más info de los planes de asesoría."), "_blank");
}

function instagramDirecto() {
    window.open(IG_URL, "_blank");
}

// ================== Planes ==================
// Por cada plan: campos que se leen del formulario y su etiqueta en el mensaje.
// Los campos obligatorios (nombre, peso, altura) se validan antes de enviar.
const CAMPOS_PLAN = {
    dieta: [
        ["nombre", "👤 Nombre", true],
        ["edad", "🎂 Edad", false],
        ["peso", "⚖️ Peso", true],
        ["altura", "📏 Altura", true],
        ["objetivo", "🎯 Objetivo", false],
        ["tipo", "🥗 Tipo de alimentación", false],
        ["comidas", "🍽️ Comidas por día", false],
        ["alergias", "⚠️ Alergias / alimentos que evita", false],
        ["salud", "🏥 Salud / medicación", false]
    ],
    rutina: [
        ["nombre", "👤 Nombre", true],
        ["edad", "🎂 Edad", false],
        ["peso", "⚖️ Peso", true],
        ["altura", "📏 Altura", true],
        ["objetivo", "🎯 Objetivo", false],
        ["dias", "🏋️ Días por semana", false],
        ["experiencia", "💪 Experiencia", false],
        ["lugar", "📍 Entrena en", false],
        ["horario", "⏱️ Duración de las sesiones", false],
        ["lesiones", "🤕 Lesiones / dolores", false],
        ["salud", "🏥 Salud / medicación", false]
    ],
    completo: [
        ["nombre", "👤 Nombre", true],
        ["edad", "🎂 Edad", false],
        ["peso", "⚖️ Peso", true],
        ["altura", "📏 Altura", true],
        ["objetivo", "🎯 Objetivo", false],
        ["dias", "🏋️ Días por semana", false],
        ["experiencia", "💪 Experiencia", false],
        ["lugar", "📍 Entrena en", false],
        ["tipo", "🥗 Tipo de alimentación", false],
        ["lesiones", "🤕 Lesiones / dolores", false],
        ["alergias", "⚠️ Alergias / alimentos que evita", false],
        ["salud", "🏥 Salud / medicación", false]
    ]
};

const FRASE_PLAN = {
    dieta: "Quiero el PLAN DE DIETA 🥗 (consulta única).",
    rutina: "Quiero el PLAN DE RUTINA 🏋️ (consulta única).",
    completo: "Quiero el PLAN COMPLETO 🔥: rutina + dieta + seguimiento diario por 3 meses."
};

// Devuelve el mensaje completo con los datos del formulario.
// Si falta algo obligatorio, marca los campos en rojo y devuelve null.
function construirMensaje(plan) {
    const campos = CAMPOS_PLAN[plan];
    const lineas = [];
    let faltan = [];
    let primerFaltante = null;

    campos.forEach(([sufijo, etiqueta, obligatorio]) => {
        const campo = $(plan + "-" + sufijo);
        if (!campo) return;
        const valor = (campo.value || "").trim();

        if (obligatorio && !valor) {
            campo.classList.add("falta");
            faltan.push(sufijo);
            if (!primerFaltante) primerFaltante = campo;
            return;
        }
        campo.classList.remove("falta");

        if (valor) lineas.push(etiqueta + ": " + valor);
    });

    const aviso = $("aviso-" + plan);
    if (aviso) aviso.hidden = faltan.length === 0;

    if (faltan.length) {
        if (primerFaltante) primerFaltante.focus();
        return null;
    }

    let texto = "¡Hola " + COACH + "! " + FRASE_PLAN[plan]
        + "\n\nEstos son mis datos para que lo armes:\n"
        + lineas.join("\n");

    return waUrl(texto);
}

// Acción del botón de cada plan
function pedirPlan(plan) {
    const url = construirMensaje(plan);
    if (url) window.open(url, "_blank");
}

// ================== Carrusel de resultados ==================
let slideActual = 0;
let autoCarrusel = null;

function moverCarrusel(direccion) {
    const pista = $("carruselPista");
    const total = pista.children.length;
    slideActual = (slideActual + direccion + total) % total;
    mostrarSlide();
    reiniciarAuto();
}

function irASlide(indice) {
    slideActual = indice;
    mostrarSlide();
    reiniciarAuto();
}

function mostrarSlide() {
    const pista = $("carruselPista");
    const total = pista.children.length;
    pista.style.transform = "translateX(-" + slideActual * 100 + "%)";
    [...$("carruselPuntos").children].forEach((punto, i) => {
        punto.classList.toggle("activo", i === slideActual);
    });
}

function reiniciarAuto() {
    clearInterval(autoCarrusel);
    autoCarrusel = setInterval(() => {
        slideActual = (slideActual + 1) % $("carruselPista").children.length;
        mostrarSlide();
    }, 5500);
}

// ================== Arranque ==================
(function iniciar() {
    // Puntos del carrusel, uno por slide
    const pista = $("carruselPista");
    const puntos = $("carruselPuntos");
    for (let i = 0; i < pista.children.length; i++) {
        const punto = document.createElement("button");
        punto.className = "punto" + (i === 0 ? " activo" : "");
        punto.setAttribute("aria-label", "Ir al resultado " + (i + 1));
        punto.onclick = () => irASlide(i);
        puntos.appendChild(punto);
    }
    reiniciarAuto();

    // Al tipear se quita el marcado rojo de "campo faltante"
    document.querySelectorAll(".campo").forEach(c => {
        c.addEventListener("input", () => c.classList.remove("falta"));
    });
})();
