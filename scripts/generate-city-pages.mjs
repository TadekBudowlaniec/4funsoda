import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const OUT_BASE = join(PUBLIC_DIR, "m");

const SITE = "https://4funsoda.pl";
const BRAND = "4FUNSODA";
const COMPANY = "Druk-Styl";

const locationsModule = await import(pathToFileURL(join(ROOT, "src/data/locations.js")).href);
const citiesModule = await import(pathToFileURL(join(ROOT, "src/lib/cities.js")).href);

const { funSodaLocations } = locationsModule;
const { slugify, groupByCity, regionForCity, locativeOf } = citiesModule;

const cities = groupByCity(funSodaLocations);

// ─── helpers ──────────────────────────────────────────────────────────────
function pluralPL(n, [one, few, many]) {
  if (n === 1) return one;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function centroidOf(locs) {
  const lat = locs.reduce((s, l) => s + l.lat, 0) / locs.length;
  const lng = locs.reduce((s, l) => s + l.lng, 0) / locs.length;
  return [lat, lng];
}

function boundsZoom(locs) {
  if (locs.length === 1) return 14;
  const lats = locs.map((l) => l.lat);
  const lngs = locs.map((l) => l.lng);
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
  if (span < 0.01) return 14;
  if (span < 0.05) return 12;
  if (span < 0.2) return 11;
  if (span < 0.5) return 10;
  return 9;
}

// ─── shared head fragments ────────────────────────────────────────────────
function favicons() {
  return `
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <meta name="theme-color" content="#2563EB" />`;
}

function fonts() {
  return `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />`;
}

function leafletAssets() {
  return `
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>`;
}

function sharedStyles() {
  return `
    <style>
      :root {
        --violet: #2563EB; --blue: #3B82F6; --cyan: #22D3EE;
        --ink: #0B1020; --muted: #5B6178; --bg: #F7F8FF;
        --border: rgba(37,99,235,0.16); --aurora: linear-gradient(120deg,#2563EB,#3B82F6,#22D3EE);
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { font-family: 'Inter', system-ui, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.6; font-size: 16px; }
      h1, h2, h3 { font-family: 'Sora', system-ui, sans-serif; }
      a { color: var(--violet); text-decoration: none; }
      a:hover { text-decoration: underline; }
      .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
      header.site { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.85); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
      header.site .row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; max-width: 1100px; margin: 0 auto; gap: 16px; flex-wrap: wrap; }
      header.site .logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 21px; color: var(--ink); font-family: 'Sora', sans-serif; }
      header.site .logo img { height: 30px; width: auto; }
      header.site nav a { margin-left: 18px; font-weight: 600; color: var(--muted); }
      header.site nav a:hover { color: var(--violet); }
      .breadcrumbs { max-width: 1100px; margin: 0 auto; padding: 14px 20px; font-size: 14px; color: var(--muted); }
      .breadcrumbs a { color: var(--muted); }
      main { padding: 24px 20px 64px; }
      .hero { background: linear-gradient(180deg, rgba(37,99,235,0.1) 0%, transparent 100%); border-bottom: 1px solid var(--border); padding: 44px 20px 56px; }
      .hero .inner { max-width: 1100px; margin: 0 auto; }
      h1 { font-size: clamp(28px, 4vw, 44px); line-height: 1.12; margin: 0 0 16px; font-weight: 800; letter-spacing: -0.5px; }
      .lead { font-size: 18px; color: var(--muted); max-width: 720px; margin: 0; }
      h2 { font-size: 24px; font-weight: 700; margin: 40px 0 16px; }
      h3 { font-size: 17px; font-weight: 700; margin: 0 0 4px; }
      .stores { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); list-style: none; padding: 0; margin: 16px 0 0; }
      .store { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 6px 18px rgba(37,99,235,0.06); }
      .store .addr { color: var(--muted); font-size: 14px; }
      .store .hours { display: inline-block; padding: 4px 10px; background: rgba(37,99,235,0.1); color: var(--violet); border-radius: 999px; font-weight: 700; font-size: 13px; margin-top: 6px; width: fit-content; }
      .store .nav-link { margin-top: 10px; font-weight: 700; font-size: 14px; color: var(--violet); }
      #cityMap { width: 100%; height: 420px; border: 1px solid var(--border); border-radius: 16px; margin-top: 14px; background: rgba(37,99,235,0.06); }
      .cta { display: inline-block; margin-top: 36px; padding: 14px 24px; background: var(--aurora); color: #fff !important; font-weight: 700; border-radius: 999px; box-shadow: 0 14px 30px rgba(37,99,235,0.35); }
      .cta:hover { text-decoration: none; opacity: 0.95; }
      .info-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 16px; }
      .info-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; }
      .info-card h3 { color: var(--violet); margin-bottom: 6px; }
      details { border: 1px solid var(--border); border-radius: 14px; padding: 12px 16px; margin-top: 10px; background: #fff; }
      details[open] { background: rgba(37,99,235,0.03); }
      summary { cursor: pointer; font-weight: 700; }
      footer.site { border-top: 1px solid var(--border); padding: 24px 20px; margin-top: 56px; color: var(--muted); font-size: 14px; }
      footer.site .row { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
      .city-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); margin-top: 16px; padding: 0; list-style: none; }
      .city-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 14px 16px; }
      .city-card a { color: var(--ink); font-weight: 700; font-size: 17px; }
      .city-card a:hover { color: var(--violet); }
      .city-card .count { color: var(--muted); font-size: 13px; margin-top: 2px; }
      .region-block { margin-top: 28px; }
      .region-block h2 { margin-top: 0; }
      @media (max-width: 640px) { header.site nav a { margin-left: 10px; font-size: 13px; } .lead { font-size: 16px; } }
    </style>`;
}

function siteHeader() {
  return `
    <header class="site">
      <div class="row">
        <a class="logo" href="/" aria-label="${BRAND} – strona główna">
          <img src="/logo-4funsoda.png" alt="${BRAND}" />
        </a>
        <nav aria-label="Główna nawigacja">
          <a href="/">Strona główna</a>
          <a href="/m/">Miasta</a>
          <a href="/#map">Mapa</a>
          <a href="/#b2b">B2B</a>
        </nav>
      </div>
    </header>`;
}

function siteFooter() {
  return `
    <footer class="site">
      <div class="row">
        <div>© ${new Date().getFullYear()} ${BRAND} – ${COMPANY}. Wymiana cylindrów CO₂ do saturatorów.</div>
        <div>
          <a href="/">Strona główna</a> ·
          <a href="/m/">Wszystkie miasta</a> ·
          <a href="/#privacy">Polityka prywatności</a>
        </div>
      </div>
    </footer>`;
}

// ─── city page ────────────────────────────────────────────────────────────
function cityIntro(city, n, region) {
  const loc = locativeOf(city);
  const punktow = pluralPL(n, ["punkt", "punkty", "punktów"]);
  const dziala = pluralPL(n, ["działa", "działają", "działa"]);
  const aktywnych = pluralPL(n, ["aktywny", "aktywne", "aktywnych"]);
  const punktyText = pluralPL(n, ["punkt wymiany", "punkty wymiany", "punktów wymiany"]);
  const regionPart = region ? ` (województwo ${region.name})` : "";
  return [
    `Szukasz miejsca, gdzie szybko wymienisz cylinder CO₂ do saturatora w ${loc}${regionPart}? Poniżej znajdziesz ${n} ${aktywnych} ${punktow} wymiany ${BRAND} w ${loc}, w których wymiana odbywa się od ręki – bez wcześniejszej rezerwacji i bez formalności.`,
    `Wymiana cylindra CO₂ w ${loc} działa prosto: przynosisz pusty cylinder, dostajesz pełny. Wymieniamy cylindry pasujące do wszystkich popularnych saturatorów (wkręcane oraz Quick Connect). W ${loc} ${dziala} ${n} ${punktyText}, dzięki czemu zawsze znajdziesz lokalizację najbliżej swojego domu.`,
    `Wszystkie cylindry zawierają certyfikowany, bezpieczny gaz spożywczy CO₂. Jeden cylinder pozwala przygotować nawet do 60 litrów wody gazowanej w domu, bez kupowania jednorazowych butelek PET.`,
  ].join("</p><p>");
}

function cityJsonLd(city, slug, locs, region) {
  const [centerLat, centerLng] = centroidOf(locs);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": BRAND, "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Miasta", "item": `${SITE}/m/` },
        { "@type": "ListItem", "position": 3, "name": city, "item": `${SITE}/m/${slug}/` },
      ]},
      { "@type": "Service", "@id": `${SITE}/m/${slug}/#service`,
        "name": `Wymiana cylindrów CO₂ ${city}`,
        "serviceType": "Wymiana cylindrów CO₂ do saturatorów",
        "description": `Wymiana cylindrów CO₂ w ${locativeOf(city)}. ${locs.length} ${pluralPL(locs.length, ["punkt", "punkty", "punktów"])} wymiany od ręki.`,
        "provider": { "@id": `${SITE}/#organization` },
        "areaServed": { "@type": "City", "name": city, ...(region ? { "containedInPlace": { "@type": "AdministrativeArea", "name": region.name } } : {}) },
        "url": `${SITE}/m/${slug}/` },
      { "@type": "ItemList", "name": `Punkty wymiany cylindrów CO₂ w ${locativeOf(city)}`, "numberOfItems": locs.length,
        "itemListElement": locs.map((l, idx) => ({ "@type": "ListItem", "position": idx + 1, "item": {
          "@type": "Place", "name": l.name,
          "address": { "@type": "PostalAddress", "streetAddress": l.address, "addressLocality": city, "addressCountry": "PL" },
          "geo": { "@type": "GeoCoordinates", "latitude": l.lat, "longitude": l.lng } } })) },
      { "@type": "WebPage", "@id": `${SITE}/m/${slug}/`, "url": `${SITE}/m/${slug}/`,
        "name": `Wymiana cylindrów CO₂ ${city} | ${BRAND}`,
        "isPartOf": { "@id": `${SITE}/#website` }, "about": { "@id": `${SITE}/m/${slug}/#service` }, "inLanguage": "pl-PL",
        "geo": { "@type": "GeoCoordinates", "latitude": centerLat, "longitude": centerLng } },
      { "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": `Gdzie wymienić cylinder CO₂ w ${locativeOf(city)}?`,
          "acceptedAnswer": { "@type": "Answer", "text": `W ${locativeOf(city)} dostępnych jest ${locs.length} ${pluralPL(locs.length, ["punkt", "punkty", "punktów"])} wymiany ${BRAND}. Pełna lista adresów i godzin otwarcia znajduje się na tej stronie.` } },
        { "@type": "Question", "name": `Czy muszę rezerwować wymianę cylindra w ${locativeOf(city)}?`,
          "acceptedAnswer": { "@type": "Answer", "text": "Nie. Wymiana odbywa się od ręki w godzinach otwarcia danego punktu, bez rezerwacji i bez formalności." } },
        { "@type": "Question", "name": `Jakie cylindry mogę wymienić w ${locativeOf(city)}?`,
          "acceptedAnswer": { "@type": "Answer", "text": "Wymieniamy cylindry pasujące do wszystkich popularnych saturatorów – zarówno wersje wkręcane, jak i Quick Connect." } },
      ]},
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

