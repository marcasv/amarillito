const PANTALLA_CHICA = window.innerWidth < 640;
const TULIPANES = PANTALLA_CHICA ? 22 : 34;
const PASTO = PANTALLA_CHICA ? 62 : 96;
const NUBES = PANTALLA_CHICA ? 4 : 6;
const POLLITOS = PANTALLA_CHICA ? 2 : 3;

const BASE_X = 60;
const BASE_Y = 100;

const jardin = document.getElementById("jardin");
const nubes = document.getElementById("nubes");
const pajaros = document.getElementById("pajaros");

const random = (min, max) => min + Math.random() * (max - min);
const mezcla = (a, b, t) => a + (b - a) * t;
const p = (v) => v.toFixed(1);
const svg = (clase, ancho, alto, cuerpo) =>
  `<svg class="${clase}" viewBox="0 0 ${ancho} ${alto}" xmlns="http://www.w3.org/2000/svg">${cuerpo}</svg>`;

let secuencia = 0;

function color(fondo) {
  fondo = Math.max(0, fondo);
  return {
    sat: (s) => p(s * mezcla(1, 0.78, fondo)),
    luz: (l) => p(mezcla(l, 84, fondo * 0.24)),
  };
}

function tepalo(h, w, punta, desvio) {
  const tx = BASE_X + desvio;
  return (
    `M${p(BASE_X - w * 0.3)} ${BASE_Y}` +
    ` C${p(BASE_X - w * 0.92)} ${p(BASE_Y - h * 0.1)} ${p(BASE_X - w * 1.08)} ${p(BASE_Y - h * 0.34)} ${p(BASE_X - w * 0.96)} ${p(BASE_Y - h * 0.6)}` +
    ` C${p(BASE_X - w * 0.8)} ${p(BASE_Y - h * 0.84)} ${p(tx - w * 0.44)} ${p(BASE_Y - h * punta)} ${p(tx)} ${p(BASE_Y - h)}` +
    ` C${p(tx + w * 0.44)} ${p(BASE_Y - h * punta)} ${p(BASE_X + w * 0.8)} ${p(BASE_Y - h * 0.84)} ${p(BASE_X + w * 0.96)} ${p(BASE_Y - h * 0.6)}` +
    ` C${p(BASE_X + w * 1.08)} ${p(BASE_Y - h * 0.34)} ${p(BASE_X + w * 0.92)} ${p(BASE_Y - h * 0.1)} ${p(BASE_X + w * 0.3)} ${BASE_Y}Z`
  );
}

function hojaTallo(base, largoHoja, ladoYAncho, color) {
  const d =
    `M60 ${base} C44 ${base - 26} 26 ${base - 62} 30 ${base - 100}` +
    ` C42 ${base - 66} 52 ${base - 30} 60 ${base - 6}Z`;
  return `<path d="${d}" fill="${color}" transform="translate(60 ${base})` +
    ` scale(${ladoYAncho} ${p(largoHoja / 100)}) translate(-60 ${-base})"/>`;
}

