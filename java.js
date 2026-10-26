// ===== Configuración =====
// WhatsApp: código país + número, SIN el "+" (wa.me lo pide así)
const WHATSAPP = "5491122929399";   // +54 9 11 2292-9399
const COACH = "Franco";
const IG_URL = "https://www.instagram.com/frannp18/";

const $ = (id) => document.getElementById(id);

// ================== WhatsApp ==================
function waUrl(texto) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
}

// Botón flotante / nav / CTA final: consulta general
function whatsappDirecto() {
    window.open(waUrl("¡Hola " + COACH + "! Vengo de tu página y quiero más info de los planes de asesoría."), "_blank");
}

function instagramDirecto() {
    window.open(IG_URL, "_blank");
}

// ================== Planes ==================
// Por cada plan: campos que se leen del formulario y su etiqueta en el mensaje.
// Los campos obligatorios (nombre, peso, altura) se validan antes de enviar.
const CAMPOS_PLAN = {
    dieta: [
        ["nombre", "Nombre", true],
        ["edad", "Edad", false],
        ["peso", "Peso (kg)", true],
        ["altura", "Altura (cm)", true],
        ["objetivo", "Objetivo", false],
        ["tipo", "Tipo de alimentación", false],
        ["comidas", "Comidas por día", false],
        ["alergias", "Alergias / alimentos que evitás", false],
        ["salud", "Salud / medicación", false]
    ],
    rutina: [
        ["nombre", "Nombre", true],
        ["edad", "Edad", false],
        ["peso", "Peso (kg)", true],
        ["altura", "Altura (cm)", true],
        ["objetivo", "Objetivo", false],
        ["dias", "Días por semana", false],
        ["experiencia", "Experiencia", false],
        ["lugar", "Entrenás en", false],
        ["horario", "Duración de las sesiones", false],
        ["lesiones", "Lesiones / dolores", false],
        ["salud", "Salud / medicación", false]
    ],
    combo: [
        ["nombre", "Nombre", true],
        ["edad", "Edad", false],
        ["peso", "Peso (kg)", true],
        ["altura", "Altura (cm)", true],
        ["objetivo", "Objetivo", false],
        ["dias", "Días por semana", false],
        ["experiencia", "Experiencia", false],
        ["lugar", "Entrenás en", false],
        ["tipo", "Tipo de alimentación", false],
        ["lesiones", "Lesiones / dolores", false],
        ["alergias", "Alergias / alimentos que evitás", false],
        ["salud", "Salud / medicación", false]
    ],
    completo: [
        ["nombre", "Nombre", true],
        ["edad", "Edad", false],
        ["peso", "Peso (kg)", true],
        ["altura", "Altura (cm)", true],
        ["objetivo", "Objetivo", false],
        ["dias", "Días por semana", false],
        ["experiencia", "Experiencia", false],
        ["lugar", "Entrenás en", false],
        ["tipo", "Tipo de alimentación", false],
        ["lesiones", "Lesiones / dolores", false],
        ["alergias", "Alergias / alimentos que evitás", false],
        ["salud", "Salud / medicación", false]
    ],
    // Rutinas por zona: comparten un único formulario (prefijo "zona-")
    zona: [
        ["nombre", "Nombre", true],
        ["edad", "Edad", false],
        ["peso", "Peso (kg)", true],
        ["altura", "Altura (cm)", true],
        ["dias", "Días por semana", false],
        ["experiencia", "Experiencia", false],
        ["lugar", "Entrenás en", false],
        ["lesiones", "Lesiones / dolores", false],
        ["salud", "Salud / medicación", false]
    ]
};

// Todos los mensajes van sin emojis (a pedido del cliente)
const FRASE_PLAN = {
    dieta: "Quiero el PLAN DE DIETA (1 mes).",
    rutina: "Quiero el PLAN DE RUTINA (1 mes).",
    combo: "Quiero el PLAN COMPLETO de 1 mes: dieta + rutina.",
    completo: "Quiero el PLAN COMPLETO con SEGUIMIENTO DIARIO por 3 MESES: dieta + rutina + seguimiento."
};

// Rutinas por zona disponibles ($30.000 cada una)
const ZONAS = {
    brazos: "RUTINA DE BRAZOS",
    pecho: "RUTINA DE PECHO",
    cuadriceps: "RUTINA DE CUÁDRICEPS",
    femoral: "RUTINA DE FEMORAL Y GLÚTEO (HOMBRE)",
    gluteo: "RUTINA DE GLÚTEO (MUJER)",
    espalda_densidad: "RUTINA DE ESPALDA - DENSIDAD",
    espalda_amplitud: "RUTINA DE ESPALDA - AMPLITUD"
};

let zonaActual = null;

function elegirZona(clave) {
    zonaActual = clave;
    document.querySelectorAll(".zona").forEach(z => {
        z.classList.toggle("elegida", z.dataset.zona === clave);
    });
    $("aviso-zona").hidden = true;
}

// Acción del botón del panel de rutinas por zona
function pedirZona() {
    if (!zonaActual) {
        $("aviso-zona").hidden = false;
        return;
    }
    const frase = "Quiero la " + ZONAS[zonaActual] + " ($30.000).";
    const url = construirMensaje("zona", frase);
    if (url) window.open(url, "_blank");
}

// Devuelve el mensaje completo con los datos del formulario.
// Si falta algo obligatorio, marca los campos en rojo y devuelve null.
function construirMensaje(plan, frasePersonalizada) {
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

    let texto = "¡Hola " + COACH + "! " + (frasePersonalizada || FRASE_PLAN[plan])
        + "\n\nEstos son mis datos para que lo armes:\n"
        + lineas.join("\n");

    return waUrl(texto);
}

// Acción del botón de cada plan
function pedirPlan(plan) {
    const url = construirMensaje(plan);
    if (url) window.open(url, "_blank");
}

// ================== Tira de resultados (scroll) ==================
function moverTira(direccion) {
    const tira = $("tira");
    if (!tira) return;
    const tarjeta = tira.querySelector(".card-resultado");
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 16 : 260;
    tira.scrollBy({ left: direccion * paso, behavior: "smooth" });
}

// ================== Arranque ==================
(function iniciar() {
    // Al tipear se quita el marcado rojo de "campo faltante"
    document.querySelectorAll(".campo").forEach(c => {
        c.addEventListener("input", () => c.classList.remove("falta"));
    });
})();