function renderCityPage(group) {
  const { city, slug, locations: locs } = group;
  const region = regionForCity(city);
  const [centerLat, centerLng] = centroidOf(locs);
  const zoom = boundsZoom(locs);
  const n = locs.length;
  const punktoweOd = pluralPL(n, ["punkt", "punkty", "punktów"]);
  const loc = locativeOf(city);
  const title = `Wymiana cylindrów CO₂ ${city} – ${n} ${punktoweOd} wymiany | ${BRAND}`;
  const description = `Wymiana cylindrów CO₂ do saturatorów w ${loc}. ${n} ${punktoweOd} wymiany ${BRAND} – od ręki, bez zamawiania. Cylindry wkręcane i Quick Connect.`;
  const canonical = `${SITE}/m/${slug}/`;

  const pointsJs = locs.map((l) => ({ lat: l.lat, lng: l.lng, name: l.name, address: l.address, hours: l.hours }));

  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="keywords" content="wymiana cylindrów CO2 ${escapeHtml(city)}, cylinder CO2 ${escapeHtml(city)}, wymiana cylindra od ręki ${escapeHtml(city)}, saturator ${escapeHtml(city)}" />
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
<meta name="author" content="${COMPANY} – ${BRAND}" />
<meta name="geo.region" content="PL" />
<meta name="geo.placename" content="${escapeHtml(city)}, Polska" />
<meta name="geo.position" content="${centerLat.toFixed(4)};${centerLng.toFixed(4)}" />
<meta name="ICBM" content="${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${BRAND}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${SITE}/og-image.png" />
<meta property="og:locale" content="pl_PL" />
${favicons()}
${fonts()}
${leafletAssets()}
${cityJsonLd(city, slug, locs, region)}
${sharedStyles()}
</head>
<body>
${siteHeader()}
<nav class="breadcrumbs" aria-label="Okruszki">
  <a href="/">${BRAND}</a> ›
  <a href="/m/">Miasta</a> ›
  <span>${escapeHtml(city)}</span>
</nav>
<section class="hero">
  <div class="inner">
    <h1>Wymiana cylindrów CO₂ – ${escapeHtml(city)}</h1>
    <div class="lead"><p>${cityIntro(city, n, region)}</p></div>
  </div>
</section>
<main class="container">
  <section>
    <h2>Punkty wymiany cylindrów CO₂ w ${escapeHtml(loc)}</h2>
    <ul class="stores">
      ${locs.map((l) => `
        <li class="store">
          <h3>${escapeHtml(l.name)}</h3>
          <div class="addr">${escapeHtml(l.address)}</div>
          <span class="hours">Godziny: ${escapeHtml(l.hours)}</span>
          <a class="nav-link" href="https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}" rel="nofollow noopener" target="_blank">Nawigacja Google Maps →</a>
        </li>`).join("")}
    </ul>
  </section>

  <section>
    <h2>Mapa punktów wymiany w ${escapeHtml(loc)}</h2>
    <div id="cityMap" role="application" aria-label="Mapa punktów wymiany cylindrów CO₂ w ${escapeHtml(loc)}"></div>
  </section>

  <section>
    <h2>Jak wygląda wymiana cylindra CO₂ w ${escapeHtml(loc)}?</h2>
    <div class="info-grid">
      <div class="info-card"><h3>1. Przyjdź z pustym cylindrem</h3><p>Wybierz dowolny z ${n} ${punktoweOd} w ${escapeHtml(loc)}. Punkty ${BRAND} to lokalne sklepy, stacje i delikatesy.</p></div>
      <div class="info-card"><h3>2. Wymiana od ręki</h3><p>Obsługa przyjmie Twój pusty cylinder i wyda pełny – wkręcany lub Quick Connect, zgodnie z Twoim saturatorem.</p></div>
      <div class="info-card"><h3>3. Płacisz tylko za gaz</h3><p>Płacisz wyłącznie za zawartość – sam cylinder krąży w obiegu zamkniętym. To ekologiczne i tańsze niż butelkowane napoje.</p></div>
    </div>
  </section>

  <section>
    <h2>Najczęstsze pytania – wymiana cylindrów ${escapeHtml(city)}</h2>
    <details><summary>Gdzie wymienić cylinder CO₂ w ${escapeHtml(loc)}?</summary><p>W ${escapeHtml(loc)} dostępnych jest ${n} ${punktoweOd} wymiany ${BRAND}. Listę adresów wraz z godzinami znajdziesz powyżej, a lokalizacje – na mapie miasta.</p></details>
    <details><summary>Czy muszę rezerwować wymianę cylindra?</summary><p>Nie. Wymiana odbywa się od ręki w godzinach otwarcia danego punktu. Nie potrzebujesz konta, rezerwacji ani aplikacji.</p></details>
    <details><summary>Jakie cylindry można wymienić?</summary><p>Wymieniamy cylindry pasujące do wszystkich popularnych saturatorów, w wersjach wkręcanej oraz Quick Connect. Jeśli masz wątpliwości – obsługa punktu pomoże w doborze.</p></details>
    <details><summary>Ile wody gazowanej przygotuję z jednego cylindra?</summary><p>Jeden cylinder CO₂ pozwala przygotować nawet do 60 litrów wody gazowanej w domu – to niższy koszt jednego litra niż woda kupowana w butelkach i mniej odpadów PET.</p></details>
    <details><summary>Czy gaz w cylindrach jest bezpieczny?</summary><p>Tak. Wszystkie cylindry ${BRAND} zawierają certyfikowany, spożywczy CO₂, w pełni bezpieczny do użycia w domowych saturatorach.</p></details>
  </section>

  <a class="cta" href="/#map">Zobacz pełną mapę wszystkich punktów ${BRAND} →</a>
</main>
${siteFooter()}
<script>
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof L === 'undefined') return;
    var points = ${JSON.stringify(pointsJs)};
    var map = L.map('cityMap', { scrollWheelZoom: false }).setView([${centerLat}, ${centerLng}], ${zoom});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
    var icon = L.icon({ iconUrl: '/favicon.svg', iconRetinaUrl: '/favicon.svg', iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -16] });
    var bounds = [];
    points.forEach(function (p) {
      var m = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
      m.bindPopup('<div style="min-width:200px"><div style="font-size:12px;font-weight:800;color:#0B1020;margin-bottom:2px">' + p.name + '</div><div style="font-size:11px;color:#5B6178;margin-bottom:4px">' + p.address + '</div><div style="font-size:11px;color:#2563EB;font-weight:700">Godziny: ' + p.hours + '</div></div>');
      bounds.push([p.lat, p.lng]);
    });
    if (points.length > 1) { map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 }); }
  });