function tulipan(id, fondo, aperturaMax = 1) {
  const v = color(fondo);
  const tono = random(40, 51);
  const verde = random(112, 134);
  const tallo = `hsl(${p(verde)} ${v.sat(34)}% ${v.luz(31)}%)`;
  const hoja = `hsl(${p(verde + 6)} ${v.sat(30)}% ${v.luz(39)}%)`;

  const apertura = Math.pow(Math.random(), 2.2) * aperturaMax;
  const giroFondo = mezcla(9, 32, apertura);
  const giroFrente = mezcla(4.5, 16, apertura);
  const alto = mezcla(96, 74, apertura);
  const ancho = mezcla(12, 17, apertura);
  const punta = mezcla(1, 1.06, apertura);
  const largo = Math.round(random(200, 325));
  const curva = random(-7, 7);
  const borde = `hsl(${p(tono - 6)} ${v.sat(60)}% ${v.luz(38)}% / .26)`;

  const pinta = (grado, h, w, relleno) =>
    `<path d="${tepalo(h, w, punta, -h * Math.tan((grado * Math.PI) / 180) * 0.55)}" fill="url(#${relleno}-${id})"` +
    ` stroke="${borde}" stroke-width=".7"` +
    ` transform="rotate(${p(grado)} ${BASE_X} ${BASE_Y})"/>`;

  const detras =
    pinta(-giroFondo, alto, ancho, "fondo") +
    pinta(giroFondo, alto, ancho, "fondo") +
    pinta(random(-2, 2), alto, ancho * 0.96, "fondo");

  const delante =
    pinta(-giroFrente, alto * 0.96, ancho * 1.12, "frente") +
    pinta(giroFrente, alto * 0.96, ancho * 1.12, "frente") +
    pinta(random(-3, 3), alto * 0.97, ancho * 1.18, "frente");

  const nace = largo - 6;
  const largoHoja = (largo - 100) * 0.62;

  return svg("planta tulipan", 120, largo, `
  <defs>
    <linearGradient id="fondo-${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="hsl(${p(tono - 9)} ${v.sat(74)}% ${v.luz(38)}%)"/>
      <stop offset=".55" stop-color="hsl(${p(tono - 2)} ${v.sat(88)}% ${v.luz(51)}%)"/>
      <stop offset="1" stop-color="hsl(${p(tono + 2)} ${v.sat(94)}% ${v.luz(62)}%)"/>
    </linearGradient>
    <linearGradient id="frente-${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="hsl(${p(tono - 5)} ${v.sat(82)}% ${v.luz(46)}%)"/>
      <stop offset=".5" stop-color="hsl(${p(tono + 1)} ${v.sat(93)}% ${v.luz(60)}%)"/>
      <stop offset="1" stop-color="hsl(${p(tono + 6)} ${v.sat(98)}% ${v.luz(77)}%)"/>
    </linearGradient>
  </defs>
  <g class="tallo">
    <path d="M60 ${largo} C${p(60 + curva)} ${Math.round(largo * 0.7)} ${p(60 - curva)} ${Math.round(largo * 0.36)} 60 98"
          fill="none" stroke="${tallo}" stroke-width="6.5" stroke-linecap="round"/>
    ${hojaTallo(nace, largoHoja * random(0.9, 1.1), random(1.05, 1.32), hoja)}
    ${hojaTallo(nace, largoHoja * random(0.68, 0.9), -random(0.9, 1.18), hoja)}
  </g>
  <g class="flor">
    <g transform="rotate(${p(random(-7, 7))} ${BASE_X} ${BASE_Y})">
      ${detras}${delante}
    </g>
  </g>`);
}

function pasto(fondo) {
  const v = color(fondo);
  const verde = random(86, 116);
  let briznas = "";
  for (let i = 0, n = Math.round(random(5, 8)); i < n; i++) {
    const alto = random(50, 98);
    const base = 60 + random(-18, 18);
    const punta = base + random(-38, 38);
    const w = random(2.4, 4.2);
    const medio = (base + punta) / 2;
    briznas +=
      `<path d="M${p(base - w)} 100` +
      ` C${p(base - w * 0.7)} ${p(100 - alto * 0.44)} ${p(medio - w)} ${p(100 - alto * 0.78)} ${p(punta)} ${p(100 - alto)}` +
      ` C${p(medio + w * 0.5)} ${p(100 - alto * 0.74)} ${p(base + w * 0.8)} ${p(100 - alto * 0.4)} ${p(base + w)} 100Z"` +
      ` fill="hsl(${p(verde)} ${v.sat(50)}% ${v.luz(random(27, 42))}%)"/>`;
  }
  return svg("planta mata", 120, 100, briznas);
}

function nube() {
  const bultos = [];
  let x = 30;
  for (let i = 0; i < 4; i++) {
    const r = i === 1 || i === 2 ? random(22, 30) : random(13, 19);
    bultos.push({ x, y: 56 - r * random(0.6, 0.9), r });
    x += r * random(1, 1.35);
  }
  const izq = bultos[0].x - bultos[0].r;
  const der = x - bultos[3].r * random(0, 0.3) + bultos[3].r;
  const forma =
    bultos.map((b) => `<circle cx="${p(b.x)}" cy="${p(b.y)}" r="${p(b.r)}"/>`).join("") +
    `<rect x="${p(izq)}" y="36" width="${p(der - izq)}" height="20" rx="10"/>`;
  return svg("nube", Math.round(der + 24), 72,
    `<g fill="#B4CADE" opacity=".7" transform="translate(0 7)">${forma}</g>` +
    `<g fill="#FFFFFF">${forma}</g>`);
}

function dibujarPollito(talla) {
  return `<div class="pollito" style="--talla:${talla.toFixed(2)};` +
    ` --aleteo:${random(0.13, 0.18).toFixed(3)}s">` +
    `<div class="cola"></div><div class="cuerpo"></div><div class="cabeza"></div>` +
    `<div class="cresta"></div><div class="ojo"></div><div class="pico"></div>` +
    `<div class="ala"></div><div class="patas"><i></i><i></i></div></div>`;
}