</script>
</body>
</html>
`;
}

// ─── hub page ─────────────────────────────────────────────────────────────
function renderHubPage() {
  const total = funSodaLocations.length;
  const cityCount = cities.length;
  const title = `Punkty wymiany cylindrów CO₂ w Polsce – ${cityCount} miast | ${BRAND}`;
  const description = `Lista miast, w których ${BRAND} prowadzi wymianę cylindrów CO₂ do saturatorów. ${total} punktów wymiany w ${cityCount} miastach – wybierz swoje miasto.`;
  const canonical = `${SITE}/m/`;

  const byRegion = new Map();
  for (const c of cities) {
    const region = regionForCity(c.city);
    const key = region ? region.slug : "inne";
    const name = region ? region.name : "Pozostałe";
    if (!byRegion.has(key)) byRegion.set(key, { name, cities: [] });
    byRegion.get(key).cities.push(c);
  }

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": BRAND, "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Miasta", "item": `${SITE}/m/` },
      ]},
      { "@type": "ItemList", "name": `Miasta z punktami wymiany ${BRAND}`, "numberOfItems": cityCount,
        "itemListElement": cities.map((c, i) => ({ "@type": "ListItem", "position": i + 1, "url": `${SITE}/m/${c.slug}/`, "name": `Wymiana cylindrów CO₂ ${c.city}` })) },
      { "@type": "WebPage", "@id": canonical, "url": canonical, "name": title, "isPartOf": { "@id": `${SITE}/#website` } },
    ],
  };

  const regionBlocks = Array.from(byRegion.values())
    .sort((a, b) => b.cities.length - a.cities.length)
    .map((r) => `
      <section class="region-block">
        <h2>${escapeHtml(r.name)} <span style="color:var(--muted);font-weight:600;font-size:16px">(${r.cities.length} ${pluralPL(r.cities.length, ["miasto", "miasta", "miast"])})</span></h2>
        <ul class="city-grid">
          ${r.cities.map((c) => `
            <li class="city-card">
              <a href="/m/${c.slug}/">${escapeHtml(c.city)}</a>
              <div class="count">${c.locations.length} ${pluralPL(c.locations.length, ["punkt", "punkty", "punktów"])} wymiany</div>
            </li>`).join("")}
        </ul>
      </section>`).join("");

  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${SITE}/og-image.png" />
<meta property="og:locale" content="pl_PL" />
${favicons()}
${fonts()}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${sharedStyles()}
</head>
<body>
${siteHeader()}
<nav class="breadcrumbs" aria-label="Okruszki">
  <a href="/">${BRAND}</a> ›
  <span>Miasta</span>
</nav>
<section class="hero">
  <div class="inner">
    <h1>Wymiana cylindrów CO₂ – ${cityCount} ${pluralPL(cityCount, ["miasto", "miasta", "miast"])} w Polsce</h1>
    <p class="lead">${BRAND} prowadzi ${total} ${pluralPL(total, ["punkt", "punkty", "punktów"])} wymiany cylindrów CO₂ do saturatorów. Wybierz miasto, żeby zobaczyć lokalne adresy, godziny otwarcia i mapę najbliższych punktów.</p>
  </div>
</section>
<main class="container">
  ${regionBlocks}
  <a class="cta" href="/#map">Pełna mapa wszystkich punktów →</a>
</main>
${siteFooter()}
</body>
</html>
`;
}

// ─── sitemap ──────────────────────────────────────────────────────────────
function renderSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${SITE}/#map`, priority: "0.9", changefreq: "weekly" },
    { loc: `${SITE}/#offer`, priority: "0.8", changefreq: "monthly" },
    { loc: `${SITE}/#b2b`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE}/m/`, priority: "0.9", changefreq: "weekly" },
    ...cities.map((c) => ({ loc: `${SITE}/m/${c.slug}/`, priority: c.locations.length >= 3 ? "0.85" : "0.75", changefreq: "weekly" })),
  ];
  const body = urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ─── build ────────────────────────────────────────────────────────────────
function writeFile(p, content) {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
}

if (existsSync(OUT_BASE)) rmSync(OUT_BASE, { recursive: true, force: true });
mkdirSync(OUT_BASE, { recursive: true });

let generated = 0;
for (const group of cities) {
  // Folder-based clean URLs for Netlify: public/m/<slug>/index.html → /m/<slug>/
  const out = join(OUT_BASE, group.slug, "index.html");
  writeFile(out, renderCityPage(group));
  generated++;
}

writeFile(join(OUT_BASE, "index.html"), renderHubPage());
writeFile(join(PUBLIC_DIR, "sitemap.xml"), renderSitemap());

console.log(`[generate-city-pages] ${generated} stron miast + hub + sitemap`);
console.log(`[generate-city-pages] Output: ${OUT_BASE}`);