function pollito() {
  const talla = PANTALLA_CHICA ? random(0.3, 0.44) : random(0.42, 0.62);
  const cruce = random(11, 18);
  const vuelo = document.createElement("div");
  vuelo.className = "vuelo";
  vuelo.style.setProperty("--alto", random(5, 34).toFixed(1) + "%");
  vuelo.style.setProperty("--cruce", cruce.toFixed(1) + "s");
  vuelo.style.setProperty("--desfase", (-random(0, cruce)).toFixed(1) + "s");
  vuelo.style.setProperty("--x", random(8, 72).toFixed(1) + "%");
  vuelo.innerHTML = `<div class="bote" style="--bote:${random(0.9, 1.25).toFixed(2)}s;` +
    ` --brinco:${(talla * 46).toFixed(0)}px">${dibujarPollito(talla)}</div>`;
  pajaros.appendChild(vuelo);
}

function plantar(html, x, fondo, tam, retraso, vaiven) {
  const molde = document.createElement("div");
  molde.innerHTML = html;
  const planta = molde.firstElementChild;

  planta.style.setProperty("--x", (x * 100).toFixed(2) + "%");
  planta.style.setProperty("--hondura", fondo.toFixed(3));
  planta.style.setProperty("--tam", tam.toFixed(2));
  planta.style.setProperty("--retraso", retraso.toFixed(0) + "ms");
  planta.style.setProperty("--brote", random(900, 1400).toFixed(0) + "ms");
  planta.style.setProperty("--ritmo", random(2600, 5600).toFixed(0) + "ms");
  planta.style.setProperty("--amplitud", vaiven.toFixed(2) + "deg");
  planta.style.setProperty("--opaco", Math.min(1, mezcla(1, 0.88, fondo)).toFixed(2));
  planta.style.zIndex = String(Math.round(mezcla(120, 10, fondo)));

  jardin.appendChild(planta);
}

function distribuir(cuantas, reparto) {
  const filas = Array.from({ length: cuantas }, (_, i) => ((i + Math.random()) / cuantas) ** reparto);
  for (let i = filas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filas[i], filas[j]] = [filas[j], filas[i]];
  }
  return filas;
}

const filasPasto = distribuir(PASTO, 1.1);
for (let i = 0; i < PASTO; i++) {
  const fondo = filasPasto[i];
  plantar(
    pasto(fondo),
    (i + random(0.05, 0.95)) / PASTO,
    fondo,
    mezcla(17, 5, fondo) * random(0.85, 1.15),
    i * 13,
    random(1.8, 4.5)
  );
}

const filasFlores = distribuir(TULIPANES, 0.95);
for (let i = 0; i < TULIPANES; i++) {
  const fondo = filasFlores[i];
  plantar(
    tulipan(++secuencia, fondo),
    (i + random(0.12, 0.88)) / TULIPANES,
    fondo,
    mezcla(24, 7.5, fondo) * random(0.88, 1.12),
    300 + i * 42,
    random(0.7, 2)
  );
}

for (let i = 0; i < 2; i++) {
  const fondo = random(-0.45, -0.2);
  plantar(
    tulipan(++secuencia, fondo, 0.14),
    (i + random(0.15, 0.85)) / 2 * 0.8 + 0.1,
    fondo,
    PANTALLA_CHICA ? random(23, 30) : random(32, 42),
    120 + i * 80,
    random(0.5, 1.2)
  );
}

for (let i = 0; i < POLLITOS; i++) pollito();

for (let i = 0; i < NUBES; i++) {
  const molde = document.createElement("div");
  molde.innerHTML = nube();
  const laNube = molde.firstElementChild;
  const deriva = random(150, 280);
  laNube.style.setProperty("--alto", random(1, 54).toFixed(1) + "%");
  laNube.style.setProperty("--x", random(4, 76).toFixed(1) + "%");
  laNube.style.setProperty("--ancho", random(12, 27).toFixed(1));
  laNube.style.setProperty("--deriva", deriva.toFixed(0) + "s");
  laNube.style.setProperty("--desfase", (-random(0, deriva)).toFixed(0) + "s");
  laNube.style.setProperty("--opaco", random(0.72, 0.97).toFixed(2));
  nubes.appendChild(laNube);
}
